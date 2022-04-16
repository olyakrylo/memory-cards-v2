import { connect } from "react-redux";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Splide } from "@splidejs/splide";
import { Splide as ReactSplide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import arrayShuffle from "array-shuffle";
import { useRouter } from "next/router";

import { AppNotification, Card, State, Topic, User } from "../../utils/types";
import { flip } from "../../utils/flip";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import AddCard from "./add";
import { setNotification, setTopics } from "../../redux/actions/main";
import CardItem from "./item";

type CardProps = {
  user?: User | null;
  currentTopic?: Topic;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
  setNotification: (n: AppNotification) => void;
};

export const Cards = ({
  currentTopic,
  user,
  topics,
  setTopics,
  setNotification,
}: CardProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [inverted, setInverted] = useState<boolean>(false);
  const [hideArrows, setHideArrows] = useState<boolean>(false);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);
  const [currCard, setCurrCard] = useState<number>(0);

  const sliderRef = useRef<ReactSplide>(null);

  const { i18n, t } = useTranslation();

  const canEditTopic = () => {
    return currentTopic?.author_id === user?._id;
  };

  useEffect(() => {
    const handleKeyup = (event: any) => {
      if (event.key !== "Enter" || event.target.tagName !== "BODY") {
        return;
      }
      const index = sliderRef.current?.splide?.index;
      if (typeof index !== "number") return;

      const splideRef = sliderRef.current?.splideRef.current;
      const list = splideRef?.children[1]?.children?.[0];
      const elem = list?.children?.[index]?.children?.[0];

      if (!elem) return;
      flip(elem as HTMLElement, 200, () => setInverted(!inverted));
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [inverted]);

  useEffect(() => {
    if (!currentTopic) {
      return;
    }

    setLoading(true);
    setCurrCard(0);
    request("cards", "by_topic", "post", {
      topic_id: currentTopic._id,
    }).then((cards) => {
      const indexFromUrl = parseInt((router.query.card as string) ?? "");
      setCurrCard(indexFromUrl || 0);

      setCards(cards);
      setInverted(false);
      setLoading(false);
    });

    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  }, [currentTopic, i18n]);

  const toggleCard = (event: BaseSyntheticEvent) => {
    const card = event.currentTarget as HTMLDivElement;
    flip(card, 200, () => setInverted(!inverted));
  };

  const handleMove = async (_: Splide, index: number): Promise<void> => {
    if (!currentTopic) return;
    setInverted(false);
    await router.replace({
      pathname: router.pathname,
      query: { ...router.query, card: index.toString() },
    });
  };

  const addCards = (newCards: Card[]): void => {
    setCards([...cards, ...newCards]);
    if (shuffledCards) {
      setShuffledCards([...shuffledCards, ...newCards]);
    }
  };

  const updateCard = (updatedCard: Card): void => {
    setCards(
      cards.map((c) => {
        if (c._id === updatedCard._id) return updatedCard;
        return c;
      })
    );
    if (shuffledCards) {
      setShuffledCards(
        shuffledCards.map((c) => {
          if (c._id === updatedCard._id) return updatedCard;
          return c;
        })
      );
    }
  };

  const deleteCard = async (id: string) => {
    await request("cards", "", "delete", { id });
    const updatedCards = cards.filter((c) => c._id !== id);
    setCards(updatedCards);
    if (shuffledCards) {
      setShuffledCards(shuffledCards.filter((c) => c._id !== id));
    }
  };

  const toggleShuffle = () => {
    if (shuffledCards) {
      setShuffledCards(null);
    } else {
      setShuffledCards(arrayShuffle(cards));
    }
  };

  const toggleArrows = () => {
    void request("config", "arrows", "put", {
      hide: !hideArrows,
    });
    setHideArrows(!hideArrows);
  };

  const isSelfTopic = (): boolean => {
    return topics.some((t) => t._id === currentTopic?._id);
  };

  const addCurrentTopic = async (): Promise<void> => {
    if (!currentTopic) return;
    const updatedTopics = await request("topics", "public", "put", {
      topics_id: [currentTopic._id],
    });
    setTopics([...topics, ...updatedTopics]);
  };

  const shareCard = async (index: number): Promise<void> => {
    const { href } = window.location;
    const link = `${href}&card=${index}`;
    await navigator.clipboard.writeText(link);
    setNotification({
      severity: "success",
      text: "ui.link_copied",
      translate: true,
      autoHide: 5000,
    });
  };

  return (
    <div>
      {currentTopic && (
        <div className={styles.control}>
          <IconButton
            onClick={toggleShuffle}
            className={styles.shuffle}
            aria-checked={!!shuffledCards}
            aria-hidden={!cards.length}
          >
            <ShuffleRoundedIcon />
          </IconButton>

          <div className={styles.control__topic}>
            <Typography>{currentTopic.title}</Typography>
            {currentTopic && !isSelfTopic() && (
              <Tooltip title={t("add.save_topic") ?? ""}>
                <IconButton onClick={addCurrentTopic}>
                  <AddRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>

          {canEditTopic() && (
            <AddCard
              currentTopic={currentTopic}
              setLoading={setLoading}
              addCards={addCards}
            />
          )}
        </div>
      )}

      {loading && <CircularProgress className={styles.loader} />}

      {!loading && !currentTopic && (
        <div className={styles.tip}>
          <ArrowCircleDownRoundedIcon className={styles.tip__icon_topics} />
          {t("ui.choose_topic")}
        </div>
      )}

      {!loading && !!currentTopic && canEditTopic() && !cards.length && (
        <div className={styles.tip}>
          {t("ui.add_first_card")}{" "}
          <ArrowCircleDownRoundedIcon className={styles.tip__icon_add} />
        </div>
      )}

      {!loading && !!cards.length && (
        <ReactSplide
          ref={sliderRef}
          onMove={handleMove}
          className={styles.slider}
          options={{
            height: 400,
            arrows: !hideArrows,
            classes: {
              arrow: `splide__arrow ${styles.arrow}`,
              pagination: `splide__pagination ${styles.pagination}`,
            },
            start: currCard,
          }}
        >
          {(shuffledCards ?? cards).map((card, i) => (
            <CardItem
              key={card._id}
              card={card}
              showArrows={!hideArrows}
              canEditTopic={canEditTopic()}
              inverted={inverted}
              setLoading={setLoading}
              toggleCard={toggleCard}
              deleteCard={() => deleteCard(card._id)}
              updateCard={updateCard}
              shareCard={() => shareCard(i)}
            />
          ))}
        </ReactSplide>
      )}

      {!loading && !!cards.length && (
        <FormGroup className={styles.arrowControl}>
          <FormControlLabel
            control={<Switch onChange={toggleArrows} checked={!hideArrows} />}
            label={t("ui.show_arrows") as string}
          />
        </FormGroup>
      )}
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    currentTopic: state.main.currentTopic,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);

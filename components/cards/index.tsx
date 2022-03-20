import { connect } from "react-redux";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
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
import { SplideSlide, Splide as ReactSplide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import arrayShuffle from "array-shuffle";
import { useRouter } from "next/router";

import { Card, State, Topic, User } from "../../utils/types";
import { flip } from "../../utils/flip";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import EditCard from "./edit";
import AddCard from "./add";
import { setTopics } from "../../redux/actions/main";

type CardProps = {
  user: User;
  currentTopic?: Topic;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
};

export const Cards = ({ currentTopic, user, topics, setTopics }: CardProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [inverted, setInverted] = useState<boolean>(false);
  const [showArrows, setShowArrows] = useState<boolean>(true);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);
  const [currCard, setCurrCard] = useState<number>(0);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<ReactSplide>(null);

  const { i18n, t } = useTranslation();

  const canEditTopic = () => {
    return currentTopic?.author_id === user._id;
  };

  useEffect(() => {
    const handleKeyup = (event: any) => {
      if (event.key !== "Enter" || event.target.tagName !== "BODY") {
        return;
      }
      const index = sliderRef.current?.splide?.index;
      if (typeof index !== "number") return;
      const ref = cardsRef.current[index];
      if (!ref) return;
      flip(ref, 200, () => setInverted(!inverted));
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
    request<Card[]>("post", "cards/by_topic", {
      topic_id: currentTopic._id,
    }).then((cards) => {
      const indexFromUrl = parseInt((router.query.card as string) ?? "");
      const indexFromStorage = parseInt(
        sessionStorage.getItem(currentTopic._id.toString()) ?? ""
      );
      setCurrCard(indexFromUrl || indexFromStorage || 0);

      setCards(cards);
      setInverted(false);
      setLoading(false);
    });
  }, [currentTopic, i18n]);

  const toggleCard = (event: BaseSyntheticEvent) => {
    const card = event.currentTarget as HTMLDivElement;
    flip(card, 200, () => setInverted(!inverted));
  };

  const handleMove = async (_: Splide, index: number): Promise<void> => {
    if (!currentTopic) return;
    setInverted(false);
    sessionStorage.setItem(currentTopic._id.toString(), index.toString());
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

  const deleteCard = async (e: any, id: string) => {
    e.stopPropagation();
    await request("delete", `cards/${id}`);
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

  const isSelfTopic = (): boolean => {
    return topics.some((t) => t._id === currentTopic?._id);
  };

  const addCurrentTopic = async (): Promise<void> => {
    if (!currentTopic) return;
    const updatedTopics = await request<Topic[]>("put", "topics/public", {
      topics_id: [currentTopic._id],
    });
    setTopics([...topics, ...updatedTopics]);
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
            arrows: showArrows,
            classes: {
              arrow: `splide__arrow ${styles.arrow}`,
              pagination: `splide__pagination ${styles.pagination}`,
            },
            start: currCard,
          }}
        >
          {(shuffledCards ?? cards).map((card, i) => (
            <SplideSlide key={card._id}>
              <div
                ref={(el) => (cardsRef.current[i] = el)}
                className={`${styles.card} ${showArrows && styles.card_arrows}`}
                onClick={toggleCard}
              >
                <Typography className={styles.card__text}>
                  {inverted ? card.answer : card.question}
                </Typography>

                {card._id && canEditTopic() && (
                  <IconButton
                    className={styles.card__del}
                    color="secondary"
                    onClick={(e) => deleteCard(e, card._id)}
                  >
                    <DeleteTwoToneIcon />
                  </IconButton>
                )}

                {card._id && canEditTopic() && (
                  <EditCard
                    card={card}
                    setLoading={setLoading}
                    updateCard={updateCard}
                  />
                )}
              </div>
            </SplideSlide>
          ))}
        </ReactSplide>
      )}

      {!loading && !!cards.length && (
        <FormGroup className={styles.arrowControl}>
          <FormControlLabel
            control={
              <Switch
                onChange={() => setShowArrows(!showArrows)}
                checked={showArrows}
              />
            }
            label={t("ui.show_arrows") as string}
          />
        </FormGroup>
      )}
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    currentTopic: state.main.currentTopic,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);

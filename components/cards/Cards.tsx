import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { Splide as ReactSplide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ShuffleRounded,
  AddRounded,
  ArrowCircleDownRounded,
} from "@mui/icons-material";
import { isBrowser } from "react-device-detect";

import { Card, Topic, User } from "../../shared/models";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import { getCardsMatrix, utils, getCardIndex } from "./utils";
import { AppNotification } from "../../shared/notification";
import CardItem from "./item";
import AddCard from "./add";
import SkeletonLoader from "../skeletonLoader";

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
  const [hideArrows, setHideArrows] = useState<boolean>(false);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);

  const sliderRef = useRef<ReactSplide>(null);

  const { t } = useTranslation();

  const resetCards = new Subject<void>();
  const flipCard = new Subject<number>();

  useEffect(() => {
    if (!isBrowser) return;
    const handleKeyup = (event: any) => {
      if (
        !["Enter", "Space"].includes(event.code) ||
        event.target.tagName !== "BODY"
      ) {
        return;
      }
      const index = sliderRef.current?.splide?.index;
      if (typeof index !== "number") return;
      flipCard.next(index);
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  });

  useEffect(() => {
    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  }, [user]);

  useEffect(() => {
    if (!currentTopic) {
      return;
    }

    setLoading(true);
    request("cards", "by_topic", "get", {
      query: {
        topic_id: currentTopic._id,
      },
    }).then((cards) => {
      setCards(cards);
      resetCards.next();
      setLoading(false);
    });
  }, [currentTopic]);

  const canEditTopic = () => {
    return currentTopic?.author_id === user?._id;
  };

  const handleMoved = (splideIndex: number, cardIndex: number): void => {
    if (!currentTopic) return;
    resetCards.next();

    const index = getCardIndex(splideIndex, cardIndex);
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

  const deleteCard = async (id: string) => {
    await request("cards", "", "delete", { query: { ids: [id] } });
    const updatedCards = cards.filter((c) => c._id !== id);
    setCards(updatedCards);
    if (shuffledCards) {
      setShuffledCards(shuffledCards.filter((c) => c._id !== id));
    }
  };

  const toggleShuffle = async (event: BaseSyntheticEvent): Promise<void> => {
    if (shuffledCards) {
      setShuffledCards(null);
    } else {
      const { default: shuffle } = await import("array-shuffle");
      setShuffledCards(shuffle(cards));
    }
    event.target.blur();
  };

  const toggleArrows = () => {
    void request("config", "arrows", "put", {
      body: {
        hide: !hideArrows,
      },
    });
    setHideArrows(!hideArrows);
  };

  const isSelfTopic = (): boolean => {
    return topics.some((t) => t._id === currentTopic?._id);
  };

  const addCurrentTopic = async (): Promise<void> => {
    if (!currentTopic) return;
    const updatedTopics = await request("topics", "public", "put", {
      body: {
        topics_id: [currentTopic._id],
      },
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

  const startIndexFromUrl = parseInt((router.query.card as string) ?? "");
  const startIndexFromStorage = parseInt(
    sessionStorage.getItem(currentTopic?._id.toString() ?? "") ?? ""
  );
  const startIndex = startIndexFromUrl || startIndexFromStorage || 0;

  return (
    <div className={styles.container}>
      {currentTopic && (
        <>
          <div className={styles.control}>
            <IconButton
              onClick={toggleShuffle}
              classes={{ root: styles.shuffle }}
              aria-checked={!!shuffledCards}
              aria-hidden={!cards.length}
            >
              <ShuffleRounded />
            </IconButton>

            <div className={styles.control__topic}>
              <Typography>{currentTopic.title}</Typography>
              {currentTopic && !isSelfTopic() && (
                <Tooltip title={t("add.save_topic") ?? ""}>
                  <IconButton onClick={addCurrentTopic}>
                    <AddRounded />
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

          {!loading && !cards.length && canEditTopic() && (
            <div className={styles.tip}>
              {t("ui.add_first_card")}{" "}
              <ArrowCircleDownRounded className={styles.tip__icon_add} />
            </div>
          )}
        </>
      )}

      {!currentTopic && (
        <div className={styles.tip}>
          <ArrowCircleDownRounded className={styles.tip__icon_topics} />
          {t("ui.choose_topic")}
        </div>
      )}

      {loading && (
        <SkeletonLoader
          height={350}
          classes={`${styles.skeleton} ${
            hideArrows ? "" : styles.skeleton_arrows
          }`}
        />
      )}

      {!loading && !!cards.length && (
        <>
          {getCardsMatrix(shuffledCards ?? cards).map(
            (cardsSlice, splideIndex) => (
              <ReactSplide
                key={splideIndex}
                ref={sliderRef}
                onMoved={(_, index) => handleMoved(splideIndex, index)}
                className={styles.slider}
                options={{
                  keyboard: isBrowser ? "global" : false,
                  height: 400,
                  arrows: !hideArrows,
                  classes: {
                    arrow: `splide__arrow ${styles.arrow}`,
                    prev: `splide__arrow--prev ${styles.arrow_prev}`,
                    next: `splide__arrow--next ${styles.arrow_next}`,
                    pagination: `splide__pagination ${styles.pagination}`,
                  },
                  start: utils(splideIndex, startIndex),
                }}
              >
                {cardsSlice.map((card, i) => (
                  <CardItem
                    index={getCardIndex(splideIndex, i)}
                    key={card._id}
                    card={card}
                    showArrows={!hideArrows}
                    canEditTopic={canEditTopic()}
                    setLoading={setLoading}
                    deleteCard={() => deleteCard(card._id)}
                    updateCard={updateCard}
                    shareCard={() => shareCard(getCardIndex(splideIndex, i))}
                    resetCards={resetCards}
                    flipCard={flipCard}
                  />
                ))}
              </ReactSplide>
            )
          )}

          <FormGroup className={styles.arrowControl}>
            <FormControlLabel
              control={<Switch onChange={toggleArrows} checked={!hideArrows} />}
              label={<Typography>{t("ui.show_arrows")}</Typography>}
            />
          </FormGroup>
        </>
      )}
    </div>
  );
};

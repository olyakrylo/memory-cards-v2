import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { Splide as ReactSplide, SplideSlide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { ShuffleRounded, AddRounded } from "@mui/icons-material";
import { isBrowser } from "react-device-detect";
import classNames from "classnames";

import { Card, Topic, User } from "../../shared/models";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import {
  getCardsMatrix,
  utils,
  getCardIndex,
  getUpdatedShuffledCards,
} from "./utils";
import { AppNotification } from "../../shared/notification";
import CardItem from "./item";
import AddCard from "./add";
import SkeletonLoader from "../skeletonLoader";
import CardsViewOptions from "./viewOptions";

type CardProps = {
  user?: User | null;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
  currentTopic?: Topic;
  setNotification: (n: AppNotification) => void;
  cards: Record<string, Card[]>;
  setCards: (t: string, c: Card[]) => void;
};

export const Cards = ({
  user,
  topics,
  setTopics,
  currentTopic,
  cards,
  setCards,
}: CardProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [hideArrows, setHideArrows] = useState<boolean>(false);
  const [shuffledCards, setShuffledCards] = useState<Card[]>();

  const sliderRef = useRef<ReactSplide>(null);

  const { t } = useTranslation();

  const resetCards = new Subject<void>();
  const flipCard = new Subject<number>();

  const currentTopicId = (): string => {
    return (router.query.topic as string) ?? "";
  };

  useEffect(() => {
    if (!isBrowser) return;
    const handleKeyup = (event: any) => {
      if (
        !["Enter", "Space"].includes(event.code) ||
        event.target.tagName !== "BODY"
      ) {
        return;
      }
      let index = sliderRef.current?.splide?.index;
      if (typeof index !== "number") return;

      if (shuffledCards) {
        index = cards[currentTopicId()].findIndex(
          (c) => shuffledCards[index as number]._id === c._id
        );
      }

      flipCard.next(index);
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  });

  useEffect(() => {
    if (!currentTopicId()) {
      return;
    }

    setLoading(true);

    request("cards", "by_topic", "get", {
      query: {
        topic_id: currentTopicId(),
      },
    }).then((cards) => {
      setCards(currentTopicId(), cards);
      resetCards.next();
      setLoading(false);
    });
  }, [router.query.topic]);

  useEffect(() => {
    if (!shuffledCards) return;

    const newShuffledCards = getUpdatedShuffledCards(
      shuffledCards,
      cards[currentTopicId()]
    );
    setShuffledCards(newShuffledCards);
  }, [setCards, cards]);

  const canEditTopic = () => {
    return currentTopic?.author_id === user?._id;
  };

  const handleMoved = (splideIndex: number, cardIndex: number): void => {
    if (!currentTopic) return;
    resetCards.next();

    const index = getCardIndex(splideIndex, cardIndex);
    sessionStorage.setItem(currentTopicId(), index.toString());
  };

  const addCards = (newCards: Card[]): void => {
    if (!currentTopic) return;

    setCards(currentTopicId(), [...cards[currentTopicId()], ...newCards]);
    if (shuffledCards) {
      setShuffledCards([...shuffledCards, ...newCards]);
    }
  };

  const toggleShuffle = async (event: BaseSyntheticEvent): Promise<void> => {
    if (shuffledCards) {
      setShuffledCards(undefined);
    } else {
      const { default: shuffle } = await import("array-shuffle");
      setShuffledCards(shuffle(cards[currentTopicId()]));
    }
    event.target.blur();
  };

  const isSelfTopic = (): boolean => {
    return topics.some((t) => t._id === currentTopicId());
  };

  const addCurrentTopic = async (): Promise<void> => {
    const updatedTopics = await request("topics", "public", "put", {
      body: {
        topics_id: [currentTopicId()],
      },
    });
    setTopics([...topics, ...updatedTopics]);
  };

  const actualCardIndex = (id: string): number => {
    return cards[currentTopicId()].findIndex((c) => c._id === id);
  };

  const startIndexFromUrl = parseInt((router.query.card as string) ?? "");
  const startIndexFromStorage = parseInt(
    sessionStorage.getItem(currentTopicId()) ?? ""
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
              aria-hidden={!cards[currentTopicId()]?.length}
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

            {canEditTopic() && <AddCard addCards={addCards} />}
          </div>

          {!loading && !cards[currentTopicId()]?.length && (
            <>
              <Typography
                className={classNames(styles.tip, styles.tip_nowrap)}
                color={"secondary"}
              >
                {t("ui.no_cards_yet")} :(
              </Typography>
              {canEditTopic() && (
                <Typography className={styles.tip} color={"primary"}>
                  {t("ui.add_first_card")}
                </Typography>
              )}
            </>
          )}
        </>
      )}

      {loading && (
        <SkeletonLoader
          height={350}
          classes={`${styles.skeleton} ${
            hideArrows ? "" : styles.skeleton_arrows
          }`}
        />
      )}

      {!loading && !!cards[currentTopicId()]?.length && (
        <>
          {getCardsMatrix(shuffledCards ?? cards[currentTopicId()]).map(
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
                  <SplideSlide key={card._id}>
                    <CardItem
                      index={actualCardIndex(card._id)}
                      showArrows={!hideArrows}
                      canEditTopic={canEditTopic()}
                      resetCards={resetCards}
                      flipCard={flipCard}
                    />
                  </SplideSlide>
                ))}
              </ReactSplide>
            )
          )}

          <CardsViewOptions
            hideArrows={hideArrows}
            setHideArrows={setHideArrows}
            shuffledCards={shuffledCards}
            canEditTopic={canEditTopic()}
            flipCard={flipCard}
          />
        </>
      )}
    </div>
  );
};

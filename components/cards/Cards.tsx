import { Fragment, useEffect, useRef, useState } from "react";
import { Splide as ReactSplide, SplideSlide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { isBrowser } from "react-device-detect";
import classNames from "classnames";

import styles from "./Cards.module.css";
import { getPartStartIndex, getCardIndex } from "./utils";
import CardItem from "./item";
import AddCard from "./add";
import SkeletonLoader from "../skeletonLoader";
import CardsViewOptions from "./viewOptions";
import { useCards, useCardsService, useTopics, useUser } from "../../hooks";
import { CardsCounter } from "./counter/CardsCounter";

export const Cards = () => {
  const { t } = useTranslation();
  const cards = useCards();
  const cardsService = useCardsService();
  const topics = useTopics();
  const { info: user } = useUser();

  const [lastIndex, setLastIndex] = useState<number>(0);

  const sliderRef = useRef<ReactSplide>(null);

  useEffect(() => {
    if (!topics.currentId) return;
    setLastIndex(cards.getSavedIndex(topics.currentId));
  }, [topics.currentId]);

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

      if (cards.currentShuffled()) {
        index = cards
          .current()
          .findIndex(
            (c) => cards.currentShuffled()?.[index as number]._id === c._id
          );
      }

      cardsService.flipCard.next(index);
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  });

  const canEditTopic = (): boolean => {
    return topics.currentTopic?.author_id === user?._id;
  };

  const handleMoved = (cardIndex: number, splideIndex?: number): void => {
    cardsService.resetCards.next();

    const index = splideIndex
      ? getCardIndex(splideIndex, cardIndex)
      : cardIndex;
    cards.saveIndex(index, topics.currentId);
    setLastIndex(index);
  };

  const handleCardIndexChange = (
    cardIndex: number,
    splideIndex?: number
  ): void => {
    handleMoved(cardIndex, splideIndex);

    if (sliderRef.current?.splide) {
      sliderRef.current.splide.go(cardIndex);
    }
  };

  const isSelfTopic = (): boolean => {
    return topics.list().some((t) => t._id === topics.currentId);
  };

  const addCurrentTopic = async (): Promise<void> => {
    await topics.updatePublicTopics([topics.currentId]);
  };

  const actualCardIndex = (id: string): number => {
    return cards.current().findIndex((c) => c._id === id);
  };

  return (
    <div className={styles.container}>
      {topics.currentId && (
        <>
          <div className={styles.control}>
            <Typography className={styles.control__topic}>
              {topics.currentTopic?.title}
            </Typography>

            {topics.currentId && !isSelfTopic() && (
              <Tooltip title={t("add.save_topic") ?? ""}>
                <IconButton onClick={addCurrentTopic} disabled={cards.loading}>
                  <AddRounded />
                </IconButton>
              </Tooltip>
            )}

            {canEditTopic() && <AddCard />}
          </div>

          {!cards.loading && !cards.current().length && (
            <div className={styles.tipContainer}>
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
            </div>
          )}
        </>
      )}

      {(cards.loading || !!cards.current().length) && (
        <div className={styles.content}>
          {cards.loading && (
            <SkeletonLoader
              height={"calc(100% - 48px)"}
              classes={`${styles.skeleton} ${
                cards.hideArrows ? "" : styles.skeleton_arrows
              }`}
            />
          )}

          {!cards.loading && (
            <>
              {cards.currentMatrix().map((cardsSlice, splideIndex) => (
                <ReactSplide
                  key={splideIndex}
                  ref={sliderRef}
                  onMoved={(_, index) => handleMoved(index, splideIndex)}
                  className={styles.slider}
                  options={{
                    keyboard: isBrowser ? "global" : false,
                    arrows: !cards.hideArrows,
                    pagination: false,
                    lazyLoad: "nearby",
                    classes: {
                      arrow: `splide__arrow ${styles.arrow}`,
                      prev: `splide__arrow--prev ${styles.arrow_prev}`,
                      next: `splide__arrow--next ${styles.arrow_next}`,
                      pagination: `splide__pagination ${styles.pagination}`,
                    },
                    start: getPartStartIndex(splideIndex, lastIndex),
                  }}
                >
                  {cardsSlice.map((card, i) => (
                    <SplideSlide key={card._id}>
                      <CardItem
                        index={actualCardIndex(card._id)}
                        canEditTopic={canEditTopic()}
                      />
                    </SplideSlide>
                  ))}
                </ReactSplide>
              ))}
            </>
          )}

          <CardsCounter
            currentIndex={sliderRef?.current?.splide?.index ?? 0}
            total={cards.current().length}
            onChangeIndex={handleCardIndexChange}
          />
        </div>
      )}

      {topics.currentId && <CardsViewOptions canEditTopic={canEditTopic()} />}
    </div>
  );
};

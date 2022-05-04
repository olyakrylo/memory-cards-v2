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
import { getCardsMatrix, getCardIndex, getUpdatedShuffledCards } from "./utils";
import CardItem from "./item";
import AddCard from "./add";

type CardProps = {
  user?: User | null;
  cards: Card[];
  currentTopic?: Topic;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
};

export const Cards = ({
  currentTopic,
  user,
  cards,
  topics,
  setTopics,
}: CardProps) => {
  const [hideArrows, setHideArrows] = useState<boolean>(false);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);

  const router = useRouter();
  const { t } = useTranslation();
  const sliderRef = useRef<ReactSplide>(null);

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
    resetCards.next();

    if (!shuffledCards) return;

    const updatedCards = getUpdatedShuffledCards(shuffledCards, cards);
    setShuffledCards(updatedCards);
  }, [cards]);

  const canEditTopic = () => {
    return currentTopic?.author_id === user?._id;
  };

  const handleMoved = (): void => {
    resetCards.next();
  };

  const updateCards = async () => {
    await router.push({
      pathname: router.pathname,
      query: router.query,
    });
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

            {canEditTopic() && <AddCard onCardsAdd={updateCards} />}
          </div>

          {!cards.length && canEditTopic() && (
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

      {!!cards.length && (
        <>
          {getCardsMatrix(shuffledCards ?? cards).map(
            (cardsSlice, splideIndex) => (
              <ReactSplide
                key={splideIndex}
                ref={sliderRef}
                onMoved={handleMoved}
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
                }}
              >
                {cardsSlice.map((card, i) => (
                  <CardItem
                    index={getCardIndex(splideIndex, i)}
                    key={card._id}
                    card={card}
                    showArrows={!hideArrows}
                    canEditTopic={canEditTopic()}
                    onUpdate={updateCards}
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

import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { Splide } from "@splidejs/splide";
import { Splide as ReactSplide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import {
  CircularProgress,
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
import arrayShuffle from "array-shuffle";

import { AppNotification, Card, Topic, User } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import AddCard from "./add";
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
  const [hideArrows, setHideArrows] = useState<boolean>(false);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);

  const sliderRef = useRef<ReactSplide>(null);

  const { i18n, t } = useTranslation();

  const resetCards = new Subject<void>();
  const flipCard = new Subject<number>();

  useEffect(() => {
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
    if (!currentTopic) {
      return;
    }

    setLoading(true);
    request("cards", "by_topic", "post", {
      topic_id: currentTopic._id,
    }).then((cards) => {
      setCards(cards);
      resetCards.next();
      setLoading(false);
    });

    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  }, [currentTopic, i18n]);

  const canEditTopic = () => {
    return currentTopic?.author_id === user?._id;
  };

  const handleMoved = (_: Splide, index: number): void => {
    if (!currentTopic) return;
    sessionStorage.setItem(currentTopic._id.toString(), index.toString());
    resetCards.next();
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

  const startIndexFromUrl = parseInt((router.query.card as string) ?? "");
  const startIndexFromStorage = parseInt(
    sessionStorage.getItem(currentTopic?._id.toString() ?? "") ?? ""
  );

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
      )}

      {loading && <CircularProgress className={styles.loader} />}

      {!loading && !currentTopic && (
        <div className={styles.tip}>
          <ArrowCircleDownRounded className={styles.tip__icon_topics} />
          {t("ui.choose_topic")}
        </div>
      )}

      {!loading && !!currentTopic && canEditTopic() && !cards.length && (
        <div className={styles.tip}>
          {t("ui.add_first_card")}{" "}
          <ArrowCircleDownRounded className={styles.tip__icon_add} />
        </div>
      )}

      {!loading && !!cards.length && (
        <ReactSplide
          ref={sliderRef}
          onMoved={handleMoved}
          className={styles.slider}
          options={{
            height: 400,
            arrows: !hideArrows,
            classes: {
              arrow: `splide__arrow ${styles.arrow}`,
              pagination: `splide__pagination ${styles.pagination}`,
            },
            start: startIndexFromUrl || startIndexFromStorage || 0,
          }}
        >
          {(shuffledCards ?? cards).map((card, i) => (
            <CardItem
              index={i}
              key={card._id}
              card={card}
              showArrows={!hideArrows}
              canEditTopic={canEditTopic()}
              setLoading={setLoading}
              deleteCard={() => deleteCard(card._id)}
              updateCard={updateCard}
              shareCard={() => shareCard(i)}
              resetCards={resetCards}
              flipCard={flipCard}
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

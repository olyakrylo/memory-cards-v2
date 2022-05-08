import { BaseSyntheticEvent, useEffect, useState } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import {
  CodeRounded,
  SquareRounded,
  ViewComfyRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Subject } from "rxjs";
import { useRouter } from "next/router";
import classNames from "classnames";

import styles from "./CardsViewOptions.module.css";
import AppDialog from "../../dialog";
import CardItem from "../item";
import { request } from "../../../utils/request";
import { Card, Topic, User } from "../../../shared/models";

type CardsViewOptionsProps = {
  loading: boolean;
  user: User;
  cards: Record<string, Card[]>;
  currentTopic?: Topic;
  currentCard: number;
  onCardIndexChange: (v: number) => void;
  hideArrows: boolean;
  setHideArrows: (hide: boolean) => void;
  shuffledCards?: Card[];
  canEditTopic: boolean;
  flipCard: Subject<number>;
};

export const CardsViewOptions = ({
  loading,
  user,
  cards,
  currentTopic,
  currentCard,
  onCardIndexChange,
  shuffledCards,
  hideArrows,
  setHideArrows,
  canEditTopic,
  flipCard,
}: CardsViewOptionsProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [allCardsOpen, setAllCardsOpen] = useState<boolean>(false);
  const [cardInputValue, setCardInputValue] = useState<string>("");

  const currentTopicId = (): string => {
    return (router.query.topic as string) ?? "";
  };

  useEffect(() => {
    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  }, [user]);

  useEffect(() => {
    setCardInputValue((currentCard + 1).toString());
  }, [currentCard]);

  const toggleArrows = () => {
    const newState = !hideArrows;
    setHideArrows(newState);
    void request("config", "arrows", "put", {
      body: {
        hide: newState,
      },
    });
  };

  const handleCardInput = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (
      !/^[0-9]*$/.test(value) ||
      parseInt(value) > cards[currentTopicId()].length
    ) {
      return;
    }
    setCardInputValue(value);
  };

  const handleKeyUp = (event: any): void => {
    if (event.code !== "Enter") return;
    event.target.blur();
    changeCardIndex();
  };

  const changeCardIndex = (): void => {
    onCardIndexChange(parseInt(cardInputValue, 10) - 1);
  };

  const openAllCards = () => {
    setAllCardsOpen(true);
  };

  const closeAllCards = () => {
    setAllCardsOpen(false);
  };

  const actualCardIndex = (id: string): number => {
    return cards[currentTopicId()]?.findIndex((c) => c._id === id) ?? 0;
  };

  return (
    <div className={styles.container}>
      <Tooltip title={t("ui.show_arrows") ?? ""}>
        <IconButton
          onClick={toggleArrows}
          color={hideArrows ? "info" : "primary"}
          disabled={loading || !cards[currentTopicId()]?.length}
        >
          <CodeRounded />
        </IconButton>
      </Tooltip>

      {!!cards[currentTopicId()]?.length && (
        <Typography className={styles.counter}>
          <input
            className={styles.counter__input}
            value={cardInputValue}
            onChange={handleCardInput}
            onBlur={changeCardIndex}
            onKeyUp={handleKeyUp}
          />{" "}
          /{" "}
          <span className={styles.counter__total}>
            {cards[currentTopicId()].length}
          </span>
        </Typography>
      )}

      <IconButton
        onClick={openAllCards}
        disabled={loading || !cards[currentTopicId()]?.length}
      >
        <ViewComfyRounded />
      </IconButton>

      <AppDialog
        open={allCardsOpen}
        onlyFullScreen
        grayContent
        title={
          <Typography color={"primary"} textAlign={"center"}>
            {currentTopic?.title.toLowerCase()}
          </Typography>
        }
        content={
          <div className={styles.allCards}>
            {(shuffledCards ?? cards[currentTopicId()])?.map((card, i) => (
              <div
                key={card._id}
                className={classNames({
                  [styles.card_even]: i % 2 === 0,
                  [styles.card_odd]: i % 2 !== 0,
                })}
              >
                <CardItem
                  index={actualCardIndex(card._id)}
                  showArrows={false}
                  canEditTopic={canEditTopic}
                  flipCard={flipCard}
                />
              </div>
            ))}
          </div>
        }
        actions={
          <IconButton onClick={closeAllCards}>
            <SquareRounded />
          </IconButton>
        }
      />
    </div>
  );
};

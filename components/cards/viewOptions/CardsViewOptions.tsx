import { BaseSyntheticEvent, useEffect, useState } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import {
  CodeRounded,
  SquareRounded,
  ViewComfyRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import styles from "./CardsViewOptions.module.css";
import AppDialog from "../../dialog";
import CardItem from "../item";
import { useCards, useTopics } from "../../../hooks";

type CardsViewOptionsProps = {
  currentCardIndex: number;
  onCardIndexChange: (v: number) => void;
  canEditTopic: boolean;
};

export const CardsViewOptions = ({
  currentCardIndex,
  onCardIndexChange,
  canEditTopic,
}: CardsViewOptionsProps) => {
  const { t } = useTranslation();
  const topics = useTopics();
  const cards = useCards();

  const [allCardsOpen, setAllCardsOpen] = useState<boolean>(false);
  const [cardInputValue, setCardInputValue] = useState<string>("");

  useEffect(() => {
    setCardInputValue((currentCardIndex + 1).toString());
  }, [currentCardIndex]);

  const toggleArrows = () => {
    cards.toggleArrows();
  };

  const handleCardInput = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (!/^[0-9]*$/.test(value) || parseInt(value) > cards.current().length) {
      return;
    }
    setCardInputValue(value);
  };

  const handleKeyUp = (event: any): void => {
    if (event.code !== "Enter") return;
    event.target.blur();
    changeCardIndex(event);
  };

  const changeCardIndex = (event: BaseSyntheticEvent): void => {
    onCardIndexChange(parseInt(event.target.value, 10) - 1);
  };

  const openAllCards = () => {
    setAllCardsOpen(true);
  };

  const closeAllCards = () => {
    setAllCardsOpen(false);
  };

  const actualCardIndex = (id: string): number => {
    return cards.current().findIndex((c) => c._id === id) ?? 0;
  };

  return (
    <div className={styles.container}>
      <Tooltip title={t("ui.show_arrows") ?? ""}>
        <IconButton
          onClick={toggleArrows}
          color={cards.hideArrows() ? "info" : "primary"}
          disabled={cards.loading() || !cards.current().length}
        >
          <CodeRounded />
        </IconButton>
      </Tooltip>

      {!!cards.current().length && (
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
            {cards.current().length}
          </span>
        </Typography>
      )}

      <IconButton
        onClick={openAllCards}
        disabled={cards.loading() || !cards.current().length}
      >
        <ViewComfyRounded />
      </IconButton>

      <AppDialog
        open={allCardsOpen}
        onlyFullScreen
        grayContent
        title={
          <Typography color={"primary"} textAlign={"center"}>
            {topics.currentTopic?.title.toLowerCase()}
          </Typography>
        }
        content={
          <div className={styles.allCards}>
            {(cards.shuffledCards() ?? cards.current()).map((card, i) => (
              <div
                key={card._id}
                className={classNames({
                  [styles.card_even]: i % 2 === 0,
                  [styles.card_odd]: i % 2 !== 0,
                })}
              >
                <CardItem
                  index={actualCardIndex(card._id)}
                  canEditTopic={canEditTopic}
                  noArrows
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

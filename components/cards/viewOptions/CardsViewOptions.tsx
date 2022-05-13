import { BaseSyntheticEvent, useState } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import {
  CodeRounded,
  LoopRounded,
  ShuffleRounded,
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
  canEditTopic: boolean;
};

export const CardsViewOptions = ({ canEditTopic }: CardsViewOptionsProps) => {
  const { t } = useTranslation();
  const topics = useTopics();
  const cards = useCards();

  const [allCardsOpen, setAllCardsOpen] = useState<boolean>(false);

  const toggleShuffle = async (event: BaseSyntheticEvent): Promise<void> => {
    await cards.toggleShuffle();
    event.target.blur();
  };

  const toggleSwap = (event: BaseSyntheticEvent) => {
    topics.toggleCardsSwap();
    event.target.blur();
  };

  const toggleArrows = () => {
    cards.toggleArrows();
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

  const disabled = (): boolean => {
    return cards.loading || !cards.current().length;
  };

  return (
    <div className={styles.container}>
      <Tooltip title={t("tip.show_arrows") ?? ""}>
        <IconButton
          onClick={toggleArrows}
          color={cards.hideArrows ? "info" : "primary"}
          disabled={disabled()}
        >
          <CodeRounded />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("tip.shuffle") ?? ""}>
        <IconButton
          onClick={toggleShuffle}
          className={styles.shuffle}
          color={cards.currentShuffled() ? "secondary" : "info"}
          disabled={disabled()}
        >
          <ShuffleRounded />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("tip.swap") ?? ""}>
        <IconButton
          color={topics.isSwapped() ? "primary" : "info"}
          onClick={toggleSwap}
          disabled={disabled()}
        >
          <LoopRounded />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("tip.show_all_cards") ?? ""}>
        <IconButton onClick={openAllCards} disabled={disabled()} color="info">
          <ViewComfyRounded />
        </IconButton>
      </Tooltip>

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
            {(cards.currentShuffled() ?? cards.current()).map((card, i) => (
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

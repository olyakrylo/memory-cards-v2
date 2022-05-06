import { useEffect, useState } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import {
  CodeRounded,
  SquareRounded,
  ViewComfyRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Subject } from "rxjs";
import { useRouter } from "next/router";

import styles from "./CardsViewOptions.module.css";
import AppDialog from "../../dialog";
import CardItem from "../item";
import { request } from "../../../utils/request";
import { Card, Topic, User } from "../../../shared/models";

type CardsViewOptionsProps = {
  user: User;
  cards: Record<string, Card[]>;
  currentTopic?: Topic;
  hideArrows: boolean;
  setHideArrows: (hide: boolean) => void;
  shuffledCards?: Card[];
  canEditTopic: boolean;
  flipCard: Subject<number>;
};

export const CardsViewOptions = ({
  user,
  cards,
  currentTopic,
  shuffledCards,
  hideArrows,
  setHideArrows,
  canEditTopic,
  flipCard,
}: CardsViewOptionsProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [allCardsOpen, setAllCardsOpen] = useState<boolean>(false);

  const currentTopicId = (): string => {
    return (router.query.topic as string) ?? "";
  };

  useEffect(() => {
    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  }, [user]);

  const toggleArrows = () => {
    void request("config", "arrows", "put", {
      body: {
        hide: !hideArrows,
      },
    });
    setHideArrows(!hideArrows);
  };

  const openAllCards = () => {
    setAllCardsOpen(true);
  };

  const closeAllCards = () => {
    setAllCardsOpen(false);
  };

  const actualCardIndex = (id: string): number => {
    return cards[currentTopicId()].findIndex((c) => c._id === id);
  };

  return (
    <div className={styles.container}>
      <Tooltip title={t("ui.show_arrows") ?? ""}>
        <IconButton
          onClick={toggleArrows}
          color={hideArrows ? "info" : "primary"}
        >
          <CodeRounded />
        </IconButton>
      </Tooltip>

      <IconButton onClick={openAllCards}>
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
            {(shuffledCards ?? cards[currentTopicId()]).map((card, i) => (
              <CardItem
                key={card._id}
                index={actualCardIndex(card._id)}
                showArrows={false}
                canEditTopic={canEditTopic}
                flipCard={flipCard}
              />
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

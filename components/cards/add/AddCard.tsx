import { useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { request } from "../../../utils/request";
import styles from "../Cards.module.css";
import { Card, Topic } from "../../../utils/types";
import CardControl from "../control";

type AddCardProps = {
  currentTopic: Topic;
  setLoading: (v: boolean) => void;
  addCards: (cards: Card[]) => void;
};

export const AddCard = ({
  currentTopic,
  setLoading,
  addCards,
}: AddCardProps) => {
  const [newCardOpen, setNewCardOpen] = useState<boolean>(false);

  const openNewCardDialog = (e: any) => {
    e.stopPropagation();
    setNewCardOpen(true);
  };

  const onCloseNewCardDialog = async (
    cards: { question: string; answer: string }[] | null
  ) => {
    setNewCardOpen(false);
    if (!cards) return;
    setLoading(true);

    const newCards = await request("cards", "", "post", {
      cards: cards.map((c) => ({ ...c, topic_id: currentTopic._id })),
    });
    if (newCards) {
      addCards(newCards);
    }

    setLoading(false);
  };

  return (
    <IconButton
      classes={{ root: styles.control__add }}
      onClick={openNewCardDialog}
    >
      <AddRounded />

      <CardControl open={newCardOpen} onClose={onCloseNewCardDialog} />
    </IconButton>
  );
};

import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { IconButton } from "@mui/material";

import styles from "../Cards.module.css";
import CardControl from "../control";
import { request } from "../../../utils/request";
import { Card, Topic } from "../../../utils/types";

export type AddCardProps = {
  currentTopic: Topic;
  setLoading: (v: boolean) => void;
  addCards: (cards: Card[]) => void;
};

const AddCard = ({ currentTopic, setLoading, addCards }: AddCardProps) => {
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
    <IconButton className={styles.control__add} onClick={openNewCardDialog}>
      <AddRoundedIcon />

      <CardControl open={newCardOpen} onClose={onCloseNewCardDialog} />
    </IconButton>
  );
};

export default AddCard;

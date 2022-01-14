import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { IconButton } from "@mui/material";

import styles from "../Cards.module.css";
import CardControl from "../control";
import { request } from "../../../middleware";
import { Card, Topic } from "../../../utils/types";

export type AddCardProps = {
  currentTopic: Topic;
  setLoading: (v: boolean) => void;
  addCard: (card: Card) => void;
};

const AddCard = ({ currentTopic, setLoading, addCard }: AddCardProps) => {
  const [newCardOpen, setNewCardOpen] = useState<boolean>(false);

  const openNewCardDialog = () => {
    setNewCardOpen(true);
  };

  const onCloseNewCardDialog = async (question: string, answer: string) => {
    setNewCardOpen(false);
    if (!question || !answer) return;
    setLoading(true);

    const newCard = await request<Card>("post", "cards", {
      question,
      answer,
      topic_id: currentTopic?._id,
    });
    if (newCard) {
      addCard(newCard);
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

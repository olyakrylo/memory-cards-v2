import { useState } from "react";
import { IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";

import { Card, ShortCard } from "../../../../utils/types";
import { request } from "../../../../utils/request";
import styles from "../CardItem.module.css";
import CardControl from "../../control";

type EditCardProps = {
  card: Card;
  setLoading: (v: boolean) => void;
  updateCard: (card: Card) => void;
};

export const EditCard = ({ card, setLoading, updateCard }: EditCardProps) => {
  const [editCardOpen, setEditCardOpen] = useState<boolean>(false);

  const openEditCardDialog = (e: any) => {
    e.stopPropagation();
    setEditCardOpen(true);
  };

  const onCloseEditCardDialog = async (
    newCards: ShortCard[] | null,
    card?: Card
  ) => {
    setEditCardOpen(false);
    if (!card || !newCards) return;

    setLoading(true);
    const updatedCard = await request("cards", "", "put", {
      ...card,
      question: newCards[0].question,
      answer: newCards[0].answer,
    });
    if (updatedCard) {
      updateCard(updatedCard);
    }
    setLoading(false);
  };

  return (
    <IconButton
      className={styles.card__edit}
      color="primary"
      onClick={openEditCardDialog}
      size={"small"}
    >
      <EditRounded />

      <CardControl
        card={card}
        open={editCardOpen}
        onClose={onCloseEditCardDialog}
      />
    </IconButton>
  );
};

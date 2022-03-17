import { useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IconButton } from "@mui/material";

import { Card } from "../../../utils/types";
import styles from "../Cards.module.css";
import CardControl from "../control";
import { request } from "../../../utils/request";

type EditCardProps = {
  card: Card;
  setLoading: (v: boolean) => void;
  updateCard: (card: Card) => void;
};

const EditCard = ({ card, setLoading, updateCard }: EditCardProps) => {
  const [editCardOpen, setEditCardOpen] = useState<boolean>(false);

  const openEditCardDialog = (e: any) => {
    e.stopPropagation();
    setEditCardOpen(true);
  };

  const onCloseEditCardDialog = async (
    newCards: { question: string; answer: string }[] | null,
    card?: Card
  ) => {
    setEditCardOpen(false);
    if (!card || !newCards) return;

    setLoading(true);
    const updatedCard = await request<Card>("put", `cards/${card._id}`, {
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
    >
      <EditRoundedIcon />

      <CardControl
        card={card}
        open={editCardOpen}
        onClose={onCloseEditCardDialog}
      />
    </IconButton>
  );
};

export default EditCard;

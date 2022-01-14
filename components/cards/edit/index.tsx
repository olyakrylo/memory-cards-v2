import { useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IconButton } from "@mui/material";

import { Card } from "../../../utils/types";
import styles from "../Cards.module.css";
import CardControl from "../control";
import { request } from "../../../middleware";

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
    question: string,
    answer: string,
    card?: Card
  ) => {
    setEditCardOpen(false);
    if (!card) return;

    setLoading(true);
    const updatedCard = await request<Card>("put", `cards/${card._id}`, {
      ...card,
      question,
      answer,
    });
    if (updatedCard) {
      updateCard(updatedCard);
    }
    setLoading(false);
  };

  return (
    <div>
      <IconButton
        className={styles.card__edit}
        color="primary"
        onClick={openEditCardDialog}
      >
        <EditRoundedIcon />
      </IconButton>

      <CardControl
        card={card}
        open={editCardOpen}
        onClose={onCloseEditCardDialog}
      />
    </div>
  );
};

export default EditCard;

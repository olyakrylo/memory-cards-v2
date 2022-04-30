import { useState } from "react";
import { IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";

import { Card, CardFieldContent, ShortCard } from "../../../../utils/types";
import { request } from "../../../../utils/request";
import styles from "../CardItem.module.css";
import CardControl from "../../control";
import { uploadImage } from "../../../../utils/images";
import { ControlCardFieldContent } from "../../control/CardControl";

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
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[],
    card?: Card
  ) => {
    setEditCardOpen(false);
    if (!card || !data || isSame(data)) return;

    setLoading(true);

    if (data.question.image && typeof data.question.image !== "string") {
      data.question.image = await uploadImage(data.question.image as File);
    }
    if (data.answer.image && typeof data.answer.image !== "string") {
      data.answer.image = await uploadImage(data.answer.image as File);
    }

    const updatedCard = await request("cards", "", "patch", {
      body: {
        ...card,
        question: data.question as CardFieldContent,
        answer: data.answer as CardFieldContent,
      },
    });
    if (updatedCard) {
      updateCard(updatedCard);
    }
    setLoading(false);
  };

  const isSame = (newData: {
    question: ControlCardFieldContent;
    answer: ControlCardFieldContent;
  }): boolean => {
    return (
      card.question.text === newData.question.text &&
      card.question.image === newData.question.image &&
      card.answer.text === newData.answer.text &&
      card.answer.image === newData.answer.image
    );
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

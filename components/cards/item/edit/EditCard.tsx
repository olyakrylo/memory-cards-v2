import { useState } from "react";
import { IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";

import { Card } from "../../../../shared/models";
import styles from "../CardItem.module.css";
import CardControl from "../../control";
import { ControlCardFieldContent } from "../../control/CardControl";
import { useCards } from "../../../../hooks";

type EditCardProps = {
  card: Card;
};

export const EditCard = ({ card }: EditCardProps) => {
  const cards = useCards();

  const [editCardOpen, setEditCardOpen] = useState<boolean>(false);

  const openEditCardDialog = (e: any) => {
    e.stopPropagation();
    setEditCardOpen(true);
  };

  const onCloseEditCardDialog = async (data?: {
    question: ControlCardFieldContent;
    answer: ControlCardFieldContent;
  }) => {
    setEditCardOpen(false);
    if (!data || isSame(data)) return;
    await cards.updateCard(card, data);
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
        onClose={(data) => onCloseEditCardDialog(data)}
      />
    </IconButton>
  );
};

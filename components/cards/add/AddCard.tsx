import { useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import styles from "../Cards.module.css";
import { ShortCard } from "../../../shared/models";
import CardControl from "../control";
import { ControlCardFieldContent } from "../control/CardControl";
import { useCards } from "../../../hooks";

export const AddCard = () => {
  const cards = useCards();

  const [newCardOpen, setNewCardOpen] = useState<boolean>(false);

  const openNewCardDialog = (e: any) => {
    e.stopPropagation();
    setNewCardOpen(true);
  };

  const onCloseNewCardDialog = async (
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[]
  ) => {
    setNewCardOpen(false);
    if (!data && !cardsFromFile?.length) return;

    await cards.addCards(data, cardsFromFile);
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

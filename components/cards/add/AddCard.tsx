import { useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { request } from "../../../utils/request";
import styles from "../Cards.module.css";
import { Card, ShortCard, Topic } from "../../../utils/types";
import CardControl from "../control";
import { uploadImage } from "../../../utils/images";
import { ControlCardFieldContent } from "../control/CardControl";

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
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[]
  ) => {
    setNewCardOpen(false);
    if (!data && !cardsFromFile?.length) return;
    setLoading(true);

    let newCards: Card[] = [];

    if (cardsFromFile?.length) {
      newCards = await request("cards", "", "put", {
        body: {
          cards: cardsFromFile.map((c) => ({
            ...c,
            topic_id: currentTopic._id,
          })),
        },
      });
    } else if (data) {
      const cardData: ShortCard = {
        question: {
          text: data.question.text,
        },
        answer: {
          text: data.answer.text,
        },
      };

      if (data?.question.image && typeof data.question.image !== "string") {
        cardData.question.image = await uploadImage(
          data.question.image as File
        );
      }
      if (data?.answer.image && typeof data.answer.image !== "string") {
        cardData.answer.image = await uploadImage(data.answer.image as File);
      }

      newCards = await request("cards", "", "put", {
        body: {
          cards: [{ ...cardData, topic_id: currentTopic._id }],
        },
      });
    }

    addCards(newCards);
    setLoading(false);
    return;
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

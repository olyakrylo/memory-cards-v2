import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

import styles from "./CardControl.module.css";
import AppDialog from "../../dialog";
import CardControlField from "./field";
import {
  Card,
  CardField,
  CardFieldContent,
  ControlCardFieldContent,
  ShortCard,
} from "../../../shared/models";
import { useTopics } from "../../../hooks";
import { CardsFromFile } from "./fromFile/CardsFromFile";

type CardControlProps = {
  open: boolean;
  onClose: (
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[]
  ) => void;
  card?: Card | ShortCard;
};

export const CardControl = ({ open, onClose, card }: CardControlProps) => {
  const topics = useTopics();

  const [question, setQuestion] = useState<ControlCardFieldContent>({
    text: "",
  });
  const [answer, setAnswer] = useState<ControlCardFieldContent>({ text: "" });

  const [cardsFromFile, setCardsFromFile] = useState<ShortCard[]>([]);

  useEffect(() => {
    if (open) {
      if (card) {
        setQuestion(card.question);
        setAnswer(card.answer);
      } else {
        setQuestion({ text: "" });
        setAnswer({ text: "" });
      }
      setCardsFromFile([]);
    }
  }, [open, card]);

  const { t } = useTranslation();

  const onSave = (e: any) => {
    e.stopPropagation();
    onClose({ question, answer }, cardsFromFile);
  };

  const onCloseDialog = (e: any) => {
    e.stopPropagation();
    onClose();
  };

  const handleTextChange = (
    field: CardField,
    data: Partial<CardFieldContent>
  ) => {
    if (field === "question") {
      setQuestion({ ...question, ...data });
    } else {
      setAnswer({ ...answer, ...data });
    }
  };

  const handleCardFromFileChange = (cards: ShortCard[]) => {
    setCardsFromFile(cards);
  };

  const handleImageChange = (field: CardField, file?: File) => {
    if (field === "question") {
      setQuestion({ ...question, image: file });
    } else {
      setAnswer({ ...answer, image: file });
    }
  };

  const noData = (): boolean => {
    return !(
      question.text ||
      question.image ||
      answer.text ||
      answer.image ||
      cardsFromFile.length
    );
  };

  return (
    <AppDialog
      open={open}
      size={"sm"}
      responsive={true}
      title={
        <>
          {t(card ? "add.edit_card_in" : "add.new_card_for")}{" "}
          <span className={styles.topic}>{topics.currentTopic?.title}</span>
        </>
      }
      content={
        <div className={styles.content}>
          <CardControlField
            field="question"
            value={question}
            rowsCount={2}
            onChange={(data) => handleTextChange("question", data)}
            onChangeImage={(data) => handleImageChange("question", data)}
            disabled={!!cardsFromFile.length}
          />

          <CardControlField
            field="answer"
            value={answer}
            rowsCount={4}
            onChange={(data) => handleTextChange("answer", data)}
            onChangeImage={(data) => handleImageChange("answer", data)}
            disabled={!!cardsFromFile.length}
          />

          {!card && <div className={styles.or}>{t("ui.or")}</div>}

          {!card && (
            <CardsFromFile
              cards={cardsFromFile}
              onChangeCards={handleCardFromFileChange}
            />
          )}
        </div>
      }
      actions={
        <>
          <Button onClick={onCloseDialog} color="secondary">
            {t("ui.cancel")}
          </Button>
          <Button variant="contained" onClick={onSave} disabled={noData()}>
            {t("ui.save")}
          </Button>
        </>
      }
    />
  );
};

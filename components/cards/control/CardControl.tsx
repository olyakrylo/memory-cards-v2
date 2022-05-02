import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip, Typography } from "@mui/material";

import styles from "./CardControl.module.css";
import AppDialog from "../../dialog";
import CardControlField from "./field";
import {
  Card,
  CardField,
  CardFieldContent,
  ShortCard,
  Topic,
} from "../../../shared/models";
import { AppNotification } from "../../../shared/notification";

export type ControlCardFieldContent = {
  text: string;
  image?: string | File;
};

type CardControlProps = {
  currentTopic?: Topic;
  open: boolean;
  onClose: (
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[],
    card?: Card
  ) => void;
  card?: Card;
  setNotification: (n: AppNotification) => void;
};

export const CardControl = ({
  currentTopic,
  open,
  onClose,
  card,
  setNotification,
}: CardControlProps) => {
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
    onClose({ question, answer }, cardsFromFile, card);
  };

  const onCloseDialog = (e: any) => {
    e.stopPropagation();
    onClose();
  };

  const onChangeField = (field: CardField, data: Partial<CardFieldContent>) => {
    if (field === "question") {
      setQuestion({ ...question, ...data });
    } else {
      setAnswer({ ...answer, ...data });
    }
  };

  const onCardsFileChange = async (
    event: BaseSyntheticEvent
  ): Promise<void> => {
    const file = event.target.files[0] as File;
    const text = await file.text();
    const separator: Record<string, string> = {
      "text/plain": " ",
      "text/tab-separated-values": "\t",
      "text/csv": ";",
    };
    try {
      const cardsData = text
        .split("\n")
        .filter((row) => !!row.trim())
        .map((row: string): ShortCard => {
          const [q, a] = row.trim().split(separator[file.type]);
          if (!q || !a) {
            throw new Error();
          }
          return { question: { text: q }, answer: { text: a } };
        });
      setCardsFromFile(cardsData);
    } catch {
      setNotification({
        severity: "error",
        autoHide: 5000,
        translate: true,
        text: "add.invalid_file_content",
      });
    }
  };

  const onChangeImage = (field: CardField, file?: File) => {
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
          <span className={styles.topic}>{currentTopic?.title}</span>
        </>
      }
      content={
        <div className={styles.content}>
          <CardControlField
            field="question"
            value={question}
            rowsCount={3}
            handleChange={(data) => onChangeField("question", data)}
            handleImage={(data) => onChangeImage("question", data)}
            disabled={!!cardsFromFile.length}
          />

          <CardControlField
            field="answer"
            value={answer}
            rowsCount={6}
            handleChange={(data) => onChangeField("answer", data)}
            handleImage={(data) => onChangeImage("answer", data)}
            disabled={!!cardsFromFile.length}
          />

          {!card && <div className={styles.or}>{t("ui.or")}</div>}

          {!card && (
            <Tooltip title={`${t("add.file_formats")}`}>
              <Button
                variant="contained"
                component="label"
                className={styles.fileInput}
              >
                {t("ui.upload_from_file")}
                <input
                  type="file"
                  hidden
                  onChange={onCardsFileChange}
                  accept=".txt"
                />
              </Button>
            </Tooltip>
          )}

          {cardsFromFile.map((card, i) => (
            <div className={styles.card} key={i}>
              <Typography classes={{ root: styles.card__question }}>
                {card.question.text}
              </Typography>
              <Typography>{card.answer.text}</Typography>
            </div>
          ))}
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

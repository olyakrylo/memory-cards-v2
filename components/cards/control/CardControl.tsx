import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField, Tooltip } from "@mui/material";

import { Card, Topic } from "../../../utils/types";
import styles from "./CardControl.module.css";
import AppDialog from "../../dialog";

type CardControlProps = {
  currentTopic?: Topic;
  open: boolean;
  onClose: (
    newCards: { question: string; answer: string }[] | null,
    card?: Card
  ) => void;
  card?: Card;
};

type ShortCard = Omit<Card, "_id" | "topic_id">;

export const CardControl = ({
  currentTopic,
  open,
  onClose,
  card,
}: CardControlProps) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const [cardsFromFile, setCardsFromFile] = useState<ShortCard[]>([]);

  useEffect(() => {
    if (open) {
      setQuestion(card?.question ?? "");
      setAnswer(card?.answer ?? "");
      setCardsFromFile([]);
    }
  }, [open, card]);

  const { t } = useTranslation();

  const onSave = (e: any) => {
    e.stopPropagation();
    let newCards = [{ question, answer }];
    if (cardsFromFile.length) {
      newCards = cardsFromFile;
    }
    onClose(newCards, card);
  };

  const onCloseDialog = (e: any) => {
    e.stopPropagation();
    onClose(null);
  };

  const onChangeField = (event: any, updateFunc: (value: string) => void) => {
    event.stopPropagation();
    const { value } = event.target as { value: string };
    updateFunc(value);
  };

  const handleFile = async (event: BaseSyntheticEvent): Promise<void> => {
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
          return { question: q, answer: a };
        });
      setCardsFromFile(cardsData);
    } catch {
      alert("Invalid file content");
    }
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
          <TextField
            required
            multiline
            rows={3}
            label={t("ui.question")}
            defaultValue={question}
            onChange={(e) => onChangeField(e, setQuestion)}
            disabled={!!cardsFromFile.length}
          />
          <TextField
            required
            multiline
            rows={6}
            label={t("ui.answer")}
            defaultValue={answer}
            onChange={(e) => onChangeField(e, setAnswer)}
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
                <input type="file" hidden onChange={handleFile} accept=".txt" />
              </Button>
            </Tooltip>
          )}

          {cardsFromFile.map((card, i) => (
            <div className={styles.card} key={i}>
              <span className={styles.card__question}>{card.question}</span>
              <span className={styles.card__answer}>{card.answer}</span>
            </div>
          ))}
        </div>
      }
      actions={
        <>
          <Button onClick={onCloseDialog} color="secondary">
            {t("ui.cancel")}
          </Button>
          <Button variant="contained" onClick={onSave}>
            {t("ui.save")}
          </Button>
        </>
      }
    />
  );
};

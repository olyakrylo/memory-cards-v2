import {
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteTwoTone, EditRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import styles from "./CardsFromFile.module.css";
import { ShortCard } from "../../../../shared/models";
import { BaseSyntheticEvent, useState } from "react";
import { useNotification } from "../../../../hooks";
import { CardControl } from "../CardControl";
import AppImage from "../../../image";

type CardFromFileProps = {
  cards: ShortCard[];
  onChangeCards: (c: ShortCard[]) => void;
};

export const CardsFromFile = ({ cards, onChangeCards }: CardFromFileProps) => {
  const { t } = useTranslation();
  const notification = useNotification();

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const handleInputChange = async (
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
          return { question: { text: q }, answer: { text: a } };
        });
      onChangeCards(cardsData);
    } catch {
      notification.setError("add.invalid_file_content");
    }
  };

  const deleteCard = (index: number) => {
    const updatedCards = cards.slice();
    updatedCards.splice(index, 1);
    onChangeCards(updatedCards);
  };

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditDialogClose = (
    index: number,
    card: ShortCard,
    data?: ShortCard
  ): void => {
    if (!data) {
      closeEditDialog();
      return;
    }

    const updatedCards: ShortCard[] = cards.map((c, i) => {
      if (index !== i) return c;
      return data;
    });

    onChangeCards(updatedCards);
    closeEditDialog();
  };

  return (
    <div className={styles.container}>
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
            onChange={handleInputChange}
            accept=".txt"
          />
        </Button>
      </Tooltip>

      <div className={styles.cardsContainer}>
        {cards.map((card, i) => (
          <div className={styles.card} key={i}>
            <Typography className={styles.card__question}>
              {card.question.text}
              {card.question.image && (
                <AppImage
                  src={card.question.image}
                  alt={""}
                  maxHeight={"150px"}
                  alignStart
                />
              )}
            </Typography>

            <Divider className={styles.card__divider} />

            <Typography className={styles.card__answer}>
              {card.answer.text}
              {card.answer.image && (
                <AppImage
                  src={card.answer.image}
                  alt={""}
                  maxHeight={"150px"}
                  alignStart
                />
              )}
            </Typography>

            <IconButton
              className={styles.card__edit}
              size="small"
              color="primary"
              onClick={openEditDialog}
            >
              <EditRounded />

              <CardControl
                open={editDialogOpen}
                onClose={(data) => handleEditDialogClose(i, card, data)}
                card={card}
              />
            </IconButton>

            <IconButton
              className={styles.card__delete}
              size="small"
              color="secondary"
              onClick={() => deleteCard(i)}
            >
              <DeleteTwoTone />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

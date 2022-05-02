import { BaseSyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Typography } from "@mui/material";
import { ZoomOutMapRounded } from "@mui/icons-material";

import { Card, CardField } from "../../../../shared/models";
import styles from "../CardItem.module.css";
import AppImage from "../../../image";

const MAX_TEXT_LENGTH = 300;

type CardMainContentProps = {
  card: Card;
  field: CardField;
  openDialog: (e: BaseSyntheticEvent) => void;
};

export const CardMainContent = ({
  card,
  field,
  openDialog,
}: CardMainContentProps) => {
  const { t } = useTranslation();

  const cropText = (text: string): string => {
    if (text.length < MAX_TEXT_LENGTH) return text;
    return `${text.slice(0, MAX_TEXT_LENGTH)}...`;
  };

  return (
    <>
      {card[field].image && (
        <AppImage
          src={card[field].image as string}
          alt={t(`ui.${field}_image`)}
          classes={styles.card__image}
        />
      )}

      {!card[field].image && (
        <Typography className={styles.card__text}>
          {cropText(card[field].text)}
        </Typography>
      )}

      <IconButton
        className={styles.card__flip}
        size={"small"}
        onClick={openDialog}
      >
        <ZoomOutMapRounded />
      </IconButton>
    </>
  );
};

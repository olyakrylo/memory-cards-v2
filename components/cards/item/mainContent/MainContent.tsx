import { BaseSyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { ZoomInMapRounded, ZoomOutMapRounded } from "@mui/icons-material";

import { Card, CardField } from "../../../../shared/models";
import styles from "../CardItem.module.css";
import AppImage from "../../../image";
import CardDialogContent from "../dialogContent";
import AppDialog from "../../../dialog";

const MAX_TEXT_LENGTH = 300;

type CardMainContentProps = {
  card: Card;
  field: CardField;
};

export const CardMainContent = ({ card, field }: CardMainContentProps) => {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const cropText = (text: string): string => {
    if (text.length < MAX_TEXT_LENGTH) return text;
    return `${text.slice(0, MAX_TEXT_LENGTH)}...`;
  };

  const openDialog = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const closeDialog = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    setDialogOpen(false);
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

      <Tooltip title={t("tip.reveal") ?? ""}>
        <IconButton
          className={styles.card__flip}
          size={"small"}
          onClick={openDialog}
        >
          <ZoomOutMapRounded />
        </IconButton>
      </Tooltip>

      <AppDialog
        open={dialogOpen}
        size={"sm"}
        responsive={true}
        onClose={closeDialog}
        content={
          <>
            <CardDialogContent field={"question"} card={card} />
            <Divider classes={{ root: styles.dialog__divider }} />
            <CardDialogContent field={"answer"} card={card} />
          </>
        }
        actions={
          <IconButton onClick={closeDialog}>
            <ZoomInMapRounded />
          </IconButton>
        }
      />
    </>
  );
};

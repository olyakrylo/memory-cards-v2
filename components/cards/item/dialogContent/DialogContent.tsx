import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

import { Card } from "../../../../utils/types";
import styles from "../CardItem.module.css";
import AppImage from "../../../image";

type CardDialogContentProps = {
  field: "question" | "answer";
  card: Card;
};

export const CardDialogContent = ({ field, card }: CardDialogContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography fontWeight={500} variant={"subtitle1"} color={"primary"}>
        {t(`ui.${field}`)}
      </Typography>
      <Typography>{card[field].text}</Typography>

      {card[field].image && (
        <AppImage
          src={card[field].image as string}
          alt={t(`ui.${field}_image`)}
          classes={styles.dialog__imageContainer}
        />
      )}
    </>
  );
};

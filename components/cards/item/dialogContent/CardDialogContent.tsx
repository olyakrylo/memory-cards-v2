import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

import { Card } from "../../../../shared/models";
import styles from "./CardDialogContent.module.css";
import AppImage from "../../../image";
import { formatText } from "../../utils";

type CardDialogContentProps = {
  field: "question" | "answer";
  card: Card;
};

export const CardDialogContent = ({ field, card }: CardDialogContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography
        variant={"subtitle1"}
        color={"primary"}
        className={styles.header}
      >
        {t(`ui.${field}`)}
      </Typography>
      <Typography>{formatText(card[field].text)}</Typography>

      {card[field].image && (
        <div className={styles.image}>
          <AppImage
            src={card[field].image as string}
            alt={t(`ui.${field}_image`)}
          />
        </div>
      )}
    </>
  );
};

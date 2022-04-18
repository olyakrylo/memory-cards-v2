import { BaseSyntheticEvent, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SplideSlide } from "@splidejs/react-splide";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { DeleteTwoTone, Share } from "@mui/icons-material";

import { Card } from "../../../utils/types";
import styles from "./CardItem.module.css";
import EditCard from "./edit";

type CardItemProps = {
  card: Card;
  showArrows: boolean;
  canEditTopic: boolean;
  inverted: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  toggleCard: (event: BaseSyntheticEvent) => void;
  deleteCard: () => void;
  updateCard: (c: Card) => void;
  shareCard: () => void;
};

export const CardItem = ({
  card,
  showArrows,
  canEditTopic,
  inverted,
  setLoading,
  toggleCard,
  updateCard,
  shareCard,
  deleteCard,
}: CardItemProps) => {
  const { t } = useTranslation();

  const handleDelete = (event: BaseSyntheticEvent): void => {
    event.stopPropagation();
    deleteCard();
  };

  const handleShare = (event: BaseSyntheticEvent): void => {
    event.stopPropagation();
    shareCard();
  };

  return (
    <SplideSlide>
      <div
        className={`${styles.card} ${showArrows && styles.card_arrows}`}
        onClick={toggleCard}
      >
        <Typography className={styles.card__text}>
          {inverted ? card.answer : card.question}
        </Typography>

        {card._id && canEditTopic && (
          <IconButton
            className={styles.card__del}
            color="secondary"
            onClick={handleDelete}
          >
            <DeleteTwoTone />
          </IconButton>
        )}

        {card._id && canEditTopic && (
          <EditCard
            card={card}
            setLoading={setLoading}
            updateCard={updateCard}
          />
        )}

        {card._id && (
          <Tooltip title={t("ui.share") ?? ""}>
            <IconButton className={styles.card__share} onClick={handleShare}>
              <Share />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </SplideSlide>
  );
};

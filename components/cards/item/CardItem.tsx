import {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Subject } from "rxjs";
import { SplideSlide } from "@splidejs/react-splide";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { DeleteTwoTone, Share, LoopRounded } from "@mui/icons-material";
import ReactCardFlip from "react-card-flip";

import { Card } from "../../../utils/types";
import styles from "./CardItem.module.css";
import EditCard from "./edit";

type CardItemProps = {
  index: number;
  card: Card;
  showArrows: boolean;
  canEditTopic: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  deleteCard: () => void;
  updateCard: (c: Card) => void;
  shareCard: () => void;
  resetCards: Subject<void>;
  flipCard: Subject<number>;
};

export const CardItem = ({
  index,
  card,
  showArrows,
  canEditTopic,
  setLoading,
  updateCard,
  shareCard,
  deleteCard,
  resetCards,
  flipCard,
}: CardItemProps) => {
  const { t } = useTranslation();

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    resetCards.subscribe(() => setFlipped(false));
    flipCard.subscribe((num) => {
      if (num !== index) return;
      setFlipped(!flipped);
    });
  });

  const handleDelete = (event: BaseSyntheticEvent): void => {
    event.stopPropagation();
    deleteCard();
  };

  const handleShare = (event: BaseSyntheticEvent): void => {
    event.stopPropagation();
    shareCard();
  };

  const toggleCard = () => {
    setFlipped(!flipped);
  };

  return (
    <SplideSlide>
      <ReactCardFlip
        isFlipped={flipped}
        flipDirection="vertical"
        containerClassName={`${styles.cardContainer} ${
          showArrows && styles.cardContainer_arrows
        }`}
        cardZIndex={"100"}
      >
        <div className={styles.card} onClick={toggleCard}>
          <Typography className={styles.card__text}>{card.question}</Typography>

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

          <LoopRounded className={styles.card__flip} />
        </div>

        <div
          className={`${styles.card} ${showArrows && styles.card_arrows}`}
          onClick={toggleCard}
        >
          <Typography className={styles.card__text}>{card.answer}</Typography>
          <LoopRounded className={styles.card__flip} />
        </div>
      </ReactCardFlip>
    </SplideSlide>
  );
};

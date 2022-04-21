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
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DeleteTwoTone,
  Share,
  ZoomOutMap,
  ZoomInMap,
} from "@mui/icons-material";
import ReactCardFlip from "react-card-flip";

import { Card } from "../../../utils/types";
import styles from "./CardItem.module.css";
import EditCard from "./edit";

const MAX_TEXT_LENGTH = 300;

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

  const [flipped, setFlipped] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    resetCards.subscribe(() => setFlipped(false));
    flipCard.subscribe((num) => {
      if (num !== index) return;
      setFlipped(!flipped);
    });
  });

  const openDialog = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

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

  const cropText = (text: string): string => {
    if (text.length < MAX_TEXT_LENGTH) return text;
    return `${text.slice(0, MAX_TEXT_LENGTH)}...`;
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
          <Typography className={styles.card__text}>
            {cropText(card.question)}
          </Typography>

          {card._id && canEditTopic && (
            <IconButton
              size={"small"}
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
              <IconButton
                className={styles.card__share}
                onClick={handleShare}
                size={"small"}
              >
                <Share />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            className={styles.card__flip}
            size={"small"}
            onClick={openDialog}
          >
            <ZoomOutMap />
          </IconButton>
        </div>

        <div
          className={`${styles.card} ${showArrows && styles.card_arrows}`}
          onClick={toggleCard}
        >
          <Typography className={styles.card__text}>
            {cropText(card.answer)}
          </Typography>

          <IconButton
            className={styles.card__flip}
            size={"small"}
            onClick={openDialog}
          >
            <ZoomOutMap />
          </IconButton>
        </div>
      </ReactCardFlip>

      <Dialog open={dialogOpen}>
        <DialogContent className={styles.dialog__content}>
          <Typography fontWeight={500} variant={"subtitle1"} color={"primary"}>
            {t("ui.question")}
          </Typography>
          <Typography>{card.question}</Typography>

          <Divider className={styles.dialog__divider} />

          <Typography fontWeight={500} variant={"subtitle1"} color={"primary"}>
            {t("ui.answer")}
          </Typography>
          <Typography>{card.answer}</Typography>
        </DialogContent>

        <DialogActions>
          <IconButton onClick={closeDialog}>
            <ZoomInMap />
          </IconButton>
        </DialogActions>
      </Dialog>
    </SplideSlide>
  );
};

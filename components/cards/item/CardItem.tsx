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
import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
import {
  DeleteTwoTone,
  Share,
  ZoomOutMapRounded,
  ZoomInMapRounded,
} from "@mui/icons-material";
import ReactCardFlip from "react-card-flip";
import Image from "next/image";

import { Card, CardField } from "../../../utils/types";
import styles from "./CardItem.module.css";
import EditCard from "./edit";
import AppDialog from "../../dialog";
import Field from "../control/field";

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
          {card.question.image && (
            <Image
              src={card.question.image}
              layout={"fill"}
              objectFit={"contain"}
            />
          )}

          <Typography className={styles.card__text}>
            {cropText(card.question.text)}
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
            <ZoomOutMapRounded />
          </IconButton>
        </div>

        <div
          className={`${styles.card} ${showArrows && styles.card_arrows}`}
          onClick={toggleCard}
        >
          {card.answer.image && (
            <Image
              src={card.answer.image}
              layout={"fill"}
              objectFit={"contain"}
            />
          )}

          <Typography className={styles.card__text}>
            {cropText(card.answer.text)}
          </Typography>

          <IconButton
            className={styles.card__flip}
            size={"small"}
            onClick={openDialog}
          >
            <ZoomOutMapRounded />
          </IconButton>
        </div>
      </ReactCardFlip>

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
    </SplideSlide>
  );
};

type CardDialogContentProps = {
  field: "question" | "answer";
  card: Card;
};

const CardDialogContent = ({ field, card }: CardDialogContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography fontWeight={500} variant={"subtitle1"} color={"primary"}>
        {t(`ui.${field}`)}
      </Typography>
      <Typography>{card[field].text}</Typography>
      {card[field].image && (
        <img
          src={card[field].image}
          alt={t(`ui.${field}`)}
          className={styles.dialog__image}
        />
      )}
    </>
  );
};

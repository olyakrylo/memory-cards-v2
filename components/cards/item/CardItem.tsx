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
import { Divider, IconButton, Tooltip } from "@mui/material";
import { DeleteTwoTone, Share, ZoomInMapRounded } from "@mui/icons-material";
import ReactCardFlip from "react-card-flip";

import { Card } from "../../../shared/models";
import styles from "./CardItem.module.css";
import EditCard from "./edit";
import AppDialog from "../../dialog";
import CardMainContent from "./mainContent";
import CardDialogContent from "./dialogContent";

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
          <CardMainContent
            card={card}
            field={"question"}
            openDialog={openDialog}
          />

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
        </div>

        <div
          className={`${styles.card} ${showArrows && styles.card_arrows}`}
          onClick={toggleCard}
        >
          <CardMainContent
            card={card}
            field={"answer"}
            openDialog={openDialog}
          />
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

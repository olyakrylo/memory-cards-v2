import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Subject } from "rxjs";
import { SplideSlide } from "@splidejs/react-splide";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { DeleteTwoTone, Share, ZoomInMapRounded } from "@mui/icons-material";

import { Card } from "../../../shared/models";
import styles from "./CardItem.module.css";
import ReactCardFlip from "react-card-flip";
import CardMainContent from "./mainContent";
import EditCard from "./edit";
import AppDialog from "../../dialog";
import CardDialogContent from "./dialogContent";
import { AppNotification } from "../../../shared/notification";
import { request } from "../../../utils/request";

type CardItemProps = {
  index: number;
  card: Card;
  showArrows: boolean;
  canEditTopic: boolean;
  resetCards: Subject<void>;
  flipCard: Subject<number>;
  setNotification: (n: AppNotification) => void;
  onUpdate: () => void;
};

export const CardItem = ({
  index,
  card,
  showArrows,
  canEditTopic,
  resetCards,
  flipCard,
  setNotification,
  onUpdate,
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

  const handleDelete = async (event: BaseSyntheticEvent): Promise<void> => {
    event.stopPropagation();
    await request("cards", "", "delete", { query: { ids: [card._id] } });
    onUpdate();
  };

  const handleShare = async (event: BaseSyntheticEvent): Promise<void> => {
    event.stopPropagation();
    const { href } = window.location;
    const link = `${href}&card=${index}`;
    await navigator.clipboard.writeText(link);

    setNotification({
      severity: "success",
      text: "ui.link_copied",
      translate: true,
      autoHide: 5000,
    });
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
            <EditCard card={card} onUpdate={onUpdate} />
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

import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { DeleteTwoTone, Share, ZoomInMapRounded } from "@mui/icons-material";
import classNames from "classnames";
import ReactCardFlip from "react-card-flip";

import { Card } from "../../../shared/models";
import styles from "./CardItem.module.css";
import CardMainContent from "./mainContent";
import EditCard from "./edit";
import AppDialog from "../../dialog";
import CardDialogContent from "./dialogContent";
import { AppNotification } from "../../../shared/notification";
import { useCards, useTopics } from "../../../hooks";

type CardItemProps = {
  index: number;
  setCards: (id: string, c: Card[]) => void;
  canEditTopic: boolean;
  setNotification: (n: AppNotification) => void;
  noArrows?: boolean;
};

export const CardItem = ({
  index,
  canEditTopic,
  setNotification,
  noArrows,
}: CardItemProps) => {
  const { t } = useTranslation();
  const cards = useCards();
  const topics = useTopics();

  const [flipped, setFlipped] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const card = (): Card => {
    return cards.current()[index];
  };

  useEffect(() => {
    cards.resetCards.subscribe(() => setFlipped(false));
    cards.flipCard.subscribe((num) => {
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
    void cards.deleteCard(topics.currentId, card()._id);
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

  if (!card()) {
    return <></>;
  }

  return (
    <>
      <ReactCardFlip
        isFlipped={flipped}
        flipDirection="vertical"
        containerClassName={classNames(styles.cardContainer, {
          [styles.cardContainer_arrows]: noArrows ? false : !cards.hideArrows(),
        })}
      >
        <div className={styles.card} onClick={toggleCard}>
          <CardMainContent
            card={card()}
            field={"question"}
            openDialog={openDialog}
          />

          {card()._id && canEditTopic && (
            <IconButton
              size={"small"}
              className={styles.card__del}
              color="secondary"
              onClick={handleDelete}
            >
              <DeleteTwoTone />
            </IconButton>
          )}

          {card()._id && canEditTopic && <EditCard card={card()} />}

          {card()._id && (
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
          className={classNames(styles.card, {
            [styles.card_arrows]: !cards.hideArrows(),
          })}
          onClick={toggleCard}
        >
          <CardMainContent
            card={card()}
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
            <CardDialogContent field={"question"} card={card()} />
            <Divider classes={{ root: styles.dialog__divider }} />
            <CardDialogContent field={"answer"} card={card()} />
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

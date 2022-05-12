import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteTwoTone, Share } from "@mui/icons-material";
import classNames from "classnames";
import ReactCardFlip from "react-card-flip";

import { Card } from "../../../shared/models";
import styles from "./CardItem.module.css";
import CardMainContent from "./mainContent";
import EditCard from "./edit";
import {
  useCards,
  useCardsService,
  useTopics,
  useNotification,
} from "../../../hooks";

type CardItemProps = {
  index: number;
  canEditTopic: boolean;
  noArrows?: boolean;
};

export const CardItem = ({ index, canEditTopic, noArrows }: CardItemProps) => {
  const { t } = useTranslation();
  const cards = useCards();
  const cardsService = useCardsService();
  const topics = useTopics();
  const notification = useNotification();

  const [flipped, setFlipped] = useState<boolean>(false);

  const card = (): Card => {
    return cards.current()[index];
  };

  useEffect(() => {
    cardsService.resetCards.subscribe(() => setFlipped(false));
    cardsService.flipCard.subscribe((num) => {
      if (num !== index) return;
      setFlipped(!flipped);
    });
  });

  const handleDelete = (event: BaseSyntheticEvent): void => {
    event.stopPropagation();
    void cards.deleteCard(topics.currentId, card()._id);
  };

  const handleShare = async (event: BaseSyntheticEvent): Promise<void> => {
    event.stopPropagation();

    const { href } = window.location;
    const link = `${href}&card=${index}`;
    await navigator.clipboard.writeText(link);

    notification.setSuccess("ui.link_copied");
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
          [styles.cardContainer_arrows]: noArrows ? false : !cards.hideArrows,
        })}
      >
        <div className={styles.card} onClick={toggleCard}>
          <CardMainContent
            card={card()}
            field={topics.isSwapped() ? "answer" : "question"}
          />

          {card()._id && canEditTopic && (
            <Tooltip title={t("tip.delete_card") ?? ""}>
              <IconButton
                size={"small"}
                className={styles.card__del}
                color="secondary"
                onClick={handleDelete}
              >
                <DeleteTwoTone />
              </IconButton>
            </Tooltip>
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
            [styles.card_arrows]: !cards.hideArrows,
          })}
          onClick={toggleCard}
        >
          <CardMainContent
            card={card()}
            field={topics.isSwapped() ? "question" : "answer"}
          />
        </div>
      </ReactCardFlip>
    </>
  );
};

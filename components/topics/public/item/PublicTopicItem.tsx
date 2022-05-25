import { BaseSyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Typography } from "@mui/material";
import {
  AddCircleRounded,
  KeyboardArrowDownRounded,
  RemoveCircleRounded,
} from "@mui/icons-material";

import SkeletonLoader from "../../../skeletonLoader";
import { Card, CardField, TopicExt } from "../../../../shared/models";
import styles from "./PublicTopicItem.module.css";
import AppImage from "../../../image";
import { useCards } from "../../../../hooks";

type PublicTopicItemProps = {
  topic: TopicExt;
  selected: boolean;
  onToggleTopic: () => void;
};

export const PublicTopicItem = ({
  topic,
  selected,
  onToggleTopic,
}: PublicTopicItemProps) => {
  const { t } = useTranslation();
  const cards = useCards();

  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    if (!expanded && !cards.get(topic._id)) {
      void loadCards();
    }
    setExpanded(!expanded);
  };

  const toggleTopic = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    onToggleTopic();
  };

  const loadCards = async (): Promise<void> => {
    await cards.loadTopicCards(topic._id);
  };

  return (
    <div key={topic._id} className={styles.topic}>
      <div
        className={styles.topic__head}
        onClick={toggleExpand}
        aria-disabled={!topic.cards_count}
      >
        <IconButton
          size="small"
          className={styles.topic__expand}
          aria-expanded={expanded}
          disabled={!topic.cards_count}
        >
          <KeyboardArrowDownRounded />
        </IconButton>
        <Typography classes={{ root: styles.topic__title }}>
          {topic.title}
        </Typography>
        <Typography className={styles.topic__author}>
          ({topic.author_name})
        </Typography>
        <Typography className={styles.topic__cards} variant="subtitle2">
          {t("add.cards-count", { count: topic.cards_count ?? 0 })}
        </Typography>
        <IconButton
          size="small"
          className={styles.topic__toggle}
          color={selected ? "secondary" : "primary"}
          onClick={(e) => toggleTopic(e)}
        >
          {selected ? <RemoveCircleRounded /> : <AddCircleRounded />}
        </IconButton>
      </div>

      {expanded && (
        <div className={styles.topic__content}>
          {!cards.get(topic._id) && (
            <SkeletonLoader height={64} count={topic.cards_count} />
          )}

          {cards.get(topic._id) &&
            cards.get(topic._id)?.map((card) => (
              <div key={card._id} className={styles.card}>
                <PublicTopicCardField card={card} field="question" />
                <PublicTopicCardField card={card} field="answer" />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

type PublicTopicsCardFieldProps = {
  card: Card;
  field: CardField;
};

const PublicTopicCardField = ({ card, field }: PublicTopicsCardFieldProps) => {
  const { t } = useTranslation();

  const className = (): string => {
    switch (field) {
      case "answer":
        return styles.card__answer;
      case "question":
        return styles.card__question;
      default:
        return "";
    }
  };

  return (
    <>
      {card[field].text && (
        <Typography className={className()} variant="subtitle2">
          {card[field].text}
        </Typography>
      )}

      {card[field].image && (
        <div className={styles.card__image}>
          <AppImage
            src={card[field].image as string}
            alt={t(`ui.${field}_image`)}
          />
        </div>
      )}
    </>
  );
};

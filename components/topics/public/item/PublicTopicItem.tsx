import { BaseSyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Typography } from "@mui/material";
import {
  AddCircleRounded,
  KeyboardArrowDownRounded,
  RemoveCircleRounded,
} from "@mui/icons-material";

import SkeletonLoader from "../../../skeletonLoader";
import { request } from "../../../../utils/request";
import { Card, CardField, TopicExt } from "../../../../utils/types";
import styles from "./PublicTopicItem.module.css";
import AppImage from "../../../image";

type PublicTopicItemProps = {
  topic: TopicExt;
  selected: boolean;
  toggleTopic: () => void;
};

export const PublicTopicItem = ({
  topic,
  selected,
  toggleTopic,
}: PublicTopicItemProps) => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[] | null>(null);

  const toggleExpand = () => {
    if (!expanded && !cards) {
      void loadCards();
    }
    setExpanded(!expanded);
  };

  const onToggleTopic = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    toggleTopic();
  };

  const loadCards = async (): Promise<void> => {
    const cards = await request("cards", "by_topic", "post", {
      topic_id: topic._id,
    });
    setCards(cards);
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
          onClick={(e) => onToggleTopic(e)}
        >
          {selected ? <RemoveCircleRounded /> : <AddCircleRounded />}
        </IconButton>
      </div>

      {expanded && (
        <div className={styles.topic__content}>
          {!cards && <SkeletonLoader height={64} count={topic.cards_count} />}

          {cards &&
            cards.map((card) => (
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
        <AppImage
          src={card[field].image as string}
          alt={t(`ui.${field}_image`)}
          maxHeight={"180px"}
          rounded={true}
        />
      )}
    </>
  );
};

import { useState } from "react";
import { Divider, Typography } from "@mui/material";

import { Card as CardType, Topic } from "../../../shared/models";
import { AdminTabData } from "../../../shared/admin";
import SkeletonLoader from "../../skeletonLoader";
import { AdminView } from "../view/AdminView";
import styles from "./AdminTopics.module.css";
import AppImage from "../../image";
import { useCards } from "../../../hooks";

type AdminTopicsProps = AdminTabData<Topic>;

export const AdminTopics = ({ data, count }: AdminTopicsProps) => {
  const cards = useCards();

  const [cardsData, setCardsData] = useState<
    Record<string, { count: number; data?: CardType[] }>
  >({});

  const handleExpand = (id: string, expanded: boolean) => {
    if (expanded && !cardsData[id]) {
      void loadCards(id);
    }
  };

  const loadCards = async (id: string) => {
    const { count } = await cards.countByTopic(id);
    setCardsData({ ...cardsData, [id]: { count } });

    const data = await cards.getByTopic(id);
    setCardsData({ ...cardsData, [id]: { ...cardsData[id], data } });
  };

  const topicTitle = (topic: Topic): string => {
    return topic.title;
  };

  const topicContent = (topic: Topic): JSX.Element => {
    return (
      <>
        <Typography color={topic.public ? "primary" : "secondary"}>
          {topic.public ? "Public" : "Private"}
        </Typography>
        <code>{topic._id}</code>
      </>
    );
  };

  const topicCollapse = (topic: Topic): JSX.Element => {
    return (
      <>
        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Cards:
        </Typography>

        <div className={styles.cardsList}>
          {!cardsData[topic._id]?.data && (
            <SkeletonLoader count={cardsData[topic._id]?.count} height={18} />
          )}

          {cardsData[topic._id]?.data?.map((card) => (
            <div key={card._id} className={styles.card}>
              {card.question.text && (
                <Typography fontWeight={500}>{card.question.text}</Typography>
              )}
              {card.question.image && (
                <AppImage src={card.question.image} alt={""} />
              )}

              <Divider />

              {card.answer.text && <Typography>{card.answer.text}</Typography>}
              {card.answer.image && (
                <AppImage src={card.answer.image} alt={""} />
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <AdminView
      count={count}
      data={data}
      itemTitle={topicTitle}
      itemContent={topicContent}
      itemCollapse={topicCollapse}
      onToggleExpand={handleExpand}
    />
  );
};

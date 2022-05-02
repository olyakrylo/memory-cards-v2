import { useState } from "react";
import { Divider, Typography } from "@mui/material";

import { Card as CardType, Topic } from "../../../shared/models";
import { AdminTabData } from "../../../shared/admin";
import { request } from "../../../utils/request";
import SkeletonLoader from "../../skeletonLoader";
import { AdminData } from "../AdminData";
import styles from "./AdminTopics.module.css";
import AppImage from "../../image";

type AdminTopicsProps = AdminTabData<Topic>;

export const AdminTopics = ({ data, count }: AdminTopicsProps) => {
  const [cards, setCards] = useState<
    Record<string, { count: number; data?: CardType[] }>
  >({});

  const handleExpand = (id: string, expanded: boolean) => {
    if (expanded && !cards[id]) {
      void loadCards(id);
    }
  };

  const loadCards = async (id: string) => {
    const query = { topic_id: id };
    const { count } = await request("cards", "by_topic_count", "get", {
      query,
    });
    setCards({ ...cards, [id]: { count } });

    const data = await request("cards", "by_topic", "get", { query });
    setCards({ ...cards, [id]: { ...cards[id], data } });
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
          {!cards[topic._id]?.data && (
            <SkeletonLoader count={cards[topic._id]?.count} height={18} />
          )}

          {cards[topic._id]?.data?.map((card) => (
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
    <AdminData
      count={count}
      data={data}
      itemTitle={topicTitle}
      itemContent={topicContent}
      itemCollapse={topicCollapse}
      onToggleExpand={handleExpand}
    />
  );
};

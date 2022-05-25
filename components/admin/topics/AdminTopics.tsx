import { useState } from "react";
import { Button, Divider, Typography } from "@mui/material";

import { Card as CardType, Topic, User } from "../../../shared/models";
import { ADMIN_DATA_LIMIT, AdminTabData } from "../../../shared/admin";
import SkeletonLoader from "../../skeletonLoader";
import { AdminView } from "../view/AdminView";
import styles from "./AdminTopics.module.css";
import AppImage from "../../image";
import { useCards, useTopics } from "../../../hooks";
import { UpdatedResult } from "../../../shared/api";
import { useRouter } from "next/router";
type AdminTopicsProps = AdminTabData<Topic>;

export const AdminTopics = ({ data, count }: AdminTopicsProps) => {
  const cards = useCards();
  const topics = useTopics();
  const router = useRouter();

  const [cardsData, setCardsData] = useState<
    Record<string, { count: number; data?: CardType[] }>
  >({});
  const [usersData, setUsersData] = useState<Record<string, User[]>>({});

  const deleteTopics = (ids: string[]): Promise<UpdatedResult> => {
    return topics.deleteMany(ids);
  };

  const deleteUnusedTopics = async (): Promise<void> => {
    await topics.deleteUnused();
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, skip: 0, limit: ADMIN_DATA_LIMIT },
    });
  };

  const handleExpand = (id: string, expanded: boolean) => {
    if (expanded && !cardsData[id]) {
      void loadUsersAndCards(id);
    }
  };

  const loadUsersAndCards = async (id: string) => {
    const { count } = await cards.countByTopic(id);
    setCardsData({ ...cardsData, [id]: { count } });

    const [topicUsers, topicCards] = await Promise.all([
      topics.getFollowingUsersById(id),
      cards.getByTopic(id),
    ]);

    setCardsData({
      ...cardsData,
      [id]: { ...cardsData[id], data: topicCards },
    });
    setUsersData({ ...usersData, [id]: topicUsers });
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
        <Typography fontWeight={500} color={"primary"}>
          Following users:
        </Typography>

        <Typography gutterBottom>
          {!usersData[topic._id] && <SkeletonLoader height={24} />}

          {usersData[topic._id]?.map((user) => (
            <div key={user._id}>{user.login}</div>
          ))}
        </Typography>

        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Cards:
        </Typography>

        <div className={styles.cardsList}>
          {!cardsData[topic._id]?.data && (
            <SkeletonLoader count={cardsData[topic._id]?.count} height={24} />
          )}

          {cardsData[topic._id]?.data?.map((card) => (
            <div key={card._id} className={styles.card}>
              {card.question.text && (
                <Typography fontWeight={500}>{card.question.text}</Typography>
              )}
              {card.question.image && (
                <div className={styles.card__image}>
                  <AppImage src={card.question.image} alt={""} />
                </div>
              )}

              <Divider />

              {card.answer.text && <Typography>{card.answer.text}</Typography>}
              {card.answer.image && (
                <div className={styles.card__image}>
                  <AppImage src={card.answer.image} alt={""} />
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AdminView
        count={count}
        data={data}
        itemTitle={topicTitle}
        itemContent={topicContent}
        itemCollapse={topicCollapse}
        onToggleExpand={handleExpand}
        deleteFunc={deleteTopics}
        footer={
          <Button
            variant={"outlined"}
            color={"secondary"}
            onClick={deleteUnusedTopics}
          >
            Remove all unused cards
          </Button>
        }
      />
    </>
  );
};

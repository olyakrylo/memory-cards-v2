import { Typography } from "@mui/material";
import { useState } from "react";

import { Topic, User } from "../../../shared/models";
import styles from "./AdminUsers.module.css";
import SkeletonLoader from "../../skeletonLoader";
import { AdminData } from "../AdminData";
import { AdminTabData } from "../../../shared/admin";
import { useTopics } from "../../../hooks";

type AdminUsersProps = AdminTabData<User>;

export const AdminUsers = ({ data, count }: AdminUsersProps) => {
  const topics = useTopics();

  const [topicsData, setTopicsData] = useState<
    Record<
      string,
      {
        count: number;
        data?: Topic[];
      }
    >
  >({});

  const handleExpand = (id: string, expanded: boolean) => {
    if (expanded && !topicsData[id]) {
      void loadTopics(id);
    }
  };

  const loadTopics = async (authorId: string) => {
    const { count } = await topics.getByAuthorCount(authorId);
    setTopicsData({ ...topicsData, [authorId]: { count } });

    const { topics: data } = await topics.getByAuthorList(authorId);
    setTopicsData({
      ...topicsData,
      [authorId]: { ...topicsData[authorId], data },
    });
  };

  const userTitle = (user: User): string => {
    return user.login;
  };

  const userContent = (user: User): JSX.Element => {
    return (
      <>
        <Typography color={"primary"}>{user.email}</Typography>
        <code>{user._id}</code>
      </>
    );
  };

  const userCollapse = (user: User): JSX.Element => {
    return (
      <>
        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Topics:
        </Typography>

        <div className={styles.topicsList}>
          {!topicsData[user._id]?.data && (
            <SkeletonLoader count={topicsData[user._id]?.count} height={24} />
          )}

          {topicsData[user._id]?.data?.map((topic) => (
            <Typography key={topic._id}>{topic.title}</Typography>
          ))}
        </div>
      </>
    );
  };

  return (
    <AdminData
      count={count}
      data={data}
      itemTitle={userTitle}
      itemContent={userContent}
      itemCollapse={userCollapse}
      onToggleExpand={handleExpand}
    />
  );
};

import { Typography } from "@mui/material";
import { useState } from "react";

import { Topic, User } from "../../../shared/models";
import styles from "./AdminUsers.module.css";
import { request } from "../../../utils/request";
import SkeletonLoader from "../../skeletonLoader";
import { AdminData } from "../AdminData";
import { AdminTabData } from "../../../shared/admin";

type AdminUsersProps = AdminTabData<User>;

export const AdminUsers = ({ data, count }: AdminUsersProps) => {
  const [topics, setTopics] = useState<
    Record<
      string,
      {
        count: number;
        data?: Topic[];
      }
    >
  >({});

  const handleExpand = (id: string, expanded: boolean) => {
    if (expanded && !topics[id]) {
      void loadTopics(id);
    }
  };

  const loadTopics = async (id: string) => {
    const query = { id };
    const { count } = await request("topics", "by_author_count", "get", {
      query,
    });
    setTopics({ ...topics, [id]: { count } });

    const { topics: data } = await request("topics", "by_author", "get", {
      query,
    });
    setTopics({
      ...topics,
      [id]: { ...topics[id], data },
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
          {!topics[user._id]?.data && (
            <SkeletonLoader count={topics[user._id]?.count} height={24} />
          )}

          {topics[user._id]?.data?.map((topic) => (
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

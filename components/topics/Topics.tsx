import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Divider, IconButton, Typography } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";

import { Topic, User } from "../../shared/models";
import { request } from "../../utils/request";
import styles from "./Topics.module.css";
import { TopicsCount } from "../../shared/api";
import SkeletonLoader from "../skeletonLoader";
import TopicItem from "./item";
import PublicTopics from "./public";
import UserControl from "../userControl";
import AddTopic from "./add";

type TopicsProps = {
  user?: User | null;
  setCurrentTopic: (topic: Topic) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
};

export const Topics = ({
  user,
  setCurrentTopic,
  topics,
  setTopics,
}: TopicsProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(false);
  const [count, setCount] = useState<TopicsCount>({ self: 1, public: 0 });

  const router = useRouter();

  useEffect(() => {
    const { topic: queryTopic } = router.query;
    if (!queryTopic) return;
    const fromUserTopics = topics.find((t) => t._id === queryTopic);
    if (fromUserTopics) {
      setCurrentTopic(fromUserTopics);
      return;
    }
    request("topics", "", "get", {
      query: { id: router.query.topic as string },
    }).then(({ topic }) => {
      if (!topic) return;
      setCurrentTopic(topic);
    });
  }, [router.query.topic]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    request("topics", "by_user_count", "get")
      .then((count) => {
        setCount(count);
      })
      .then(() => request("topics", "by_user", "get"))
      .then((resTopics) => {
        setTopics(resTopics);
        setLoading(false);
      });
  }, [user?._id]);

  const toggleMenu = (event: BaseSyntheticEvent): void => {
    event.target.blur();
    setHidden(!hidden);
  };

  const selfTopics = (): Topic[] => {
    return topics.filter((t) => t.author_id === user?._id);
  };

  const publicTopics = (): Topic[] => {
    return topics.filter((t) => t.author_id !== user?._id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} aria-hidden={hidden}>
        <div>
          <Divider className={styles.topicsDivider} textAlign="left">
            <Typography variant={"subtitle2"}>{t("ui.created")}</Typography>
          </Divider>

          <div className={styles.topicsList}>
            {loading && <SkeletonLoader height={34} count={count.self} />}

            {selfTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}
          </div>

          <Divider classes={{ root: styles.topicsDivider }} textAlign="left">
            <Typography variant={"subtitle2"}>{t("ui.added")}</Typography>
          </Divider>

          <div className={styles.topicsList}>
            {loading && <SkeletonLoader height={34} count={count.public} />}

            {publicTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}
          </div>
        </div>

        {!loading && (
          <div className={styles.addContainer}>
            <AddTopic />
            <PublicTopics />
          </div>
        )}
      </div>

      <div className={styles.control}>
        <IconButton
          classes={{ root: styles.control__toggle }}
          onClick={toggleMenu}
        >
          <MenuRounded />
        </IconButton>

        <UserControl />
      </div>
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Divider, IconButton, Typography } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import classNames from "classnames";

import { Topic, User } from "../../shared/models";
import styles from "./Topics.module.css";
import { TopicsCount } from "../../shared/api";
import SkeletonLoader from "../skeletonLoader";
import TopicItem from "./item";
import PublicTopics from "./public";
import UserControl from "../userControl";
import AddTopic from "./add";
import { useTopics } from "../../hooks";

type TopicsProps = {
  user?: User | null;
};

export const Topics = ({ user }: TopicsProps) => {
  const { t } = useTranslation();
  const topics = useTopics();

  const [loading, setLoading] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(false);
  const [count, setCount] = useState<TopicsCount>({ self: 1, public: 0 });

  useEffect(() => {
    if (!user) return;

    topics.clear();
    setLoading(true);

    topics
      .getCount()
      .then((count) => {
        setCount(count);
      })
      .then(() => topics.getList())
      .then((resTopics) => {
        topics.set(resTopics);
        setLoading(false);
      });
  }, [user?._id]);

  const toggleMenu = (event: BaseSyntheticEvent): void => {
    event.target.blur();
    setHidden(!hidden);
  };

  const selfTopics = (): Topic[] => {
    return topics.list().filter((t) => t.author_id === user?._id);
  };

  const publicTopics = (): Topic[] => {
    return topics.list().filter((t) => t.author_id !== user?._id);
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.content, {
          [styles.content_centered]: !topics.currentTopic?._id,
        })}
        aria-hidden={hidden}
      >
        <div>
          <Divider className={styles.topicsDivider} textAlign="left">
            <Typography variant={"subtitle2"}>{t("ui.created")}</Typography>
          </Divider>

          <div className={styles.topicsList}>
            {loading && <SkeletonLoader height={34} count={count.self} />}

            {selfTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}

            {!loading && !selfTopics().length && (
              <Typography className={styles.noTopics} variant={"subtitle2"}>
                {t("ui.no_created_topics")}
              </Typography>
            )}
          </div>

          <Divider classes={{ root: styles.topicsDivider }} textAlign="left">
            <Typography variant={"subtitle2"}>{t("ui.added")}</Typography>
          </Divider>

          <div className={styles.topicsList}>
            {loading && <SkeletonLoader height={34} count={count.public} />}

            {publicTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}

            {!loading && !publicTopics().length && (
              <Typography className={styles.noTopics} variant={"subtitle2"}>
                {t("ui.no_added_topics")}
              </Typography>
            )}
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

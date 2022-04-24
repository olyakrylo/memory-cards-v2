import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { MenuRounded } from "@mui/icons-material";

import { Topic, User } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./Topics.module.css";
import TopicItem from "./item";
import AddTopic from "./add";
import PublicTopics from "./public";
import UserControl from "../userControl";

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

  const router = useRouter();

  useEffect(() => {
    const { topic: queryTopic } = router.query;
    if (!queryTopic) return;
    const fromUserTopics = topics.find((t) => t._id === queryTopic);
    if (fromUserTopics) {
      setCurrentTopic(fromUserTopics);
      return;
    }
    request("topics", "", "post", { id: router.query.topic as string }).then(
      ({ topic }) => {
        if (!topic) return;
        setCurrentTopic(topic);
      }
    );
  }, [router.query.topic]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    request("topics", "by_user", "get").then((resTopics) => {
      setTopics(resTopics);
      setLoading(false);
    });
  }, [user?._id]);

  const toggleMenu = () => {
    setHidden(!hidden);
  };

  const addTopic = async (newTopic: Topic): Promise<void> => {
    setTopics([...topics, newTopic]);
    await router.push({
      pathname: "/app",
      query: { topic: newTopic._id },
    });
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
        {loading && <CircularProgress className={styles.loader} size={24} />}

        {!loading && (
          <div>
            <Divider className={styles.topicsDivider} textAlign="left">
              <Typography variant={"subtitle2"}>{t("ui.created")}</Typography>
            </Divider>

            <div className={styles.topicsList}>
              {selfTopics().map((topic) => (
                <TopicItem key={topic._id} topic={topic} />
              ))}
            </div>

            <Divider classes={{ root: styles.topicsDivider }} textAlign="left">
              <Typography variant={"subtitle2"}>{t("ui.added")}</Typography>
            </Divider>

            <div className={styles.topicsList}>
              {publicTopics().map((topic) => (
                <TopicItem key={topic._id} topic={topic} />
              ))}
            </div>
          </div>
        )}

        <div>
          <AddTopic addTopic={addTopic} />
          <PublicTopics />
        </div>
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

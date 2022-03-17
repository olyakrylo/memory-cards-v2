import { connect } from "react-redux";
import {
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { State, Topic, User } from "../../utils/types";
import { setCurrentTopic, setTopics } from "../../redux/actions/main";
import { request } from "../../utils/request";
import styles from "./Topics.module.css";
import UserControl from "../userControl";
import AddTopic from "./add";
import PublicTopics from "./public";
import TopicItem from "./item";

type TopicsProps = {
  user: User;
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
    request<Topic>("get", `topics/${router.query.topic}`).then((topic) => {
      setCurrentTopic(topic);
    });
  }, [router.query, setCurrentTopic, topics]);

  useEffect(() => {
    setLoading(true);
    request<Topic[]>("post", "topics/by_user", {
      user_id: user._id,
    }).then((resTopics) => {
      setTopics(resTopics);
      setLoading(false);
    });
  }, [user._id]);

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
    return topics.filter((t) => t.author_id === user._id);
  };

  const publicTopics = (): Topic[] => {
    return topics.filter((t) => t.author_id !== user._id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} aria-hidden={hidden}>
        {loading && <CircularProgress size={24} />}

        {!loading && (
          <div className={styles.topicsList}>
            <Divider className={styles.topicsList__divider} textAlign="left">
              <Typography>{t("ui.created")}</Typography>
            </Divider>

            {selfTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}

            <Divider className={styles.topicsList__divider} textAlign="left">
              <Typography>{t("ui.added")}</Typography>
            </Divider>

            {publicTopics().map((topic) => (
              <TopicItem key={topic._id} topic={topic} />
            ))}
          </div>
        )}

        <div>
          <AddTopic addTopic={addTopic} />
          <PublicTopics />
        </div>
      </div>

      <div className={styles.control}>
        <IconButton className={styles.control__toggle} onClick={toggleMenu}>
          <MenuRoundedIcon />
        </IconButton>

        <UserControl />
      </div>
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

import { connect } from "react-redux";
import { CircularProgress, IconButton } from "@mui/material";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { State, Topic, UpdatedResult, User } from "../../utils/types";
import { setCurrentTopic, setTopics } from "../../redux/actions/main";
import { request } from "../../middleware";
import styles from "./Topics.module.css";
import UserControl from "../userControl";
import AddTopic from "./add";
import PublicTopics from "./public";

type TopicsProps = {
  user: User;
  currentTopic?: Topic;
  setCurrentTopic: (topic: Topic) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
};

export const Topics = ({
  user,
  currentTopic,
  setCurrentTopic,
  topics,
  setTopics,
}: TopicsProps) => {
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

  const selectTopic = async (topic: Topic) => {
    await router.push({
      pathname: "/app",
      query: { topic: topic._id },
    });
  };

  const addTopic = async (newTopic: Topic): Promise<void> => {
    setTopics([...topics, newTopic]);
    await selectTopic(newTopic);
  };

  const deleteTopic = async (id: string) => {
    const { updated } = await request<UpdatedResult>("delete", `topics/${id}`, {
      user_id: user._id,
    });
    if (updated) {
      setTopics(topics.filter((t) => t._id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} aria-hidden={hidden}>
        {loading && <CircularProgress size={24} />}

        <div className={styles.topicsList}>
          {!loading &&
            topics.map((topic) => (
              <p
                className={styles.topic}
                aria-selected={currentTopic?._id === topic._id}
                onClick={() => selectTopic(topic)}
                key={topic._id}
              >
                {topic.title}

                <IconButton
                  size="small"
                  color="secondary"
                  className={styles.topic__del}
                  aria-hidden={currentTopic?._id !== topic._id}
                  onClick={() => deleteTopic(topic._id)}
                >
                  <RemoveCircleOutlineRoundedIcon />
                </IconButton>
              </p>
            ))}
        </div>

        <AddTopic addTopic={addTopic} />

        <PublicTopics />
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
    currentTopic: state.main.currentTopic,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

import { connect } from "react-redux";
import { CircularProgress, IconButton } from "@mui/material";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { State, Topic, UpdatedResult, User } from "../../utils/types";
import { setCurrentTopic } from "../../redux/actions/main";
import { request } from "../../middleware";
import styles from "./Topics.module.css";
import UserControl from "../userControl";

type TopicsProps = {
  user: User;
  currentTopic?: Topic;
  setCurrentTopic: (topic: Topic) => void;
};

export const Topics = ({
  user,
  currentTopic,
  setCurrentTopic,
}: TopicsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [hidden, setHidden] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);

  const { t } = useTranslation();

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

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

  const toggleInput = () => {
    setShowInput(!showInput);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addTopic = async (event: any) => {
    if (event.key !== "Enter" || !inputRef.current?.value) return;

    const newTopic = await request<Topic>("post", "topics", {
      users_id: [user._id],
      title: inputRef.current.value,
    });
    if (newTopic) {
      setTopics([...topics, newTopic]);
      setCurrentTopic(newTopic);
      setShowInput(false);
    }
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

        <div className={styles.add}>
          <IconButton
            size="small"
            className={styles.add__button}
            color="primary"
            onClick={toggleInput}
          >
            {!showInput && <AddRoundedIcon />}
            {showInput && <RemoveRoundedIcon />}
          </IconButton>

          <input
            ref={inputRef}
            className={styles.add__input}
            aria-hidden={!showInput}
            placeholder={`${t("add.topic_title")}...`}
            onKeyUp={addTopic}
          />
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
    currentTopic: state.main.currentTopic,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

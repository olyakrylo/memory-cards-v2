import { IconButton } from "@mui/material";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import { State, Topic, UpdatedResult, User } from "../../../utils/types";
import { setTopics } from "../../../redux/actions/main";
import { request } from "../../../utils/request";
import styles from "../Topics.module.css";

type TopicItemProps = {
  topic: Topic;
  topics: Topic[];
  user: User;
  currentTopic?: Topic;
};

const TopicItem = ({
  topic,
  topics: topicsList,
  user,
  currentTopic,
}: TopicItemProps) => {
  const router = useRouter();

  const selectTopic = async () => {
    await router.push({
      pathname: "/app",
      query: { topic: topic._id },
    });
  };

  const deleteTopic = async () => {
    const { updated } = await request<UpdatedResult>(
      "delete",
      `topics/${topic._id}`,
      {
        user_id: user._id,
      }
    );
    if (updated) {
      setTopics(topicsList.filter((t) => t._id !== topic._id));
    }
  };

  return (
    <p
      className={styles.topic}
      aria-selected={currentTopic?._id === topic._id}
      onClick={() => selectTopic()}
      key={topic._id}
    >
      {topic.title}

      <IconButton
        size="small"
        color="secondary"
        className={styles.topic__del}
        aria-hidden={currentTopic?._id !== topic._id}
        onClick={() => deleteTopic()}
      >
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
    </p>
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
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicItem);

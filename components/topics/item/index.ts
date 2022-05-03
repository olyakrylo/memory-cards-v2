import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import {
  setNotification,
  setTopics,
  setCurrentTopic,
} from "../../../redux/actions/main";

import { TopicItem } from "./TopicItem";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    currentTopic: state.main.currentTopic,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
  setNotification,
  setCurrentTopic,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicItem);

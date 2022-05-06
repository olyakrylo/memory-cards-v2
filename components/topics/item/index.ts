import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { setNotification, setTopics } from "../../../redux/actions/main";

import { TopicItem } from "./TopicItem";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicItem);

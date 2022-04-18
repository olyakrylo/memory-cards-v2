import { connect } from "react-redux";

import { State } from "../../utils/types";
import { setNotification, setTopics } from "../../redux/actions/main";

import { Cards } from "./Cards";

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
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);

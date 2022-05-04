import { connect } from "react-redux";

import { State } from "../../shared/redux";
import { setCurrentTopic, setTopics } from "../../redux/actions/main";

import { Topics } from "./Topics";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    topics: state.main.topics,
    currentTopic: state.main.currentTopic,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

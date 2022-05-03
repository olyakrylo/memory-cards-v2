import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { User } from "../../../shared/models";

import { AddTopic } from "./AddTopic";
import { setTopics } from "../../../redux/actions/main";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    topics: state.main.topics,
  };
};

const mapDispatchTopProps = {
  setTopics,
};

export default connect(mapStateToProps, mapDispatchTopProps)(AddTopic);

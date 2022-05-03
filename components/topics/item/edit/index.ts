import { connect } from "react-redux";

import { EditTopic } from "./EditTopic";

import { State } from "../../../../shared/redux";
import { setTopics } from "../../../../redux/actions/main";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTopic);

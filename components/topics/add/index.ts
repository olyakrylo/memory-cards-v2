import { connect } from "react-redux";

import { State, User } from "../../../utils/types";

import { AddTopic } from "./AddTopic";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
  };
};

export default connect(mapStateToProps)(AddTopic);

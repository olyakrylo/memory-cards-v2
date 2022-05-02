import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { User } from "../../../shared/models";

import { AddTopic } from "./AddTopic";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
  };
};

export default connect(mapStateToProps)(AddTopic);

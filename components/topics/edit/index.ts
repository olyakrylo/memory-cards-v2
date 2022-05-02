import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { User } from "../../../shared/models";

import { EditTopic } from "./EditTopic";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
  };
};

export default connect(mapStateToProps)(EditTopic);

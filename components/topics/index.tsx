import { connect } from "react-redux";

import { State, User } from "../../utils/types";
import { setCurrentTopic } from "../../redux/actions/main";

import { Topics } from "./Topics";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    currentTopic: state.main.currentTopic,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

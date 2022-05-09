import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { setNotification } from "../../../redux/actions/main";

import { TopicItem } from "./TopicItem";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicItem);

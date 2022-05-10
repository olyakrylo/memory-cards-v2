import { connect } from "react-redux";

import { State } from "../../../shared/redux";

import { TopicItem } from "./TopicItem";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

export default connect(mapStateToProps)(TopicItem);

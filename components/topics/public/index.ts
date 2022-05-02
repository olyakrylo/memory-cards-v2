import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { User } from "../../../shared/models";

import { setTopics } from "../../../redux/actions/main";

import { PublicTopics } from "./PublicTopics";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    topics: state.main.topics,
  };
};

const mapDispatchToProps = {
  setTopics,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicTopics);

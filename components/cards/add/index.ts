import { connect } from "react-redux";

import { AddCard } from "./AddCard";

import { State } from "../../../shared/redux";
import { Topic } from "../../../shared/models";

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic as Topic,
  };
};

export default connect(mapStateToProps)(AddCard);

import { connect } from "react-redux";

import { State } from "../../utils/types";

import { Cards } from "./Cards";

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic,
  };
};

export default connect(mapStateToProps)(Cards);

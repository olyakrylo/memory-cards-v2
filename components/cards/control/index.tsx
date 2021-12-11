import { connect } from "react-redux";

import { State } from "../../../utils/types";

import { CardControl } from "./CardControl";

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic,
  };
};

export default connect(mapStateToProps)(CardControl);

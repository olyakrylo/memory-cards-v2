import { connect } from "react-redux";

import { State } from "../../../shared/redux";
import { setNotification } from "../../../redux/actions/main";

import { CardControl } from "./CardControl";

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic,
  };
};

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardControl);

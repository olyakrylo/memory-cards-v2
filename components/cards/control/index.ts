import { connect } from "react-redux";

import { setNotification } from "../../../redux/actions/main";

import { CardControl } from "./CardControl";
import { State } from "../../../shared/redux";

const mapStateToProps = (state: { main: State }) => ({
  currentTopic: state.main.currentTopic,
});

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardControl);

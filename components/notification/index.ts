import { connect } from "react-redux";

import { State } from "../../utils/types";
import { setNotification } from "../../redux/actions/main";

import { Notification } from "./Notification";

const mapStateToProps = (state: { main: State }) => {
  return {
    notification: state.main.notification,
  };
};

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

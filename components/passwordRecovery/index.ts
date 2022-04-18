import { connect } from "react-redux";

import { setNotification } from "../../redux/actions/main";

import { PasswordRecovery } from "./PasswordRecovery";

const mapDispatchToProps = {
  setNotification,
};

export default connect(undefined, mapDispatchToProps)(PasswordRecovery);

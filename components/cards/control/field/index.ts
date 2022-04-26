import { connect } from "react-redux";

import { CardControlField } from "./CardControlField";

import { setNotification } from "../../../../redux/actions/main";

const mapDispatchToProps = {
  setNotification,
};

export default connect(undefined, mapDispatchToProps)(CardControlField);

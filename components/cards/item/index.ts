import { connect } from "react-redux";

import { CardItem } from "./CardItem";

import { setNotification } from "../../../redux/actions/main";

const mapDispatchToProps = {
  setNotification,
};

export default connect(undefined, mapDispatchToProps)(CardItem);

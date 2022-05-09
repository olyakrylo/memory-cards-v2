import { connect } from "react-redux";

import { CardItem } from "./CardItem";

import { setCards, setNotification } from "../../../redux/actions/main";

const mapDispatchTopProps = {
  setNotification,
  setCards,
};

export default connect(undefined, mapDispatchTopProps)(CardItem);

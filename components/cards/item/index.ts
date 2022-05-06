import { connect } from "react-redux";

import { CardItem } from "./CardItem";

import { setCards, setNotification } from "../../../redux/actions/main";
import { State } from "../../../shared/redux";

const mapStateToProps = (state: { main: State }) => ({
  cards: state.main.cards,
});

const mapDispatchTopProps = {
  setNotification,
  setCards,
};

export default connect(mapStateToProps, mapDispatchTopProps)(CardItem);

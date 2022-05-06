import { connect } from "react-redux";

import { CardsViewOptions } from "./CardsViewOptions";

import { State } from "../../../shared/redux";
import { User } from "../../../shared/models";

const mapStateToProps = (state: { main: State }) => ({
  user: state.main.user as User,
  cards: state.main.cards,
  currentTopic: state.main.currentTopic,
});

export default connect(mapStateToProps)(CardsViewOptions);

import { connect } from "react-redux";

import { State } from "../../shared/redux";
import { setCards, setNotification, setTopics } from "../../redux/actions/main";

import { Cards } from "./Cards";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
    topics: state.main.topics,
    cards: state.main.cards,
    currentTopic: state.main.currentTopic,
  };
};

const mapDispatchToProps = {
  setTopics,
  setNotification,
  setCards,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);

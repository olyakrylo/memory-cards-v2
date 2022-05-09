import { connect } from "react-redux";

import { State } from "../../shared/redux";
import { setCurrentTopic } from "../../redux/actions/main";

import { Topics } from "./Topics";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setCurrentTopic,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);

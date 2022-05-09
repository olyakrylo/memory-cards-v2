import { connect } from "react-redux";

import { State } from "../../shared/redux";

import { Cards } from "./Cards";

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

export default connect(mapStateToProps)(Cards);

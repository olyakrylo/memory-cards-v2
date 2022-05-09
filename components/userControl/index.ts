import { connect } from "react-redux";

import { State } from "../../shared/redux";

import { UserControl } from "./UserControl";

const mapStateToProps = (state: { main: State }) => {
  return { user: state.main.user };
};

export default connect(mapStateToProps)(UserControl);

import { connect } from "react-redux";

import { State } from "../../utils/types";
import { setUser } from "../../redux/actions/main";

import { UserControl } from "./UserControl";

const mapStateToProps = (state: { main: State }) => {
  return { user: state.main.user };
};

const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);

import { connect } from "react-redux";

import { User } from "../../utils/types";

import { UserControl } from "./UserControl";

const mapStateToProps = (state: { main: { user: User } }) => {
  return { user: state.main.user };
};

export default connect(mapStateToProps)(UserControl);

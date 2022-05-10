import { connect } from "react-redux";

import { Header } from "./Header";
import { State } from "../../shared/redux";

const mapStateToProps = (state: { main: State }) => ({
  user: state.main.user,
});

export default connect(mapStateToProps)(Header);

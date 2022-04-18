import { connect } from "react-redux";

import { State } from "../../utils/types";
import { setDarkMode } from "../../redux/actions/main";

import { Header } from "./Header";

const mapStateToProps = (state: { main: State }) => {
  return {
    darkMode: state.main.darkMode,
  };
};

const mapDispatchToProps = {
  setDarkMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

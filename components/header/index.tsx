import { connect } from "react-redux";

import { State } from "../../utils/types";
import { setColorMode } from "../../redux/actions/main";

import { Header } from "./Header";

const mapStateToProps = (state: { main: State }) => {
  return {
    colorMode: state.main.colorMode,
  };
};

const mapDispatchToProps = {
  setColorMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

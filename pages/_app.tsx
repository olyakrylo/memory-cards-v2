import { connect } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import "@splidejs/splide/dist/css/splide.min.css";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import "../locales/i18n";
import { State } from "../utils/types";
import { palette } from "../utils/palette";

function MyApp({
  Component,
  pageProps,
  colorMode,
}: AppProps & { colorMode: "dark" | "light" }) {
  const theme = createTheme({
    palette: palette(colorMode),
  });

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

const mapStateToProps = (state: { main: State }) => {
  return {
    colorMode: state.main.colorMode,
  };
};

export default wrapper.withRedux(connect(mapStateToProps)(MyApp));

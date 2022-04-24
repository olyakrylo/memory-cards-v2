import { connect } from "react-redux";
import Head from "next/head";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { StyledEngineProvider } from "@mui/material/styles";
import "@splidejs/splide/dist/css/splide.min.css";

import "../styles/globals.css";
import "../styles/overrides.css";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import "../locales/i18n";
import { State } from "../utils/types";
import { palette } from "../utils/palette";
import Notification from "../components/notification";

function MyApp({
  Component,
  pageProps,
  darkMode,
}: AppProps & { darkMode?: boolean }) {
  const theme = createTheme({
    palette: palette(darkMode ? "dark" : "light"),
    typography: {
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightMedium: 300,
      fontWeightRegular: 300,
      fontWeightBold: 500,
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <Head>
        <title>Memory cards</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />

        <Notification />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

const mapStateToProps = (state: { main: State }) => {
  return {
    darkMode: state.main.darkMode,
  };
};

export default wrapper.withRedux(connect(mapStateToProps)(MyApp));

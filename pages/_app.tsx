import Head from "next/head";
import "@splidejs/splide/dist/css/splide.min.css";
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";
import { SingletonHooksContainer } from "react-singleton-hook";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import "../utils/i18n";
import { palette } from "../utils/palette";
import { useConfig } from "../hooks";

const Notification = dynamic(() => import("../components/notification"));
const Header = dynamic(() => import("../components/header"));

function MyApp({ Component, pageProps }: AppProps) {
  const config = useConfig();

  const theme = createTheme({
    palette: palette(config.darkMode ? "dark" : "light"),
    typography: {
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightMedium: 300,
      fontWeightRegular: 300,
      fontWeightBold: 500,
    },
  });

  const { i18n } = useTranslation();

  return (
    <StyledEngineProvider injectFirst>
      <Helmet>
        <html lang={i18n.language} />
      </Helmet>

      <Head>
        <title>Memory cards</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Header />

        <SingletonHooksContainer />
        <Component {...pageProps} />

        <Notification />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default wrapper.withRedux(MyApp);

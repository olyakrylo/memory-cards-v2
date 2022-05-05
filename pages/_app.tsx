import { connect } from "react-redux";
import Head from "next/head";
import "@splidejs/splide/dist/css/splide.min.css";
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import "../utils/i18n";
import { State } from "../shared/redux";
import { palette } from "../utils/palette";
import { User } from "../shared/models";
import { setUser } from "../redux/actions/main";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { request } from "../utils/request";

const Notification = dynamic(() => import("../components/notification"));
const Header = dynamic(() => import("../components/header"));

type MyAppProps = {
  darkMode?: boolean;
  user?: User | null;
  setUser: (u: User | null) => void;
};

function MyApp({
  Component,
  pageProps,
  darkMode,
  user,
  setUser,
}: AppProps & MyAppProps) {
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

  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.startsWith("/recovery")) {
      return;
    }

    if (user) {
      if (router.pathname === "/auth") {
        void router.push("/app");
      }
      return;
    }

    if (user === null) {
      void router.push("/auth");
      return;
    }

    request("users", "", "get").then(({ user }) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [user, setUser]);

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

        <Component {...pageProps} />

        <Notification />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

const mapStateToProps = (state: { main: State }) => {
  return {
    darkMode: state.main.darkMode,
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setUser,
};

export default wrapper.withRedux(
  connect(mapStateToProps, mapDispatchToProps)(MyApp)
);

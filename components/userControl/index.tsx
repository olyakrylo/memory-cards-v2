import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { State, User } from "../../utils/types";
import styles from "./UserControl.module.css";
import { LanguagesList } from "../../locales/languages";
import { setUser } from "../../redux/actions/main";
import { request } from "../../utils/request";

type UserControlProps = {
  user?: User | null;
  setUser: (v: User | undefined | null) => void;
};

export const UserControl = ({ user, setUser }: UserControlProps) => {
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);

  const { t } = useTranslation();

  const handleLogout = async () => {
    await request("users", "logout", "get");
    setUser(null);
  };

  const userMenuOpened = Boolean(userMenu);
  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenu(event.currentTarget);
  };
  const closeUserMenu = () => {
    setUserMenu(null);
  };

  return (
    <div className={styles.container}>
      {user?.login}
      <IconButton className={styles.settings} onClick={openUserMenu}>
        <SettingsIcon />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={userMenu}
        open={userMenuOpened}
        onClose={closeUserMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <LanguageMenu />
        </MenuItem>
        <MenuItem onClick={handleLogout}>{t("ui.logout")}</MenuItem>
      </Menu>
    </div>
  );
};

const LanguageMenu = () => {
  const [langMenu, setLangMenu] = useState<null | HTMLElement>(null);

  const { t, i18n } = useTranslation();

  const langMenuOpened = Boolean(langMenu);
  const openLangMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setLangMenu(event.currentTarget);
  };
  const closeLangMenu = () => {
    setLangMenu(null);
  };

  const setLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      <div onClick={openLangMenu}>{t("ui.language")}</div>
      <Menu
        anchorEl={langMenu}
        open={langMenuOpened}
        onClose={closeLangMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {LanguagesList.map((lang) => (
          <MenuItem key={lang.id} onClick={() => setLanguage(lang.id)}>
            {lang.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return { user: state.main.user };
};

const mapDispatchToProps = { setUser };

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);

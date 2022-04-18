import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Settings } from "@mui/icons-material";

import { User } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./UserControl.module.css";
import { LanguagesList } from "../../locales/languages";

type UserControlProps = {
  user?: User | null;
  setUser: (user?: User | null) => void;
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
        <Settings />
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

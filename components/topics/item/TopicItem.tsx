import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { DeleteTwoTone, MoreVert, Share } from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Topic, User } from "../../../shared/models";
import { request } from "../../../utils/request";
import styles from "../Topics.module.css";
import { AppNotification } from "../../../shared/notification";

type TopicItemProps = {
  topic: Topic;
  topics: Topic[];
  user?: User | null;
  currentTopic?: Topic;
  setTopics: (t: Topic[]) => void;
  setNotification: (n: AppNotification) => void;
};

export const TopicItem = ({
  topic,
  topics: topicsList,
  user,
  currentTopic,
  setTopics,
  setNotification,
}: TopicItemProps) => {
  const router = useRouter();

  const { t } = useTranslation();

  const [menu, setMenu] = useState<null | HTMLElement>(null);

  const selectTopic = async () => {
    await router.push({
      pathname: "/app",
      query: { topic: topic._id },
    });
  };

  const deleteTopic = async () => {
    if (!user) return;
    const { updated } = await request("topics", "", "delete", {
      body: {
        user_id: user?._id,
        topic_id: topic._id,
      },
    });
    if (updated) {
      setTopics(topicsList.filter((t) => t._id !== topic._id));
      setNotification({
        severity: "warning",
        text: "ui.topic_deleted",
        translate: true,
        autoHide: 5000,
      });
    }
  };

  const shareTopic = async () => {
    const { href } = window.location;
    await navigator.clipboard.writeText(href);
    setNotification({
      severity: "success",
      text: "ui.link_copied",
      translate: true,
      autoHide: 5000,
    });
  };

  const menuOpened = Boolean(menu);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setMenu(null);
  };

  return (
    <div
      className={styles.topic}
      aria-selected={currentTopic?._id === topic._id}
      onClick={() => selectTopic()}
      key={topic._id}
    >
      {topic.title}

      <IconButton
        size="small"
        color="info"
        className={styles.topic__menu}
        aria-hidden={currentTopic?._id !== topic._id}
        onClick={openMenu}
      >
        <MoreVert />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={menu}
        open={menuOpened}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem className={styles.menuItem} onClick={deleteTopic}>
          {t("ui.delete")}
          <DeleteTwoTone color="secondary" />
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={shareTopic}>
          {t("ui.share")}
          <Share color="primary" />
        </MenuItem>
      </Menu>
    </div>
  );
};

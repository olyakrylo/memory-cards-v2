import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import {
  DeleteTwoTone,
  MoreVert,
  Share,
  CopyAllRounded,
  EditRounded,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Topic, User } from "../../../shared/models";
import { request } from "../../../utils/request";
import styles from "../Topics.module.css";
import { AppNotification } from "../../../shared/notification";
import EditTopic from "./edit";

type TopicItemProps = {
  topic: Topic;
  topics: Topic[];
  user?: User | null;
  setTopics: (t: Topic[]) => void;
  setNotification: (n: AppNotification) => void;
};

export const TopicItem = ({
  user,
  topic,
  topics: topicsList,
  setTopics,
  setNotification,
}: TopicItemProps) => {
  const router = useRouter();

  const { t } = useTranslation();

  const [menu, setMenu] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const currentTopicId = (): string => {
    return (router.query.topic as string) ?? "";
  };

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
      const newTopics = topicsList.filter((t) => t._id !== topic._id);
      setTopics(newTopics);

      setNotification({
        severity: "warning",
        text: "ui.topic_deleted",
        translate: true,
        autoHide: 5000,
      });

      await router.push({
        pathname: router.pathname,
        query: { topic: newTopics[0]._id },
      });
    }
  };

  const copyTopic = async () => {
    const { topics, new_id } = await request("topics", "copy", "put", {
      query: { id: topic._id },
      body: { title: topic.title },
    });
    setTopics(topics);
    await router.push({
      pathname: router.pathname,
      query: { topic: new_id },
    });
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

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    closeMenu();
    setEditDialogOpen(false);
  };

  const isSelfTopic = (): boolean => {
    return topic.author_id === user?._id;
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
      aria-selected={currentTopicId() === topic._id}
      onClick={() => selectTopic()}
      key={topic._id}
    >
      {topic.title}

      <IconButton
        size="small"
        color="info"
        className={styles.topic__menu}
        aria-hidden={currentTopicId() !== topic._id}
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

        {!isSelfTopic() && (
          <MenuItem className={styles.menuItem} onClick={copyTopic}>
            {t("ui.create_copy")}
            <CopyAllRounded color={"info"} />
          </MenuItem>
        )}

        {isSelfTopic() && (
          <MenuItem className={styles.menuItem} onClick={openEditDialog}>
            {t("ui.edit")}
            <EditRounded color={"info"} />

            <EditTopic
              topic={topic}
              dialogOpen={editDialogOpen}
              closeDialog={closeEditDialog}
            />
          </MenuItem>
        )}

        <MenuItem className={styles.menuItem} onClick={shareTopic}>
          {t("ui.share")}
          <Share color="primary" />
        </MenuItem>
      </Menu>
    </div>
  );
};

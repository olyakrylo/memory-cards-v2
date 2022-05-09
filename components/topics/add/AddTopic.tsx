import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AddBoxRounded } from "@mui/icons-material";
import { useRouter } from "next/router";

import mainStyles from "../Topics.module.css";
import TopicControl from "../control";
import { useTopics } from "../../../hooks";

export const AddTopic = () => {
  const router = useRouter();
  const topics = useTopics();

  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const addTopic = async (title: string, isPublic: boolean): Promise<void> => {
    const { newTopic } = await topics.addTopic(title, isPublic);

    if (newTopic) {
      closeDialog();
      await router.push({
        pathname: "/app",
        query: { topic: newTopic._id },
      });
    }
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        classes={{ root: mainStyles.addButton }}
        color="primary"
        onClick={openDialog}
      >
        <AddBoxRounded />
        <Typography
          className={mainStyles.addButton__title}
          variant={"subtitle2"}
        >
          {t("add.create_topic")}
        </Typography>
      </Button>

      <TopicControl
        open={dialogOpen}
        onClose={closeDialog}
        onConfirm={addTopic}
      />
    </>
  );
};

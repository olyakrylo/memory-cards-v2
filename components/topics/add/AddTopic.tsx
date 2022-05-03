import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AddBoxRounded } from "@mui/icons-material";
import { useRouter } from "next/router";

import mainStyles from "../Topics.module.css";
import { Topic, User } from "../../../shared/models";
import TopicControl from "../control";
import { request } from "../../../utils/request";

type AddTopicProps = {
  user?: User | null;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
};

export const AddTopic = ({ user, topics, setTopics }: AddTopicProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const addTopic = async (title: string, isPublic: boolean): Promise<void> => {
    if (!user) return;

    const newTopic = await request("topics", "", "put", {
      body: {
        users_id: [user._id],
        author_id: user._id,
        title,
        public: isPublic,
      },
    });

    if (newTopic) {
      setTopics([...topics, newTopic]);
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

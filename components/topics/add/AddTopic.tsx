import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AddBoxRounded } from "@mui/icons-material";
import { BaseSyntheticEvent, useState } from "react";

import styles from "../Topics.module.css";
import { Topic, User } from "../../../shared/models";
import { request } from "../../../utils/request";
import AppDialog from "../../dialog";

type AddTopicProps = {
  user?: User;
  addTopic: (topic: Topic) => void;
};

export const AddTopic = ({ user, addTopic }: AddTopicProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const { t } = useTranslation();

  const clear = () => {
    setDialogOpen(false);
    setTitle("");
    setIsPublic(false);
  };

  const closeDialog = (): void => {
    clear();
  };

  const onTitleChange = (e: BaseSyntheticEvent) => {
    setTitle(e.target.value);
  };

  const onPublicChange = (e: BaseSyntheticEvent) => {
    setIsPublic(e.target.checked);
  };

  const add = async (): Promise<void> => {
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
      addTopic(newTopic);
      clear();
    }
  };

  return (
    <div>
      <Button
        classes={{ root: styles.addButton }}
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        <AddBoxRounded />
        <Typography className={styles.addButton__title} variant={"subtitle2"}>
          {t("add.create_topic")}
        </Typography>
      </Button>

      <AppDialog
        open={dialogOpen}
        size={"xs"}
        title={t("add.new_topic")}
        content={
          <FormGroup className={styles.add__form}>
            <TextField
              onChange={onTitleChange}
              required
              label={t("add.topic_title")}
            />
            <FormControlLabel
              control={<Checkbox onChange={onPublicChange} />}
              label={t("add.make_public") as string}
            />
          </FormGroup>
        }
        actions={
          <>
            <Button onClick={closeDialog} color="secondary">
              {t("ui.cancel")}
            </Button>
            <Button variant="contained" onClick={add}>
              {t("ui.save")}
            </Button>
          </>
        }
      />
    </div>
  );
};

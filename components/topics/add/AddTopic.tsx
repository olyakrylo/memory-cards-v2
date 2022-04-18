import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AddBoxRounded } from "@mui/icons-material";
import { BaseSyntheticEvent, useState } from "react";

import styles from "../Topics.module.css";
import { Topic, User } from "../../../utils/types";
import { request } from "../../../utils/request";

type AddTopicProps = {
  user?: User;
  addTopic: (topic: Topic) => void;
};

export const AddTopic = ({ user, addTopic }: AddTopicProps) => {
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const { t } = useTranslation();

  const clear = () => {
    setDialogOpened(false);
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
      users_id: [user._id],
      author_id: user._id,
      title,
      public: isPublic,
    });
    if (newTopic) {
      addTopic(newTopic);
      clear();
    }
  };

  return (
    <div>
      <Button
        className={styles.addButton}
        color="primary"
        onClick={() => setDialogOpened(true)}
      >
        <AddBoxRounded />
        <Typography className={styles.addButton__title}>
          {t("add.create_topic")}
        </Typography>
      </Button>

      <Dialog open={dialogOpened}>
        <DialogTitle>{t("add.new_topic")}</DialogTitle>

        <DialogContent className={styles.add__content}>
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
        </DialogContent>

        <DialogActions className={styles.add__actions}>
          <Button onClick={closeDialog} color="secondary">
            {t("ui.cancel")}
          </Button>
          <Button variant="contained" onClick={add}>
            {t("ui.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

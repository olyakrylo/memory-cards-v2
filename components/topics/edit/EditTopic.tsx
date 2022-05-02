import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, useState } from "react";

import styles from "../Topics.module.css";
import { Topic } from "../../../shared/models";
import AppDialog from "../../dialog";

type EditTopicProps = {
  open: boolean;
  onClose: () => void;
  topic?: Topic;
  onConfirm: (title: string, isPublic: boolean) => void;
};

export const EditTopic = ({
  open,
  onClose,
  topic,
  onConfirm,
}: EditTopicProps) => {
  const [title, setTitle] = useState<string>(topic?.title ?? "");
  const [isPublic, setIsPublic] = useState<boolean>(topic?.public ?? false);

  const { t } = useTranslation();

  const clear = () => {
    setTitle("");
    setIsPublic(false);
  };

  const closeDialog = (): void => {
    clear();
    onClose();
  };

  const onTitleChange = (e: BaseSyntheticEvent) => {
    setTitle(e.target.value);
  };

  const onPublicChange = (e: BaseSyntheticEvent) => {
    setIsPublic(e.target.checked);
  };

  const confirm = async (): Promise<void> => {
    onConfirm(title, isPublic);
    clear();
  };

  return (
    <AppDialog
      open={open}
      size={"xs"}
      title={t("add.new_topic")}
      content={
        <FormGroup className={styles.add__form}>
          <TextField
            onChange={onTitleChange}
            required
            value={title}
            label={t("add.topic_title")}
          />
          <FormControlLabel
            control={<Checkbox onChange={onPublicChange} checked={isPublic} />}
            label={t("add.make_public") as string}
          />
        </FormGroup>
      }
      actions={
        <>
          <Button onClick={closeDialog} color="secondary">
            {t("ui.cancel")}
          </Button>
          <Button variant="contained" onClick={confirm}>
            {t("ui.save")}
          </Button>
        </>
      }
    />
  );
};

import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, useState } from "react";

import styles from "./TopicControl.module.css";
import { Topic } from "../../../shared/models";
import AppDialog from "../../dialog";

type TopicControlProps = {
  open: boolean;
  onClose: () => void;
  topic?: Topic;
  onConfirm: (title: string, isPublic: boolean) => Promise<void>;
};

export const TopicControl = ({
  open,
  onClose,
  topic,
  onConfirm,
}: TopicControlProps) => {
  const [title, setTitle] = useState<string>(topic?.title ?? "");
  const [isPublic, setIsPublic] = useState<boolean>(topic?.public ?? false);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    await onConfirm(title, isPublic);
    setLoading(false);
    clear();
  };

  return (
    <AppDialog
      open={open}
      size={"xs"}
      title={t(`add.${topic ? "edit_topic" : "new_topic"}`)}
      content={
        <FormGroup className={styles.form}>
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
          {loading && <CircularProgress size={24} className={styles.loader} />}
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

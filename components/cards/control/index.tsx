import { connect } from "react-redux";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { State, Topic } from "../../../utils/types";
import styles from "./CardControl.module.css";

type CardControlProps = {
  currentTopic?: Topic;
  open: boolean;
  onClose: (question: string, answer: string) => void;
};

export const CardControl = ({
  currentTopic,
  open,
  onClose,
}: CardControlProps) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const { t } = useTranslation();

  const onSave = () => {
    onClose(question, answer);
  };

  const onChangeField = (event: any, updateFunc: (value: string) => void) => {
    const { value } = event.target as { value: string };
    updateFunc(value);
  };

  return (
    <Dialog open={open} className={styles.container}>
      <DialogTitle>
        {t("add.new_card_for")}{" "}
        <span className={styles.topic}> {currentTopic?.title}</span>
      </DialogTitle>

      <DialogContent className={styles.content}>
        <TextField
          className={styles.input}
          required
          multiline
          label={t("ui.question")}
          onChange={(e) => onChangeField(e, setQuestion)}
        />
        <TextField
          required
          multiline
          label={t("ui.answer")}
          onChange={(e) => onChangeField(e, setAnswer)}
        />
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button onClick={() => onClose("", "")}>{t("ui.cancel")}</Button>
        <Button variant="contained" onClick={onSave}>
          {t("ui.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic,
  };
};

export default connect(mapStateToProps)(CardControl);

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

import { Card, State, Topic } from "../../../utils/types";
import styles from "./CardControl.module.css";

type CardControlProps = {
  currentTopic?: Topic;
  open: boolean;
  onClose: (question: string, answer: string, card?: Card) => void;
  card?: Card;
};

export const CardControl = ({
  currentTopic,
  open,
  onClose,
  card,
}: CardControlProps) => {
  const [question, setQuestion] = useState<string>(card?.question ?? "");
  const [answer, setAnswer] = useState<string>(card?.answer ?? "");

  const { t } = useTranslation();

  const onSave = (e: any) => {
    e.stopPropagation();
    setQuestion("");
    setAnswer("");
    onClose(question, answer, card);
  };

  const onCloseDialog = (e: any) => {
    e.stopPropagation();
    setQuestion("");
    setAnswer("");
    onClose("", "");
  };

  const onChangeField = (event: any, updateFunc: (value: string) => void) => {
    event.stopPropagation();
    const { value } = event.target as { value: string };
    updateFunc(value);
  };

  return (
    <Dialog open={open} className={styles.container}>
      <DialogTitle>
        {t(card ? "add.edit_card_in" : "add.new_card_for")}{" "}
        <span className={styles.topic}> {currentTopic?.title}</span>
      </DialogTitle>

      <DialogContent className={styles.content}>
        <TextField
          className={styles.input}
          required
          multiline
          label={t("ui.question")}
          defaultValue={question}
          onChange={(e) => onChangeField(e, setQuestion)}
        />
        <TextField
          required
          multiline
          label={t("ui.answer")}
          defaultValue={answer}
          onChange={(e) => onChangeField(e, setAnswer)}
        />
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button onClick={onCloseDialog} color="secondary">
          {t("ui.cancel")}
        </Button>
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

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import styles from "./CardControl.module.css";
import { Topic } from "../../../utils/types";

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
        New card for{" "}
        <span className={styles.topic}> {currentTopic?.title}</span>
      </DialogTitle>

      <DialogContent className={styles.content}>
        <TextField
          className={styles.input}
          required
          multiline
          label={"question"}
          onChange={(e) => onChangeField(e, setQuestion)}
        />
        <TextField
          required
          multiline
          label={"answer"}
          onChange={(e) => onChangeField(e, setAnswer)}
        />
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button onClick={() => onClose("", "")}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import { BaseSyntheticEvent, useRef, useState } from "react";
import { Typography } from "@mui/material";

import styles from "./CardsCounter.module.css";

type CardsCounterProps = {
  currentIndex: number;
  total: number;
  onChangeIndex: (i: number) => void;
};

export const CardsCounter = ({
  currentIndex,
  total,
  onChangeIndex,
}: CardsCounterProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const edit = () => {
    setEditMode(true);
  };

  const handleChange = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
      setEditMode(false);
      return;
    }

    if (numValue <= 1) {
      onChangeIndex(0);
    } else if (numValue > total) {
      onChangeIndex(total - 1);
    } else {
      onChangeIndex(numValue - 1);
    }
    setEditMode(false);
  };

  const handleKeyUp = (event: any): void => {
    if (event.code !== "Enter") return;
    event.target.blur();
  };

  return (
    <Typography align={"center"} className={styles.container}>
      {editMode && (
        <input
          className={styles.input}
          defaultValue={currentIndex + 1}
          onBlur={handleChange}
          onKeyUp={handleKeyUp}
          autoFocus
        />
      )}
      {!editMode && (
        <span className={styles.count} onClick={edit}>
          {currentIndex + 1}
        </span>
      )}{" "}
      / <span className={styles.total}>{total}</span>
    </Typography>
  );
};

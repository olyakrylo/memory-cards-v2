import { BaseSyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Tooltip } from "@mui/material";
import { AttachFileRounded } from "@mui/icons-material";
import Image from "next/image";

import { Field } from "../CardControl";
import styles from "./CardControlField.module.css";
import { CardField } from "../../../../utils/types";

type CardControlFieldProps = {
  field: Field;
  value: CardField;
  rowsCount: number;
  handleChange: (e: BaseSyntheticEvent, f: Field) => void;
  handleAttach: (e: BaseSyntheticEvent, f: Field) => void;
  disabled: boolean;
};

export const CardControlField = ({
  field,
  value,
  rowsCount,
  handleChange,
  handleAttach,
  disabled,
}: CardControlFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <TextField
        required
        multiline
        rows={rowsCount}
        label={t(`ui.${field}`)}
        defaultValue={value.text}
        onChange={(e) => handleChange(e, field)}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <>
              <input
                id={`${field}-file-input`}
                className={styles.attachment}
                type={"file"}
                onChange={(e) => handleAttach(e, field)}
              />
              <Tooltip title={"attach image of text file"}>
                <label
                  htmlFor={`${field}-file-input`}
                  className={styles.attachmentLabel}
                >
                  <AttachFileRounded />
                </label>
              </Tooltip>
            </>
          ),
        }}
      />

      {value.image && (
        <img src={value.image} alt={"image"} className={styles.image} />
      )}
    </div>
  );
};

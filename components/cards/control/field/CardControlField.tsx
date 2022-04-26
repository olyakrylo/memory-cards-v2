import { BaseSyntheticEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Tooltip } from "@mui/material";
import { AttachFileRounded } from "@mui/icons-material";

import styles from "./CardControlField.module.css";
import {
  AppNotification,
  CardField,
  CardFieldContent,
} from "../../../../utils/types";

type CardControlFieldProps = {
  field: CardField;
  value: CardFieldContent;
  rowsCount: number;
  handleChange: (f: CardField, data: Partial<CardFieldContent>) => void;
  disabled: boolean;
  setNotification: (n: AppNotification) => void;
};

export const CardControlField = ({
  field,
  value,
  rowsCount,
  handleChange,
  disabled,
  setNotification,
}: CardControlFieldProps) => {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLTextAreaElement | null>();

  const onChangeInput = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    handleChange(field, { text: value });
  };

  const onChangeAttach = async (event: BaseSyntheticEvent): Promise<void> => {
    const reader = new FileReader();

    const file = event.target.files[0] as File;
    if (!file) return;

    if (file.type.startsWith("image")) {
      if (file.size > 900000) {
        setNotification({
          autoHide: 5000,
          severity: "error",
          text: "add.too_large_image",
          translate: true,
        });
        return;
      }

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const fileString = reader.result as string;

        handleChange(field, {
          image: fileString,
        });
      };
    } else if (file.type.startsWith("text")) {
      const text = await file.text();
      if (!text) {
        setNotification({
          autoHide: 5000,
          severity: "error",
          text: "add.invalid_file_content",
          translate: true,
        });
      } else {
        handleChange(field, { text });

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <TextField
        required
        multiline
        inputRef={inputRef}
        rows={rowsCount}
        label={t(`ui.${field}`)}
        defaultValue={value.text}
        onChange={onChangeInput}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <>
              <input
                id={`${field}-file-input`}
                className={styles.attachment}
                type={"file"}
                onChange={onChangeAttach}
                disabled={disabled}
                accept="text/*, image/*"
              />
              <Tooltip
                title={disabled ? "" : t("add.attach_image_or_text") ?? ""}
              >
                <label
                  htmlFor={`${field}-file-input`}
                  className={styles.attachmentLabel}
                  aria-disabled={disabled}
                >
                  <AttachFileRounded />
                </label>
              </Tooltip>
            </>
          ),
        }}
      />

      {value.image && (
        <img
          src={value.image}
          alt={t(`ui.${field}_image`)}
          className={styles.image}
        />
      )}
    </div>
  );
};

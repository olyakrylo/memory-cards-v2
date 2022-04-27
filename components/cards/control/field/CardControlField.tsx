import { BaseSyntheticEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Tooltip } from "@mui/material";
import { AttachFileRounded } from "@mui/icons-material";
import { compressAccurately } from "image-conversion";

import styles from "./CardControlField.module.css";
import {
  AppNotification,
  CardField,
  CardFieldContent,
} from "../../../../utils/types";
import AppImage from "../../../image";

type CardControlFieldProps = {
  field: CardField;
  value: CardFieldContent;
  rowsCount: number;
  handleChange: (data: Partial<CardFieldContent>) => void;
  handleImage: (f: File) => void;
  disabled: boolean;
  setNotification: (n: AppNotification) => void;
};

export const CardControlField = ({
  field,
  value,
  rowsCount,
  handleChange,
  handleImage,
  disabled,
  setNotification,
}: CardControlFieldProps) => {
  const { t } = useTranslation();

  const [image, setImage] = useState<string | undefined>(value.image);
  const [uploaded, setUploaded] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement | null>();
  const inputId = `${field}-file-input`;

  const onChangeInput = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    handleChange({ text: value });
  };

  const onChangeAttach = async (event: BaseSyntheticEvent): Promise<void> => {
    const file = event.target.files[0] as File;
    if (!file) return;

    if (file.type.startsWith("image")) {
      compressAccurately(file, 500).then((blob) => {
        const fileFromBlob = new File([blob], file.name, { type: file.type });
        setImage(URL.createObjectURL(fileFromBlob));
        setUploaded(true);
        handleImage(fileFromBlob);
      });
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
        handleChange({ text });

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
                id={inputId}
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
                  htmlFor={inputId}
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

      {image && (
        <AppImage
          src={image}
          maxHeight={"250px"}
          simpleSrc={uploaded}
          alt={t(`ui.${field}_image`)}
          rounded={true}
        />
      )}
    </div>
  );
};

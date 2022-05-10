import { BaseSyntheticEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { AttachFileRounded, HighlightOffRounded } from "@mui/icons-material";

import styles from "./CardControlField.module.css";
import { ControlCardFieldContent } from "../CardControl";
import { CardField, CardFieldContent } from "../../../../shared/models";
import AppImage from "../../../image";
import SkeletonLoader from "../../../skeletonLoader";
import { useNotification } from "../../../../hooks";

const IMAGE_HEIGHT = 250;

type CardControlFieldProps = {
  field: CardField;
  value: ControlCardFieldContent;
  rowsCount: number;
  handleChange: (data: Partial<CardFieldContent>) => void;
  handleImage: (f?: File) => void;
  disabled: boolean;
};

export const CardControlField = ({
  field,
  value,
  rowsCount,
  handleChange,
  handleImage,
  disabled,
}: CardControlFieldProps) => {
  const { t } = useTranslation();
  const notification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement | null>();
  const inputId = `${field}-file-input`;

  const onChangeInput = (event: BaseSyntheticEvent): void => {
    handleChange({ text: event.target.value });
  };

  const onChangeAttach = async (event: BaseSyntheticEvent): Promise<void> => {
    const file = event.target.files[0] as File;
    if (!file) return;

    if (file.type.startsWith("image")) {
      if (file.size > 10 * 1024 * 1024) {
        notification.setError("add.too_large_image");
        return;
      }

      setLoading(true);
      let conversionFile: File | Blob = file;
      if (file.type === "image/heic") {
        const { default: converter } = await import("heic2any");
        conversionFile = (await converter({
          blob: file,
          toType: "image/jpg",
        })) as Blob;
      }

      const { compressAccurately } = await import("image-conversion");
      const blob = await compressAccurately(conversionFile, 500);

      const fileFromBlob = new File([blob], file.name, { type: file.type });
      handleImage(fileFromBlob);
      setLoading(false);
    } else if (file.type.startsWith("text")) {
      const text = await file.text();
      if (!text) {
        notification.setError("add.invalid_file_content");
      } else {
        handleChange({ text });

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const removeAttach = () => {
    handleImage();
  };

  return (
    <div className={styles.container}>
      <TextField
        multiline
        inputRef={inputRef}
        rows={rowsCount}
        label={t(`ui.${field}`)}
        value={value.text}
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
                accept="text/*, image/*, image/heic"
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

      {loading && <SkeletonLoader height={IMAGE_HEIGHT} />}

      {!loading && value.image && (
        <div className={styles.file} style={{ height: IMAGE_HEIGHT }}>
          <AppImage
            src={value.image}
            maxHeight={`${IMAGE_HEIGHT}px`}
            alt={t(`ui.${field}_image`)}
          />

          <IconButton
            size={"small"}
            className={styles.file__del}
            color={"secondary"}
            onClick={removeAttach}
          >
            <HighlightOffRounded />
          </IconButton>
        </div>
      )}
    </div>
  );
};

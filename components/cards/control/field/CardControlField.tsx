import {
  BaseSyntheticEvent,
  ClipboardEventHandler,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { AttachFileRounded, HighlightOffRounded } from "@mui/icons-material";
import { v4 as UUID } from "uuid";

import styles from "./CardControlField.module.css";
import {
  CardField,
  CardFieldContent,
  ControlCardFieldContent,
} from "../../../../shared/models";
import AppImage from "../../../image";
import SkeletonLoader from "../../../skeletonLoader";
import { useNotification } from "../../../../hooks";

const IMAGE_HEIGHT = 250;

type CardControlFieldProps = {
  field: CardField;
  value: ControlCardFieldContent;
  rowsCount: number;
  onChange: (data: Partial<CardFieldContent>) => void;
  onChangeImage: (f?: File) => void;
  disabled: boolean;
};

export const CardControlField = ({
  field,
  value,
  rowsCount,
  onChange,
  onChangeImage,
  disabled,
}: CardControlFieldProps) => {
  const { t } = useTranslation();
  const notification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement | null>();
  const inputId = `${field}-${UUID()}`;

  const handleInputChange = (event: BaseSyntheticEvent): void => {
    onChange({ text: event.target.value });
  };

  const handleAttach = async (event: BaseSyntheticEvent): Promise<void> => {
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
      onChangeImage(fileFromBlob);
      setLoading(false);
    } else if (file.type.startsWith("text")) {
      const text = await file.text();
      if (!text) {
        notification.setError("add.invalid_file_content");
      } else {
        onChange({ text });

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handlePaste: ClipboardEventHandler = async (event): Promise<void> => {
    const file = event.clipboardData?.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    await handleAttach({ target: { files: [file] } } as BaseSyntheticEvent);
  };

  const removeAttach = () => {
    onChangeImage();
  };

  return (
    <FormControl fullWidth onPaste={handlePaste} className={styles.container}>
      <InputLabel>{t(`ui.${field}`)}</InputLabel>
      <OutlinedInput
        multiline
        inputRef={inputRef}
        rows={rowsCount}
        label={t(`ui.${field}`)}
        value={value.text}
        placeholder={t("add.enter_text_or_paste")}
        onChange={handleInputChange}
        disabled={disabled}
        endAdornment={
          <>
            <input
              id={inputId}
              className={styles.attachment}
              type={"file"}
              onChange={handleAttach}
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
        }
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
    </FormControl>
  );
};

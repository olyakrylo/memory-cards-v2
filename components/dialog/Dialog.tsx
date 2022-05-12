import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import classNames from "classnames";

import styles from "./Dialog.module.css";
import DialogTransition from "./transition";
import { BaseSyntheticEvent } from "react";

type DialogProps = {
  open: boolean;
  size?: Breakpoint;
  responsive?: boolean;
  onlyFullScreen?: boolean;
  onClose?: (e: BaseSyntheticEvent) => void;
  title?: JSX.Element;
  content: JSX.Element;
  actions: JSX.Element;
  grayContent?: boolean;
};

export const AppDialog = ({
  open,
  size,
  responsive,
  onlyFullScreen,
  title,
  content,
  actions,
  onClose,
  grayContent,
}: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      fullScreen={responsive ? fullScreen : !!onlyFullScreen}
      maxWidth={size}
      fullWidth={true}
      TransitionComponent={DialogTransition}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
    >
      {title && <DialogTitle className={styles.title}>{title}</DialogTitle>}

      <DialogContent
        className={classNames(styles.content, {
          [styles.content_gray]: grayContent,
        })}
      >
        {content}
      </DialogContent>

      <DialogActions className={styles.actions}>{actions}</DialogActions>
    </Dialog>
  );
};

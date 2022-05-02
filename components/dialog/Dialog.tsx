import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";

import styles from "./Dialog.module.css";

const DialogTransition = dynamic(() => import("./transition"));

type DialogProps = {
  open: boolean;
  size: Breakpoint;
  responsive?: boolean;
  onClose?: () => void;
  title?: JSX.Element;
  content: JSX.Element;
  actions: JSX.Element;
};

export const AppDialog = ({
  open,
  size,
  responsive,
  title,
  content,
  actions,
  onClose,
}: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      fullScreen={responsive ? fullScreen : false}
      maxWidth={size}
      fullWidth={true}
      TransitionComponent={DialogTransition}
      onClose={onClose}
    >
      {title && <DialogTitle className={styles.title}>{title}</DialogTitle>}

      <DialogContent dividers={true} className={styles.content}>
        {content}
      </DialogContent>

      <DialogActions className={styles.actions}>{actions}</DialogActions>
    </Dialog>
  );
};

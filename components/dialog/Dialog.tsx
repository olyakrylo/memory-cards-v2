import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import DialogTransition from "./transition";
import styles from "./Dialog.module.css";

type DialogProps = {
  open: boolean;
  size: Breakpoint;
  responsive?: boolean;
  onClose?: () => void;
  title?: any;
  content: any;
  actions: any;
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
      {title && (
        <DialogTitle classes={{ root: styles.title }}>{title}</DialogTitle>
      )}

      <DialogContent classes={{ root: styles.content }}>
        {content}
      </DialogContent>

      <DialogActions classes={{ root: styles.actions }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

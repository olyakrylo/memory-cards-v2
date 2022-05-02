import { AlertColor } from "@mui/material";

export type AppNotification = {
  severity: AlertColor;
  text: string;
  translate?: boolean;
  autoHide?: number;
};

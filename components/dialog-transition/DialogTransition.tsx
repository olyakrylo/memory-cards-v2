import { Slide } from "@mui/material";
import { forwardRef, ReactElement } from "react";
import { TransitionProps } from "@mui/material/transitions";

export const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

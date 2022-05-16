import { useState } from "react";
import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  IconButton,
} from "@mui/material";

import styles from "./ViewCard.module.css";

type ViewCardProps = {
  title: string;
  content?: JSX.Element;
  actions?: JSX.Element;
  collapse?: JSX.Element;
  onToggleExpand?: (expanded: boolean) => void;
  selected?: boolean;
  onToggleSelection: (checked: boolean) => void;
};

export const ViewCard = ({
  title,
  content,
  actions,
  collapse,
  onToggleExpand,
  selected,
  onToggleSelection,
}: ViewCardProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    const newValue = !expanded;
    setExpanded(newValue);
    if (!onToggleExpand) return;
    onToggleExpand(newValue);
  };

  const toggleSelection = (checked: boolean) => {
    onToggleSelection(checked);
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "subtitle1" }}
      />

      {content && <CardContent>{content}</CardContent>}

      <CardActions className={styles.card__actions}>
        <Checkbox
          checked={selected}
          onChange={(_, checked) => toggleSelection(checked)}
          className={styles.card__checkbox}
        />

        {actions}

        {collapse && (
          <IconButton
            onClick={toggleExpand}
            aria-expanded={expanded}
            size={"small"}
          >
            {expanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          </IconButton>
        )}
      </CardActions>

      {collapse && (
        <Collapse in={expanded}>
          <div className={styles.card__collapse}>{collapse}</div>
        </Collapse>
      )}
    </Card>
  );
};

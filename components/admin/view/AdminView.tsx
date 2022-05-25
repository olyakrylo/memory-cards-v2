import { IconButton, Pagination, Typography } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./AdminView.module.css";
import { ADMIN_DATA_LIMIT } from "../../../shared/admin";
import { UpdatedResult } from "../../../shared/api";
import AdminItemCard from "./card";

interface AdminViewProps<T = any> {
  count: number;
  deleteFunc?: (selected: string[]) => Promise<UpdatedResult>;
  data: T[];
  itemTitle: (item: T) => string;
  itemContent?: (item: T) => JSX.Element;
  itemActions?: (item: T) => JSX.Element;
  itemCollapse?: (item: T) => JSX.Element;
  onToggleExpand?: (id: string, expanded: boolean) => void;
  footer?: JSX.Element;
}

export function AdminView<T extends { _id: string }>({
  count,
  deleteFunc,
  data,
  itemTitle,
  itemContent,
  itemActions,
  itemCollapse,
  onToggleExpand,
  footer,
}: AdminViewProps<T>) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string, checked: boolean): void => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const deleteCards = async (): Promise<void> => {
    if (!deleteFunc) return;
    const { updated } = await deleteFunc(selectedIds);
    if (!updated) return;

    setSelectedIds([]);
    await router.push({
      pathname: router.pathname,
      query: router.query,
    });
  };

  const onChangePage = async (...[, page]: [any, number]): Promise<void> => {
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        skip: (page - 1) * ADMIN_DATA_LIMIT,
        limit: ADMIN_DATA_LIMIT,
      },
    });
  };

  const pagesCount = (): number => {
    return Math.ceil(count / ADMIN_DATA_LIMIT);
  };

  return (
    <div className={styles.container}>
      {!!selectedIds.length && (
        <div className={styles.selected}>
          <Typography>
            Selected: <b>{selectedIds.length}</b>
          </Typography>

          {deleteFunc && (
            <IconButton onClick={deleteCards} className={styles.delete}>
              <DeleteOutlined />
            </IconButton>
          )}
        </div>
      )}

      <Pagination
        count={pagesCount()}
        color={"primary"}
        className={styles.pagination}
        onChange={onChangePage}
        showFirstButton
        showLastButton
      />

      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing={3}
        className={styles.content}
      >
        {data.map((item, i) => (
          <AdminItemCard
            key={i}
            title={itemTitle(item)}
            content={itemContent ? itemContent(item) : undefined}
            actions={itemActions ? itemActions(item) : undefined}
            collapse={itemCollapse ? itemCollapse(item) : undefined}
            selected={selectedIds.includes(item._id)}
            onToggleSelection={(checked) => toggleSelection(item._id, checked)}
            onToggleExpand={
              onToggleExpand
                ? (expanded) => onToggleExpand(item._id, expanded)
                : undefined
            }
          />
        ))}
      </Masonry>

      {footer}
    </div>
  );
}

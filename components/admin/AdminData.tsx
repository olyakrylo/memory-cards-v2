import { IconButton, Pagination, Typography } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useState } from "react";
import dynamic from "next/dynamic";

import styles from "./AdminData.module.css";
import { ADMIN_DATA_LIMIT } from "../../shared/admin";
import { UpdatedResult } from "../../shared/api";
import AdminItemCard from "./item";

const Masonry = dynamic(() => import("@mui/lab/Masonry"));

type AdminDataProps = {
  count: number;
  deleteFunc?: (selected: string[]) => Promise<UpdatedResult>;
  data: any[];
  itemTitle: (item: any) => string;
  itemContent?: (item: any) => JSX.Element;
  itemActions?: (item: any) => JSX.Element;
  itemCollapse?: (item: any) => JSX.Element;
  onToggleExpand?: (id: string, expanded: boolean) => void;
  selectable?: boolean;
};

export const AdminData = ({
  count,
  deleteFunc,
  data,
  itemTitle,
  itemContent,
  itemActions,
  itemCollapse,
  onToggleExpand,
  selectable,
}: AdminDataProps) => {
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

  const onChangePage = async (_: BaseSyntheticEvent, page: number) => {
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
    <>
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
            onToggleSelection={
              selectable
                ? (checked) => toggleSelection(item._id, checked)
                : undefined
            }
            onToggleExpand={
              onToggleExpand
                ? (expanded) => onToggleExpand(item._id, expanded)
                : undefined
            }
          />
        ))}
      </Masonry>
    </>
  );
};

import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CollectionsBookmarkRounded } from "@mui/icons-material";
import { Button, debounce, TextField, Typography } from "@mui/material";

import styles from "./PublicTopics.module.css";
import mainStyles from "../Topics.module.css";
import { request } from "../../../utils/request";
import { Topic, TopicExt } from "../../../utils/types";
import AppDialog from "../../dialog";
import SkeletonLoader from "../../skeletonLoader";
import PublicTopicItem from "./item";

type PublicTopicsProps = {
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
};

export const PublicTopics = ({ topics, setTopics }: PublicTopicsProps) => {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [publicTopics, setPublicTopics] = useState<TopicExt[]>([]);
  const [count, setCount] = useState<number>(1);
  const [filteredTopics, setFilteredTopics] = useState<TopicExt[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!dialogOpen) return;

    setLoading(true);
    setPublicTopics([]);
    setFilteredTopics([]);

    request("topics", "public_count", "get")
      .then(({ count }) => {
        setCount(count);
      })
      .then(() => request("topics", "public", "get"))
      .then((data) => {
        setPublicTopics(data);
        setFilteredTopics(data);
        setSelectedTopics([]);
        setLoading(false);
      });
  }, [dialogOpen]);

  const openDialog = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const closeDialog = (e: BaseSyntheticEvent): void => {
    setPublicTopics([]);
    setDialogOpen(false);
  };

  const toggleTopic = (id: string): void => {
    let updatedTopics = selectedTopics.slice();
    if (selectedTopics.includes(id)) {
      updatedTopics = updatedTopics.filter((topicId) => topicId !== id);
    } else {
      updatedTopics.push(id);
    }
    setSelectedTopics(updatedTopics);
  };

  const updateTopics = async (): Promise<void> => {
    const updatedTopics = await request("topics", "public", "put", {
      body: {
        topics_id: selectedTopics,
      },
    });
    setTopics([...topics, ...updatedTopics]);
    setDialogOpen(false);
  };

  const filter = (event: BaseSyntheticEvent): void => {
    const search = event.target.value;
    if (!search) {
      setFilteredTopics(publicTopics);
      return;
    }
    setFilteredTopics(
      publicTopics.filter(
        (t) => t.title.includes(search) || t.author_name.includes(search)
      )
    );
  };

  return (
    <div>
      <Button
        color="secondary"
        classes={{ root: mainStyles.addButton }}
        onClick={openDialog}
      >
        <CollectionsBookmarkRounded />
        <Typography
          className={mainStyles.addButton__title}
          variant={"subtitle2"}
        >
          {t("add.existing_topics")}
        </Typography>
      </Button>

      <AppDialog
        open={dialogOpen}
        size={"sm"}
        responsive={true}
        title={
          <TextField
            className={styles.dialog__search}
            type="search"
            label={t("ui.search")}
            onChange={debounce(filter, 200)}
          />
        }
        content={
          <>
            {loading && (
              <SkeletonLoader
                height={50}
                count={count}
                classes={styles.topicSkeleton}
              />
            )}

            {filteredTopics.map((topic) => (
              <PublicTopicItem
                key={topic._id}
                topic={topic}
                selected={selectedTopics.includes(topic._id)}
                toggleTopic={() => toggleTopic(topic._id)}
              />
            ))}
          </>
        }
        actions={
          <>
            <Button onClick={closeDialog} color="secondary">
              {t("ui.cancel")}
            </Button>
            {!!selectedTopics.length && (
              <Button variant="contained" onClick={updateTopics}>
                {t("add.add-topics", { count: selectedTopics.length })}
              </Button>
            )}
          </>
        }
      />
    </div>
  );
};

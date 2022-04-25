import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RemoveCircleRounded,
  CollectionsBookmarkRounded,
  KeyboardArrowDownRounded,
  AddCircleRounded,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  debounce,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import styles from "./PublicTopics.module.css";
import mainStyles from "../Topics.module.css";
import { request } from "../../../utils/request";
import { Card, Topic, TopicExt } from "../../../utils/types";
import AppDialog from "../../dialog";
import SkeletonLoader from "../../skeletonLoader";

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
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [topicCards, setTopicCards] = useState<{ [key: string]: Card[] }>({});

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

  const loadCards = async (id: string): Promise<void> => {
    if (topicCards[id]) return;
    const cards = await request("cards", "by_topic", "post", {
      topic_id: id,
    });
    setTopicCards({ ...topicCards, [id]: cards });
  };

  const toggleExpand = async (topic: TopicExt): Promise<void> => {
    if (!topic.cards_count) return;

    if (!expanded[topic._id]) {
      await loadCards(topic._id);
    }
    setExpanded({ ...expanded, [topic._id]: !expanded[topic._id] });
  };

  const toggleTopic = (event: BaseSyntheticEvent, id: string): void => {
    event.stopPropagation();
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
      topics_id: selectedTopics,
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

            {filteredTopics.map((topic) => {
              return (
                <div key={topic._id} className={styles.topic}>
                  <div
                    className={styles.topic__head}
                    onClick={() => toggleExpand(topic)}
                    aria-disabled={!topic.cards_count}
                  >
                    <IconButton
                      size="small"
                      className={styles.topic__expand}
                      aria-expanded={expanded[topic._id]}
                      disabled={!topic.cards_count}
                    >
                      <KeyboardArrowDownRounded />
                    </IconButton>
                    <Typography classes={{ root: styles.topic__title }}>
                      {topic.title}
                    </Typography>
                    <Typography className={styles.topic__author}>
                      ({topic.author_name})
                    </Typography>
                    <Typography
                      className={styles.topic__cards}
                      variant="subtitle2"
                    >
                      {t("add.cards-count", { count: topic.cards_count ?? 0 })}
                    </Typography>
                    <IconButton
                      size="small"
                      className={styles.topic__toggle}
                      color={
                        selectedTopics.includes(topic._id)
                          ? "secondary"
                          : "primary"
                      }
                      onClick={(e) => toggleTopic(e, topic._id)}
                    >
                      {selectedTopics.includes(topic._id) ? (
                        <RemoveCircleRounded />
                      ) : (
                        <AddCircleRounded />
                      )}
                    </IconButton>
                  </div>

                  {expanded[topic._id] && (
                    <div className={styles.topic__content}>
                      {!topicCards[topic._id] && (
                        <SkeletonLoader height={64} count={topic.cards_count} />
                      )}

                      {(topicCards[topic._id] ?? []).map((card) => {
                        return (
                          <div key={card._id} className={styles.card}>
                            <Typography
                              className={styles.card__question}
                              variant="subtitle2"
                            >
                              {card.question}
                            </Typography>
                            <Typography
                              className={styles.card__answer}
                              variant="subtitle2"
                            >
                              {card.answer}
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

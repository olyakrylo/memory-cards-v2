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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import styles from "./PublicTopics.module.css";
import mainStyles from "../Topics.module.css";
import { request } from "../../../utils/request";
import { Card, Topic, TopicExt } from "../../../utils/types";
import DialogTransition from "../../dialog-transition";

type PublicTopicsProps = {
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
};

export const PublicTopics = ({ topics, setTopics }: PublicTopicsProps) => {
  const { t } = useTranslation();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [publicTopics, setPublicTopics] = useState<TopicExt[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<TopicExt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [topicCards, setTopicCards] = useState<{ [key: string]: Card[] }>({});
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!dialogOpened) return;
    setLoading(true);
    request("topics", "public", "get").then((data) => {
      const ids = topics.map((t) => t._id);
      const notSelfTopics = data.filter((pt) => !ids.includes(pt._id));
      setPublicTopics(notSelfTopics);
      setFilteredTopics(notSelfTopics);
      setSelectedTopics([]);
      setLoading(false);
    });
  }, [dialogOpened, topics]);

  const openDialog = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
    setDialogOpened(true);
  };

  const closeDialog = (e: BaseSyntheticEvent): void => {
    setPublicTopics([]);
    setDialogOpened(false);
  };

  const loadCards = async (id: string): Promise<void> => {
    if (topicCards[id]) return;
    const cards = await request("cards", "by_topic", "post", {
      topic_id: id,
    });
    setTopicCards({ ...topicCards, [id]: cards });
  };

  const toggleExpand = async (id: string): Promise<void> => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
    if (!expanded[id]) {
      await loadCards(id);
    }
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
      topics_id: selectedTopics,
    });
    setTopics([...topics, ...updatedTopics]);
    setDialogOpened(false);
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
        className={mainStyles.addButton}
        onClick={openDialog}
      >
        <CollectionsBookmarkRounded />
        <Typography className={mainStyles.addButton__title}>
          {t("add.existing_topics")}
        </Typography>
      </Button>

      <Dialog
        open={dialogOpened}
        fullScreen
        TransitionComponent={DialogTransition}
      >
        <DialogTitle>
          <TextField
            className={styles.dialog__search}
            type="search"
            label={t("ui.search")}
            onChange={debounce(filter, 200)}
          />
        </DialogTitle>

        <DialogContent className={styles.dialog__content}>
          {loading && <CircularProgress />}

          {filteredTopics.map((topic) => {
            return (
              <div key={topic._id} className={styles.topic}>
                <div className={styles.topic__head}>
                  <IconButton
                    size="small"
                    className={styles.topic__expand}
                    aria-expanded={expanded[topic._id]}
                    onClick={() => toggleExpand(topic._id)}
                    disabled={!topic.cards_count}
                  >
                    <KeyboardArrowDownRounded />
                  </IconButton>
                  <Typography className={styles.topic__title}>
                    {topic.title}
                  </Typography>
                  <Typography className={styles.topic__author}>
                    ({topic.author_name})
                  </Typography>
                  <Typography className={styles.topic__cards}>
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
                    onClick={() => toggleTopic(topic._id)}
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
                    {!topicCards[topic._id] && <CircularProgress />}

                    {(topicCards[topic._id] ?? []).map((card) => {
                      return (
                        <div key={card._id} className={styles.card}>
                          <Typography className={styles.card__question}>
                            {card.question}
                          </Typography>
                          <Typography className={styles.card__answer}>
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
        </DialogContent>

        <DialogActions className={styles.dialog__actions}>
          {!!selectedTopics.length && (
            <Button variant="contained" onClick={updateTopics}>
              {t("add.add-topics", { count: selectedTopics.length })}
            </Button>
          )}
          <Button onClick={closeDialog} color="secondary">
            {t("ui.cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

import { useDispatch, useSelector } from "react-redux";
import { Subject } from "rxjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { State } from "../../shared/redux";
import { Card, CardFieldContent, ShortCard } from "../../shared/models";
import { setCards } from "../../redux/actions/main";
import { useApi, useTopics, useFiles } from "../index";
import { ControlCardFieldContent } from "../../components/cards/control/CardControl";
import { getUpdatedShuffledCards } from "../../components/cards/utils";
import { UpdatedResult } from "../../shared/api";

export const useCardsImpl = () => {
  const router = useRouter();
  const topics = useTopics();
  const api = useApi();
  const files = useFiles();

  const { cards, user } = useSelector((state: { main: State }) => ({
    cards: state.main.cards,
    user: state.main.user,
  }));
  const dispatch = useDispatch();

  const [shuffledCards, setShuffledCards] = useState<Card[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hideArrows, setHideArrows] = useState<boolean>(false);

  const dispatchCards = (topicId: string, cards: Card[]): void => {
    dispatch(setCards(topicId, cards));
  };

  const resetCards = new Subject<void>();
  const flipCard = new Subject<number>();

  useEffect(() => {
    void configArrows();
  }, [user?._id]);

  useEffect(() => {
    if (!topics.currentId) return;
    void loadTopicCards(topics.currentId);
  }, [topics.currentId]);

  useEffect(() => {
    if (!shuffledCards) return;
    const newShuffledCards = getUpdatedShuffledCards(shuffledCards, current());
    setShuffledCards(newShuffledCards);
  }, [cards]);

  const current = (): Card[] => {
    return cards[topics.currentId] ?? [];
  };

  const set = (topicId: string, cards: Card[]): void => {
    dispatchCards(topicId, cards);
  };

  const get = (topicId: string): Card[] | undefined => {
    return cards[topicId];
  };

  const loadTopicCards = async (topicId: string): Promise<void> => {
    if (cards[topicId]) return;

    setLoading(true);
    const cardsList = await api.request("cards", "by_topic", "get", {
      query: {
        topic_id: topicId,
      },
    });
    set(topicId, cardsList);
    resetCards.next();
    setLoading(false);
  };

  const countByTopic = (topicId: string): Promise<{ count: number }> => {
    return api.request("cards", "by_topic_count", "get", {
      query: { topic_id: topicId },
    });
  };

  const getByTopic = (topicId: string): Promise<Card[]> => {
    return api.request("cards", "by_topic", "get", {
      query: { topic_id: topicId },
    });
  };

  const toggleShuffle = async (): Promise<void> => {
    if (shuffledCards) {
      setShuffledCards(undefined);
    } else {
      const { default: shuffle } = await import("array-shuffle");
      setShuffledCards(shuffle(current()));
    }
  };

  const addCards = async (
    data?: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    },
    cardsFromFile?: ShortCard[],
    topic?: string
  ): Promise<void> => {
    const topicId = topic ?? topics.currentId;

    let newCards: Card[] = [];

    if (cardsFromFile?.length) {
      newCards = await api.request("cards", "", "put", {
        body: {
          cards: cardsFromFile.map((c) => ({
            ...c,
            topic_id: topicId,
          })),
        },
      });
    } else if (data) {
      const cardData: ShortCard = {
        question: {
          text: data.question.text,
        },
        answer: {
          text: data.answer.text,
        },
      };

      if (data?.question.image && typeof data.question.image !== "string") {
        cardData.question.image = await files.upload(
          data.question.image as File
        );
      }
      if (data?.answer.image && typeof data.answer.image !== "string") {
        cardData.answer.image = await files.upload(data.answer.image as File);
      }

      newCards = await api.request("cards", "", "put", {
        body: {
          cards: [{ ...cardData, topic_id: topicId }],
        },
      });
    }

    dispatchCards(topicId, [...current(), ...newCards]);
  };

  const deleteCard = async (topicId: string, cardId: string): Promise<void> => {
    await api.request("cards", "", "delete", { query: { ids: [cardId] } });
    const updatedCards = cards[topicId].filter((c) => c._id !== cardId);
    dispatchCards(topicId, updatedCards);
  };

  const deleteMany = (ids: string[]): Promise<UpdatedResult> => {
    return api.request("cards", "", "delete", {
      query: { ids },
    });
  };

  const updateCard = async (
    card: Card,
    data: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    }
  ): Promise<void> => {
    if (data.question.image && typeof data.question.image !== "string") {
      data.question.image = await files.upload(data.question.image as File);
    }
    if (data.answer.image && typeof data.answer.image !== "string") {
      data.answer.image = await files.upload(data.answer.image as File);
    }

    const updatedCard = await api.request("cards", "", "patch", {
      body: {
        ...card,
        question: data.question as CardFieldContent,
        answer: data.answer as CardFieldContent,
      },
    });

    dispatchCards(
      topics.currentId,
      current().map((c) => {
        if (c._id === updatedCard._id) return updatedCard;
        return c;
      })
    );
  };

  const configArrows = async (): Promise<void> => {
    api.request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  };

  const toggleArrows = (): void => {
    const newState = !hideArrows;
    setHideArrows(newState);
    void api.request("config", "arrows", "put", {
      body: {
        hide: newState,
      },
    });
  };

  const saveIndex = (index: number, topicId: string): void => {
    sessionStorage.setItem(topicId, index.toString());
  };

  const getSavedIndex = (topicId: string): number => {
    const startIndexFromUrl = parseInt((router.query.card as string) ?? "");
    const startIndexFromStorage = parseInt(
      sessionStorage.getItem(topicId) ?? ""
    );

    return startIndexFromUrl || startIndexFromStorage || 0;
  };

  return {
    current,
    set,
    get,
    loadTopicCards,
    countByTopic,
    getByTopic,
    resetCards,
    flipCard,
    loading: () => loading,
    hideArrows: () => hideArrows,
    configArrows,
    toggleArrows,
    shuffledCards: () => shuffledCards,
    toggleShuffle,
    addCards,
    deleteCard,
    deleteMany,
    updateCard,
    saveIndex,
    getSavedIndex,
  };
};

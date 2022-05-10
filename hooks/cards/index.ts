import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { State } from "../../shared/redux";
import { Card, CardFieldContent, ShortCard } from "../../shared/models";
import {
  setCards,
  setCardsLoading,
  setHideArrows,
  setShuffledCards,
} from "../../redux/actions/main";
import { useApi, useTopics, useFiles } from "../index";
import { ControlCardFieldContent } from "../../components/cards/control/CardControl";
import { getUpdatedShuffledCards } from "../../components/cards/utils";
import { UpdatedResult } from "../../shared/api";

export const useCardsImpl = () => {
  const router = useRouter();
  const topics = useTopics();
  const api = useApi();
  const files = useFiles();

  const { cards, shuffledCards, loading, hideArrows } = useSelector(
    (state: { main: State }) => ({
      cards: state.main.cards,
      shuffledCards: state.main.shuffledCards,
      loading: state.main.cardsLoading,
      hideArrows: state.main.hideArrows,
    })
  );
  const dispatch = useDispatch();

  const dispatchCards = (topicId: string, cards: Card[]): void => {
    dispatch(setCards(topicId, cards));
  };

  const dispatchShuffledCards = (
    topicId: string,
    shuffledCards?: Card[]
  ): void => {
    dispatch(setShuffledCards(topicId, shuffledCards));
  };

  const dispatchLoading = (loading: boolean): void => {
    dispatch(setCardsLoading(loading));
  };

  const dispatchArrows = (hide: boolean): void => {
    dispatch(setHideArrows(hide));
  };

  const current = (): Card[] => {
    return cards[topics.currentId] ?? [];
  };

  const currentShuffled = (): Card[] | undefined => {
    return shuffledCards[topics.currentId];
  };

  const get = (topicId: string): Card[] | undefined => {
    return cards[topicId];
  };

  const loadTopicCards = async (topicId: string): Promise<void> => {
    if (cards[topicId]) return;

    dispatchLoading(true);
    const cardsList = await api.request("cards", "by_topic", "get", {
      query: {
        topic_id: topicId,
      },
    });
    dispatchCards(topicId, cardsList);
    dispatchLoading(false);
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
    if (currentShuffled()) {
      dispatchShuffledCards(topics.currentId);
    } else {
      const { default: shuffle } = await import("array-shuffle");
      dispatchShuffledCards(topics.currentId, shuffle(current()));
    }
  };

  const updateShuffledCards = (): void => {
    if (!currentShuffled()) return;

    const updatedShuffledCards = getUpdatedShuffledCards(
      currentShuffled() ?? [],
      current()
    );
    dispatchShuffledCards(topics.currentId, updatedShuffledCards);
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

    dispatchCards(topicId, [...cards[topicId], ...newCards]);
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
      dispatchArrows(hide);
    });
  };

  const toggleArrows = (): void => {
    const newState = !hideArrows;
    dispatchArrows(newState);
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
    loading,
    hideArrows,
    current,
    currentShuffled,
    get,
    loadTopicCards,
    countByTopic,
    getByTopic,
    configArrows,
    toggleArrows,
    toggleShuffle,
    updateShuffledCards,
    addCards,
    deleteCard,
    deleteMany,
    updateCard,
    saveIndex,
    getSavedIndex,
  };
};
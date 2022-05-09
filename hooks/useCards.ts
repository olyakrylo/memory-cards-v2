import { useDispatch, useSelector } from "react-redux";
import { Subject } from "rxjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { State } from "../shared/redux";
import { Card, CardFieldContent, ShortCard } from "../shared/models";
import { setCards } from "../redux/actions/main";
import { useTopics } from "./index";
import { request } from "../utils/request";
import { ControlCardFieldContent } from "../components/cards/control/CardControl";
import { uploadImage } from "../utils/images";
import { getUpdatedShuffledCards } from "../components/cards/utils";
import { UpdatedResult } from "../shared/api";

export const useCardsImpl = () => {
  const topics = useTopics();
  const router = useRouter();

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
    if (!topics.currentTopic) return;
    void loadTopicCards(topics.currentTopic._id);
  }, [topics.currentTopic]);

  useEffect(() => {
    if (!shuffledCards) return;

    const newShuffledCards = getUpdatedShuffledCards(shuffledCards, current());
    setShuffledCards(newShuffledCards);
  }, [cards]);

  const current = (): Card[] => {
    return cards[topics.currentId()] ?? [];
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
    const cardsList = await request("cards", "by_topic", "get", {
      query: {
        topic_id: topicId,
      },
    });
    set(topicId, cardsList);
    resetCards.next();
    setLoading(false);
  };

  const countByTopic = (topicId: string): Promise<{ count: number }> => {
    return request("cards", "by_topic_count", "get", {
      query: { topic_id: topicId },
    });
  };

  const getByTopic = (topicId: string): Promise<Card[]> => {
    return request("cards", "by_topic", "get", {
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
    const topicId = topic ?? topics.currentId();

    let newCards: Card[] = [];

    if (cardsFromFile?.length) {
      newCards = await request("cards", "", "put", {
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
        cardData.question.image = await uploadImage(
          data.question.image as File
        );
      }
      if (data?.answer.image && typeof data.answer.image !== "string") {
        cardData.answer.image = await uploadImage(data.answer.image as File);
      }

      newCards = await request("cards", "", "put", {
        body: {
          cards: [{ ...cardData, topic_id: topicId }],
        },
      });
    }

    dispatchCards(topicId, [...current(), ...newCards]);
  };

  const deleteCard = async (topicId: string, cardId: string): Promise<void> => {
    await request("cards", "", "delete", { query: { ids: [cardId] } });
    const updatedCards = cards[topicId].filter((c) => c._id !== cardId);
    dispatchCards(topicId, updatedCards);
  };

  const deleteMany = (ids: string[]): Promise<UpdatedResult> => {
    return request("cards", "", "delete", {
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
      data.question.image = await uploadImage(data.question.image as File);
    }
    if (data.answer.image && typeof data.answer.image !== "string") {
      data.answer.image = await uploadImage(data.answer.image as File);
    }

    const updatedCard = await request("cards", "", "patch", {
      body: {
        ...card,
        question: data.question as CardFieldContent,
        answer: data.answer as CardFieldContent,
      },
    });

    dispatchCards(
      topics.currentId(),
      current().map((c) => {
        if (c._id === updatedCard._id) return updatedCard;
        return c;
      })
    );
  };

  const configArrows = async (): Promise<void> => {
    request("config", "arrows", "get").then(({ hide }) => {
      setHideArrows(hide);
    });
  };

  const toggleArrows = (): void => {
    const newState = !hideArrows;
    setHideArrows(newState);
    void request("config", "arrows", "put", {
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

export const useCardsInitialState = {
  current: () => [] as Card[],
  set: (tid: string, c: Card[]) => {},
  get: (tid: string) => [] as Card[] | undefined,
  loadTopicCards: (tid: string) => Promise.resolve(),
  countByTopic: (tid: string) => Promise.resolve({ count: 0 }),
  getByTopic: (tid: string) => Promise.resolve([] as Card[]),
  resetCards: new Subject<void>(),
  flipCard: new Subject<number>(),
  loading: () => false,
  hideArrows: () => false,
  configArrows: () => Promise.resolve(),
  toggleArrows: () => {},
  shuffledCards: () => undefined as Card[] | undefined,
  toggleShuffle: () => Promise.resolve(),
  addCards: () => Promise.resolve(),
  deleteCard: (tid: string, cid: string) => Promise.resolve(),
  deleteMany: (ids: string[]) => Promise.resolve({ updated: false }),
  updateCard: (
    c: Card,
    data: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    }
  ) => Promise.resolve(),
  saveIndex: (i: number, tid: string) => {},
  getSavedIndex: (tid: string) => 0,
};

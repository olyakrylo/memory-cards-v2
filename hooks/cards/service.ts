import { useEffect } from "react";
import { useSelector } from "react-redux";

import { State } from "../../shared/redux";
import { useCards, useTopics } from "../index";
import { Subject } from "rxjs";

export const useCardsServiceImpl = () => {
  const topics = useTopics();
  const cards = useCards();

  const { user, cards: cardsState } = useSelector((state: { main: State }) => ({
    user: state.main.user,
    cards: state.main.cards,
  }));

  const resetCards = new Subject<void>();
  const flipCard = new Subject<number>();

  useEffect(() => {
    void cards.configArrows();
  }, [user?._id]);

  useEffect(() => {
    if (!topics.currentId) return;
    void cards.loadTopicCards(topics.currentId);
  }, [topics.currentId]);

  useEffect(() => {
    cards.updateShuffledCards();
  }, [cardsState]);

  return { resetCards, flipCard };
};

export const useCardsServiceInitialState = {
  resetCards: new Subject<void>(),
  flipCard: new Subject<number>(),
};

import { Subject } from "rxjs";

import { Card } from "../../shared/models";
import { ControlCardFieldContent } from "../../components/cards/control/CardControl";

export const useCardsInitialState = {
  current: () => [] as Card[],
  set: (_: string, __: Card[]) => {},
  get: (_: string) => [] as Card[] | undefined,
  loadTopicCards: (_: string) => Promise.resolve(),
  countByTopic: (_: string) => Promise.resolve({ count: 0 }),
  getByTopic: (_: string) => Promise.resolve([] as Card[]),
  resetCards: new Subject<void>(),
  flipCard: new Subject<number>(),
  loading: () => false,
  hideArrows: () => false,
  configArrows: () => Promise.resolve(),
  toggleArrows: () => {},
  shuffledCards: () => undefined as Card[] | undefined,
  toggleShuffle: () => Promise.resolve(),
  addCards: () => Promise.resolve(),
  deleteCard: (_: string, __: string) => Promise.resolve(),
  deleteMany: (_: string[]) => Promise.resolve({ updated: false }),
  updateCard: (
    _: Card,
    __: {
      question: ControlCardFieldContent;
      answer: ControlCardFieldContent;
    }
  ) => Promise.resolve(),
  saveIndex: (_: number, __: string) => {},
  getSavedIndex: (_: string) => 0,
};

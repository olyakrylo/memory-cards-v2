import { Card } from "../../shared/models";
import { isBrowser } from "react-device-detect";

export const CARDS_BY_SLIDER = 20;

export const utils = (splideIndex: number, cardIndex: number): number => {
  if (!cardIndex) return 0;

  if (
    splideIndex * CARDS_BY_SLIDER > cardIndex ||
    (splideIndex + 1) * CARDS_BY_SLIDER - 1 < cardIndex
  ) {
    return 0;
  }
  return cardIndex - splideIndex * CARDS_BY_SLIDER;
};

export const getCardsMatrix = (cards: Card[]): Card[][] => {
  if (isBrowser) {
    return [cards];
  }

  const matrix: Card[][] = [];
  for (let i = 0; i < cards.length; i += CARDS_BY_SLIDER) {
    matrix.push(cards.slice(i, i + CARDS_BY_SLIDER));
  }
  return matrix;
};

export const getCardIndex = (
  splideIndex: number,
  cardIndex: number
): number => {
  return splideIndex * CARDS_BY_SLIDER + cardIndex;
};

import { Card } from "../../shared/models";
import { isBrowser } from "react-device-detect";
import { NextRouter } from "next/router";

export const CARDS_BY_SLIDER = 20;

export const getPartStartIndex = (
  splideIndex: number,
  cardIndex: number
): number => {
  if (!cardIndex) return 0;

  if (
    splideIndex * CARDS_BY_SLIDER > cardIndex ||
    (splideIndex + 1) * CARDS_BY_SLIDER - 1 < cardIndex
  ) {
    return 0;
  }
  return cardIndex - splideIndex * CARDS_BY_SLIDER;
};

export const getCardIndex = (
  splideIndex: number,
  cardIndex: number
): number => {
  return splideIndex * CARDS_BY_SLIDER + cardIndex;
};

export const getUpdatedShuffledCards = (
  shuffledCards: Card[],
  cards: Card[]
): Card[] | undefined => {
  if (cards[0]?.topic_id !== shuffledCards[0]?.topic_id) {
    return undefined;
  }

  let updatedCards: Card[];

  if (cards.length < shuffledCards.length) {
    // sth was deleted
    updatedCards = shuffledCards.filter((sc) =>
      cards.some((c) => c._id === sc._id)
    );
  } else if (cards.length > shuffledCards.length) {
    // sth was added
    const newCards = cards.filter(
      (c) => !shuffledCards.some((sc) => sc._id === c._id)
    );
    updatedCards = [...shuffledCards, ...newCards];
  } else {
    // sth was changed
    updatedCards = shuffledCards
      .map((sc) => {
        return cards.find((c) => c._id === sc._id);
      })
      .filter(Boolean) as Card[];
  }

  return updatedCards;
};

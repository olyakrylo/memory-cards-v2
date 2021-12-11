import { Card } from "./types";

export const DefaultCards: {
  [key in "start" | "empty"]: { [key: string]: Card[] };
} = {
  start: {
    ru: [
      {
        _id: "",
        question: "Что делать?",
        answer: "Выбрать тему или создать новую!",
        topic_id: "",
      },
    ],
    en: [
      {
        _id: "",
        question: "What to do?",
        answer: "Choose topic or create one!",
        topic_id: "",
      },
    ],
  },
  empty: {
    ru: [
      {
        _id: "",
        question: "Нет карточек :( Что делать?",
        answer: "Создать первую карточку!",
        topic_id: "",
      },
    ],
    en: [
      {
        _id: "",
        question: "No cards :( What to do?",
        answer: "Create the first card!",
        topic_id: "",
      },
    ],
  },
};

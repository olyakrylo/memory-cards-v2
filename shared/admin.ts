import { Card } from "./models";

export const ADMIN_DATA_LIMIT = 12;

export interface AdminTabData<T> {
  count: number;
  data: T[];
}

export type CardWithTopicTitle = Card & { topic_title: string };

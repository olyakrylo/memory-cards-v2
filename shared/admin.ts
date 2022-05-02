import { Card } from "./models";

export const ADMIN_DATA_LIMIT = 12;

export interface AdminTabData<T> {
  count: number;
  data: T[];
}

export type AdminCard = Card & { topic_title: string };

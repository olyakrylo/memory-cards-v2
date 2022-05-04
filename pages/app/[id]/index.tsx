import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

import { Card } from "../../../shared/models";

const Topics = dynamic(() => import("../../../components/topics"));
const Cards = dynamic(() => import("../../../components/cards"));

type TopicCardsProps = {
  cards: Card[];
};

const TopicCards = ({ cards }: TopicCardsProps) => {
  return (
    <>
      <Topics />

      <Cards cards={cards} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!query.id) {
    return { props: { cards: [] } };
  }

  if (process.env.NODE_ENV !== "production") {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  }

  const url = `https://${req.headers.host}/api/cards/by_topic?topic_id=${query.id}`;
  const response = await fetch(url);
  const cards = await response.json();
  return { props: { cards } };
};

export default TopicCards;

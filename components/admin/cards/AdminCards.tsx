import { Divider, Typography } from "@mui/material";

import { request } from "../../../utils/request";
import AppImage from "../../image";
import { Card, UpdatedResult } from "../../../utils/types";
import { AdminData } from "../AdminData";

type AdminCardsProps = {
  count: number;
  cards: (Card & { topic_title: string })[];
};

export const AdminCards = ({ cards, count }: AdminCardsProps) => {
  const deleteCards = (selectedIds: string[]): Promise<UpdatedResult> => {
    return request("cards", "", "delete", {
      query: { ids: selectedIds },
    });
  };

  const cardTitle = (card: Card & { topic_title: string }): string => {
    return card.topic_title;
  };

  const cardContent = (card: Card): JSX.Element => {
    return (
      <>
        <code>Topic: {card.topic_id}</code>
        <br />
        <code>Card: {card._id}</code>
      </>
    );
  };

  const cardCollapse = (card: Card): JSX.Element => {
    return (
      <>
        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Question
        </Typography>
        <Typography>{card.question.text}</Typography>
        {card.question.image && (
          <AppImage src={card.question.image} alt={""} maxHeight={"150px"} />
        )}

        <Divider style={{ margin: "16px 0" }} />

        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Answer
        </Typography>
        <Typography>{card.answer.text}</Typography>
        {card.answer.image && (
          <AppImage src={card.answer.image} alt={""} maxHeight={"150px"} />
        )}
      </>
    );
  };

  return (
    <AdminData
      count={count}
      deleteFunc={deleteCards}
      data={cards}
      itemTitle={cardTitle}
      itemContent={cardContent}
      itemCollapse={cardCollapse}
      selectable
    />
  );
};

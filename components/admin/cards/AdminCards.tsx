import { Divider, Typography } from "@mui/material";

import { request } from "../../../utils/request";
import AppImage from "../../image";
import { AdminCard, AdminTabData } from "../../../shared/admin";
import { UpdatedResult } from "../../../shared/api";
import { AdminData } from "../AdminData";

type AdminCardsProps = AdminTabData<AdminCard>;

export const AdminCards = ({ data, count }: AdminCardsProps) => {
  const deleteCards = (selectedIds: string[]): Promise<UpdatedResult> => {
    return request("cards", "", "delete", {
      query: { ids: selectedIds },
    });
  };

  const cardTitle = (card: AdminCard): string => {
    return card.topic_title;
  };

  const cardContent = (card: AdminCard): JSX.Element => {
    return (
      <>
        <code>Topic: {card.topic_id}</code>
        <br />
        <code>Card: {card._id}</code>
      </>
    );
  };

  const cardCollapse = (card: AdminCard): JSX.Element => {
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
      data={data}
      itemTitle={cardTitle}
      itemContent={cardContent}
      itemCollapse={cardCollapse}
      selectable
    />
  );
};

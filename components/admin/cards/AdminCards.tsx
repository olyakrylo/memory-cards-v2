import { Divider, Typography } from "@mui/material";

import AppImage from "../../image";
import { CardWithTopicTitle, AdminTabData } from "../../../shared/admin";
import { UpdatedResult } from "../../../shared/api";
import { AdminView } from "../view/AdminView";
import { useCards } from "../../../hooks";
import styles from "./AdminCards.module.css";

type AdminCardsProps = AdminTabData<CardWithTopicTitle>;

export const AdminCards = ({ data, count }: AdminCardsProps) => {
  const cards = useCards();

  const deleteCards = (selectedIds: string[]): Promise<UpdatedResult> => {
    return cards.deleteMany(selectedIds);
  };

  const cardTitle = (card: CardWithTopicTitle): string => {
    return card.topic_title;
  };

  const cardContent = (card: CardWithTopicTitle): JSX.Element => {
    return (
      <>
        <code>Topic: {card.topic_id}</code>
        <br />
        <code>Card: {card._id}</code>
      </>
    );
  };

  const cardCollapse = (card: CardWithTopicTitle): JSX.Element => {
    return (
      <>
        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Question
        </Typography>
        <Typography>{card.question.text}</Typography>
        {card.question.image && (
          <div className={styles.image}>
            <AppImage src={card.question.image} alt={""} />
          </div>
        )}

        <Divider style={{ margin: "16px 0" }} />

        <Typography fontWeight={500} color={"primary"} gutterBottom>
          Answer
        </Typography>
        <Typography>{card.answer.text}</Typography>
        {card.answer.image && (
          <div className={styles.image}>
            <AppImage src={card.answer.image} alt={""} />
          </div>
        )}
      </>
    );
  };

  return (
    <AdminView
      count={count}
      deleteFunc={deleteCards}
      data={data}
      itemTitle={cardTitle}
      itemContent={cardContent}
      itemCollapse={cardCollapse}
    />
  );
};

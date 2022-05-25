import { Button, Divider, Typography } from "@mui/material";

import AppImage from "../../image";
import {
  CardWithTopicTitle,
  AdminTabData,
  ADMIN_DATA_LIMIT,
} from "../../../shared/admin";
import { UpdatedResult } from "../../../shared/api";
import { AdminView } from "../view/AdminView";
import { useCards } from "../../../hooks";
import styles from "./AdminCards.module.css";
import { useRouter } from "next/router";

type AdminCardsProps = AdminTabData<CardWithTopicTitle>;

export const AdminCards = ({ data, count }: AdminCardsProps) => {
  const cards = useCards();
  const router = useRouter();

  const deleteCards = (selectedIds: string[]): Promise<UpdatedResult> => {
    return cards.deleteMany(selectedIds);
  };

  const deleteUnusedCards = async (): Promise<void> => {
    await cards.deleteUnused();
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, skip: 0, limit: ADMIN_DATA_LIMIT },
    });
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
      footer={
        <Button
          variant={"outlined"}
          color={"secondary"}
          onClick={deleteUnusedCards}
        >
          Remove all unused cards
        </Button>
      }
    />
  );
};

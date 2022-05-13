import { BaseSyntheticEvent, useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import styles from "../Cards.module.css";
import { ShortCard } from "../../../shared/models";
import CardControl from "../control";
import { useCards } from "../../../hooks";

export const AddCard = () => {
  const cards = useCards();
  const { t } = useTranslation();

  const [newCardOpen, setNewCardOpen] = useState<boolean>(false);

  const openNewCardDialog = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    setNewCardOpen(true);
  };

  const onCloseNewCardDialog = async (
    data?: ShortCard,
    cardsFromFile?: ShortCard[]
  ) => {
    setNewCardOpen(false);
    if (!data) return;

    const cardsData = cardsFromFile ?? [];
    if (
      data.question.text ||
      data.question.image ||
      data.answer.text ||
      data.answer.image
    ) {
      cardsData.unshift(data);
    }

    await cards.addCards(cardsData);
  };

  return (
    <>
      <Tooltip title={t("tip.new_card") ?? ""}>
        <IconButton
          classes={{ root: styles.control__add }}
          onClick={openNewCardDialog}
        >
          <AddRounded />
        </IconButton>
      </Tooltip>
      <CardControl open={newCardOpen} onClose={onCloseNewCardDialog} />
    </>
  );
};

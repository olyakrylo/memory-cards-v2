import { connect } from "react-redux";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";

import { Card, State, Topic } from "../../utils/types";
import { flip } from "../../utils/flip";
import { DefaultCards } from "../../utils/default-cards";
import { request } from "../../middleware";
import styles from "./Cards.module.css";
import CardControl from "./control/";

type CardProps = {
  currentTopic?: Topic;
};

export const Cards = ({ currentTopic }: CardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [inverted, setInverted] = useState<boolean>(false);
  const [newCardOpen, setNewCardOpen] = useState<boolean>(false);
  const [showArrows, setShowArrows] = useState<boolean>(true);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<Splide>(null);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleKeyup = (event: any) => {
      if (event.key !== "Enter" || event.target.tagName !== "BODY") {
        return;
      }
      const index = sliderRef.current?.splide?.index;
      if (typeof index !== "number") return;
      const ref = cardsRef.current[index];
      if (!ref) return;
      flip(ref, 200, () => setInverted(!inverted));
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [inverted]);

  useEffect(() => {
    if (!currentTopic) {
      setCards(DefaultCards.start[i18n.language] ?? []);
      return;
    }

    setLoading(true);
    request<Card[]>("post", "cards/by_topic", {
      topic_id: currentTopic._id,
    }).then((cards) => {
      if (cards.length) {
        setCards(cards);
      } else {
        setCards(DefaultCards.empty[i18n.language] ?? []);
      }
      setLoading(false);
    });
  }, [currentTopic, i18n]);

  const toggleCard = (event: any) => {
    const card = event.target as HTMLDivElement;
    flip(card, 200, () => setInverted(!inverted));
  };

  const resetCards = () => {
    setInverted(false);
  };

  const openNewCardDialog = () => {
    setNewCardOpen(true);
  };

  const closeNewCardDialog = async (question: string, answer: string) => {
    setNewCardOpen(false);
    if (!question || !answer || !currentTopic) return;
    setLoading(true);
    const newCard = await request<Card>("post", "cards", {
      question,
      answer,
      topic_id: currentTopic?._id,
    });
    if (newCard) {
      setCards([...cards.filter((c) => !!c._id), newCard]);
    }
    setLoading(false);
  };

  const deleteCard = async (e: any, id: string) => {
    e.stopPropagation();
    await request("delete", `cards/${id}`);
    const updatedCards = cards.filter((c) => c._id !== id);
    setCards(
      updatedCards.length
        ? updatedCards
        : DefaultCards.empty[i18n.language] ?? []
    );
  };

  return (
    <div>
      <div className={styles.control}>
        {currentTopic && (
          <IconButton
            className={styles.control__add}
            onClick={() => openNewCardDialog()}
          >
            <AddRoundedIcon />
          </IconButton>
        )}

        <CardControl open={newCardOpen} onClose={closeNewCardDialog} />
      </div>

      {loading && <CircularProgress className={styles.loader} />}

      {!loading && (
        <Splide
          ref={sliderRef}
          onMove={resetCards}
          className={styles.slider}
          options={{
            height: 400,
            arrows: showArrows,
          }}
        >
          {cards.map((card, i) => (
            <SplideSlide key={card._id}>
              <div
                ref={(el) => (cardsRef.current[i] = el)}
                className={`${styles.card} ${showArrows && styles.card_arrows}`}
                onClick={toggleCard}
              >
                {inverted ? card.answer : card.question}

                {card._id && (
                  <IconButton
                    className={styles.card__del}
                    color="secondary"
                    onClick={(e) => deleteCard(e, card._id)}
                  >
                    <DeleteTwoToneIcon />
                  </IconButton>
                )}
              </div>
            </SplideSlide>
          ))}
        </Splide>
      )}

      <FormGroup className={styles.arrowControl}>
        <FormControlLabel
          control={
            <Switch
              onChange={() => setShowArrows(!showArrows)}
              checked={showArrows}
            />
          }
          label={t("ui.show_arrows") as string}
        />
      </FormGroup>
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    currentTopic: state.main.currentTopic,
  };
};

export default connect(mapStateToProps)(Cards);

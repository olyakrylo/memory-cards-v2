import { connect } from "react-redux";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import {
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";
import arrayShuffle from "array-shuffle";

import { Card, State, Topic, User } from "../../utils/types";
import { flip } from "../../utils/flip";
import { request } from "../../utils/request";
import styles from "./Cards.module.css";
import EditCard from "./edit";
import AddCard from "./add";

type CardProps = {
  user: User;
  currentTopic?: Topic;
};

export const Cards = ({ currentTopic, user }: CardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [inverted, setInverted] = useState<boolean>(false);
  const [showArrows, setShowArrows] = useState<boolean>(true);
  const [shuffledCards, setShuffledCards] = useState<Card[] | null>(null);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<Splide>(null);

  const { i18n, t } = useTranslation();

  const canEditTopic = () => {
    return currentTopic?.author_id === user._id;
  };

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
      return;
    }

    setLoading(true);
    request<Card[]>("post", "cards/by_topic", {
      topic_id: currentTopic._id,
    }).then((cards) => {
      setCards(cards);
      setInverted(false);
      setLoading(false);
    });
  }, [currentTopic, i18n]);

  const toggleCard = (event: BaseSyntheticEvent) => {
    const card = event.currentTarget as HTMLDivElement;
    flip(card, 200, () => setInverted(!inverted));
  };

  const resetCards = () => {
    setInverted(false);
  };

  const addCards = (newCards: Card[]): void => {
    setCards([...cards, ...newCards]);
    if (shuffledCards) {
      setShuffledCards([...shuffledCards, ...newCards]);
    }
  };

  const updateCard = (updatedCard: Card): void => {
    setCards(
      cards.map((c) => {
        if (c._id === updatedCard._id) return updatedCard;
        return c;
      })
    );
    if (shuffledCards) {
      setShuffledCards(
        shuffledCards.map((c) => {
          if (c._id === updatedCard._id) return updatedCard;
          return c;
        })
      );
    }
  };

  const deleteCard = async (e: any, id: string) => {
    e.stopPropagation();
    await request("delete", `cards/${id}`);
    const updatedCards = cards.filter((c) => c._id !== id);
    setCards(updatedCards);
    if (shuffledCards) {
      setShuffledCards(shuffledCards.filter((c) => c._id !== id));
    }
  };

  const toggleShuffle = () => {
    if (shuffledCards) {
      setShuffledCards(null);
    } else {
      setShuffledCards(arrayShuffle(cards));
    }
  };

  return (
    <div>
      {currentTopic && (
        <div className={styles.control}>
          <IconButton
            onClick={toggleShuffle}
            className={styles.shuffle}
            aria-checked={!!shuffledCards}
            aria-hidden={!cards.length}
          >
            <ShuffleRoundedIcon />
          </IconButton>

          {canEditTopic() && (
            <AddCard
              currentTopic={currentTopic}
              setLoading={setLoading}
              addCards={addCards}
            />
          )}
        </div>
      )}

      {loading && <CircularProgress className={styles.loader} />}

      {!loading && !currentTopic && (
        <div className={styles.tip}>
          <ArrowCircleDownRoundedIcon className={styles.tip__icon_topics} />
          {t("ui.choose_topic")}
        </div>
      )}

      {!loading && !!currentTopic && canEditTopic() && !cards.length && (
        <div className={styles.tip}>
          {t("ui.add_first_card")}{" "}
          <ArrowCircleDownRoundedIcon className={styles.tip__icon_add} />
        </div>
      )}

      {!loading && !!cards.length && (
        <Splide
          ref={sliderRef}
          onMove={resetCards}
          className={styles.slider}
          options={{
            height: 400,
            arrows: showArrows,
            classes: {
              arrow: `splide__arrow ${styles.arrow}`,
            },
          }}
        >
          {(shuffledCards ?? cards).map((card, i) => (
            <SplideSlide key={card._id}>
              <div
                ref={(el) => (cardsRef.current[i] = el)}
                className={`${styles.card} ${showArrows && styles.card_arrows}`}
                onClick={toggleCard}
              >
                <Typography className={styles.card__text}>
                  {inverted ? card.answer : card.question}
                </Typography>

                {card._id && canEditTopic() && (
                  <IconButton
                    className={styles.card__del}
                    color="secondary"
                    onClick={(e) => deleteCard(e, card._id)}
                  >
                    <DeleteTwoToneIcon />
                  </IconButton>
                )}

                {card._id && canEditTopic() && (
                  <EditCard
                    card={card}
                    setLoading={setLoading}
                    updateCard={updateCard}
                  />
                )}
              </div>
            </SplideSlide>
          ))}
        </Splide>
      )}

      {!loading && !!cards.length && (
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
      )}
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user as User,
    currentTopic: state.main.currentTopic,
  };
};

export default connect(mapStateToProps)(Cards);

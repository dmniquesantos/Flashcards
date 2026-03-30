import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Deck = {
  id: number;
  name: string;
};

export type CardItem = {
  id: number;
  deckId: number;
  question: string;
  answer: string;
};

type FlashcardsContextType = {
  decks: Deck[];
  cards: CardItem[];
  selectedDeckId: number;
  setSelectedDeckId: (id: number) => void;
  addCard: (question: string, answer: string, deckId: number, newDeckName?: string) => void;
  editCard: (id: number, question: string, answer: string) => void;
  deleteCard: (id: number) => void;
  deleteDeck: (id: number) => void;
  cardsForDeck: (deckId: number) => CardItem[];
};

const initialDecks: Deck[] = [
  { id: 1, name: "Biologia" },
  { id: 2, name: "História" },
  { id: 3, name: "Inglês" },
];

const initialCards: CardItem[] = [
  { id: 1, deckId: 1, question: "O que é mitose?", answer: "Divisão celular que gera duas células-filhas geneticamente iguais." },
  { id: 2, deckId: 1, question: "O que é fotossíntese?", answer: "Processo em que a planta produz seu alimento usando luz, água e gás carbônico." },
  { id: 3, deckId: 2, question: "Quando começou a Revolução Francesa?", answer: "Em 1789." },
  { id: 4, deckId: 3, question: "What is the past of go?", answer: "Went." },
];

const FlashcardsContext = createContext<FlashcardsContextType | null>(null);

export function FlashcardsProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [selectedDeckId, setSelectedDeckId] = useState<number>(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const savedDecks = await AsyncStorage.getItem("flashapp-decks");
        const savedCards = await AsyncStorage.getItem("flashapp-cards");
        if (savedDecks) setDecks(JSON.parse(savedDecks));
        if (savedCards) setCards(JSON.parse(savedCards));
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("flashapp-decks", JSON.stringify(decks));
  }, [decks, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("flashapp-cards", JSON.stringify(cards));
  }, [cards, loaded]);

  const cardsForDeck = useMemo(
    () => (deckId: number) => cards.filter((c) => c.deckId === deckId),
    [cards]
  );

  function addCard(question: string, answer: string, deckId: number, newDeckName?: string) {
    let finalDeckId = deckId;
    if (newDeckName?.trim()) {
      const existing = decks.find((d) => d.name.toLowerCase() === newDeckName.trim().toLowerCase());
      if (existing) {
        finalDeckId = existing.id;
      } else {
        const newDeck: Deck = { id: Date.now(), name: newDeckName.trim() };
        setDecks((prev) => [...prev, newDeck]);
        finalDeckId = newDeck.id;
        setSelectedDeckId(newDeck.id);
      }
    }
    const newCard: CardItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      deckId: finalDeckId,
      question: question.trim(),
      answer: answer.trim(),
    };
    setCards((prev) => [...prev, newCard]);
  }

  function editCard(id: number, question: string, answer: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, question: question.trim(), answer: answer.trim() } : c))
    );
  }

  function deleteCard(id: number) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function deleteDeck(id: number) {
    setDecks((prev) => prev.filter((d) => d.id !== id));
    setCards((prev) => prev.filter((c) => c.deckId !== id));
    if (selectedDeckId === id) {
      const remaining = decks.filter((d) => d.id !== id);
      if (remaining.length > 0) setSelectedDeckId(remaining[0].id);
    }
  }

  return (
    <FlashcardsContext.Provider
      value={{ decks, cards, selectedDeckId, setSelectedDeckId, addCard, editCard, deleteCard, deleteDeck, cardsForDeck }}
    >
      {children}
    </FlashcardsContext.Provider>
  );
}

export function useFlashcards() {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error("useFlashcards must be used within FlashcardsProvider");
  return ctx;
}

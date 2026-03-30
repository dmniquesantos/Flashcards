import { BookOpen, CheckCircle2, Plus, Sparkles, Zap } from "lucide-react-native";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useFlashcards } from "@/context/FlashcardsContext";

type Props = {
  onStartReview: (deckId: number) => void;
  onCreateCard: () => void;
};

export default function DashboardPanel({ onStartReview, onCreateCard }: Props) {
  const { decks, cards } = useFlashcards();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const totalCards = cards.length;
  const totalDecks = decks.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Painel de Estudos</Text>
          <Text style={styles.pageSubtitle}>Bom estudo hoje, Dominique!</Text>
        </View>
        <TouchableOpacity onPress={onCreateCard} style={styles.createBtn} activeOpacity={0.85}>
          <Plus size={16} color="#fff" />
          <Text style={styles.createBtnText}>Novo card</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <LinearGradient
          colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.statCardGradient]}
        >
          <View style={styles.statIcon}>
            <BookOpen size={20} color="#fff" />
          </View>
          <Text style={styles.statNumWhite}>{totalDecks}</Text>
          <Text style={styles.statLabelWhite}>Matérias</Text>
        </LinearGradient>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.accent }]}>
            <Sparkles size={20} color={Colors.primary} />
          </View>
          <Text style={styles.statNum}>{totalCards}</Text>
          <Text style={styles.statLabel}>Cards salvos</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#e8f8ef" }]}>
            <CheckCircle2 size={20} color={Colors.success} />
          </View>
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLabel}>Revisados hoje</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas matérias</Text>
        </View>

        <View style={styles.deckGrid}>
          {decks.map((deck) => {
            const deckCards = cards.filter((c) => c.deckId === deck.id);
            return (
              <TouchableOpacity
                key={deck.id}
                onPress={() => onStartReview(deck.id)}
                style={styles.deckCard}
                activeOpacity={0.8}
              >
                <View style={styles.deckCardTop}>
                  <View style={styles.deckIcon}>
                    <BookOpen size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.deckCardCount}>{deckCards.length} cards</Text>
                </View>
                <Text style={styles.deckCardName}>{deck.name}</Text>
                <TouchableOpacity
                  onPress={() => onStartReview(deck.id)}
                  style={styles.studyBtn}
                  activeOpacity={0.8}
                >
                  <Zap size={13} color={Colors.primary} />
                  <Text style={styles.studyBtnText}>Estudar agora</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={onCreateCard}
            style={[styles.deckCard, styles.deckCardAdd]}
            activeOpacity={0.7}
          >
            <View style={[styles.deckIcon, { backgroundColor: Colors.background }]}>
              <Plus size={18} color={Colors.textMuted} />
            </View>
            <Text style={styles.deckCardAddText}>Nova matéria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards recentes</Text>
          <View style={styles.recentList}>
            {cards.slice(-4).reverse().map((card) => {
              const deck = decks.find((d) => d.id === card.deckId);
              return (
                <View key={card.id} style={styles.recentItem}>
                  <View style={styles.recentDot} />
                  <View style={styles.recentContent}>
                    <Text style={styles.recentQuestion} numberOfLines={1}>{card.question}</Text>
                    <Text style={styles.recentDeck}>{deck?.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 28,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#735aaa",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    gap: 8,
  },
  statCardGradient: {
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.25,
  },
  statIcon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statNum: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textHeader,
  },
  statNumWhite: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  statLabelWhite: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  addBtn: {
    height: 30,
    width: 30,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  deckCard: {
    width: "31%",
    minWidth: 160,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#735aaa",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
    gap: 10,
  },
  deckCardAdd: {
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  deckCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deckIcon: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deckCardCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  deckCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textDark,
  },
  deckCardAddText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
    marginTop: 8,
  },
  studyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  studyBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  recentList: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#735aaa",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
  },
  recentContent: {
    flex: 1,
  },
  recentQuestion: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textDark,
  },
  recentDeck: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
});

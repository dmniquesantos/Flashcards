import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  Sparkles,
  Trash2,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useFlashcards } from "@/context/FlashcardsContext";
import { Section } from "@/types/navigation";

type Props = {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  onStartReview: (deckId: number) => void;
  reviewDeckId: number;
};

export default function Sidebar({ activeSection, onNavigate, onStartReview, reviewDeckId }: Props) {
  const { decks, cards, deleteDeck } = useFlashcards();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleDeleteDeck(id: number, name: string) {
    if (Platform.OS === "web") {
      if (window.confirm(`Excluir a matéria "${name}" e todos os seus cards?`)) {
        deleteDeck(id);
      }
    } else {
      Alert.alert(
        "Excluir matéria",
        `Tem certeza que quer excluir "${name}" e todos os seus cards?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: () => deleteDeck(id) },
        ]
      );
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <LinearGradient
        colors={[Colors.primaryGradientStart, Colors.primaryGradientMid, Colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.headerRow}>
          <View style={styles.logoArea}>
            <Sparkles size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.appName}>FlashCards</Text>
          </View>
        </View>
        <View style={styles.userRow}>
          <View style={styles.avatarBtn}>
            <User size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.greeting}>Dominique</Text>
            <Text style={styles.greetingSub}>Bom estudo hoje!</Text>
          </View>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.headerStatPill}>
            <Text style={styles.headerStatNum}>{decks.length}</Text>
            <Text style={styles.headerStatLabel}>matérias</Text>
          </View>
          <View style={styles.headerStatPill}>
            <Text style={styles.headerStatNum}>{cards.length}</Text>
            <Text style={styles.headerStatLabel}>cards</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.deckSection}>
        <View style={styles.deckSectionHeader}>
          <Text style={styles.deckSectionTitle}>MATÉRIAS</Text>
          <TouchableOpacity
            onPress={() => onNavigate("create")}
            style={styles.addDeckBtn}
            activeOpacity={0.7}
          >
            <Plus size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.deckList}>
          {decks.map((deck) => {
            const total = cards.filter((c) => c.deckId === deck.id).length;
            const isActive = activeSection === "review" && reviewDeckId === deck.id;
            return (
              <View key={deck.id} style={[styles.deckItem, isActive && styles.deckItemActive]}>
                <TouchableOpacity
                  style={styles.deckItemContent}
                  onPress={() => onStartReview(deck.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.deckName, isActive && styles.deckNameActive]} numberOfLines={1}>
                    {deck.name}
                  </Text>
                  <Text style={styles.deckCount}>{total} cards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteDeck(deck.id, deck.name)}
                  style={styles.deleteDeckBtn}
                  activeOpacity={0.7}
                >
                  <Trash2 size={14} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: Colors.card,
    borderRightWidth: 1,
    borderRightColor: Colors.cardBorder,
    flexDirection: "column",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  circle1: {
    position: "absolute",
    right: -20,
    top: 20,
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  circle2: {
    position: "absolute",
    left: 20,
    bottom: -30,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appName: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  avatarBtn: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  greeting: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  greetingSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    marginTop: 1,
  },
  headerStats: {
    flexDirection: "row",
    gap: 8,
  },
  headerStatPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  headerStatNum: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 1,
  },
  deckSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  deckSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  deckSectionTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addDeckBtn: {
    height: 24,
    width: 24,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deckList: {
    flex: 1,
  },
  deckItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 4,
    paddingLeft: 4,
  },
  deckItemActive: {
    backgroundColor: Colors.accent,
  },
  deckItemContent: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
  },
  deckName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textDark,
  },
  deckNameActive: {
    color: Colors.primary,
  },
  deckCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  deleteDeckBtn: {
    padding: 10,
  },
});

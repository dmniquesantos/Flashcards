import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { FlashcardsProvider } from "@/context/FlashcardsContext";
import Sidebar from "@/components/Sidebar";
import DashboardPanel from "@/screens/DashboardPanel";
import ReviewPanel from "@/screens/ReviewPanel";
import CreatePanel from "@/screens/CreatePanel";
import Colors from "@/constants/colors";

import { Section } from "@/types/navigation";

export default function App() {
  const [section, setSection] = useState<Section>("home");
  const [reviewDeckId, setReviewDeckId] = useState<number>(1);

  function handleStartReview(deckId: number) {
    setReviewDeckId(deckId);
    setSection("review");
  }

  return (
    <FlashcardsProvider>
      <View style={styles.root}>
        <Sidebar
          activeSection={section}
          onNavigate={setSection}
          onStartReview={handleStartReview}
          reviewDeckId={reviewDeckId}
        />
        <View style={styles.content}>
          {section === "home" && (
            <DashboardPanel
              onStartReview={handleStartReview}
              onCreateCard={() => setSection("create")}
            />
          )}
          {section === "review" && (
            <ReviewPanel
              deckId={reviewDeckId}
              onBack={() => setSection("home")}
              onCreateCard={() => setSection("create")}
            />
          )}
          {section === "create" && (
            <CreatePanel onDone={() => setSection("home")} />
          )}
        </View>
      </View>
    </FlashcardsProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

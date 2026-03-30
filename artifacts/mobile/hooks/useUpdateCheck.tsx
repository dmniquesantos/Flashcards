import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export function useUpdateCheck() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    if (!__DEV__) {
      try {
        setIsChecking(true);
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          // Atualização disponível
          Alert.alert(
            "Atualização disponível",
            "Uma nova versão do app está disponível. Deseja atualizar agora?",
            [
              {
                text: "Depois",
                onPress: () => setIsChecking(false),
              },
              {
                text: "Atualizar",
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                },
              },
            ]
          );
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Erro ao verificar atualização:", error);
        setIsChecking(false);
      }
    }
  }

  return { isChecking, checkForUpdates };
}

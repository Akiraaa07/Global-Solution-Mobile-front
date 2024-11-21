import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  TextArea,
  ScrollView,
  Center,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AdicionarFeedbackScreen: React.FC = () => {
  const [comentario, setComentario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!comentario.trim()) {
      alert("Por favor, preencha o campo de feedback.");
      return;
    }

    setCarregando(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("usuario_id");

      if (!token || !usuarioId) {
        alert("Erro: Usuário não autenticado!");
        setCarregando(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          mensagem: comentario,
        }),
      });

      if (response.ok) {
        alert("Feedback registrado com sucesso!");
        setComentario("");
        navigation.goBack();
      } else if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        navigation.navigate("LoginScreen");
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao registrar feedback: ${errorData.error || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao registrar feedback. Verifique sua conexão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView bg="white">
      <Box p={6} safeArea>
        <VStack space={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Registrar Feedback
          </Text>

          <Text fontSize="md" color="gray.600">
            Por favor, compartilhe sua experiência com o aplicativo:
          </Text>

          <TextArea
            value={comentario}
            onChangeText={setComentario}
            placeholder="Escreva seu comentário aqui..."
            h={24}
            bg="gray.100"
            borderColor="gray.300"
            borderRadius={8}
            _focus={{ borderColor: "blue.600" }}
            p={4}
            fontSize="md"
          />

          <Center>
            <Button
              onPress={handleSubmit}
              bg="blue.600"
              _pressed={{ bg: "#2A1761" }}
              isDisabled={carregando || !comentario.trim()}
              isLoading={carregando}
              size="lg"
              width="80%"
              mt={6}
              borderRadius={8}
            >
              Registrar Feedback
            </Button>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default AdicionarFeedbackScreen;
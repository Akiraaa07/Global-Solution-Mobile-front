import React, { useState } from "react";
import { Box, Text, TextArea, Button, VStack } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEstadoGlobal } from "../hooks/ContextoEstadoGlobal";

const AdicionarFeedback = () => {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { adicionarFeedback } = useEstadoGlobal(); 

  const handleEnviarFeedback = async () => {
    if (mensagem.trim() === "") {
      alert("Por favor, escreva um feedback.");
      return;
    }

    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Token não encontrado. Por favor, faça login novamente.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensagem }), 
      });

      if (response.ok) {
        const feedback = await response.json();
        adicionarFeedback(feedback.usuario, feedback.mensagem);

        alert("Feedback enviado com sucesso!");
        setMensagem("");
      } else {
        alert("Erro ao enviar feedback. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box p={5}>
      <VStack space={4}>
        <Text fontSize="lg" fontWeight="bold">
          Enviar Feedback
        </Text>
        <TextArea
          placeholder="Escreva seu feedback"
          value={mensagem}
          onChangeText={setMensagem}
        />
        <Button
          onPress={handleEnviarFeedback}
          isLoading={carregando}
          isLoadingText="Enviando..."
        >
          Enviar
        </Button>
      </VStack>
    </Box>
  );
};

export default AdicionarFeedback;
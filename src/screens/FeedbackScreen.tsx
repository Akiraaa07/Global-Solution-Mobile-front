import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, Spinner, Center, Toast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeedbackItem from "../components/FeedbackItem";

interface Feedback {
  feedback_id: number;
  mensagem: string;
  data_feedback: string;
}

const FeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        } else {
          console.error("Erro ao buscar feedbacks:", await response.json());
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFeedbacks((prev) => prev.filter((feedback) => feedback.feedback_id !== id));
        Toast.show({
          description: "Feedback excluído com sucesso!",
          bgColor: "green.500",
        });
      } else {
        console.error("Erro ao excluir feedback:", await response.json());
        Toast.show({
          description: "Erro ao excluir feedback.",
          bgColor: "red.500",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir feedback:", error);
      Toast.show({
        description: "Erro ao se comunicar com o servidor.",
        bgColor: "red.500",
      });
    }
  };

  const handleUpdate = async (id: number, novoComentario: string) => {
    // Verificação se o comentário está vazio
    if (!novoComentario.trim()) {
      Toast.show({
        description: "A mensagem do feedback não pode estar vazia.",
        bgColor: "red.500",
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/feedback/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensagem: novoComentario }), // Alinhei o campo para 'mensagem'
      });

      if (response.ok) {
        setFeedbacks((prev) =>
          prev.map((feedback) =>
            feedback.feedback_id === id ? { ...feedback, mensagem: novoComentario } : feedback
          )
        );
        Toast.show({
          description: "Feedback atualizado com sucesso!",
          bgColor: "green.500",
        });
      } else {
        const errorResponse = await response.json();
        console.error("Erro ao atualizar feedback:", errorResponse);
        Toast.show({
          description: `Erro ao atualizar feedback: ${errorResponse.error}`,
          bgColor: "red.500",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar feedback:", error);
      Toast.show({
        description: "Erro ao se comunicar com o servidor.",
        bgColor: "red.500",
      });
    }
  };

  if (loading) {
    return (
      <Center flex={1} bg="gray.50">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={4} flex={1} bg="gray.50">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        Feedbacks Recebidos
      </Text>

      {feedbacks.length === 0 ? (
        <Center flex={1}>
          <Text color="gray.500" fontSize="lg">
            Nenhum feedback encontrado.
          </Text>
        </Center>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={({ item }) => (
            <FeedbackItem
              id={item.feedback_id}
              comentario={item.mensagem}
              data={item.data_feedback}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
          keyExtractor={(item) => item.feedback_id.toString()}
        />
      )}
    </Box>
  );
};

export default FeedbackScreen;
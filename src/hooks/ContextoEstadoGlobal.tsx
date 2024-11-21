import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Feedback {
  id: number;
  usuario: string;
  mensagem: string;
  data: string;
}

interface ContextoEstadoGlobal {
  feedbacks: Feedback[];
  carregarFeedbacks: () => void;
  adicionarFeedback: (usuario: string, mensagem: string) => Promise<void>;
  editarFeedback: (id: number, novoComentario: string) => Promise<void>;
  excluirFeedback: (id: number) => Promise<void>;
  carregando: boolean;
}

const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  feedbacks: [],
  carregarFeedbacks: () => {},
  adicionarFeedback: async () => {},
  editarFeedback: async () => {},
  excluirFeedback: async () => {},
  carregando: false,
});

export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarFeedbacks = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch("http://localhost:3000/api/feedbacks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar feedbacks");
      }

      const dados = await response.json();
      setFeedbacks(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarFeedback = async (usuario: string, mensagem: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await fetch("http://localhost:3000/api/feedbacks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, mensagem }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar feedback");
      }

      const novoFeedback: Feedback = await response.json();
      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, novoFeedback]);
    } catch (error) {
      console.error(error);
    }
  };

  const editarFeedback = async (id: number, novoComentario: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await fetch(
        `http://localhost:3000/api/feedbacks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comentario: novoComentario }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar feedback");
      }

      const updatedFeedback = await response.json();
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === id ? updatedFeedback : feedback
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const excluirFeedback = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await fetch(
        `http://localhost:3000/api/feedbacks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir feedback");
      }

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const carregarFeedbacksLocal = async () => {
      try {
        const feedbacksArmazenados = await AsyncStorage.getItem("feedbacks");
        if (feedbacksArmazenados) {
          setFeedbacks(JSON.parse(feedbacksArmazenados));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    carregarFeedbacksLocal();
  }, []);

  useEffect(() => {
    const salvarFeedbacks = async () => {
      try {
        await AsyncStorage.setItem("feedbacks", JSON.stringify(feedbacks));
      } catch (error) {
        console.error(error);
      }
    };
    salvarFeedbacks();
  }, [feedbacks]);

  return (
    <ContextoEstadoGlobal.Provider
      value={{
        feedbacks,
        carregarFeedbacks,
        adicionarFeedback,
        editarFeedback,
        excluirFeedback,
        carregando,
      }}
    >
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
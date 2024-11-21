import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  ScrollView,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AparelhosScreen: React.FC = () => {
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [horasUso, setHorasUso] = useState("");

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/aparelhos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          potencia: parseInt(potencia),
          horas_uso: parseInt(horasUso),
        }),
      });

      if (response.ok) {
        alert("Aparelho cadastrado com sucesso!");
        setNome("");
        setPotencia("");
        setHorasUso("");
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao cadastrar aparelho: ${
            errorData.error || "Erro desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao cadastrar aparelho:", error);
      alert("Erro ao cadastrar aparelho");
    }
  };

  return (
    <ScrollView bg="gray.50">
      <Box p={5}>
        <VStack space={5} alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={5}>
            Cadastrar Aparelho
          </Text>

          <Input
            placeholder="Nome do Aparelho"
            value={nome}
            onChangeText={setNome}
            bg="white"
            borderColor="gray.300"
            borderRadius="md"
            p={3}
            w="80%"
          />

          <Input
            placeholder="Potência (W)"
            value={potencia}
            onChangeText={setPotencia}
            keyboardType="numeric"
            bg="white"
            borderColor="gray.300"
            borderRadius="md"
            p={3}
            w="80%"
          />

          <Input
            placeholder="Horas de Uso por Dia"
            value={horasUso}
            onChangeText={setHorasUso}
            keyboardType="numeric"
            bg="white"
            borderColor="gray.300"
            borderRadius="md"
            p={3}
            w="80%"
          />

          <Button
            onPress={handleSubmit}
            bg="blue.600"
            _pressed={{ bg: "blue.700" }}
            isDisabled={!nome || !potencia || !horasUso}
            w="80%"
            mt={5}
          >
            Cadastrar
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default AparelhosScreen;
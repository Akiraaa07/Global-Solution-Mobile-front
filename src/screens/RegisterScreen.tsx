import React, { useState } from "react";
import { Box, Input, Button, Text, VStack, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const validatePassword = (password: string) => {
    const minLength = 6;
    return password.length >= minLength;
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Nome e senha são obrigatórios.");
      return;
    }

    if (!validatePassword(password)) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário registrado com sucesso! Faça login para continuar.");
        navigation.navigate("LoginScreen");
      } else {
        setError(data.error || "Erro ao registrar usuário.");
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} bg="gray.50">
      <Box p={5} w="90%" maxW="400px">
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Cadastro de Novo Usuário
          </Text>
          <Input
            placeholder="Nome"
            value={username}
            onChangeText={setUsername}
            isDisabled={loading}
          />
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            type="password"
            isDisabled={loading}
          />
          {error ? <Text color="red.500">{error}</Text> : null}
          <Button
            onPress={handleRegister}
            isLoading={loading}
            isDisabled={loading}
          >
            Cadastrar
          </Button>
          <Button
            variant="link"
            onPress={() => navigation.navigate("LoginScreen")}
            isDisabled={loading}
          >
            Já tem uma conta? Faça login
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default RegisterScreen;
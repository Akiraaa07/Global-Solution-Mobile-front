import React, { useState } from "react";
import { Box, Input, Button, Text, VStack, Center } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const validatePassword = (password: string) => {
    const minLength = 6;
    return password.length >= minLength;
  };

  const handleLogin = async () => {
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
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvando o token e o usuário ID no AsyncStorage
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("usuario_id", String(data.id));
        console.log("Login bem-sucedido:", { token: data.token, id: data.id });

        // Redirecionar para a tela inicial
        navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
      } else {
        setError(data.error || "Erro de autenticação.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} bg="gray.50">
      <Box p={5} w="90%" maxW="400px">
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Bem-vindo
          </Text>
          <Input
            placeholder="Nome"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
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
            onPress={handleLogin}
            isLoading={loading}
            isDisabled={loading}
          >
            Entrar
          </Button>
          <Button
            variant="link"
            onPress={() => navigation.navigate("RegisterScreen")}
            isDisabled={loading}
          >
            Criar nova conta
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen;
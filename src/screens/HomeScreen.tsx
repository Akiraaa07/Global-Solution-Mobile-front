import React from "react";
import {
  Box,
  VStack,
  Button,
  Text,
  Center,
  Divider,
  Icon,
  HStack,
  ScrollView,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Box flex={1} bg="#F7F7F7" safeArea>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={4}
        bg="white"
      >
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          Aplicativo para cadastro de aparelhos eletronicos
        </Text>
        <Button
          onPress={handleLogout}
          variant="ghost"
          _text={{ color: "gray.800", fontWeight: "bold" }}
          _pressed={{ bg: "gray.200" }}
          leftIcon={
            <Icon as={MaterialIcons} name="logout" size="sm" color="gray.800" />
          }
          rounded="full"
        >
          Sair
        </Button>
      </HStack>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Center>
          <VStack space={6} alignItems="center" width="100%">
            <Box
              bg="white"
              width="100%"
              borderRadius="md"
              p={6}
              shadow={1}
              borderWidth={1}
              borderColor="#E2E8F0"
            >
              <HStack alignItems="center" space={3}>
                <Icon
                  as={MaterialIcons}
                  name="feedback"
                  size="lg"
                  color="blue.500"
                />
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Feedbacks
                </Text>
              </HStack>
              <Divider my={3} bg="gray.300" />
              <VStack space={3}>
                <Button
                  bg="#3182CE"
                  _text={{ color: "white", fontWeight: "bold" }}
                  _pressed={{ bg: "#2C5282" }}
                  rounded="full"
                  onPress={() => navigation.navigate("AdicionarFeedbackScreen")}
                >
                  Registrar Novo Feedback
                </Button>
                <Button
                  bg="#3182CE"
                  _text={{ color: "white", fontWeight: "bold" }}
                  _pressed={{ bg: "#2C5282" }}
                  rounded="full"
                  onPress={() => navigation.navigate("FeedbackScreen")}
                >
                  Ver Histórico de Feedbacks
                </Button>
              </VStack>
            </Box>

            <Box
              bg="white"
              width="100%"
              borderRadius="md"
              p={6}
              shadow={1}
              borderWidth={1}
              borderColor="#E2E8F0"
            >
              <HStack alignItems="center" space={3}>
                <Icon as={FontAwesome5} name="tv" size="lg" color="blue.500" />
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Aparelhos
                </Text>
              </HStack>
              <Divider my={3} bg="gray.300" />
              <VStack space={3}>
                <Button
                  bg="#3182CE"
                  _text={{ color: "white", fontWeight: "bold" }}
                  _pressed={{ bg: "#2C5282" }}
                  rounded="full"
                  onPress={() => navigation.navigate("AparelhosScreen")}
                >
                  Registrar Aparelhos
                </Button>
                <Button
                  bg="#3182CE"
                  _text={{ color: "white", fontWeight: "bold" }}
                  _pressed={{ bg: "#2C5282" }}
                  rounded="full"
                  onPress={() => navigation.navigate("ListaAparelhosScreen")}
                >
                  Ver Histórico de Aparelhos
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Center>
      </ScrollView>
    </Box>
  );
};

export default HomeScreen;
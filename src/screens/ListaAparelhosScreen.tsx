import React, { useEffect, useState } from "react";
import {
  Box,
  FlatList,
  Text,
  VStack,
  Spinner,
  HStack,
  Badge,
  Center,
  Button,
  Modal,
  Input,
  Toast,
  Icon,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";  // Importando ícones do Ionicons

interface Aparelho {
  aparelho_id: number;
  nome: string;
  potencia: number;
  horas_uso: number;
  data_cadastro: string;
}

const ListaAparelhosScreen: React.FC = () => {
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAparelho, setSelectedAparelho] = useState<Aparelho | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAparelhos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/aparelhos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAparelhos(data);
      } else {
        throw new Error("Erro ao buscar aparelhos");
      }
    } catch (error) {
      setError("Erro ao buscar aparelhos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (aparelho_id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/aparelhos/${aparelho_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Toast.show({
          description: "Aparelho deletado com sucesso!",
          bgColor: "green.500",
        });
        setAparelhos((prevAparelhos) =>
          prevAparelhos.filter((aparelho) => aparelho.aparelho_id !== aparelho_id)
        );
      } else {
        throw new Error("Erro ao deletar aparelho");
      }
    } catch (error) {
      Toast.show({
        description: "Erro ao deletar aparelho. Tente novamente.",
        bgColor: "red.500",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedAparelho) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/aparelhos/${selectedAparelho.aparelho_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedAparelho),
        }
      );

      if (response.ok) {
        Toast.show({
          description: "Aparelho atualizado com sucesso!",
          bgColor: "green.500",
        });
        fetchAparelhos();
        setIsEditing(false);
      } else {
        throw new Error("Erro ao atualizar aparelho");
      }
    } catch (error) {
      Toast.show({
        description: "Erro ao atualizar aparelho. Tente novamente.",
        bgColor: "red.500",
      });
    }
  };

  const renderAparelhoItem = ({ item }: { item: Aparelho }) => (
    <Box
      bg="white"
      p={4}
      m={3}
      rounded="lg"
      shadow={2}
      borderColor="gray.200"
      borderWidth={1}
    >
      <VStack space={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="bold" flex={1} color="gray.800">
            {item.nome}
          </Text>
          <Center
            bg={getPotenciaColor(item.potencia)}
            p={3}
            rounded="full"
            minW="120px"
          >
            <Text color="white" fontWeight="bold">
              {item.potencia}W
            </Text>
          </Center>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.500">
            {new Date(item.data_cadastro).toLocaleDateString("pt-BR")}
          </Text>
          <Badge
            colorScheme="info"
            rounded="full"
            variant="subtle"
            px={3}
            py={1}
          >
            {item.horas_uso} horas de uso
          </Badge>
        </HStack>

        <HStack space={2} mt={3}>
          {/* Botão Editar com Ícone de Lápis */}
          <Button
            variant="outline"
            colorScheme="blue"
            flex={1}
            onPress={() => {
              setSelectedAparelho(item);
              setIsEditing(true);
            }}
            _pressed={{ bg: "blue.50" }}
            _text={{ color: "blue.500" }}
            borderColor="blue.500"
          >
            <Icon as={Ionicons} name="pencil" size="sm" color="blue.500" />
          </Button>

          {/* Botão Deletar com Ícone de Lixeira */}
          <Button
            variant="outline"
            colorScheme="red"
            flex={1}
            onPress={() => {
              setSelectedAparelho(item);
              setIsDeleting(true);
            }}
            _pressed={{ bg: "red.50" }}
            _text={{ color: "red.500" }}
            borderColor="red.500"
          >
            <Icon as={Ionicons} name="trash" size="sm" color="red.500" />
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  useEffect(() => {
    fetchAparelhos();
  }, []);

  const getPotenciaColor = (potencia: number) => {
    if (potencia >= 1000) return "red.500";
    if (potencia >= 500) return "yellow.500";
    return "green.500";
  };

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1}>
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Center>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <Box p={4}>
        <Text
          color="blue.600"
          fontSize="2xl"
          textAlign="center"
          fontWeight="bold"
        >
          Histórico de Aparelhos
        </Text>
      </Box>

      {aparelhos.length === 0 ? (
        <Center flex={1}>
          <Text color="gray.600" fontSize="lg">
            Nenhum aparelho registrado ainda.
          </Text>
        </Center>
      ) : (
        <FlatList
          data={aparelhos}
          renderItem={renderAparelhoItem}
          keyExtractor={(item) =>
            item.aparelho_id ? item.aparelho_id.toString() : item.nome
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Editar Aparelho</Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Nome do Aparelho"
              value={selectedAparelho?.nome || ""}
              onChangeText={(text) =>
                setSelectedAparelho((prev) =>
                  prev ? { ...prev, nome: text } : null
                )
              }
              mb={3}
            />
            <Input
              placeholder="Potência (W)"
              value={selectedAparelho?.potencia?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(text) => {
                const parsedValue = parseInt(text);
                setSelectedAparelho((prev) =>
                  prev
                    ? {
                        ...prev,
                        potencia: isNaN(parsedValue) ? 0 : parsedValue,
                      }
                    : null
                );
              }}
              mb={3}
            />
            <Input
              placeholder="Horas de Uso por Dia"
              value={selectedAparelho?.horas_uso?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(text) => {
                const parsedValue = parseInt(text);
                setSelectedAparelho((prev) =>
                  prev
                    ? {
                        ...prev,
                        horas_uso: isNaN(parsedValue) ? 0 : parsedValue,
                      }
                    : null
                );
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blue" onPress={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onPress={handleEdit}>
                Salvar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Confirmar Exclusão</Modal.Header>
          <Modal.Body>
            <Text>Tem certeza que deseja excluir este aparelho?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blue" onPress={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onPress={() => {
                  if (selectedAparelho) {
                    handleDelete(selectedAparelho.aparelho_id);
                  }
                  setIsDeleting(false);
                }}
              >
                Deletar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ListaAparelhosScreen;
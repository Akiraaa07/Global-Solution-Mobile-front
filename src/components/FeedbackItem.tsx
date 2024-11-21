import React, { useState } from "react";
import { Box, Text, IconButton, Input, HStack, Button, Modal } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

interface FeedbackItemProps {
  id: number;
  comentario: string;
  data: string;
  onUpdate: (id: number, comentario: string) => void;
  onDelete?: (id: number) => Promise<void>;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  id,
  comentario,
  data,
  onUpdate,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newComentario, setNewComentario] = useState(comentario); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async () => {
    if (newComentario.trim() === "") return;
    await onUpdate(id, newComentario);
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(id);
      setIsModalOpen(false); // Fecha o modal após exclusão
    }
  };

  return (
    <Box bg="white" p={4} m={2} rounded="md" shadow={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          {isEditMode ? (
            // Modo de edição
            <>
              <Input
                value={newComentario}
                onChangeText={setNewComentario}
                autoFocus
              />
              <Button mt={2} onPress={handleUpdate}>
                Confirmar
              </Button>
            </>
          ) : (
            // Modo de visualização
            <>
              <Text mt={1}>{comentario}</Text>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {new Date(data).toLocaleDateString()}
              </Text>
            </>
          )}
        </Box>
        
        {/* Botões de Editar e Excluir */}
        <HStack space={2}>
          {!isEditMode && (
            <IconButton
              icon={<MaterialIcons name="edit" size={24} />}
              onPress={() => setIsEditMode(true)} // Ativa o modo de edição
            />
          )}
          {onDelete && (
            <IconButton
              icon={<MaterialIcons name="delete" size={24} color="red" />}
              onPress={() => setIsModalOpen(true)} // Abre o modal de confirmação
            />
          )}
        </HStack>
      </HStack>

      {/* Modal de confirmação para exclusão */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content>
          <Modal.Header>Excluir Feedback</Modal.Header>
          <Modal.Body>
            Você realmente deseja excluir este feedback?
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button colorScheme="coolGray" onPress={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={handleDelete}>
                Excluir
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default FeedbackItem;
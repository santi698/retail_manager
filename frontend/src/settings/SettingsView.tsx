import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import {
  Center,
  Flex,
  Heading,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { BsPlus } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { useCities } from "../cities/useCities";
import { ViewTitle } from "../common/components/ViewTitle";
import { RetailManagerApi } from "../common/services/RetailManagerApi";
import { City } from "../domain/City";

export function useCreateCity() {
  const queryClient = useQueryClient();
  const createCity = async ({ name }: Pick<City, "name">) => {
    return RetailManagerApi.post<City>("/api/cities", { name });
  };

  return useMutation<
    City,
    Error,
    { name: string },
    { previousItems: City[]; newItems: City[] }
  >("createCity", createCity, {
    onMutate: async ({ name }) => {
      const queryKey = "cities";
      await queryClient.cancelQueries(queryKey);
      const previousItems = queryClient.getQueryData<City[]>(queryKey) || [];
      const newItems = [...previousItems, { id: NaN, name }];
      queryClient.setQueryData(queryKey, newItems);

      return { previousItems, newItems };
    },
    onSettled: () => {
      const queryKey = "cities";
      queryClient.invalidateQueries(queryKey);
    },
    onError: (_error, _variables, context) => {
      const queryKey = "cities";
      queryClient.setQueryData(queryKey, context?.previousItems);
    },
  });
}

export function SettingsView() {
  const cities = useCities();
  const createCity = useCreateCity();
  const { isOpen: isAddCityModalOpen, onOpen, onClose } = useDisclosure();
  if (cities.status !== "success") {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <ViewTitle>Configuración</ViewTitle>
      <VStack
        align="flex-start"
        border="1px solid var(--chakra-colors-gray-100)"
        borderRadius="md"
        p={4}
      >
        <Heading mb="4" fontSize="xl">
          Ciudades
        </Heading>
        <List spacing={2}>
          {cities.data.map((city) => (
            <ListItem key={city.id}>{city.name}</ListItem>
          ))}
        </List>
        <Button
          onClick={onOpen}
          size="sm"
          variant="ghost"
          leftIcon={<BsPlus size={20} />}
        >
          Agregar nueva ciudad
        </Button>
      </VStack>
      <Modal isOpen={isAddCityModalOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Agregar ciudad</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const name = formData.get("name") as string;
                  createCity.mutate({ name });
                  onClose();
                }}
              >
                <VStack align="flex-start">
                  <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input name="name" />
                  </FormControl>
                  <Flex justify="space-between" width="100%">
                    <Button type="submit">Agregar</Button>
                    <Button variant="outline" type="button" onClick={onClose}>
                      Cancelar
                    </Button>
                  </Flex>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

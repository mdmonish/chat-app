import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import UserBadgeItem from "../User/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async searchText => {
    setSearch(searchText);
    if (!searchText) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map(u => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created",

        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Occured",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGroup = user => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User Aalready added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = user => {
    const filtered = selectedUsers.filter(
      selected => selected._id !== user._id
    );
    setSelectedUsers(filtered);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily={"Work sans"}
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl id="chat_name">
              <Input
                mb={3}
                type="text"
                placeholder="Chat Name"
                onChange={e => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl id="name">
              <Input
                mb={1}
                type="text"
                placeholder="Add User eg. John"
                autoComplete="off"
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
              w="100%"
              flex="flexWrap"
              style={{ display: "flex" }}
              mb={3}
              mt={2}
            >
              {selectedUsers?.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

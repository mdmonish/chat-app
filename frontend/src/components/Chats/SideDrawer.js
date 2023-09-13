import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const history = useNavigate();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };

  const accessChat = async userId => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!chats.find(chat => chat._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setSearch("");
      setSearchResult([]);
      onClose();
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

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter soemthing in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
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

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#c2edce"
        w="100%"
        p="5px 10px 5px 10px"
        shadow="2xl"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i>🔍</i>
            <Text
              fontFamily="Chakra petch"
              display={{ base: "none", md: "flex" }}
              px="4"
            >
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Chakra petch" fontWeight="bold">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map(notif => (
                <MenuItem
                  fontFamily="Chakra petch"
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter(n => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  scr={user.pic}
                ></Avatar>
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem fontFamily="Chakra petch">My Profile</MenuItem>
                </ProfileModal>

                <MenuDivider />
                <MenuItem fontFamily="Chakra petch" onClick={logoutHandler}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="Chakra petch">Search Users</DrawerHeader>
          <DrawerBody>
            <Box style={{ display: "flex" }}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                fontFamily="Chakra petch"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button fontFamily="Chakra petch" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

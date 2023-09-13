import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleShow = () => {
    setShow(!show);
  };

  const handleGuest = () => {
    setEmail("guestuser@guest.com");
    setPassword("guest12345");
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !password) {
      console.log("Enter fields are empty");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      toast({
        title: "Success",
        description: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl id="email" isRequired>
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Email
        </FormLabel>
        <Input
          type="email"
          fontFamily="Chakra petch"
          value={email}
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Password
        </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            fontFamily="Chakra petch"
            value={password}
            placeholder="password"
            onChange={e => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="green"
        w="100%"
        fontFamily="Chakra petch"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        w="100%"
        fontFamily="Chakra petch"
        onClick={handleGuest}
      >
        Get Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;

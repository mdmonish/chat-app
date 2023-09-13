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

const DEFAULT_STATE = {
  name: "",
  email: "",
  password: "",
  pic: "",
};

const Signup = () => {
  const history = useNavigate();
  const [state, setState] = useState(DEFAULT_STATE);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleShow = () => {
    setShow(!show);
  };

  const handleImage = pic => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Error",
        description: "Image is not selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dp6yrbocz");
      fetch("https://api.cloudinary.com/v1_1/dp6yrbocz/image/upload", {
        method: "Post",
        body: data,
      })
        .then(res => res.json())
        .then(data => {
          setState(prev => ({ ...prev, pic: data.url.toString() }));
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Error",
        description: "Image selected is not correct",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!state.name || !state.email || !state.password || !confirmPassword) {
      return;
    }
    if (state.password !== confirmPassword) {
      return;
    }
    try {
      const { data } = await axios.post("/api/user", state, {
        headers: {
          "Content-type": "application/json",
        },
      });
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
      <FormControl id="name" isRequired>
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Name
        </FormLabel>
        <Input
          type="text"
          fontFamily="Chakra petch"
          value={state.name}
          placeholder="name"
          onChange={e => setState(prev => ({ ...prev, name: e.target.value }))}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Email
        </FormLabel>
        <Input
          type="email"
          fontFamily="Chakra petch"
          value={state.email}
          placeholder="email"
          onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
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
            value={state.password}
            placeholder="password"
            onChange={e =>
              setState(prev => ({ ...prev, password: e.target.value }))
            }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            fontFamily="Chakra petch"
            value={confirmPassword}
            placeholder="confirm password"
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel fontFamily="Chakra petch" fontWeight="bold">
          Profile Image
        </FormLabel>
        <Input
          type="file"
          accept="image/*"
          fontFamily="Chakra petch"
          p={1}
          placeholder="image url"
          onChange={e => handleImage(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="green"
        w="100%"
        fontFamily="Chakra petch"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;

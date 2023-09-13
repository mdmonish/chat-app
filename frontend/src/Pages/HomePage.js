import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const history = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      history("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="#c2edce"
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        shadow="2xl"
      >
        <Text fontSize="4xl" fontFamily="Chakra petch">
          Chat App
        </Text>
      </Box>
      <Box
        shadow="2xl"
        bg="#F6F6F2"
        p={4}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab fontFamily="Chakra petch">Login</Tab>
            <Tab fontFamily="Chakra petch">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <>
      <Box padding="6" boxShadow="xl" bg="white" my={2}>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" my={2}>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" my={2}>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" my={2}>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" my={2}>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="2" />
      </Box>
    </>
  );
};

export default ChatLoading;

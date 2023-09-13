import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      mr={2}
      borderRadius="lg"
      colorScheme="green"
      onClick={handleFunction}
    >
      {user.name}

      <CloseIcon ml={2} />
    </Badge>
  );
};

export default UserBadgeItem;

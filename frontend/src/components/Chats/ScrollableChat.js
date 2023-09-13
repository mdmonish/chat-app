import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ initialMessages }) => {
  const { user } = ChatState();
  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i + 1].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  return (
    <ScrollableFeed>
      {initialMessages.length &&
        initialMessages.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              fontFamily: "Chakra petch",
              marginTop: isSameUser(initialMessages, m, i) ? "10px" : "20px",
            }}
          >
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginTop: isSameUser(initialMessages, m, i, user._id) ? 3 : 10,
                marginLeft: isSameSenderMargin(initialMessages, m, i, user._id),
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

import { useChatStore } from "../store/useChatStore";
import { useEffect,useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);// ref for scroll to bottom of chat container
  // scroll to bottom of chat container when new message is added

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

  return () => unsubscribeFromMessages();
}, [selectedUser._id, getMessages,subscribeToMessages, unsubscribeFromMessages]);
    
// scroll to bottom of chat container when new message is added
useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
, [messages]);
// put true inside if to check messages laoding state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
       
         <ChatHeader />
        <MessageSkeleton /> {/* Loading... firstly now replaced*/}
        <MessageInput /> 
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* <p>messages.....</p> */}
      {/* message state to display messages history */}
      {/* chat bubble of daisyUi and if we chatend others chatstart */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                {/* if message sender is authUser then show authUser profile pic else show selectedUser profile pic */}
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            {/* chat component  */}
            {/* flex-col image and text in vertical */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div> 


      <MessageInput />
    </div>
  );
};
export default ChatContainer;
import { ChangeEvent, FC, useEffect, useState } from "react";
import { MESSAGE_ROLES } from "../../utils/constants";
import { FaUser, FaRobot } from "react-icons/fa";
import { messageProps } from "../../types";

export const Chat: FC = () => {
  const [conversation, setConversation] = useState({ conversation: [] });
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      const conversationId = localStorage.getItem("conversationId");
      if (conversationId) {
        const response = await fetch(
          `http://localhost:5000/backend_service/${conversationId}`
        );
        const data = await response.json();
        if (!data.error) {
          setConversation(data);
        }
      }
    };

    fetchConversation();
  }, []);

  const generateConversationId = () =>
    "_" + Math.random().toString(36).slice(2, 11);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  const handleNewSession = () => {
    localStorage.removeItem("conversationId");
    setConversation({ conversation: [] });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let conversationId = localStorage.getItem("conversationId");
    if (!conversationId) {
      conversationId = generateConversationId();
      localStorage.setItem("conversationId", conversationId);
    }

    const newConversation = [
      ...conversation.conversation,
      { role: "user", content: userMessage },
    ];

    const response = await fetch(
      `http://localhost:5000/backend_service/${conversationId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: newConversation }),
      }
    );

    const data = await response.json();
    setConversation(data);
    setUserMessage("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 h-screen justify-between bg-violet-400 text-sm w-full">
      <h1 className="text-3xl font-bold mb-4 text-white">Ask me Anything!!!</h1>

      <div className="flex flex-col p-4 bg-violet-200 rounded shadow w-full space-y-4 h-full">
        <div className="flex flex-col flex-auto h-full p-6 overflow-y-auto">
          {conversation.conversation.length > 0 &&
            conversation.conversation
              .filter(
                (message: messageProps) => message.role !== MESSAGE_ROLES.SYSTEM
              )
              .map((message: messageProps, index: number) => (
                <div key={index}>
                  {message.role === MESSAGE_ROLES.ASSISTANT ? (
                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex flex-row items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          <FaRobot />
                        </div>
                        <div className="relative ml-3 text-sm bg-indigo-500 text-gray-50 py-2 px-4 shadow rounded-xl">
                          <div>{message.content}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-start-6 col-end-13 p-3 rounded-lg">
                      <div className="flex items-center justify-start flex-row-reverse">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500 flex-shrink-0">
                          <FaUser color="#fff" />
                        </div>
                        <div className="relative mr-3 text-sm bg-gray-500 text-gray-50 py-2 px-4 shadow rounded-xl">
                          <div>{message.content}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>

      <div className="flex flex-row w-full max-w-md mt-4 justify-end">
        <input
          type="text"
          value={userMessage}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-grow mr-2 p-4 rounded border-gray-300"
          placeholder={isLoading ? "Processing..." : "Type your message here"}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="p-4 rounded bg-blue-800 text-white"
        >
          Send
        </button>
      </div>
      {isLoading && (
        <div className="flex items-center space-x-4 text-l text-white">
          {/* <FaSpinner className="animate-spin" /> */}
          <span>Loading...</span>
        </div>
      )}
      <button
        onClick={handleNewSession}
        className="m-4 p-2 rounded bg-violet-700 text-white absolute bottom-0 right-4"
      >
        Clear cache from Radis
      </button>
    </div>
  );
};

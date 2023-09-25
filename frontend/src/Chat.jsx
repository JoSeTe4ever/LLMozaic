import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useWebSocket } from "ahooks";
import styles from "../src/styles/Home.module.css";
import AudioStream from "./AudioStream";
import axios from "axios";

export default function Chat({ greetingInfo }) {
  const wsBackendUrl =
    import.meta.env.VITE_WS_BACKEND_URL || "ws://localhost:5000";

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [initialMessageReceived, setInitialMessageReceived] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [firstMessageReceived, setFirstMessageReceived] = useState(false);

  const [messages, setMessages] = useState([]);
  const [socketUrl, setSocketUrl] = useState(
    `${wsBackendUrl}/ws?userId=${sessionStorage.getItem("userId")}`
  );

  const [messageHistory, setMessageHistory] = useState([]);
  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket(socketUrl);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);
  const formButton = useRef(null);
  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (readyState === 0) {
      setLoading(false);
    }
  }, [readyState]);

  // Init useEffect.
  // Focus on text field on load and init audio recording (check if browser supports it)
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  useEffect(() => {
    if (latestMessage === undefined) {
      return;
    }
    // We know this is ugly. But for UX reasons we are
    // redirecting the stdout of the agent to the frontend
    // and parsing it here to display it in the chat.
    let messagesToAdd = [];
    console.log(latestMessage.data);
    let isThought = false;
    let isFinalAnswer = false;
    let message = latestMessage.data;
    if (latestMessage.data.includes("\x1B[32;1m\x1B[1;3mThought:")) {
      isThought = true;
      message = latestMessage.data.replace("\x1B[32;1m\x1B[1;3mThought:", "");

      messagesToAdd.push({
        message: message,
        type: "apiMessage",
        isThought: isThought,
        isFinalAnswer: isFinalAnswer,
      });
    } else if (latestMessage.data.includes("\x1B[32;1m\x1B[1;3m")) {
      isThought = true;
      message = latestMessage.data.replace("\x1B[32;1m\x1B[1;3m", "");

      messagesToAdd.push({
        message: message,
        type: "apiMessage",
        isThought: isThought,
        isFinalAnswer: isFinalAnswer,
      });
    } else if (latestMessage.data.includes('"action_input": "')) {
      message = latestMessage.data.replace('"action_input": "', "");

      messagesToAdd.push({
        message: message,
        type: "apiMessage",
        isThought: isThought,
        isFinalAnswer: isFinalAnswer,
      });
    } else if (latestMessage.data.includes('"action": "Final Answer",')) {
      isFinalAnswer = true;
      messagesToAdd = latestMessage.data.split('"action": "Final Answer",');

      messagesToAdd = messagesToAdd.map((e) => {
        return {
          message: e,
          type: "apiMessage",
          isThought: false,
          isFinalAnswer: true,
        };
      });
    } else {
      messagesToAdd.push({
        message: latestMessage.data,
        type: "apiMessage",
        isThought: false,
        isFinalAnswer: false,
      });
    }

    //sanitize message
    messagesToAdd = messagesToAdd.filter((e) => e.message.trim() !== "");

    setMessageHistory((prev) => prev.concat(latestMessage.data));
    setMessages((prevMessages) => [...prevMessages, ...messagesToAdd]);
  }, [latestMessage]);

  // Handle form submission through WS
  const handleWSSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userInput, type: "userMessage" },
    ]);

    if (readyState === 3) {
      connect();
      setLoading(false);
    }
    // Send user question and history to API
    sendMessage(userInput);
    // Reset user input
    setUserInput("");
  };

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: "Oops! There seems to be an error. Please try again.",
        type: "apiMessage",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleWSSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleRecordClick = () => {
    setRecording(true);
    console.log("recorder started");
  };

  const handleRecorderClose = (event) => {
    if (event && event.length > 0) {
      console.log("desde el chat", event);
      setUserInput(event);

      setTimeout(() => {
        formButton.current.click();
      }, "100");
    }
    setRecording(false);
  };

  useEffect(() => {
    // run the chain and set the first message
    setLoading(true);
    const SERVER_URI = "http://localhost:5000";
    const ENDPOINT = SERVER_URI + "/greeting-chain";
    axios
      .post(ENDPOINT, greetingInfo)
      .then((response) => {
        console.log("Response from chain greeting endpoint:", response.data); // Debugging
        setInitialMessageReceived(true);
        setLoading(false);
        setMessages((prevMessages) => {
          if (Array.isArray(prevMessages) && prevMessages.length == 0) {
            return [
              ...prevMessages,
              { message: response.data.success, type: "apiMessage" },
            ];
          }
          return prevMessages;
        });
      })
      .catch((error) => {
        console.log("Error fetching chain greeting info:", error); // Debugging
      });
  }, []);

  return (
    <>
      {/* socket readyState: {readyState} */}
      <main className={styles.main}>
        {/* Condición para mostrar el overlay */}
        {recording && (
          <div className={styles.RecordStreamOverlay}>
            <div className="overlay-content">
              <AudioStream onClose={handleRecorderClose} />
            </div>
          </div>
        )}

        <div className={styles.cloud}>
          {/* Mostrar spinner si el primer mensaje aún no ha sido recibido */}

          <div ref={messageListRef} className={styles.messagelist}>
            {!initialMessageReceived && (
              <div className="loadingSpinner">
                <div className="spinner">
                  <CircularProgress />
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.type === "userMessage" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.type === "apiMessage"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  {/* Display the correct icon depending on the message type */}
                  {message.type === "apiMessage" ? (
                    <img
                      src="/ideogram.jpeg"
                      alt="AI"
                      width="80"
                      height="80"
                      className={styles.boticon}
                    />
                  ) : (
                    <img
                      src="/me.jpg"
                      alt="Me"
                      width="80"
                      height="80"
                      className={styles.usericon}
                    />
                  )}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleWSSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                type="text"
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />

              <button
                ref={formButton}
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{" "}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <>
                    <svg
                      viewBox="0 0 20 20"
                      className={styles.svgicon}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </>
                )}
              </button>
              {!loading ? (
                <div className="circle">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className={styles.microButton}
                    onClick={handleRecordClick}
                  />
                </div>
              ) : (
                <></>
              )}
            </form>
          </div>
          <div className={styles.footer}>
            <p>
              Built by{" "}
              <a
                href="https://devpost.com/software/virtual-assistant-nm4cyh"
                target="_blank"
              >
                TEAM JOSE LUCIA FRAN
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

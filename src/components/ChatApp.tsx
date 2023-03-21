import React, { useState, useEffect, MouseEventHandler, useRef } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  QueryDocumentSnapshot,
  CollectionReference,
  orderBy,
} from "firebase/firestore";
import { auth, dataBase } from "../firebase_config";
import { FieldValue } from "firebase/firestore";
import { timeStamp } from "console";
import { signOut } from "firebase/auth";

interface Message {
  id: string;
  text: string;
  timestamp: any;
  user: string;
  room: string;
  color: string;
}

const DEFAULT_MESSAGE: Message = {
  id: "",
  text: "",
  timestamp: null,
  user: "",
  room: "",
  color: "",
};

type Props = {
  room: string;
  signUserOut: MouseEventHandler;
};

const colors = [
  "#FFC312",
  "#C4E538",
  "#12CBC4",
  "#FDA7DF",
  "#ED4C67",
  "#F79F1F",
  "#A3CB38",
  "#1289A7",
  "#D980FA",
  "#B53471",
];

export const ChatApp = ({ room, signUserOut }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userColor, setUserColor] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const messagesRef = collection(dataBase, "messages");

  useEffect(() => {
    let queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          ...DEFAULT_MESSAGE,
          ...doc.data(),
          id: doc.id,
        });
      });

      setMessages(messages);
    });

    setUserColor(colors[Math.floor(Math.random() * colors.length)]);

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMessage) {
      setNewMessage("");
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: Date.now(),
        user: auth.currentUser?.displayName,
        room: room,
        color: userColor,
      });

      if (chatContainerRef.current) {
        const chatContainer = chatContainerRef.current;
        const lastMessage = chatContainer.lastElementChild as HTMLElement;
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      return;
    }
  };

  return (
    <div className="background-overlay">
      {/* <button className="btn sign-out" onClick={signUserOut}>
        Sign Out
      </button>*/}
      <h1 className="welcome-msg">
        Welcome to the chat {auth.currentUser?.displayName}
      </h1>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            className={
              auth.currentUser?.displayName === message.user
                ? "chat-bubble sent"
                : "chat-bubble recieved"
            }
            key={message.id}
            style={{ backgroundColor: message.color }}
          >
            <p className="message text">{message.text}</p>
            <p className="message user">{message.user}</p>
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          className="input-message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn" type="submit">
          Send
        </button>
      </form>
      <div className="logout-container">
        <span onClick={signUserOut} className="logout-span">
          Had enough? Click here to logout.
        </span>
      </div>
    </div>
  );
};

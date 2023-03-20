import React, { useState, useEffect, MouseEventHandler } from "react";
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
}

const DEFAULT_MESSAGE: Message = {
  id: "",
  text: "",
  timestamp: null,
  user: "",
  room: "",
};

type Props = {
  room: string;
  signUserOut: MouseEventHandler;
};

export const ChatApp = ({ room, signUserOut }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

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

        console.log(doc.data());
      });

      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMessage) {
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: Date.now(),
        user: auth.currentUser?.displayName,
        room: room,
      });
      setNewMessage("");
    } else {
      return;
    }
  };

  return (
    <div className="background-overlay">
      <button className="btn sign-out" onClick={signUserOut}>
        Sign Out
      </button>
      <h1>Welcome to the chat {auth.currentUser?.displayName}</h1>
      <div className="chat-container">
        {messages.map((message) => (
          <div
            className={
              auth.currentUser?.displayName === message.user
                ? "chat-bubble sent"
                : "chat-bubble recieved"
            }
            key={message.id}
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
    </div>
  );
};

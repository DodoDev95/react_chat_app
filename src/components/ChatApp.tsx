import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, QueryDocumentSnapshot } from "firebase/firestore";
import { auth, dataBase } from "../firebase_config";
import { FieldValue } from 'firebase/firestore';

interface Message {
  id: string,
  text: string,
  timestamp: any,
  user: string,
  room: string,
}

const DEFAULT_MESSAGE: Message = {
  id: '',
  text: '',
  timestamp: null,
  user: '',
  room: '',
};

type Props = {
  room: string,
}

export const ChatApp = ({ room }: Props) => {

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
 

  const messagesRef = collection(dataBase, 'messages');

  

  useEffect(() => {

    const queryMessages = query(messagesRef, where("room", "==", room,))
    onSnapshot(queryMessages, (snapshot) => {
      let messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({ ...DEFAULT_MESSAGE, ...doc.data(), id: doc.id })
      })
      setMessages(messages)
    })


  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMessage) {
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: serverTimestamp() as FieldValue,
        user: auth.currentUser?.displayName,
        room: room,

      })


      setNewMessage("");
    } else {
      return;
    }
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
          <p>{message.user}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
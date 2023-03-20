import React, { useState, useRef, LegacyRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./components/ChatApp";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import { ChatApp } from "./components/ChatApp";
import { signOut } from "firebase/auth";
import { auth } from "./firebase_config";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState("");

  const roomName: LegacyRef<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom("");
  };

  if (!isAuth) {
    return <Auth setIsAuth={setIsAuth} />;
  }

  return (
    <>
      {room ? (
        <ChatApp room={room} signUserOut={signUserOut} />
      ) : (
        <div className="room">
          <label>Enter a room name</label>
          <input type="text" ref={roomName} className="roomInput" />
          <button
            className="btn enter"
            onClick={() => roomName.current && setRoom(roomName.current.value)}
          >
            Enter Chat
          </button>
          <button className="btn sign-out" onClick={signUserOut}>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

export default App;

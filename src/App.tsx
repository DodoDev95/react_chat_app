import React, { useState, useRef, LegacyRef } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/ChatApp';
import Auth from './components/Auth'
import Cookies from 'universal-cookie'
import { ChatApp } from './components/ChatApp';

const cookies = new Cookies();

function App() {

  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState("");


  const roomName: LegacyRef<HTMLInputElement> = useRef<HTMLInputElement>(null);

  if(!isAuth) {
  return (
    <Auth setIsAuth={setIsAuth} />
  );
}

return <> {room ? <ChatApp room={room} /> : <div className='room'>
  <label>Enter room name:</label>
  <input type="text" ref={roomName}/>
  <button onClick={() => roomName.current && setRoom(roomName.current.value)}>Enter Chat</button>
</div> }  </>

}

export default App;

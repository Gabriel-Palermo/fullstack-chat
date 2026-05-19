"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado!");
    });

    socket.on("history", (history) => {
      setMessages(history);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("system", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          text: msg,
        },
      ]);
    });

    return () => {
      socket.off("history");
      socket.off("message");
      socket.off("system");
    };
  }, []);

  function sendMessage() {
    if (!message.trim() || !username.trim()) return;

    socket.emit("message", {
      sender: username,
      text: message,
    });

    setMessage("");
  }

  return (
    <div className="container">
      <h1>Chat em Tempo Real</h1>

      <input
        placeholder="Digite seu nome"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.system
                ? "system-message"
                : msg.sender === username
                ? "my-message"
                : "other-message"
            }
          >
            {msg.system ? (
              <em>{msg.text}</em>
            ) : (
              <>
                <strong>{msg.sender}: </strong>
                {msg.text}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          placeholder="Digite uma mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}
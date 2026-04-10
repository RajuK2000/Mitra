import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";

export default function Chatbox() {
  const [contacts] = useState([
    { id: 1, name: "Asha", last: "Hey! are we meeting?" },
    { id: 2, name: "Ravi", last: "Sent the files." },
    { id: 3, name: "Sneha", last: "See you!" },
  ]);

  const [conversations, setConversations] = useState({
    1: [
      { id: "m1", from: "them", text: "Hi!", time: "10:01" },
      { id: "m2", from: "me", text: "Hello Asha — what's up?", time: "10:02" },
    ],
    2: [{ id: "m3", from: "them", text: "Please check the doc.", time: "9:40" }],
    3: [{ id: "m4", from: "them", text: "See you!", time: "Yesterday" }],
  });
  console.log(conversations,"conversations");
  

  const [active, setActive] = useState(1);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active, conversations]);

  function sendMessage() {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => ({
      ...prev,
      [active]: [...prev[active], newMsg],
    }));

    setInput("");
  }

  return (
    <div className="chat-wrapper">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>Chats</h2>
        </div>

        <div className="contact-list">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`contact-item ${c.id === active ? "active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              <div className="avatar">{c.name.charAt(0)}</div>
              <div className="contact-info">
                <strong>{c.name}</strong><br/>
                <span>{c.last}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="chat-area">

        {/* HEADER */}
        <header className="chat-header">
          <div className="avatar big">
            {contacts.find((c) => c.id === active)?.name.charAt(0)}
          </div>
          <div>
            <h3>{contacts.find((c) => c.id === active)?.name}</h3>
            <p>Online</p>
          </div>
        </header>

        {/* MESSAGES */}
        <section className="messages">
          {(conversations[active] || []).map((m) => (
            <div key={m.id} className={`msg ${m.from}`}>
              <div className="bubble">
                {m.text}
                <span className="time">{m.time}</span>
              </div>
            </div>
          ))}

          <div ref={endRef}></div>
        </section>

        {/* INPUT BAR */}
        <footer className="chat-input">
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </footer>
      </main>
    </div>
  );
}

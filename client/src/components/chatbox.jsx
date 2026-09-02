import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import axios from "axios";
import useDebounce from "../hooks/Debouncing";
import socket from "../../socket/socket.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Deterministic color per name so contacts are visually distinguishable
// instead of every avatar sharing the same gradient.
const AVATAR_PALETTE = [
  ["#6ee7b7", "#3f9d76"],
  ["#f0b86e", "#c98a3b"],
  ["#7fb8f0", "#3f7ec9"],
  ["#e29be0", "#a955a3"],
  ["#f0866e", "#c9563f"],
  ["#9be0b8", "#55a37c"],
];

function avatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [from, to] = AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  return { backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` };
}

function initial(name) {
  return name ? name.charAt(0).toUpperCase() : "";
}

function titleCase(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function Chatbox() {
  const [loginUser, SetLogInuser] = useState();
  const [Messages, setMessage] = useState([]);
  const [Conversations, setConversationss] = useState([]);
  const [active, setActive] = useState({});
  const activeRef = useRef(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();
  console.log(active, "activeactive");

  const openConversation = (conversationId, name, receiverId, isLogin) => {
    setActive({
      id: conversationId,
      name,
      reciverId: receiverId,
      isLogin: isLogin
    });

    activeRef.current = conversationId;

    messagesFetch(conversationId);
  };

  useEffect(() => {
    const logeduser = JSON.parse(sessionStorage.getItem("user") || "");
    if (logeduser) {
      const decoded = jwtDecode(logeduser);
      SetLogInuser(decoded);
      ConversationFetch(decoded?.userId);
    }

  }, []);

  useEffect(() => {
    if (loginUser?.userId) {
      socket.emit("register", loginUser.userId);
    }
  }, [loginUser]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `https://mitra-lyao.onrender.com/api/search?keyword=${debouncedSearch}`
        );
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const messagesFetch = async (Con_id) => {
    try {
      const response = await axios.get(
        `https://mitra-lyao.onrender.com/api/messages/${Con_id}`
      );
      setMessage(response.data);
    } catch (err) {
      console.log(err, "Message Fetch Error");
    }
  };

  const updateConversationLastMessage = (data) => {
    const conversationId = data?.conversation?._id;
    const lastMessage = data?.conversation?.lastMessage;

    if (!conversationId) return;

    setConversationss((prev) => {
      const updated = prev.map((conversation) =>
        String(conversation._id) === String(conversationId)
          ? {
            ...conversation,
            lastMessage,
            updatedAt: new Date().toISOString(),
          }
          : conversation
      );

      return updated.sort(
        (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      );
    });
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      updateConversationLastMessage(data);
      const newMessage = data?.message;
      if (!newMessage) return;

      const messageConversationId = data?.conversation?._id;
      if (String(messageConversationId) !== String(activeRef.current)) {
        return;
      }

      setMessage((prev) => [...prev, newMessage]);
    };

    const handleMessageSent = (data) => {
      updateConversationLastMessage(data);
      const newMessage = data?.message;
      if (!newMessage) return;

      const messageConversationId = data?.conversation?._id;
      if (String(messageConversationId) !== String(activeRef.current)) {
        return;
      }

      setMessage((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageSent", handleMessageSent);
    };
  }, []);

  const ConversationFetch = async (user_Id) => {
    console.log(user_Id, "hhhhhhhh");

    try {
      const Conversations = await axios.get(
        `https://mitra-lyao.onrender.com/api/conversations/${user_Id}`
      );
      setConversationss(Conversations?.data || []);
    } catch (err) {
      console.log(err, "Conversation Fetch Error");
    }
  };

  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [active, Messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const receiverId = search !== "" ? active.id : active.reciverId;

    if (!receiverId) {
      console.log("Receiver not selected");
      return;
    }

    socket.emit("sendMessage", {
      senderId: loginUser.userId,
      receiverId,
      message: input,
      messageType: "text",
      fileUrl: null,
    });

    setInput("");
  };

  const closeChat = () => {
    setActive({
      id: "",
      name: "",
      reciverId: "",
      isLogin: null
    });

    activeRef.current = null;
    setMessage([]);
  };

  let mergedConversations;

  if (Object.keys(active).length > 0) {
    mergedConversations = [{ participants: [active] }, ...Conversations];
  } else {
    mergedConversations = [...Conversations];
  }

  // Sort most-recently-updated conversation first without mutating the
  // pinned "currently open" entry that has no updatedAt of its own.
  mergedConversations = [...mergedConversations].sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatListTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupedMessages = (Messages || []).reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const LogOut = async () => {
    try {

      const data = {
        email: loginUser.email,
        islogin: false
      }
      const Responce = await axios.post("https://mitra-lyao.onrender.com/api/logout", data)
      if (Responce.status === 200) {
        sessionStorage.removeItem("user");
        setTimeout(() => {
          navigate("/");
        }, 100);
      }
    } catch (err) {
      console.log(err,"jjjjjj");
      
      alert(err?.message)
    }
  };

  const hasActiveChat = Boolean(active?.id);

  return (
    <div className={`chat-wrapper ${hasActiveChat ? "chat-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>Hi👋 - {titleCase(loginUser?.name)}</h2>
          <div className="Search_User_class">
            <input
              type="text"
              placeholder="Search name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="contact-list">
          {search !== ""
            ? users.map((c) => {
              const mine = c._id === loginUser?.userId;
              if (mine) return null;

              return (
                <div
                  key={c._id}
                  className={`contact-item ${c._id === active.id ? "active" : ""
                    }`}
                  onClick={() => {
                    setActive({
                      id: c._id,
                      name: c?.name,
                      reciverId: c?._id,
                      isLogin: c?.isLogin
                    });
                    activeRef.current = null;
                    setMessage([]);
                  }}
                >
                  <div className="avatar" style={avatarGradient(c?.name)}>
                    {initial(c?.name)}
                  </div>

                  <div className="contact-info">
                    <div className="contact-row">
                      <strong>{titleCase(c?.name)}</strong>
                    </div>
                    <span>{c.lastMessage || "Start a conversation"}</span>
                  </div>
                </div>
              );
            })
            : mergedConversations.map((c) => {
              const otherUser = c.participants.find(
                (p) => String(p._id) !== String(loginUser?.userId)
              );
              return (
                <div
                  key={c._id || otherUser?.id}
                  className={`contact-item ${c._id === active.id ? "active" : ""
                    }`}
                  onClick={
                    c._id
                      ? () => {
                        openConversation(
                          c._id,
                          otherUser?.name,
                          otherUser?._id,
                          otherUser?.isLogin
                        );
                      }
                      : undefined
                  }
                >
                  <div
                    className="avatar"
                    style={avatarGradient(otherUser?.name)}
                  >
                    {initial(otherUser?.name)}
                  </div>

                  <div className="contact-info">
                    <div className="contact-row">
                      <strong>{titleCase(otherUser?.name)}</strong>
                      {c.updatedAt && (
                        <span className="contact-time">
                          {formatListTime(c.updatedAt)}
                        </span>
                      )}
                    </div>
                    <span>{c?.lastMessage || "No messages yet"}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-header">
          <div className="chat-header1">
            {hasActiveChat ? (
              <>
                <button
                  className="back-btn"
                  onClick={closeChat}
                  aria-label="Back to chats"
                >
                  ‹
                </button>
                <div className="avatar big" style={avatarGradient(active?.name)}>
                  {initial(active?.name)}
                </div>
                <div>
                  <h3>{titleCase(active?.name)}</h3>
                  {active?.isLogin ?
                    <p>Online</p>
                    : <span>Offline</span>}
                </div>
              </>
            ) : (
              <span className="chat-header-placeholder">Messages</span>
            )}
          </div>
          <div className="avatar logout" title="Log Out" onClick={LogOut}>
            ⍈
          </div>
        </header>

        {hasActiveChat ? (
          <>
            <section className="messages">
              {Object.entries(groupedMessages).map(([date, messages]) => (
                <React.Fragment key={date}>
                  <div className="date-separator">
                    <span>{date}</span>
                  </div>
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`msg ${m.senderId === loginUser?.userId ? "me" : "them"
                        }`}
                    >
                      <div className="bubble">
                        {m.message}
                        <span className="time">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              <div ref={endRef}></div>
            </section>

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
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Pick a contact from the list or search for someone to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}
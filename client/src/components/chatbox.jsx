import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import axios from "axios";
import useDebounce from "../hooks/Debouncing";
import socket from "../../socket/socket.js";
import { useNavigate } from "react-router-dom";

export default function Chatbox() {
  const [loginUser, SetLogInuser] = useState()
  const [Messages, setMessage] = useState([])
  const [Conversations, setConversationss] = useState([])
  const [active, setActive] = useState({});
  const activeRef = useRef(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate()

  const openConversation = (conversationId, name, receiverId) => {
    setActive({
      id: conversationId,
      name,
      reciverId: receiverId,
    });

    activeRef.current = conversationId;

    messagesFetch(conversationId);
    // setSearch("")
  };

  useEffect(() => {
    const logeduser = JSON.parse(sessionStorage.getItem("user") || [])
    SetLogInuser(logeduser?.data)
    ConversationFetch(logeduser?.data?._id)
  }, [])
  console.log(users, "usersusers");

  useEffect(() => {
    if (loginUser?._id) {
      socket.emit("register", loginUser._id);
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

      console.log("Messages from API:", response.data);

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
        (a, b) =>
          new Date(b.updatedAt || 0) -
          new Date(a.updatedAt || 0)
      );
    });
  };
  useEffect(() => {

    const handleReceiveMessage = (data) => {
      console.log("RECEIVE MESSAGE:", data);
      updateConversationLastMessage(data)
      const newMessage = data?.message;

      if (!newMessage) return;

      const messageConversationId =
        data?.conversation?._id

      // Only show message if this conversation is currently open
      if (
        String(messageConversationId) !==
        String(activeRef.current)
      ) {
        return;
      }

      setMessage((prev) => [
        ...prev,
        newMessage
      ]);
    };


    const handleMessageSent = (data) => {
      console.log("MESSAGE SENT:", data);
      updateConversationLastMessage(data)
      const newMessage = data?.message;
      if (!newMessage) return;

      const messageConversationId =
        data?.conversation?._id

      // Only show message in currently opened chat
      if (
        String(messageConversationId) !==
        String(activeRef.current)
      ) {
        return;
      }

      setMessage((prev) => [
        ...prev,
        newMessage
      ]);
    };

    //  if(active.id === data?.message?.senderId){
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageSent", handleMessageSent);
    };

  }, []);

  const ConversationFetch = async (user_Id) => {
    try {
      const Conversations = await axios.get(`https://mitra-lyao.onrender.com/api/conversations/${user_Id}`)
      setConversationss(Conversations?.data)
    } catch (err) {
      console.log(err, "Conversation Fetch Error");

    }
  }
  // useEffect(() => {
  //   fetchContacts()
  // }, [])
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [active, Messages]);

  // const sendMessage = async () => {
  //   const SentData = search !== "" ? {
  //     "senderId": loginUser._id,
  //     "receiverId": active.id,
  //     "message": input,
  //   } :
  //     {
  //       "senderId": loginUser._id,
  //       "receiverId": active.reciverId,
  //       "message": input,
  //     }
  //   try {
  //     const sentmesage = await axios.post("https://mitra-lyao.onrender.com/api/createMessaage", SentData)
  //     alert("Message Sent!")
  //     setInput("")
  //     return sentmesage;
  //   } catch (err) {
  //     console.log(err, "Message Sent Error");

  //   }
  // }
  const sendMessage = () => {
    if (!input.trim()) return;

    const receiverId =
      search !== ""
        ? active.id
        : active.reciverId;

    if (!receiverId) {
      console.log("Receiver not selected");
      return;
    }

    socket.emit("sendMessage", {
      senderId: loginUser._id,
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
    });

    activeRef.current = null;

    setMessage([]);
  };
  let mergedConversations

  if (Object.keys(active).length > 0) {
    mergedConversations = [{ participants: [active] }, ...Conversations]
    // setSearch("")

  } else {
    mergedConversations = [...Conversations]
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  const LogOut = () => {
    sessionStorage.removeItem("user");
    setTimeout(() => {
      navigate("/");
    }, 100);

  };

  return (
    <div className={`chat-wrapper ${active?.id ? "chat-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>Hi👋 - {loginUser?.name.charAt(0).toUpperCase() + loginUser?.name.slice(1).toLowerCase()}</h2>
          <div className="Search_User_class">
            <input type="text" placeholder="Search name" value={search}
              onChange={(e) => setSearch(e.target.value)}></input>
          </div>
        </div>

        <div className="contact-list">
          {
            search !== ""
              ?
              users.map((c) => {
                const mine = c._id === loginUser._id
                if (mine) {
                  return ""
                }
                return (
                  <div
                    key={c._id}
                    className={`contact-item ${c._id === active.id ? "active" : ""}`}
                    onClick={() => {
                      setActive({
                        id: c._id,
                        name: c?.name,
                        reciverId: c?._id,
                      });

                      activeRef.current = null;

                      setMessage([]);

                      // setSearch("");
                    }}
                  >
                    <div className="avatar">
                      {c?.name?.charAt(0)}
                    </div>

                    <div className="contact-info">
                      <strong>{c?.name.charAt(0).toUpperCase() + c?.name?.slice(1).toLowerCase()}</strong>
                      {/* <br /> */}
                      <span>{c.lastMessage}</span>
                    </div>
                  </div>
                )
              })
              :
              mergedConversations.sort((msg) => msg.UpdateAt - 1).map((c) => {
                console.log(c, "jjjjjjjj");

                const otherUser = c.participants.find(
                  (p) => String(p._id) !== String(loginUser._id)
                );

                return (
                  <div
                    key={c._id}
                    className={`contact-item ${c._id === active.id ? "active" : ""}`}
                    onClick={
                      c._id
                        ? () => {
                          openConversation(
                            c._id,
                            otherUser?.name,
                            otherUser?._id
                          );
                        }
                        : undefined
                    } >
                    <div className="avatar">
                      {otherUser?.name?.charAt(0)}
                    </div>

                    <div className="contact-info">
                      <strong>{otherUser?.name.charAt(0).toUpperCase() + otherUser?.name?.slice(1).toLowerCase()}</strong>
                      <br />
                      <span>{c?.lastMessage}</span>
                    </div>
                  </div>
                );
              })

          }
        </div>
      </aside>

      <main className="chat-area">

        <header className="chat-header">
          <div className="chat-header1">
            {
              Object.keys(active).length > 0 ?
                <>
                  <button className="back-btn"
                    onClick={closeChat}
                    aria-label="Back to chats">
                    ‹
                  </button>
                  <div className="avatar big">
                    {active?.name?.charAt(0).toUpperCase() || ""}
                  </div>
                  <div>
                    <h3>{active?.name.charAt(0).toUpperCase() + active.name.slice(1).toLowerCase() || ""}</h3>
                    <p>{active?.name && "Online"}</p>
                  </div>

                </>
                :
                ""
            }
          </div>
          <div className="avatar logout" title="Log Out" onClick={() => { LogOut() }}>⍈</div>
        </header>

        <section className="messages">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <React.Fragment key={date}>

              {/* Date separator */}
              <div className="date-separator">
                <span>{date}</span>
              </div>
              {(Messages || []).map((m) => (
                <div key={m._id} className={`msg ${m.senderId === loginUser._id ? "me" : "them"} `}>
                  <div className="bubble">
                    {m.message}
                    <span className="time">{new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}</span>
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
      </main>
    </div>
  );
}

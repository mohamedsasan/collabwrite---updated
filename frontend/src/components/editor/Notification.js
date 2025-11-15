import React, { useState, useRef, useEffect } from "react";
import "./Notification.css";
import { io } from "socket.io-client";

export default function Notification({ show, onClose }) {
  const notifRef = useRef(null);
  const [toasts, setToasts] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Setup socket only once
  useEffect(() => {
    const s = io("http://localhost:5000", { transports: ["websocket", "polling"] });
    setSocket(s);

    // ✅ Listen for user join from backend
    s.on("user-join", ({ user }) => {
      showToast(`${user || "A new user"} has joined the document!`, "success");
    });

    // Cleanup
    return () => s.disconnect();
  }, []);

  // ✅ Show Toast Function
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // ✅ Example Notification Lists (kept same)
 const [notifications, setNotifications] = useState({
  new: [
    {
      id: 1,
      text: "A new user has arrived User_023",
      type: "info",
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
  ],
  old: [] // ✅ added to prevent .map() crash
});


  // ✅ Format Time
  const formatTime = (time) => {
    const diff = (Date.now() - time.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (!show)
    return (
      <>
        {toasts.map((t) => (
          <div key={t.id} className={`toast-notification toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === "success"
                ? "✓"
                : t.type === "error"
                ? "✕"
                : t.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <div className="toast-content">
              <div className="toast-title">
                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
              </div>
              <div className="toast-message">{t.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() =>
                setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
              }
            >
              ×
            </button>
          </div>
        ))}
      </>
    );

  return (
    <>
      {/* Toasts always visible */}
      {toasts.map((t) => (
        <div key={t.id} className={`toast-notification toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === "success"
              ? "✓"
              : t.type === "error"
              ? "✕"
              : t.type === "warning"
              ? "⚠"
              : "ℹ"}
          </span>
          <div className="toast-content">
            <div className="toast-title">
              {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
            </div>
            <div className="toast-message">{t.message}</div>
          </div>
          <button
            className="toast-close"
            onClick={() =>
              setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
            }
          >
            ×
          </button>
        </div>
      ))}

      {/* Regular Notification Popup */}
      <div ref={notifRef} className="notification-popup">
        <div className="notif-header">
          <strong className="notif-title">Notifications</strong>
          <button className="notif-close" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="notif-content">
          <div className="notif-section">
            <div className="notif-section-title">New</div>
            {notifications.new.map((n) => (
              <div key={n.id} className={`notif-item ${n.type} unread`}>
                <span className={`notif-icon ${n.type}`}>
                  {n.type === "success"
                    ? "✓"
                    : n.type === "error"
                    ? "✕"
                    : n.type === "warning"
                    ? "⚠"
                    : "ℹ"}
                </span>
                <div className="notif-content-text">
                  <div className="notif-title-text">{n.text}</div>
                  <div className="notif-time">{formatTime(n.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="notif-section">
            <div className="notif-section-title">Earlier</div>
            {notifications.old.map((n) => (
              <div key={n.id} className={`notif-item ${n.type} read`}>
                <span className={`notif-icon ${n.type}`}>
                  {n.type === "success"
                    ? "✓"
                    : n.type === "error"
                    ? "✕"
                    : n.type === "warning"
                    ? "⚠"
                    : "ℹ"}
                </span>
                <div className="notif-content-text">
                  <div className="notif-title-text">{n.text}</div>
                  <div className="notif-time">{formatTime(n.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notif-footer">
          <button
            className="notif-footer-btn"
            onClick={() => setNotifications({ new: [], old: [] })}
          >
            Clear all
          </button>
        </div>
      </div>
    </>
  );
}

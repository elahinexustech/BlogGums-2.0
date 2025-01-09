import React, { createContext, useEffect, useState } from "react";
import "./notifications.css";

// Create Context
export const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type) => {
        setNotifications((prev) => [...prev, { message, type, id: Date.now() }]);
    };

    const removeNotification = (id) => {
        console.log("HEYYEY DELETING NOTIFICATIOn")
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    return (
        <NotificationsContext.Provider value={{ addNotification, removeNotification }}>
            {children}

            {/* Render each notification in its own container */}
            {notifications.map(({ message, type, id }, index) => (
                <div
                    key={id}
                    className={`notifications ${notifications.length ? "show" : ""} ${type}`}
                    style={{ position: 'fixed', '--top': `${ (index+1) * 10 }px` }}
                    id={id}
                >
                    <div className={`notification flex jc-start`}>
                        {type === "success" && (
                            <i
                                className="bi bi-check-circle"
                                style={{ color: "var(--success)" }}
                            ></i>
                        )}
                        {type === "error" && (
                            <i
                                className="bi bi-exclamation-circle"
                                style={{ color: "var(--error)" }}
                            ></i>
                        )}
                        {type === "warning" && (
                            <i
                                className="bi bi-exclamation-triangle"
                                style={{ color: "var(--alert)" }}
                            ></i>
                        )}
                        <p>&nbsp; {message}</p>
                        <button
                            className="obj-trans circle closeBtn"
                            onClick={() => removeNotification(id)}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            ))}
        </NotificationsContext.Provider>
    );
};

export default NotificationsProvider;

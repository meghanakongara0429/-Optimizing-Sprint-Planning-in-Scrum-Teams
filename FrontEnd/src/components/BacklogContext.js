import React, { createContext, useState, useEffect } from "react";

// Create the context
export const BacklogContext = createContext();

// Provider component
export const BacklogProvider = ({ children }) => {
  const [backlog, setBacklog] = useState(() => {
    const saved = localStorage.getItem("backlog");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "Login Page", storyPoints: 3, businessValue: 8, urgency: "High" },
          { id: 2, title: "Payment Gateway", storyPoints: 5, businessValue: 9, urgency: "High" },
        ];
  });

  // Persist in localStorage
  useEffect(() => {
    localStorage.setItem("backlog", JSON.stringify(backlog));
  }, [backlog]);

  return (
    <BacklogContext.Provider value={{ backlog, setBacklog }}>
      {children}
    </BacklogContext.Provider>
  );
};

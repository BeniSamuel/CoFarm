// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ChatProvider from "./Context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // Remove React.StrictMode
  <ChatProvider>
    <App />
  </ChatProvider>
);
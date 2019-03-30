import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import createWebsocketContext from "react-with-websocket";
// import WebSocket from "isomorphic-ws";

const ws = new WebSocket("wss://sandbox.kaazing.net/echo");

const { WebsocketContextProvider, withWebsocket, withSubscription } = createWebsocketContext<WebSocket>();

const AppWithSub = withSubscription(
  App,
  "",
  { data: "", readyState: -1 },
  (d, ws) => ({ data: d || "", readyState: ws.readyState }),
  message => message.data.toString(),
  event => {
    if (event.eventType === "close") {
      return "closed! " + event.reason;
    }
    if (event.eventType === "open") {
      return "opened!";
    }
    if (event.eventType === "error") {
      return "error! " + (event.message || "").toString();
    }
    return "";
  },
);

const AppWithWs = withWebsocket(AppWithSub);
ReactDOM.render(
  <WebsocketContextProvider value={ws}><AppWithWs t={"1"}/></WebsocketContextProvider>
  ,
  document.getElementById("root") as HTMLElement
);
ws.onopen = () => {
  setTimeout(() => ws.send("Hi!"), 1000);
  setTimeout(() => ws.send("How do you do!"), 3000);
  setTimeout(() => {
    ws.close();
  }, 5000);
};
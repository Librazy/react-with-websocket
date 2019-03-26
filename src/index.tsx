import WebSocket from 'isomorphic-ws';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { WebsocketContextProvider, withWebsocket } from './WebsocketContext';
import { withWebsocketSubscription, ICloseEvent } from './WebsocketSubscription';

interface IComputedProps {
  data: string;
  readyState: number;
}

const ws = new WebSocket("wss://sandbox.kaazing.net/echo")
const AppWithSub = withWebsocketSubscription(
  App,
  (d, ws) => ({data: d, readyState: ws.readyState}) as IComputedProps,
  message => message.data, 
  event => {
    if (event.eventType === 'close') {
      return "closed! " + event.reason
    } 
    if (event.eventType === 'open') {
      return "opened!"
    } 
    if (event.eventType == 'error') {
      return "error! " + (event.message || "").toString()
    }
    return ""
  },
  )
const AppWithWs = withWebsocket(AppWithSub)
ReactDOM.render(
  <WebsocketContextProvider value={ws}><AppWithWs/></WebsocketContextProvider>
  ,
  document.getElementById('root') as HTMLElement
);
ws.onopen = () => {
  setTimeout(() => ws.send("Hi!"), 1000);
  setTimeout(() => ws.send("How do you do!"), 3000);
  setTimeout(() => {
    ws.close();
  }, 5000);
}
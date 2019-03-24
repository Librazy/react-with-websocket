import WebSocket from 'isomorphic-ws';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { WebsocketContextProvider, withWebsocket } from './WebsocketContext';
import { withWebsocketSubscription } from './WebsocketSubscription';

export interface IComputedProps {
  data: string;
  readyState: number;
}

const ws = new WebSocket("wss://sandbox.kaazing.net/echo")
const AppWithSub = withWebsocketSubscription(App, d => d.toString(), (d, r) => ({data: d, readyState: r}) as IComputedProps)
const AppWithWs = withWebsocket(AppWithSub)
ReactDOM.render(
  <WebsocketContextProvider value={ws}><AppWithWs/></WebsocketContextProvider>
  ,
  document.getElementById('root') as HTMLElement
);
ws.onopen = () => {
  ws.send("Hi!");
  setTimeout(() => ws.send("How do you do!"), 1000);
}
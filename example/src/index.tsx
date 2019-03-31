import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { WebSocketContextProvider } from 'react-with-websocket'

const ws = new WebSocket('wss://sandbox.kaazing.net/echo')

ReactDOM.render(
    <WebSocketContextProvider value={ws}>
        <App t="1" />
    </WebSocketContextProvider>,
    document.getElementById('root') as HTMLElement,
)
ws.onopen = () => {
    setTimeout(() => ws.send('Hi!'), 1000)
    setTimeout(() => ws.send('How do you do!'), 3000)
    setTimeout(() => {
        ws.close()
    }, 5000)
}

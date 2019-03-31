import { createWebSocketContext } from './WebSocketContext'
export default createWebSocketContext

const {
    WebSocketContext,
    WebSocketContextConsumer,
    WebSocketContextProvider,
    withWebSocket,
    createSubscription,
    createWebSocketSubscription,
    subscribe,
} = createWebSocketContext<WebSocket>()

export {
    WebSocketContext,
    WebSocketContextConsumer,
    WebSocketContextProvider,
    withWebSocket,
    createSubscription,
    createWebSocketSubscription,
    subscribe,
}

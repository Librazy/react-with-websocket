import { createWebSocketContext } from './Context'
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

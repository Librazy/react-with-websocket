import { createWebsocketContext } from './WebsocketContext'
export default createWebsocketContext

const {
    WebsocketContext,
    WebsocketContextConsumer,
    WebsocketContextProvider,
    withWebsocket,
    withSubscription,
} = createWebsocketContext<WebSocket>()

export {
    WebsocketContext,
    WebsocketContextConsumer,
    WebsocketContextProvider,
    withWebsocket,
    withSubscription,
}

import WebSocket from 'isomorphic-ws';
import * as React from 'react';

export const WebsocketContext = React.createContext<WebSocket>({} as WebSocket);

export const WebsocketContextProvider = WebsocketContext.Provider;

export const WebsocketContextConsumer = WebsocketContext.Consumer;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withWebsocket
    <
        P extends { websocketContext: WebSocket},
        R = Omit<P, 'websocketContext'>
    >
    (
        Component: React.ComponentClass<P> | React.StatelessComponent<P>
    ): React.FunctionComponent<R> {
    return function applyWebsocketContext(props: R) {
        const value = React.useContext(WebsocketContext)
        return <Component {...props as any} websocketContext={value}/>
    };
}

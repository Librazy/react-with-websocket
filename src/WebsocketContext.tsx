import * as React from 'react'
import { IWebSocket } from './ws';
import { withSubscription as withSubscriptionTyped, StateToPropMapper, IMessageEvent, ICloseEvent, IOpenEvent, IErrorEvent, Delta } from './WebsocketSubscription'

export function createWebsocketContext<WebSocketType extends IWebSocket>() {
    
    const WebsocketContext = React.createContext<WebSocketType>({} as WebSocketType);

    const WebsocketContextProvider = WebsocketContext.Provider;

    const WebsocketContextConsumer = WebsocketContext.Consumer;
    
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    
    function withWebsocket
        <
            P extends { websocketContext: WebSocketType},
            R = Omit<P, 'websocketContext'>
        >
        (
            Component: React.ComponentClass<P> | React.StatelessComponent<P>
        ): React.FunctionComponent<R> {
        return function withWebsocket(props: R) {
            const value = React.useContext(WebsocketContext)
            return <Component {...props as any} websocketContext={value}/>
        };
    }

    function withSubscription
    <
        StateType,
        InheritPropType,
        ComputedPropType,
        PropType
        extends
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebSocketType } =
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebSocketType }
    >(
        Component: React.ComponentClass<InheritPropType> | React.StatelessComponent<InheritPropType>,
        initState: StateType,
        fallbackProps: ComputedPropType,
        mapStateToProps: StateToPropMapper<StateType, ComputedPropType, WebSocketType>,
        mapMessageToState: (message: IMessageEvent<WebSocketType>)
            => (StateType | null),
        mapEventToState: (event: ICloseEvent<WebSocketType> | IOpenEvent<WebSocketType> | IErrorEvent<WebSocketType>)
            => (StateType | null) = (_) => null,
) {
    return withSubscriptionTyped
        <StateType, InheritPropType, ComputedPropType, WebSocketType, PropType>
        (Component, initState, fallbackProps, mapStateToProps, mapMessageToState, mapEventToState);
}

    return { WebsocketContext, WebsocketContextConsumer, WebsocketContextProvider, withWebsocket, withSubscription }
}



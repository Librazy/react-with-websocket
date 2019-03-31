import * as React from 'react'
import { IWebSocket } from './ws'
import {
    subscribe as subscribeTyped,
    StateToPropMapper,
    IMessageEvent,
    ICloseEvent,
    IOpenEvent,
    IErrorEvent,
    Delta,
} from './Subscription'

export function createWebSocketContext<WebSocketType extends IWebSocket>() {
    const WebSocketContext = React.createContext<WebSocketType>(
        {} as WebSocketType,
    )

    const WebSocketContextProvider = WebSocketContext.Provider

    const WebSocketContextConsumer = WebSocketContext.Consumer

    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

    type EventTypes =
        | ICloseEvent<WebSocketType>
        | IOpenEvent<WebSocketType>
        | IErrorEvent<WebSocketType>

    const withWebSocket = <
        P extends { webSocketContext: WebSocketType },
        R = Omit<P, 'webSocketContext'>
    >(
        Component: React.ComponentType<P>,
    ): React.ComponentType<R> =>
        function withWebSocket(props: R): React.ReactElement {
            const value = React.useContext(WebSocketContext)
            return <Component {...props as any} webSocketContext={value} />
        }

    function subscribe<StateType, InheritPropType, ComputedPropType>(
        Component: React.ComponentType<InheritPropType>,
        initState: StateType,
        fallbackProps: ComputedPropType,
        mapStateToProps: StateToPropMapper<
            StateType,
            ComputedPropType,
            WebSocketType
        >,
        mapMessageToState: (
            message: IMessageEvent<WebSocketType>,
        ) => StateType | null,
        mapEventToState: (event: EventTypes) => StateType | null = _ => null,
    ) {
        return subscribeTyped<
            StateType,
            InheritPropType,
            ComputedPropType,
            WebSocketType
        >(
            Component,
            initState,
            fallbackProps,
            mapStateToProps,
            mapMessageToState,
            mapEventToState,
        )
    }

    function createSubscription<StateType, ComputedPropType>(
        initState: StateType,
        fallbackProps: ComputedPropType,
        mapStateToProps: StateToPropMapper<
            StateType,
            ComputedPropType,
            WebSocketType
        >,
        mapMessageToState: (
            message: IMessageEvent<WebSocketType>,
        ) => StateType | null,
        mapEventToState: (event: EventTypes) => StateType | null = _ => null,
    ) {
        return function withSubscription<InheritPropType>(
            Component: React.ComponentType<InheritPropType>,
        ) {
            return subscribe<StateType, InheritPropType, ComputedPropType>(
                Component,
                initState,
                fallbackProps,
                mapStateToProps,
                mapMessageToState,
                mapEventToState,
            )
        }
    }

    function createWebSocketSubscription<StateType, ComputedPropType>(
        initState: StateType,
        fallbackProps: ComputedPropType,
        mapStateToProps: StateToPropMapper<
            StateType,
            ComputedPropType,
            WebSocketType
        >,
        mapMessageToState: (
            message: IMessageEvent<WebSocketType>,
        ) => StateType | null,
        mapEventToState: (event: EventTypes) => StateType | null = _ => null,
    ) {
        return function withWebSocketSubscription<InheritPropType>(
            Component: React.ComponentType<InheritPropType>,
        ): React.ComponentType<Delta<InheritPropType, ComputedPropType>> {
            const withSubscription = createSubscription<
                StateType,
                ComputedPropType
            >(
                initState,
                fallbackProps,
                mapStateToProps,
                mapMessageToState,
                mapEventToState,
            )

            return withWebSocket(withSubscription(Component))
        }
    }

    return {
        WebSocketContext,
        WebSocketContextConsumer,
        WebSocketContextProvider,
        withWebSocket,
        createSubscription,
        createWebSocketSubscription,
        subscribe,
    }
}

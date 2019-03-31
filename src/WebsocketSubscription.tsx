import * as React from 'react'
import { IWebSocket, IWebSocketData } from './ws'

export interface ICloseEvent<TWebSocket> {
    eventType: 'close'
    wasClean: boolean
    code: number
    reason: string
    target: TWebSocket
}

export interface IErrorEvent<TWebSocket> {
    eventType: 'error'
    error: any
    message: any
    type: string
    target: TWebSocket
}

export interface IOpenEvent<TWebSocket> {
    eventType: 'open'
    target: TWebSocket
}

export interface IMessageEvent<TWebSocket> {
    eventType: 'message'
    data: IWebSocketData
    type: string
    target: TWebSocket
}

export type StateUpdater<StateType> =
    | StateType
    | ((prevState: StateType) => StateType)

export type StateExactor<EventType, StateType> = (
    event: EventType,
) => StateUpdater<StateType> | null

export type StateToPropMapper<StateType, ComputedPropType, WebSocketType> = (
    data: StateType | null,
    websocket: WebSocketType,
) => ComputedPropType | null

const makeCallBack = function<
    EventType extends { eventType: string },
    StateType
>(
    exactor: StateExactor<EventType, StateType>,
    receiver: (state: StateUpdater<StateType>) => void,
): (eventType: string) => (event: EventType) => void {
    return (eventType: string) => (event: EventType) => {
        event.eventType = eventType
        const d = exactor(event)
        if (d !== null) {
            receiver(d)
        }
    }
}

export type Delta<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] }

export function subscribe<
    StateType,
    InheritPropType,
    ComputedPropType,
    WebSocketType extends IWebSocket = IWebSocket
>(
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
    ) => StateUpdater<StateType> | null,
    mapEventToState: (
        event:
            | ICloseEvent<WebSocketType>
            | IOpenEvent<WebSocketType>
            | IErrorEvent<WebSocketType>,
    ) => StateUpdater<StateType> | null = _ => null,
): React.FunctionComponent<
    Delta<InheritPropType, ComputedPropType> & {
        webSocketContext: WebSocketType
    }
> {
    return (
        props: Delta<InheritPropType, ComputedPropType> & {
            webSocketContext: WebSocketType
        },
    ) => {
        const [data, setData] = React.useState<StateType>(initState)
        React.useEffect(() => {
            const messageCb = makeCallBack(mapMessageToState, setData)
            props.webSocketContext.addEventListener('message', messageCb(
                'message',
            ) as (_: any) => void)
            return () => {
                props.webSocketContext.removeEventListener('message', messageCb(
                    'message',
                ) as (_: any) => void)
            }
        }, [props.webSocketContext])
        React.useEffect(() => {
            const eventCb = makeCallBack(mapEventToState, setData)
            props.webSocketContext.addEventListener('open', eventCb('open') as (
                _: any,
            ) => void)
            props.webSocketContext.addEventListener('close', eventCb(
                'close',
            ) as (_: any) => void)
            props.webSocketContext.addEventListener('error', eventCb(
                'error',
            ) as () => void)
            return () => {
                props.webSocketContext.removeEventListener('open', eventCb(
                    'open',
                ) as () => void)
                props.webSocketContext.removeEventListener('close', eventCb(
                    'close',
                ) as () => void)
                props.webSocketContext.removeEventListener('error', eventCb(
                    'error',
                ) as () => void)
            }
        }, [props.webSocketContext])
        const computedProps =
            mapStateToProps(data, props.webSocketContext) || fallbackProps
        return <Component {...props as any} {...computedProps} />
    }
}

import * as React from 'react'
import { IWebSocket, IWebSocketData } from './ws'

export interface ICloseEvent<TWebsocket> {
    eventType: "close";
    wasClean: boolean;
    code: number;
    reason: string;
    target: TWebsocket;
}

export interface IErrorEvent<TWebsocket> {
    eventType: "error";
    error: any;
    message: any;
    type: string;
    target: TWebsocket;
}

export interface IOpenEvent<TWebsocket> {
    eventType: "open";
    target: TWebsocket;
}

export interface IMessageEvent<TWebsocket> {
    eventType: "message";
    data: IWebSocketData;
    type: string;
    target: TWebsocket;
}

export type StateUpdater<StateType> = StateType | ((prevState: StateType) => StateType);
export type StateExactor<EventType, StateType> = (event: EventType) => (StateUpdater<StateType> | null);
export type StateToPropMapper<StateType, ComputedPropType, WebsocketType> = (data: StateType | null, websocket: WebsocketType) => ComputedPropType | null;

const makeCallBack =
    function <EventType extends { eventType: string }, StateType>(
        exactor: StateExactor<EventType, StateType>,
        receiver: (state: StateUpdater<StateType>) => void
    )
        : (eventType: string) => (event: EventType) => void {
        return (eventType: string) => (event: EventType) => {
            event.eventType = eventType;
            const d = exactor(event);
            if (d !== null) {
                receiver(d);
            }
        }
    }

export type Delta<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] }

export function withSubscription
    <
        StateType,
        InheritPropType,
        ComputedPropType,
        WebsocketType extends IWebSocket = IWebSocket,
        PropType
        extends
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebsocketType } =
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebsocketType }
    >(
        Component: React.ComponentClass<InheritPropType> | React.StatelessComponent<InheritPropType>,
        initState: StateType,
        fallbackProps: ComputedPropType,
        mapStateToProps: StateToPropMapper<StateType, ComputedPropType, WebsocketType>,
        mapMessageToState: (message: IMessageEvent<WebsocketType>) => (StateType | null),
        mapEventToState: (event: ICloseEvent<WebsocketType> | IOpenEvent<WebsocketType> | IErrorEvent<WebsocketType>)
            => (StateType | null) = (_) => null,
): React.FunctionComponent<PropType> {
    return function withSubscription(props: PropType) {
        const [data, setData] = React.useState<StateType>(initState);
        React.useEffect(() => {
            const messageCb = makeCallBack(mapMessageToState, setData);
            props.websocketContext.addEventListener('message', messageCb('message') as (_: any) => void);
            return () => { props.websocketContext.removeEventListener('message', messageCb('message') as (_: any) => void); }
        }, [props.websocketContext])
        React.useEffect(() => {
            const eventCb = makeCallBack(mapEventToState, setData);
            props.websocketContext.addEventListener('open', eventCb('open') as (_: any) => void);
            props.websocketContext.addEventListener('close', eventCb('close') as (_: any) => void);
            props.websocketContext.addEventListener('error', eventCb('error') as () => void);
            return () => {
                props.websocketContext.removeEventListener('open', eventCb('open') as () => void);
                props.websocketContext.removeEventListener('close', eventCb('close') as () => void);
                props.websocketContext.removeEventListener('error', eventCb('error') as () => void);
            }
        }, [props.websocketContext])
        const computedProps = mapStateToProps(data, props.websocketContext) || fallbackProps;
        return (
            <Component {...props as any} {...computedProps} />
        )
    };
}

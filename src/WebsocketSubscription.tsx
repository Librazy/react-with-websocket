import WebSocket from 'isomorphic-ws';
import * as React from 'react';

export interface ICloseEvent {
    eventType: "close";
    wasClean: boolean;
    code: number;
    reason: string;
    target: WebSocket;
}

export interface IErrorEvent {
    eventType: "error";
    error: any;
    message: any;
    type: string;
    target: WebSocket;
}

export interface IOpenEvent {
    eventType: "open";
    target: WebSocket;
}

export interface IMessageEvent {
    eventType: "message";
    data: WebSocket.Data;
    type: string;
    target: WebSocket;
}
type StateUpdater<StateType> = StateType | ((prevState: StateType) => StateType)
type StateExactor<EventType, StateType> = (event: EventType) => (StateUpdater<StateType> | null);
type StateToPropMapper<StateType, ComputedPropType> = (data: StateType | null, websocket: WebSocket) => ComputedPropType | null;

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

type Delta<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] }

export function withWebsocketSubscription
    <
        StateType,
        InheritPropType,
        ComputedPropType,
        PropType
        extends
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebSocket } =
        Delta<InheritPropType, ComputedPropType> & { websocketContext: WebSocket }
    >(
        Component: React.ComponentClass<InheritPropType> | React.StatelessComponent<InheritPropType>,
        initState: StateType,
        fallbackProps: ComputedPropType,
        stateMapper: StateToPropMapper<StateType, ComputedPropType>,
        messageExactor: (message: IMessageEvent) => (StateType | null),
        eventExactor: (event: ICloseEvent | IOpenEvent | IErrorEvent) => (StateType | null) = (_) => null,
): React.FunctionComponent<PropType> {
    return function applyWebsocketSubscription(props: PropType) {
        const [data, setData] = React.useState<StateType>(initState);
        React.useEffect(() => {
            const messageCb = makeCallBack(messageExactor, setData);
            props.websocketContext.addEventListener('message', messageCb('message') as (_: any) => void);
            return () => { props.websocketContext.removeEventListener('message', messageCb('message') as (_: any) => void); }
        }, [props.websocketContext])
        React.useEffect(() => {
            const eventCb = makeCallBack(eventExactor, setData);
            props.websocketContext.addEventListener('open', eventCb('open') as (_: any) => void);
            props.websocketContext.addEventListener('close', eventCb('close') as (_: any) => void);
            props.websocketContext.addEventListener('error', eventCb('error') as () => void);
            return () => {
                props.websocketContext.removeEventListener('open', eventCb('open') as () => void);
                props.websocketContext.removeEventListener('close', eventCb('close') as () => void);
                props.websocketContext.removeEventListener('error', eventCb('error') as () => void);
            }
        }, [props.websocketContext])
        const computedProps = stateMapper(data, props.websocketContext) || fallbackProps;
        return (
            <Component {...props as any} {...computedProps} />
        )
    };
}

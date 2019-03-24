import WebSocket from 'isomorphic-ws';
import * as React from 'react';

type StateMapper<D, T> = (data: D|null, readyState: number) => T;
export function withWebsocketSubscription
    <
        DataType,
        PropTypes extends { websocketContext: WebSocket },
        ComputedProps
    >(
        Component: React.ComponentClass<PropTypes> | React.StatelessComponent<PropTypes>,
        DataExactor: (data: WebSocket.Data) => (DataType | null),
        Mapper: StateMapper<DataType, ComputedProps>
    ): React.SFC<Exclude<PropTypes, ComputedProps>> {
    return function applyWebsocketSubscription(props: Exclude<PropTypes, ComputedProps>) {
        const [data, setData] = React.useState<DataType | null>(null);
        React.useEffect(() => {
            const cb = (wsData: WebSocket.Data) => {
                const d = DataExactor(wsData);
                if (d !== null) {
                    setData(d);
                }
            };
            const delegateCb = (event : any|MessageEvent) => cb(event.data);
            if (props.websocketContext.addListener) {
                props.websocketContext.addListener('message', cb);
                return () => { props.websocketContext.removeListener('message', cb); }
            } else {
                props.websocketContext.addEventListener('message', delegateCb);
                return () => { props.websocketContext.removeEventListener('message', delegateCb); }
            }
        }, [props.websocketContext])
        const computedProps = Mapper(data, props.websocketContext.readyState);
        return (
            <Component {...props as any} {...computedProps} />
        )
    };
}

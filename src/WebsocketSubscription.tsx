import * as WebSocket from 'isomorphic-ws';
import * as React from 'react';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withWebsocketSubscription
    <
        D,
        R extends { data?: D, connectState?: number, websocketContext: WebSocket },
        S = Omit<R, 'data'>,
    >(
        Component: React.ComponentClass<R> | React.StatelessComponent<R>,
        DataExactor: (data: WebSocket.Data) => D | null
    ): React.SFC<S> {
    return function applyWebsocketContext(props: S & { websocketContext: WebSocket }) {
        const [data, setData] = React.useState<D | null>(null);
        React.useEffect(() => {
            const cb = (wsData: WebSocket.Data) => {
                const d = DataExactor(wsData);
                if (d !== null) {
                    setData(d);
                }
            };
            props.websocketContext.addListener('message', cb);
            return () => { props.websocketContext.removeListener('message', cb); }
        }, [props.websocketContext])
        return (
            <Component {...props as any} data={data} readyState={props.websocketContext.readyState} />
        )
    };
}

import * as WebSocket from 'isomorphic-ws';
import * as React from 'react';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type StateMapper<D> = (data: D|null, readyState: number) => object;
export function withWebsocketSubscription
    <
        D,
        R extends { data?: D, readyState?: number, websocketContext?: WebSocket },
        S = Omit<R, 'data'|'readyState'>,
    >(
        Component: React.ComponentClass<R> | React.StatelessComponent<R>,
        DataExactor: (data: WebSocket.Data) => (D | null),
        Mapper?: StateMapper<D>
    ): React.SFC<S> {
    return function applyWebsocketSubscription(props: S & { websocketContext: WebSocket }) {
        const [data, setData] = React.useState<D | null>(null);
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
        const noop: StateMapper<D> = (d: D, r: number) => ({data: d, readyState: r});
        const mapper: StateMapper<D> = Mapper ? Mapper :noop;
        const computedProps = mapper(data, props.websocketContext.readyState);
        return (
            <Component {...props as any} {...computedProps} />
        )
    };
}

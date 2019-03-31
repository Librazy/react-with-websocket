export interface IWebSocket {
    // HTML5 WebSocket events
    addEventListener(
        method: 'message',
        cb?: (event: { data: any; type: string; target: IWebSocket }) => void,
    ): void
    addEventListener(
        method: 'close',
        cb?: (event: {
            wasClean: boolean
            code: number
            reason: string
            target: IWebSocket
        }) => void,
    ): void
    addEventListener(
        method: 'error',
        cb?: (event: {
            error: any
            message: any
            type: string
            target: IWebSocket
        }) => void,
    ): void
    addEventListener(
        method: 'open',
        cb?: (event: { target: IWebSocket }) => void,
    ): void
    addEventListener(
        method: string,
        listener: (this: IWebSocket, ev: any) => any,
    ): void

    removeEventListener(
        method: 'message',
        cb?: (event: { data: any; type: string; target: IWebSocket }) => void,
    ): void
    removeEventListener(
        method: 'close',
        cb?: (event: {
            wasClean: boolean
            code: number
            reason: string
            target: IWebSocket
        }) => void,
    ): void
    removeEventListener(
        method: 'error',
        cb?: (event: {
            error: any
            message: any
            type: string
            target: IWebSocket
        }) => void,
    ): void
    removeEventListener(
        method: 'open',
        cb?: (event: { target: IWebSocket }) => void,
    ): void
    removeEventListener(
        method: string,
        listener: (this: IWebSocket, ev: any) => any,
    ): void
}

export type IWebSocketData = string | Buffer | ArrayBuffer | Buffer[]

import React from 'react'
import logo from './logo.svg'
import './App.css'
import { createWebSocketSubscription } from 'react-with-websocket'

export interface IAppProps {
    data: string
    readyState: number
    t: string
}

const withWebsocketSubscription = createWebSocketSubscription(
    '',
    { data: '', readyState: -1 },
    (d, ws) => ({ data: d || '', readyState: ws.readyState }),
    message => message.data.toString(),
    event => {
        if (event.eventType === 'close') {
            return `closed! ${event.reason}`
        }
        if (event.eventType === 'open') {
            return 'opened!'
        }
        if (event.eventType === 'error') {
            return `error! ${(event.message || '').toString()}`
        }
        return ''
    },
)

class App extends React.Component<IAppProps> {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    WebSocket is {this.props.readyState} and newest data is{' '}
                    {this.props.data}. {this.props.t}
                </p>
            </div>
        )
    }
}

export default withWebsocketSubscription(App)

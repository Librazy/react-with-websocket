import * as React from 'react';
import './App.css';

import logo from './logo.svg';

export interface IAppProps {
  data: string;
  readyState: number;
  t: string;
}

class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          WebSocket is {this.props.readyState} and newest data is {this.props.data}. {this.props.t}
        </p>
      </div>
    );
  }
}

export default App;

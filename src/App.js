import { Component } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket} from "websocket";

const client = new W3CWebSocket('ws://localhost:8088/ws');

class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "Eddy",
    }
  }

  joinChat(event) {
    event.preventDefault()
    let user = event.target.username.value
    this.setState({username: user})
    let body = " has joined the chat"
    client.send(JSON.stringify({user, body}))
  }

  sendMessage(event) {
    event.preventDefault()
    const user = this.state.username
    let body = event.target.body.value;
    client.send(JSON.stringify({user, body}))
  }

  render() {
    return (
      <div>
        <h1>Stealth</h1>
        <h2>real time encrypted chat</h2>
        <form className="Userconnection" onSubmit={this.joinChat.bind(this)}>
          <input name="username" type="text" placeholder="Username"></input>
          <button type="submit">Connection</button>  
        </form>
        <form className="Messaging" onSubmit={this.sendMessage.bind(this)}>
        <input name="body" type="text" placeholder="Message"></input>
        <button type="submit">Send your message</button>  
        </form>
      </div>
    );
  }

}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // username: "",
      // msgbody: "",
      messages: []
    }
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    }; 
    client.onmessage = (message) => {
      const {user, body} = JSON.parse(message.data)
      console.log("new message received", user, body);
      const messages = this.state.messages.slice();
      messages.push({user, body});
      this.setState({messages: messages})
      // console.log("print array messages : ", this.state.messages)
    };
  }
  
  
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <div className="inputcontainer">
          <Chat />
          </div>
          <div className="messagecontainer">
          {this.state.messages.map( (message, i) => (
            <div className="container darker" key={i}>
                <p className="NMUsername">user: {message.user}</p>
                <p className="Newmessage">{message.body}</p>
            </div> 
          ))}
          </div>
        </div>  
        </div>
    );
  }
}

export default App;

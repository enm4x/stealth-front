import React from 'react';
import { Component } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket} from "websocket";
import Conversation from './Conversation'

const client = new W3CWebSocket('ws://localhost:8088/ws');


class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "Username",
      showRegistration: true,
      msg: ''
    }
  }

  userRegistration = (event) => {
    event.preventDefault()
    let user = event.target.username.value
    this.setState({username: user})
    let body = " has joined the chat"
    client.send(JSON.stringify({user, body}))
    this.setState({showRegistration: false})
  }

  sendMessage = (event) => {
    event.preventDefault()
    const user = this.state.username
    let body = event.target.body.value;
    client.send(JSON.stringify({user, body}))
    this.setState({msg: ''})
  }

  handleChange = (event) => {
      const value = event.currentTarget.value
      this.setState({msg: value})
  }

  render() {
    return (
      <div className="Userconnection-form">
        { 
          this.state.showRegistration ? (
          <form  onSubmit={this.userRegistration}>
            <input name="username" type="text" placeholder="Username"></input>
            <button type="submit">Connection</button>  
          </form>
        ):(
        <form className="Messaging-form" onSubmit={this.sendMessage}>
          <input value={this.state.msg} onChange={this.handleChange} name="body" type="text" placeholder="Message"></input>
          <button type="submit">Send your message</button>  
        </form>
        )
        }        
      </div>
    );
  }

}
class Messages extends Component {
  
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
    return(
      <div className="Messagebox">
      {this.state.messages.map( (message, i) => (
        <div className="Messagecontainer " key={i}>
            <p className="NMUsername">{message.user}</p>
            <p className="Newmessage">{message.body}</p>
        </div> 
      ))}
      </div>
    )
  }

}
class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="global-container">
            <div className="Side-bar-left">
            <header>
              <h1>Stealth</h1>
            </header>
            <Conversation />
            </div>
            <div className="Chat-body-right">
              <Messages />
              <Input />
            </div>
        </div>  
      </div>
    );
  }
}

export default App;

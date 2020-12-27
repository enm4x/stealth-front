import React from 'react';
import { Component } from 'react';
import * as crypto from 'crypto';

import Conversation from './Conversation';
import { Client } from './Websocket';
import { stealthFrame } from './model/Globals'
import './App.css';

// On définit notre algorithme de cryptage
var algorithm = 'aes256';
// Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
var password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      showRegistration: true,
      msg: ''
    }
  }

  cypherOutput = (frame) => {
    //fonction de chiffrement
    var bodyString = String(frame);
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(bodyString,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  userRegistration = (event) => {
    event.preventDefault()
    let userFrame = stealthFrame;
    userFrame.type = "register"
    userFrame.id = event.target.username.value
    this.setState({username: userFrame.id})
    userFrame.content = this.cypherOutput(" is connected")
    Client.send(JSON.stringify(userFrame))
    this.setState({showRegistration: false})
  }

  sendMessage = (event) => {
    event.preventDefault()
    if (event.target.body.value === "" ) {
      console.log("error input empty")
    }
    let userFrame = stealthFrame;
    userFrame.id = this.state.username
    userFrame.type = "message"
    userFrame.content = this.cypherOutput(event.target.body.value);
    Client.send(JSON.stringify(userFrame))
    this.setState({msg: ''})
  }

  handleChange = (event) => {
      this.setState({msg: event.currentTarget.value})
  }

  render() {
    return (
      <div>
      <Messages myUserName={this.state.username}/>
      
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
      </div>
      
    );
  }

}
class Messages extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  }

  decypher = (input) => {
      var bodyString = String(input.content);
      var decipher = crypto.createDecipher(algorithm,password);
      var dec = decipher.update(bodyString,'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
  }

  componentDidMount() {
    Client.onopen = () => {
      console.log('WebSocket Client Connected');
    }; 
    Client.onmessage = (message) => {
      console.log(message.data);
      if ( message.data.type === "message"){
        let receivedFrame = stealthFrame ;
        receivedFrame = JSON.parse(message.data)
  
        const body = this.decypher(receivedFrame);
        const messages = this.state.messages.slice();
        
        let user = receivedFrame.id
        messages.push({user, body});
        this.setState({messages: messages})
      }
    };
  }

  render() {
    return(
      <div className="Messagebox">
      {this.state.messages.map( (message, i) => (

      message.user === this.props.myUserName ? ( 
        <div className="Messagecontainer" key={i}>
           <p className="NMUsername">{message.user}</p>
           <p className="message-sent">{message.body}</p>
        </div> 
      ):(
        <div className="message-received-container" key={i}>
          <p className="message-received">{message.body}</p>
          <p className="message-received-username">{message.user}</p>
        </div> 
      ) 
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
              <Input />
            </div>
        </div>  
      </div>
    );
  }
}

export default App;

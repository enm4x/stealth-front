import React from 'react';
import { Component } from 'react';
import { crypto } from 'crypto';

import Conversation from './Conversation';
import { Client } from './Websocket';
import './App.css';

// On définit notre algorithme de cryptage
var algorithm = 'aes256';
// Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
var password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

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
    var bodyString = String(body);
    // On crypte notre texte
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(bodyString,'utf8','hex');
    crypted += cipher.final('hex');
    body = crypted;
    Client.send(JSON.stringify({user, body}))
    this.setState({showRegistration: false})
  }

  sendMessage = (event) => {
    event.preventDefault()
    const user = this.state.username
    let body = event.target.body.value;
    var bodyString = String(body);
    // On crypte notre texte
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(bodyString,'utf8','hex');
    crypted += cipher.final('hex');
    body = crypted;
    console.log(crypted)
    Client.send(JSON.stringify({user, body}))
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
    Client.onopen = () => {
      console.log('WebSocket Client Connected');
    }; 
    Client.onmessage = (message) => {
      const {user, body} = JSON.parse(message.data)
      console.log("new message received", user, body);
      const messages = this.state.messages.slice();
      // On décrypte notre texte
      var bodyString = String(body);
      var decipher = crypto.createDecipher(algorithm,password);
      var dec = decipher.update(bodyString,'hex','utf8');
      dec += decipher.final('utf8');
      console.log(dec);
      messages.push({user, dec});
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
            <p className="Newmessage">{message.dec}</p>
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

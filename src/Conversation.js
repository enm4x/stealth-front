import React from 'react';
import { Component } from 'react';
import './Conversation.css';
import  Defaultlogo from './img/icon.svg';

class Conversation extends Component {

    constructor(props) {
        super(props);
        this.state = {
          conversations: [
              {
                user: "Edouard",
                logo:  "./img/icon.svg"   
              },
              {
                user: "Pierre",
                logo:  "" 
              },
              {
                user: "Alice",
                logo:  "" 
              },
              {
                user: "Bob",
                logo:  "" 
              },
              {
                user: "Louis",
                logo:  "" 
              }
          ],
        }
      }

    render(){
        return(
            <div className="Conversations-container">
                {this.state.conversations.map( (conversations, i) => (
                    <div className="Conversation-box" key={i}>
                        <p className="Conversation-username">{conversations.user}</p>
                        <div className="Avatar">
                            <img src={Defaultlogo}  className="userAvatar" alt="DefaultLogo"/>
                        </div>
                        </div> 
                ))}
        </div>
        );
        }
}

export default Conversation;
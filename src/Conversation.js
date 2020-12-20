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
              }
          ],
        }
      }

    render(){
        return(
            <div>
                {this.state.conversations.map( (conversations, i) => (
                    <div className="Conversation-box" key={i}>
                        <p className="">user: {conversations.user}</p>
                        <avatar>
                        <img src={Defaultlogo} width="50" height="50"/>
                        </avatar>
                        </div> 
                ))}
        </div>
        );
        }
}

export default Conversation;
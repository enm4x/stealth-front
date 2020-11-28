import { Component } from 'react';

class Messages extends Component {

    constructor(props) {
      super(props)
      this.state = {
        // username: "",
        // msgbody: "",
        messages: [
          { usr: "blyat", msg: "premier"},
          { usr: "cyka", msg: "second"}
        ]
      }
    }
  
    componentDidMount() {
      
      client.onmessage = (message) => {
        const {user, body} = JSON.parse(message.data)
        console.log("new message received", user, body);
        // this.setState({username: user, msgbody: body})
        // this.setState((state, props) => {
        //   state.messages.push({user, body})
        //   console.log(state)
        // })
        // console.log("print array messages : ", this.state.messages)
        };
    }
  
    render() {
      const msgs = this.state.messages.map(function(message){
      return <li>{msgs}</li>
      })
      return(
      <div>
        {msgs}
      </div>
      );
    }
  
  }

export default Messages;

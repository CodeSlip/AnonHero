import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./utils/getWeb3";
import {Button} from 'reactstrap';

import "./App.css";
import web3Obj from './helper'

// Components
import Map from './Map/Map';

class App extends React.Component {
  state = {
    account: '',
    balance: '',
    loggedIn: false,
  }

  componentDidMount() {
    const isTorus = sessionStorage.getItem('pageUsingTorus')
    if (isTorus) {
      web3Obj.initialize().then(() => {
        this.setStateInfo()
      })
      this.setState({
        loggedIn: true
      })
    }
    if (!isTorus) {
      this.setState({
        loggedIn: false
      })
    }
  }

  setStateInfo = () => {
    console.log("current status", web3Obj.web3)
    web3Obj.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] })
      web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
        this.setState({ balance: balance })
      })
    })
  }

  enableTorus = async () => {
    try {
      await web3Obj.initialize()
      this.setStateInfo()
      this.setState({
        loggedIn: true
      })
    } catch (error) {
      console.error(error)
    }
  }

  disableTorus = async () => {
    try {
      await web3Obj.logout().then(()=>{
        this.setState({
          loggedIn: false
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
  
  render() {
    console.log("current state of loggedIn",this.state.loggedIn)
    return (
      <div className="App">
        {this.state.loggedIn === true ? 
          <div>
            <p>
              Let's get it done
            </p>
              <Button onClick={this.disableTorus}>Logout</Button>
              <br/><br/>
              <div>
                {this.state.account ? <div>Account: {this.state.account}</div> : null}
                {(this.state.balance && (this.state.balance != 0)) ? <div>Balance: {this.state.balance}</div> : null}
              </div>
          </div>
          :
          <div className="login-container">
            <h1 className="logo">Anon Hero</h1>
            <div>
              <Button  onClick={this.enableTorus}>Login</Button>
            </div>
            
          </div>
        }
      </div>
    )
  }
}

export default App;

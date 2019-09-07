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
  }

  setStateInfo = () => {
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
      await web3Obj.logout()
      this.setStateInfo()
      this.setState({
        loggedIn: false
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div className="App">
            <Map/>

        { this.state.loggedIn == true ? 
          <div>
            <p>
              Let's get it done
            </p>

              <Button onClick={this.disable}>Logout</Button>
          </div>
          :
          <div>
            <h1 className="logo">Anon Hero</h1>
            <div>
              <Button className="login-btn" onClick={this.enableTorus}>Login</Button>
            </div>
            <div>
              {/* <button onClick={this.enableTorus}>Enable Torus</button> */}
              <div>Account: {this.state.account}</div>
              <div>Balance: {this.state.balance}</div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default App;

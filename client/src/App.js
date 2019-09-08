import React, { Component } from "react";
import {Button} from 'reactstrap';
import "./App.css";
import web3Obj from './helper'
import UploadContentView from './UploadContent/UploadContent';
import MapView from './Map/Map';
import FileUpload from "./Files/FileUpload";
import Loading from './Loading/Loading';

class App extends React.Component {
  state = {
    account: '',
    balance: '',
    page:'Map',
    loggedIn: false,
    userLocation: {lat: '', long: ''},
    distance:'',
    loading: false
  }

  componentDidMount() {
    const isTorus = sessionStorage.getItem('pageUsingTorus')
    if (isTorus) {
      web3Obj.initialize().then(() => {
        this.setStateInfo()
        this.setState({
          loggedIn: true
        })
      })
    }
    if (!isTorus) {
      this.setState({
        loggedIn: false
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
      this.setState({
        loading: true
      })
      await web3Obj.initialize().then(()=>{
        this.setState({
          loggedIn: true
        })
        this.setState({
          loading: false
        })
      }).catch((error)=>console.log(error))
    }

  disableTorus = async () => {
    try {
      await web3Obj.logout().then(()=>{
        this.setState({
          loggedIn: false
        })
        sessionStorage.clear();
      })
    } catch (error) {
      console.error(error)
    }
  }

  checkMapLocation = (lat, long, distance) => {
    if(distance < .3){
      this.setState({
        onLocation: true,
        userLat: lat,
        userLong: long
      })
    } else {
      this.setState({
        onLocation: false
      })
    }
  }

  uploadContentPage = () => {
    this.setState({
      page: 'Upload'
    })
  }
  changeToMapView = () => {
    this.setState({
      page: 'Map'
    })
  }
  
  render() {
    let {page} = this.state;
    let view = (<MapView checkMapLocation={this.checkMapLocation} uploadContentClick={this.uploadContentPage} />)
    if(this.state.page === 'Upload'){
      view = (<UploadContentView changeToMap={this.changeToMapView} />)
    }

    if(this.state.page === 'Map'){
      view = (<MapView checkMapLocation={this.checkMapLocation} uploadContentClick={this.uploadContentPage}  />)
    }

    if (this.state.loading == true) {
      return <div className="login-container default-padding">
            <div>
              <Loading />
            </div>
          </div>
    } else {
      return (
        <div className="App">
          {this.state.loggedIn === true ? 
            <div style={{height: '100%'}}> 
              <div className="page-header">
                <div className="header"> 
                  <h4>AnonHero | {page} </h4>
                  <Button className='logout-btn' onClick={this.disableTorus}>Logout</Button>
                </div>
                <div className="account">{this.state.account ? <p>Account: {this.state.account.slice(0,8)}...</p> : null}</div>
              </div>
              {view}
              </div>
            :
            <div className="login-container default-padding">
              <h1 className="logo">Anon Hero</h1>
              <div>
                <Button  className="login-btn" onClick={this.enableTorus}>Login</Button>
              </div>
            </div>
          }
        </div>
      )
    }
  }
}

export default App;

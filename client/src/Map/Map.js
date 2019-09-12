import React from 'react';
import {Component} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import { geolocated } from "react-geolocated";
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import { Button } from 'reactstrap';
import Loading from '../Loading/Loading';
// import HeatmapOverlay from 'react-map-gl-heatmap-overlay';

class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            people: {

            },
            status:'default',
            activeMode: false,
            distance: null,
            isInLocation: false,
            statusDict: {
                'default': 'Set Location',
                'success' : <i className="fas fa-camera"></i>,
                'fail' : 'Not in Location',
                'loading': 'Verifying'
            },
            viewport: {
              width: '100%',
              height: '100%',
              latitude: 42.3792848,
              longitude: -71.1156926,
              draggable: false,
              zoom: 15
            }
        };
    }

    checkLocation = (e) => {
        e.preventDefault();
        let dist;
        if (!this.props.coords) {
            dist = 0
        } else {
            dist =  this.checkDistance(this.props.coords.latitude,this.props.coords.longitude, this.state.viewport.latitude,this.state.viewport.longitude);
            this.props.checkMapLocation(this.props.coords.latitude, this.props.coords.longitude, dist)
        }
        this.setState({
            status: 'loading',
            distance: dist
        }, () => {
            setTimeout(()=>{
                    this.setState({
                        status: 'success'
                    })
                }, 2500)
        })
    }
                  
    checkDistance = (userLat, userLong, locationLat, locationLong) => {
        let distance = 0;
        if ((userLat == locationLat) && (userLong == locationLong)) {
            distance =  0;
        }
        else {
            var radlat1 = Math.PI * userLat/180;
            var radlat2 = Math.PI * locationLat/180;
            var theta = userLong-locationLong;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            // if (unit=="K") { dist = dist * 1.609344 }
            // if (unit=="N") { dist = dist * 0.8684 }
            distance = dist;
        }
        return distance
    }

    uploadContent = () => {
        this.setState({
            activeMode: true
        });
        this.props.uploadContentClick()
    };

    onViewportChange = viewport => { 
        const {width, height, ...etc} = viewport
        this.setState({viewport: etc})
    } 

    render() {
        console.log("this is the current status", this.state.status)
        return (
            <div className={this.state.status == 'success' ? 'active-mode map-view' : 'map-view'} style={{height: 'calc(100% - 50px)', width: '100%'}}>
                <ReactMapGL
                    className='active-mode'
                    width='100%'
                    height='100%'
                    mapboxApiAccessToken = 'pk.eyJ1IjoidGlmZmFueW1xIiwiYSI6ImNrMDl3a2p3cjBkZGYzbW55djZ4NDgzMzcifQ.GcKDVp7Hzst2xXfpldKGcg'
                    {...this.state.viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}>
                         <Marker draggable={false} latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} offsetLeft={-20} offsetTop={-10}>
                            <div className="meeting-point"></div>
                        </Marker>
                         {/* <HeatmapOverlay locations={[42.376700, -71.112420]} {...this.state.viewport}/> */}
                </ReactMapGL>

                {this.state.showLoading == true ? <div className="loading-div"><Loading/></div> : null}
                <Button 
                    disabled={this.state.status === 'fail' ? true : false}
                    className={"map-submit-btn " + (this.state.status === 'loading' ? ' loading-btn ' : '') + (this.state.status === 'success' ? 'success-btn ' : '') + (this.state.status === 'fail' ? 'fail-btn' : '')} 
                    onClick={this.state.status === 'success' ? this.uploadContent : this.checkLocation}>
                     {this.state.statusDict[this.state.status]}
                </Button>
            </div>
        );
    }
}

export default geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(Map);
import React from 'react';
import {Component} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import { geolocated } from "react-geolocated";
import 'mapbox-gl/dist/mapbox-gl.css';

import './Map.css';
import { Button } from 'reactstrap';


class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            isInLocation: false,
            viewport: {
              width: '100%',
              height: '100%',
            //   latitude: 42.3792848,
            //   longitude: -71.1156926,
              latitude: 37.7577,
              longitude: -122.4376,
              zoom: 8
            }
        };
    }
    checkLocation = (e) => {
        e.preventDefault();
      let dist =  this.checkDistance(this.state.latitude,this.state.longitude, this.state.viewport.latitude,this.state.viewport.longitude);
      this.setState({
          distance: dist
      })
      this.props.checkMapLocation(this.props.coords.latitude, this.props.coords.longitude, dist )
    }


// set for miles (default)                     

    checkDistance = (userLat, userLong, locationLat, locationLong) => {
        if ((userLat == locationLat) && (userLong == locationLong)) {
            return 0;
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
            
            return dist;
        }
    }

    onViewportChange = viewport => { 
        console.log('change')
        const {width, height, ...etc} = viewport
        this.setState({viewport: etc})
      } 

    render() {
        console.log(this.props, 'map')
        return (
            <div className='map-view' style={{height: 'calc(100% - 90px)', width: '100%'}}>
                <ReactMapGL
                   width='100%'
                   height='100%'
                    mapboxApiAccessToken = 'pk.eyJ1IjoidGlmZmFueW1xIiwiYSI6ImNrMDl3a2p3cjBkZGYzbW55djZ4NDgzMzcifQ.GcKDVp7Hzst2xXfpldKGcg'
                    {...this.state.viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}>
                        <Marker draggable={false} latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} offsetLeft={-20} offsetTop={-10}>
                            <div style={{color: '#f00'}}>You are here</div>
                        </Marker>
                    </ReactMapGL>
                <Button className={"map-submit-btn" } onClick={this.checkLocation} >Set Location</Button>
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
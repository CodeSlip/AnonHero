import React from 'react';
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import './Map.css';
import { Button } from 'reactstrap';


class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            viewport: {
              width: '100%',
              height: '100%',
              latitude: 37.7577,
              longitude: -122.4376,
              zoom: 8
            }
        };
    }



    render() {
        return (
            <div className='map-view' style={{height: 'calc(100% - 90px)', width: '100%'}}>
                <ReactMapGL
                    mapboxApiAccessToken = 'pk.eyJ1IjoidGlmZmFueW1xIiwiYSI6ImNrMDl3a2p3cjBkZGYzbW55djZ4NDgzMzcifQ.GcKDVp7Hzst2xXfpldKGcg'
                    {...this.state.viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}
                />
                <Button className="map-submit-btn" onClick={this.setLocation} >Set Location</Button>
            </div>
        );
    }
}


export default Map;
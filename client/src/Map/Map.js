import React from 'react';



import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

class Map extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {
    return (
        <div>
            <div className="page-header">
                <h4>AnonHero | Map</h4>
            </div>
            <ReactMapGL
                mapboxApiAccessToken = 'pk.eyJ1IjoidGlmZmFueW1xIiwiYSI6ImNrMDl3a2p3cjBkZGYzbW55djZ4NDgzMzcifQ.GcKDVp7Hzst2xXfpldKGcg'
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
            />
        </div>
  
    );
  }
}


export default Map;
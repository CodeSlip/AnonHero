import React, { Component } from "react";
import { _getEvent, _createEvent } from "../contract";

class UploadContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async getEvent() {
    const event = await _getEvent(1);
    console.log("event", event);
  }

  async createEvent() {
    await _createEvent();
  }

  render() {
    return (
      <div className="upload-content-view">
        <p>CONTENT</p>
        <div onClick={this.createEvent}>create event</div>
        <div onClick={this.getEvent}>get event</div>
      </div>
    );
  }
}

export default UploadContent;

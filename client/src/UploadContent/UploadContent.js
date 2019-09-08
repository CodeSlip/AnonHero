import React, { Component } from "react";
import { _getEvent, _createEvent, _createPost, _getPost } from "../contract";
import { web3 } from "../contract";
import "./UploadContent.css";

import { Form, Button } from "reactstrap";

import Web3 from "web3";

const FileStorage = require("@skalenetwork/filestorage.js/src/index");
let fileStorage = new FileStorage("https://ethboston1.skalenodes.com:10150");

// const web3Provider = new Web3.providers.HttpProvider(
//   "http://ethboston1.skalenodes.com:10145"
// );
// let web3 = new Web3(web3Provider);

const IMAGE_UPLOAD_ADDRESS = "0x5fC4630B22539c1853920c5bE0539b8Ed60EE039";

class UploadContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      bytesToUpload: null,
      filePaths: [],
      images: [],
      imagesReady: false,
      reload: false,
      file: null,
      showFeed: false,
      latitude: null,
      longitude: null
    };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidMount() {
    this.load();
    window.navigator.geolocation.getCurrentPosition(loc => {
      this.setState({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
    });
  }

  handleFileChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  async load() {
    await this.getEvent();
    await this.getAllFiles();
    await this.getPosts();
  }

  async getEvent() {
    const event = await _getEvent(1);

    let name = event["name"];
    name = web3.utils.toAscii(name);
    console.log("name", name);

    const creator = event["creator"]; // addr (include??)
    console.log("creator", creator);

    let latitude = event["latitude"];
    latitude = web3.utils.toAscii(latitude);
    console.log("latitude", latitude);

    let longitude = event["longitude"];
    longitude = web3.utils.toAscii(longitude);
    console.log("longitude", longitude);
  }

  async createEvent() {
    await _createEvent();
  }

  getAllFiles = async () => {
    let account = IMAGE_UPLOAD_ADDRESS; // michael test (not torus. use fixed acct for skale upload to coordinate image directory)
    let files = await fileStorage.listDirectory(account.split("0x")[1]);
    let holder = document.createElement("div");
    for (var i = 0; i < files.length; i++) {
      let file = await fileStorage.downloadToBuffer(files[i].storagePath);
      file = "data:image/png;base64," + file.toString("base64");
      let imgEl = document.createElement("img");
      imgEl.src = `${file}`;
      holder.append(imgEl);
      const getImgHolder = document.getElementById("img-holder");
      getImgHolder.append(holder);
    }
  };

  attach = e => {
    let file = document.getElementById("files").files[0];
    console.log(file);
    this.setState({
      fileName: file.name,
      file: URL.createObjectURL(e.target.files[0])
    });

    let reader = new FileReader();
    const scope = this;
    reader.onload = async function(e) {
      const arrayBuffer = reader.result;
      const bytes = new Uint8Array(arrayBuffer);
      scope.setState({ bytesToUpload: bytes });
    };
    reader.readAsArrayBuffer(file);
  };

  setBytes = bytes => {
    this.setState({ bytesToUpload: bytes });
  };

  uploadFile = async e => {
    e.preventDefault();
    if (!this.state.bytesToUpload) return;
    if(!this.state.latitude) return;
    console.log("in upload file -  bytes", this.state)
    let privateKey =
      "0xEC6BA7DD9EB64A5BF6336D20E4046E80935BC574EC6F1C4ADF6AA9DA5A286C4C"; // testnet pk
    let account = IMAGE_UPLOAD_ADDRESS; // testnet addr

    await fileStorage.uploadFile(
      account,
      this.state.fileName,
      this.state.bytesToUpload,
      privateKey
    );

    let getMostRecentUploads = await fileStorage.listDirectory(
      account.split("0x")[1]
    );
    console.log("getmostrecent", getMostRecentUploads);
    const mostRecent =
      getMostRecentUploads[getMostRecentUploads.length - 1].storagePath;

    const { latitude, longitude } = this.state;
    await _createPost(latitude, longitude, mostRecent);
  };

  async getPosts() {
    const posts = [];
    for (var i = 0; i < 2; i++) {
      const post = await _getPost(i);
      posts.push(post);
    }

    console.log(posts);
  }

  showFeed = () => {
    this.setState({
      showFeed: !this.state.showFeed
    });
  };

  changeMapView = () => {
    this.props.changeToMap();
  }

  render() {
    const { imagesReady, images } = this.state;
    console.log("this.state", this.state);
    return (
      <div className="upload-content-view">
        <Button onClick={this.changeMapView} className="view-map-btn"> View Map </Button>
        <Form className="upload-content-form" onSubmit={this.uploadFile}>
          <h3>Upload Content</h3>
          <img src={this.state.file} className="img-upload" />
          {this.state.file ? (
            <Button onClick={this.uploadFile} type="submit">
              Share
            </Button>
          ) : (
            <div className="add-file-container">
              <Button>Add Image</Button>
              <input onChange={e => this.attach(e)} type="file" id="files" />
            </div>
          )}
        </Form>
        <h3>Feed</h3>
        <Button onClick={this.showFeed}>Show Feed</Button>
        <div
          id="img-holder"
          className={this.state.showFeed ? " " : "hide"}
        ></div>
      </div>
    );
  }
}

export default UploadContent;

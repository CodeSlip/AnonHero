import React, { Component } from "react";
import { _getEvent, _createEvent, _createPost } from "../contract";
import { web3 } from "../contract";

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
      reload: false
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    await this.getEvent();
    await this.getAllFiles();
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
    const mapped = files.map(async fileObj => {
      let file = await fileStorage.downloadToBuffer(fileObj.storagePath);
      file = "data:image/png;base64," + file.toString("base64");
      console.log("file", file);
      return file;
    });

    this.setState({ images: mapped, imagesReady: true });

    console.log("files", files);
  };

  attach = e => {
    let file = document.getElementById("files").files[0];
    this.setState({ fileName: file.name });
    let reader = new FileReader();
    const scope = this;
    reader.onload = async function(e) {
      const arrayBuffer = reader.result;
      const bytes = new Uint8Array(arrayBuffer);
      scope.setState({ bytesToUpload: bytes });
    };
    reader.readAsArrayBuffer(file);
  };

  uploadFile = async () => {
    if (!this.state.bytesToUpload) return;
    let privateKey =
      "0xEC6BA7DD9EB64A5BF6336D20E4046E80935BC574EC6F1C4ADF6AA9DA5A286C4C"; // testnet pk
    let account = IMAGE_UPLOAD_ADDRESS; // testnet addr

    await fileStorage.uploadFile(
      account,
      this.state.fileName,
      this.state.bytesToUpload,
      privateKey
    );

      let getMostRecentUploads = await fileStorage.listDirectory(account.split("0x"));
      console.log("getmostrecent", getMostRecentUploads)
      const mostRecent = getMostRecentUploads[getMostRecentUploads.length - 1];
      console.log("mostrecent", mostRecent)
      await _createPost(mostRecent)
  };


  render() {
    const { imagesReady, images } = this.state;
    console.log("imagesready", imagesReady);
    return (
      <div className="upload-content-view">
        <input onChange={e => this.attach(e)} type="file" id="files" />
        <div onClick={this.uploadFile} className="file-button">
          Upload File
        </div>
        {/* {imagesReady &&
          images.map(img => {
            return (
              <img base64="true" src={img} height="40px" width="40px" />
              // <img src={img} height="40px" width="40px" />
            );
          })} */}
      </div>
    );
  }
}

export default UploadContent;

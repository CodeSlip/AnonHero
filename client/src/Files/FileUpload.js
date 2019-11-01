import React, { useState, Component } from "react";
import Web3 from "web3";
import { _createEvent } from "../contract"
import "./Files.css";

const FileStorage = require("@skalenetwork/filestorage.js/src/index");
let fileStorage = new FileStorage("https://sip1.skalenodes.com:10040");
// let fileStorage = new FileStorage("http://ethboston1.skalenodes.com:10145");

const web3Provider = new Web3.providers.HttpProvider(
  // "https://ethboston1.skalenodes.com:10145"
   "https://sip1.skalenodes.com:10040"
);
let web3 = new Web3(web3Provider);

function FileUpload() {
  const [bytesToUpload, setBytesToUpload] = useState(null);
  const [fileName, setFileName] = useState("");

  const uploadFile = async () => {
    if (!bytesToUpload) return;
    let privateKey =
      "0x1E25C8731DE51F919A23EF70749251BB4F57D80BFD6468FC450FD79D39E3B87C"; // testnet pk
    let account = "0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9"; // testnet addr

    fileStorage.uploadFile(account, fileName, bytesToUpload, privateKey);
  };

  const getAllFiles = async () => {
    let account = "0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9";
    let files = await fileStorage.listDirectory(account.split("0x")[1]);
    console.log("files", files);
  };

  const attach = e => {
    let file = document.getElementById("files").files[0];
    setFileName(file.name);
    let reader = new FileReader();
    reader.onload = async function(e) {
      const arrayBuffer = reader.result;
      const bytes = new Uint8Array(arrayBuffer);
      setBytesToUpload(bytes);
    };
    reader.readAsArrayBuffer(file);
  };

  const contractCreateEvent = async() => {
      await _createEvent();
    //   args: (latitude, longitude, eventName)
  }

  return (
    <div
      className="file-upload"
      style={{ height: "calc(100% - 90px)", width: "100%" }}
    >
      <input onChange={e => attach(e)} type="file" id="files" />
      <div onClick={uploadFile} className="file-button">
        Upload File
      </div>
      <div onClick={getAllFiles}>get files</div>
      <div onClick={contractCreateEvent}>createEvent</div>
    </div>
  );
}

export default FileUpload;

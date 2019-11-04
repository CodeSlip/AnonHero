import Web3 from "web3";
import AnonAbi from "./contracts/Anon.json";
import AnonValidateAbi from "./contracts/AnonValidate.json";
import web3Obj from "./helper";
console.log("web3obj", web3Obj)

//for the purpose of this application, we've used https://ethboston1.skalenodes.com:10150, 
//In a production scenario with SML running, we would use the SML endpoint and deploy all contracts to that end-point
const web3Provider = new Web3.providers.HttpProvider(
  // " https://sip1.skalenodes.com:10040"
  "https://ethboston1.skalenodes.com:10150"
);
console.log('web3provider', web3Provider)

// SML endpoint
// const web3Provider = new Web3.providers.HttpProvider(
//   "http://157.245.138.108:2234"
// );

export const web3 = new Web3(web3Provider);
const Tx = require('ethereumjs-tx');
const SkaleAnonContract = "0x6F29BA25Fab3d81616A79De20736A58813C6c3E7";
const SkaleAnonValidateContract = "0x4e7d45384c7878ea463163372fbd78563cbe26bb"; //SML contract deployed on http://157.245.138.108:2234

async function Contract() {
  return await new web3Obj.web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

async function ReadContract() {
  return await new web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

async function ValidateContract() {
  return await new web3Obj.web3.eth.Contract(AnonValidateAbi.abi, SkaleAnonValidateContract);
}

export async function _createEvent() {
  const contr = await Contract();
  const lat = web3Obj.web3.utils.fromAscii("42.3792848")
  const long = web3Obj.web3.utils.fromAscii("-71.1156926")
  const name = web3Obj.web3.utils.fromAscii("Protest for Justice")
  const func = contr.methods.createEvent(lat, long, name).encodeABI();
  web3Obj.web3.eth.getAccounts((err, res) => {
    console.log("res", res)
    web3Obj.web3.eth.sendTransaction(
      {
        from: res[0],
        to: SkaleAnonContract,
        data: func
      }, ((error, txHash) => {
        console.log("error", error)
        console.log("txhash", txHash)
      })
    )
  })
}

export async function _createPost(latitude, longitude, filePath){
  const contr = await Contract();

  const lat = web3Obj.web3.utils.fromAscii(latitude)
  // const lat = web3Obj.web3.utils.fromAscii("42.3792848")
  const long = web3Obj.web3.utils.fromAscii(longitude)
  // const long = web3Obj.web3.utils.fromAscii("-71.1156926")
  const eventId = 1;

  const func = contr.methods.createPost(lat, long, eventId, filePath).encodeABI();
  web3Obj.web3.eth.getAccounts((err, res) => {
    console.log("res", res)
    web3Obj.web3.eth.sendTransaction(
      {
        from: res[0],
        to: SkaleAnonContract,
        data: func
      }, ((error, txHash) => {
        console.log("%cUpload Image to SkaleML if available", "color: green; font-size: medium")
        console.log("%cUse the validator contract on Skale ML (SML) to validate the uploaded image (input image shape must be: 600, 900, 3), and check uploaded image against image dataset using keras model located on SkaleML: 0xa2061d10e7af547822ad0f5dcfe28b3ce6182b37", "color: blue")
        console.log("%cAnonHero to receive bool from model and store alongside image & location", "color: yellow")
        console.log("%cImage validation and storage complete", "color: green; font-size: medium")
      })
    )
  })
}

export async function _getEvent(eventId) {
  const contr = await ReadContract();
  console.log("contr", contr)
  const evt = await contr.methods.getEvent(eventId).call()
  return evt;
}

export async function _getPost(postId) {
  const contr = await ReadContract();
  console.log("contr", contr)
  const evt = await contr.methods.getPost(postId).call()
  return evt;
}

export async function validate(address, fileName) {
  const validateContr = await ValidateContract();
  console.log("contr", validateContr)
  let result = await this.validateContr.methods.validate(address, fileName).call({gas: 100000000, gasPrice: 0});
	console.log('bbbb');
	return result;
}

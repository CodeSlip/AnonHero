import Web3 from "web3";
import AnonAbi from "./contracts/Anon.json";
import AnonValidateAbi from "./contracts/AnonValidate.json";
import web3Obj from "./helper";
console.log("web3obj", web3Obj)
//new route where ML & Storage are located

const web3Provider = new Web3.providers.HttpProvider(
  "https://ethboston1.skalenodes.com:10150"
);

const web3ProviderB = new Web3.providers.HttpProvider(
  "157.245.138.108"
);

export const web3 = new Web3(web3Provider);
export const web3B = new Web3(web3ProviderB);
const Tx = require('ethereumjs-tx');
const SkaleAnonContract = "0x6F29BA25Fab3d81616A79De20736A58813C6c3E7";
const SkaleAnonValidateContract = "";

async function Contract() {
  return await new web3Obj.web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

async function ReadContract() {
  return await new web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

async function ValidateContract() {
  return await new web3Obj.web3.eth.Contract(AnonAbi.abi, SkaleAnonValidateContract);
}

export async function _createEvent() {
  const contr = await Contract();
  const lat = web3Obj.web3.utils.fromAscii("42.3792848")
  const long = web3Obj.web3.utils.fromAscii("-71.1156926")
  const name = web3Obj.web3.utils.fromAscii("Protest for Justice")
  const func = contr.methods.createEvent(lat, long, name).encodeABI();
  web3Obj.web3.eth.getAccounts((err, res) => {
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
        console.log("error", error)
        console.log("txhash", txHash)
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
  //receives address of stored object, and name of stored object
  const validationContr = await ValidateContract();
  console.log('validation begins');
  let result = await validationContr.methods.validate(address, fileName).call({gas: 100000000, gasPrice: 0});
  console.log('validation completed');
  return result;
}
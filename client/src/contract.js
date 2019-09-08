import Web3 from "web3";
import AnonAbi from "./contracts/Anon.json";
import web3Obj from "./helper";
// const web3Provider = new Web3.providers.HttpProvider(
//   "http://ethboston1.skalenodes.com:10145"
// );
// let web3 = new Web3(web3Provider);

const SkaleAnonContract = "0x6F29BA25Fab3d81616A79De20736A58813C6c3E7";

async function Contract() {
  return await new web3Obj.web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

export async function _createEvent() {
    console.log("in create event")
  const contr = await Contract();
  await contr.methods.createEvent("42.3792848", "-71.1156926", "Protest event");
}

export async function _getEvent(eventId) {
  const contr = await Contract();
  const evt = await contr.methods.getEvent(eventId)
  console.log("evt", evt)
}

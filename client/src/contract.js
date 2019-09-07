import Web3 from "web3";
import AnonAbi from "./contracts/Anon.json";

const web3Provider = new Web3.providers.HttpProvider(
  "http://ethboston1.skalenodes.com:10145"
);
let web3 = new Web3(web3Provider);

const SkaleAnonContract = "0x2a15CCB1Cde702563cBFc13ddc0080EDBEb964A8";

async function Contract() {
  return await new web3.eth.Contract(AnonAbi.abi, SkaleAnonContract);
}

export async function createEvent() {
    console.log("in create event")
  const contr = await Contract();
  await contr.methods.createEvent("42.3792848", "-71.1156926", "Protest event");
}

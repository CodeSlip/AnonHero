var ValidatorFull = artifacts.require("./ValidatorFull.sol");

const smlAddress = "0xa2061d10e7af547822ad0f5dcfe28b3ce6182b37"

module.exports = function (deployer) {
    deployer.deploy(ValidatorFull, smlAddress);
};

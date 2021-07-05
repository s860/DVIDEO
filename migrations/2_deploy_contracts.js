const DVideo = artifacts.require("DVideo");

module.exports = function(deployer) {
  deployer.deploy(DVideo);
};
//here we are deploying this Dvideo on the blockchain
//1_intial migration ,2_deploy_contract.js these are numbered because we are teeling in what order we have to compile

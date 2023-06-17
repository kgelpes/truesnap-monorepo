require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId

    //deploy trueSnapDev
    const TrueSnapDev = await deploy("TrueSnapDev", {
        from: wallet.address,
        args: ["TrueSnap Dev", "TRUESNAP_DEV", wallet.address, 400, wallet.address],
        log: true,
    })
}

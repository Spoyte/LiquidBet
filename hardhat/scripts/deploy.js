const { ethers } = require('hardhat')
require('dotenv').config({ path: '.env' });
const { Contract } = require("ethers")


//Deployment of the 3 Smart Contracts
async function main() {



    // Wait/Sleep function
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    //Deployment of the France Token Smart Contract 
    const FranceContract = await ethers.getContractFactory('France')
    const deployedFranceContract = await FranceContract.deploy()
    await deployedFranceContract.deployed()
    console.log('France Contract Address', deployedFranceContract.address)
    const France_Address = deployedFranceContract;

    //Deployment of the Brasil Token Smart Contract 
    const BrasilContract = await ethers.getContractFactory('Brasil')
    const deployedBrasilContract = await BrasilContract.deploy()
    await deployedBrasilContract.deployed()
    console.log('Brasil Contract Address', deployedBrasilContract.address)
    const Brasil_Address = deployedBrasilContract;

    //Deployment of the Swap Token Smart Contract 
    const SwapContract = await ethers.getContractFactory('Swap')
    const deployedSwapContract = await SwapContract.deploy(deployedFranceContract.address, deployedBrasilContract.address)
    await deployedSwapContract.deployed()
    console.log('Swap Contract Address', deployedSwapContract.address)


    const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
    const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

    const provider = new ethers.providers.JsonRpcProvider(NODE_PROVIDER_API_KEY_URL)
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const swapABI = SwapContract.interface;

    try {
        const _swapContract = new Contract(
            deployedSwapContract.address,
            swapABI,
            signer
        )
        let tx = await _swapContract.ownTokenContracts({ gasLimit: 5000000 })
        // provider.estimateGas(tx).then((gasLimit) => {});
        await tx.wait();

    } catch (error) {
        console.log(error);

    }


    await sleep(60000)

    //Verification on the Polygonscan Mumbai network
    await hre.run("verify:verify", {
        address: deployedFranceContract.address,
        constructorArguments: [],
        contract: "contracts/Tokens.sol:France"
    });

    //Verification on the Polygonscan Mumbai network
    await hre.run("verify:verify", {
        address: deployedBrasilContract.address,
        constructorArguments: [],
        contract: "contracts/Tokens.sol:Brasil"
    });

    //Verification on the Polygonscan Mumbai network
    await hre.run("verify:verify", {
        address: deployedSwapContract.address,
        constructorArguments: [deployedFranceContract.address, deployedBrasilContract.address],
        contract: "contracts/Swap.sol:Swap"
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
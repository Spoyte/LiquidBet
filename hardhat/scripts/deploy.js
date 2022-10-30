const { ethers } = require('hardhat')
require('dotenv').config({ path: '.env' });
const swap = require("../artifacts/contracts/Swap.sol/Swap.json")
const france = require("../artifacts/contracts/Tokens.sol/France.json")
const brasil = require("../artifacts/contracts/Tokens.sol/Brasil.json")

const { Contract } = require("ethers")

//Deployment of the 3 Smart Contracts
async function main() {



    // Wait/Sleep function
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    //Deployment of the France Token Smart Contract 
    console.log("");
    const FranceContract = await ethers.getContractFactory('France')
    const deployedFranceContract = await FranceContract.deploy()
    await deployedFranceContract.deployed()
    console.log('France Contract Address', deployedFranceContract.address)


    //Deployment of the Brasil Token Smart Contract 
    const BrasilContract = await ethers.getContractFactory('Brasil')
    const deployedBrasilContract = await BrasilContract.deploy()
    await deployedBrasilContract.deployed()
    console.log('Brasil Contract Address', deployedBrasilContract.address)


    //Deployment of the Swap Token Smart Contract 
    const SwapContract = await ethers.getContractFactory('Swap')
    const deployedSwapContract = await SwapContract.deploy(deployedFranceContract.address, deployedBrasilContract.address)
    await deployedSwapContract.deployed()
    console.log('Swap Contract Address', deployedSwapContract.address)
    console.log("");





    /////////////////////////////////////////////////////
    // Calling the functions after contracts are deployed //
    //////////////////////////////////////////////////// 

    const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
    const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
    // Connnecting the Wallet  
    const provider = new ethers.providers.JsonRpcProvider(NODE_PROVIDER_API_KEY_URL)
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const swapABI = swap.abi;
    const _swapContract = new Contract(
        deployedSwapContract.address,
        swapABI,
        signer
    )

    // Initialyse the Ownership of the Tokens Contracts to the Swap Contract.
    try {
        let tx = await _swapContract.ownTokenContracts({ gasLimit: 5000000 })
        // provider.estimateGas(tx).then((gasLimit) => {});
        await tx.wait();
        console.log("Tokens owns by the Swap Contract ");
        console.log("");

    } catch (error) {
        console.log(error);
    }

    //Amount to set in approve() function.
    const weiApprove = "10000000000000000000000000000"
    //Amount that the user is willing to bet.
    const maticAmount = "1000000000000000000";

    // Tokens Contracts ABI
    const franceABI = france.abi;
    const brasilABI = brasil.abi;


    // Approval from the Tokens Contracts 
    try {
        const _franceContract = new Contract(
            deployedFranceContract.address,
            franceABI,
            signer
        )
        let tx = await _franceContract.approve(deployedSwapContract.address, weiApprove, { gasLimit: 5000000 })
        await tx.wait();

        console.log("Msg.sender approved by France Token");
        console.log("");

    } catch (error) {
        console.log(error);
    }

    try {
        const _brasilContract = new Contract(
            deployedBrasilContract.address,
            brasilABI,
            signer
        )
        let tx = await _brasilContract.approve(deployedSwapContract.address, weiApprove, { gasLimit: 5000000 })
        await tx.wait();
        console.log("Msg.sender approved by Brasil Token");
        console.log("");

    } catch (error) {
        console.log(error);
    }


    try {
        let tx = await _swapContract.addLiquidity(10000, { gasLimit: 5000000 })
        await tx.wait();
        console.log("Liquidity Added ");
        console.log("");

    } catch (error) {
        console.log(error);
    }
    try {

        let tx = await _swapContract.deposit({
            value: maticAmount,
            gasLimit: 5000000
        })
        await tx.wait();

        console.log("Deposit made");
        console.log("");
        tx = await _swapContract.sendBRAToken(maticAmount / 1e18, { gasLimit: 5000000 })
        await tx.wait();
        console.log("Bra token sent to the Pool");
        console.log("");
        tx = await _swapContract.receivedFrToken(maticAmount / 1e18, { gasLimit: 5000000 })
        await tx.wait();
        console.log("Fr tokens received from the Pool");
        console.log("");


    } catch (error) {
        console.log(error);
    }


    // try {
    //     let tx = await _swapContract.gameOver({ gasLimit: 5000000 })
    //     await tx.wait();
    //     console.log("Game Over");
    //     console.log("");


    // } catch (error) {
    //     console.log(error);
    // }

    //     await sleep(30000)

    //Verification on the Polygonscan Mumbai network
    //     await hre.run("verify:verify", {
    //         address: deployedFranceContract.address,
    //         constructorArguments: [],
    //         contract: "contracts/Tokens.sol:France"
    //     });

    //Verification on the Polygonscan Mumbai network
    //     await hre.run("verify:verify", {
    //         address: deployedBrasilContract.address,
    //         constructorArguments: [],
    //         contract: "contracts/Tokens.sol:Brasil"
    //     });

    //Verification on the Polygonscan Mumbai network
    //     await hre.run("verify:verify", {
    //         address: deployedSwapContract.address,
    //         constructorArguments: [deployedFranceContract.address, deployedBrasilContract.address],
    //         contract: "contracts/Swap.sol:Swap"
    //     });


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })
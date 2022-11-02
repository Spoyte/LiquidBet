const { ethers } = require('hardhat')
require("@nomiclabs/hardhat-ethers");
require('dotenv').config({ path: '.env' });
const swap = require("../artifacts/contracts/Swap.sol/Swap.json")
const france = require("../artifacts/contracts/Tokens.sol/France.json")
const brasil = require("../artifacts/contracts/Tokens.sol/Brasil.json")

const { Contract, BigNumber } = require("ethers")

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



    /////////////////////////////////////////////////////////
    // Calling the functions after contracts are deployed //
    ///////////////////////////////////////////////////////

    const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
    const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;


    // Connnecting the Wallet  
    const provider = new ethers.providers.JsonRpcProvider(NODE_PROVIDER_API_KEY_URL)
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const swapABI = swap.abi;
    const _swapContract = new ethers.Contract(
        deployedSwapContract.address,
        swapABI,
        signer
    )


    //Doesn't Work for now 
    const checkEvents = () => {
        _swapProviderContract.on("Initialization", (sender, event) => {
            console.log({
                sender: sender,
                data: event
            });
        })
    }




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
    const weiApprove = "10000000000000000000000000000000000000000000000000000";
    //Amount that the user is willing to bet in WEI .
    const maticAmount = "10000000000000000000";

    // Tokens Contracts ABI
    const franceABI = france.abi;
    const brasilABI = brasil.abi;


    // Approval from the Tokens Contracts 
    try {
        const _franceContract = new Contract(deployedFranceContract.address, franceABI, signer)
        let tx = await _franceContract.approve(deployedSwapContract.address, weiApprove, { gasLimit: 5000000 })
        await tx.wait();

        console.log("Msg.sender approved by France Token");
    } catch (error) {
        console.log(error);
    }

    try {
        const _brasilContract = new Contract(deployedBrasilContract.address, brasilABI, signer)
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


    //callStatic is used to Read data from a "view" function
    try {
        let tx = await _swapContract.callStatic.getReserveFrance()
        console.log(`There is ${tx.toNumber()} France Tokens in the Pool`);
        tx = await _swapContract.callStatic.getReserveBrasil()
        console.log(`There is ${tx.toNumber()} Brasil Tokens in the Pool`)
        console.log("");
    } catch (error) {
        console.log(error);
    }
    try {
        let _swapContract = new ethers.Contract(
            deployedSwapContract.address,
            swapABI,
            signer
        )

        let tx = await _swapContract.deposit({
            value: maticAmount,
            gasLimit: 5000000
        })
        console.log("Deposit made");
        console.log("");
        tx = await _swapContract.callStatic.getBalanceWalletFrance()
        tx = parseInt(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
        console.log(`You have ${tx} France Tokens in your wallet`)
        tx = await _swapContract.callStatic.getBalanceWalletBrasil()
        tx = parseInt(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
        console.log(`You have ${tx} Brasil Tokens in your wallet`)
        console.log("");
        // ! tx = await _swapContract.sendBRAToken(maticAmount, { gasLimit: 5000000 })
        // ! await tx.wait();
        // ! console.log(`${ethers.utils.formatEther(maticAmount)} Bra token send to the Pool`);
        tx = await _swapContract.callStatic.getReserveFrance()
        console.log(`There is ${tx.toNumber()} France Tokens in the Pool`);
        // tx = await _swapContract.receivedFrToken(maticAmount, { gasLimit: 5000000 })
        // await tx.wait();
        // console.log(`${ether.utils.formatEther(maticAmount)} Fr tokens received from the Pool`);
        // console.log("");

    } catch (error) {
        console.log(error);
    }



    try {
        let tx = await _swapContract.callStatic.getReserveFrance()
        console.log(`There is ${tx.toNumber()} France Tokens in the Pool`);
        tx = await _swapContract.callStatic.getReserveBrasil()
        console.log(`There is  ${tx.toNumber()} Brasil Tokens in the Pool`)




    } catch (error) {
        console.log(error);
    }
    try {
        let tx = await _swapContract.callStatic.contractBalance()
        tx = BigInt(tx)
        // tx = parseInt(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
        console.log(`There is ${tx} Matic in the Contract`);

    } catch (error) {
        console.log(error);
    }
    try {

        let tx = await _swapContract.callStatic.balance()
        tx = parseInt(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
        console.log(`You have ${tx} Matic in your Wallet`);

    } catch (error) {
        console.log(error);
    }


    try {
        let tx = await _swapContract.gameOver({ gasLimit: 5000000 })
        await tx.wait();
        console.log("Game Over");
        console.log("");


    } catch (error) {
        console.log(error);
    }
    // ! try {
    // !     let tx = await _swapContract.backMoney()
    // !     await tx.wait();
    // !     console.log("BackMoney Call");

    // ! } catch (error) {
    // !     console.log(error);
    // ! }

    // ! try {

    // !     let tx = await _swapContract.callStatic.balance()
    // !     console.log(`You have ${tx.toNumber()} Matic in your Wallet`);

    // ! } catch (error) {
    // !     console.log(error);
    // ! }

    // + try {
    // +     let tx = await _swapContract.callStatic.contractBalance()
    // +     console.log(`There is ${tx.toNumber()} Matic in the Contract`);

    // + } catch (error) {
    // +     console.log(error);
    // + }


    // //     await sleep(30000)

    // //Verification on the Polygonscan Mumbai network
    // //     await hre.run("verify:verify", {
    // //         address: deployedFranceContract.address,
    // //         constructorArguments: [],
    // //         contract: "contracts/Tokens.sol:France"
    // //     });

    // //Verification on the Polygonscan Mumbai network
    // //     await hre.run("verify:verify", {
    // //         address: deployedBrasilContract.address,
    // //         constructorArguments: [],
    // //         contract: "contracts/Tokens.sol:Brasil"
    // //     });

    // //Verification on the Polygonscan Mumbai network
    // //     await hre.run("verify:verify", {
    // //         address: deployedSwapContract.address,
    // //         constructorArguments: [deployedFranceContract.address, deployedBrasilContract.address],
    // //         contract: "contracts/Swap.sol:Swap"
    // //     });


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })
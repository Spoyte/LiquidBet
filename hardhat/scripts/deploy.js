const { ethers } = require('hardhat')
const fs = require('fs');
const swap = require("../artifacts/contracts/Swap.sol/Swap.json")
const france = require("../artifacts/contracts/Tokens.sol/France.json")
const brasil = require("../artifacts/contracts/Tokens.sol/Brasil.json")
const { Contract, utils } = require("ethers");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config({ path: '.env' });


//Deployment of the 3 Smart Contracts
async function main() {

    // Wait/Sleep function
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    console.log('DEPLOYMENT');
    console.log("");

    //Calcul Odds before Deploys 
    const calculInitialOdds = () => {
        const teamA = 3.28
        const teamB = 2.32
        const total = teamA + teamB
        const resultA = parseInt(((teamA / total) * 10000).toFixed(0))
        const resultB = parseInt(((teamB / total) * 10000).toFixed(0))
        return [resultA, resultB, total]

    }
    let initialValues = calculInitialOdds();

    let _LinkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    let _LinkOracle = "0x915dc8cbcf3F17faa33F20B88e6d5D162195E0b2"


    //Deployment of the France Token Smart Contract 
    const FranceContract = await ethers.getContractFactory('France')
    const deployedFranceContract = await FranceContract.deploy(initialValues[0])
    await deployedFranceContract.deployed()
    console.log('France Contract Address', deployedFranceContract.address)


    //Deployment of the Brasil Token Smart Contract 
    const BrasilContract = await ethers.getContractFactory('Brasil')
    const deployedBrasilContract = await BrasilContract.deploy(initialValues[1])
    await deployedBrasilContract.deployed()
    console.log('Brasil Contract Address', deployedBrasilContract.address)


    //Deployment of the Swap Token Smart Contract 
    const SwapContract = await ethers.getContractFactory('Swap')
    const deployedSwapContract = await SwapContract.deploy(
        deployedFranceContract.address,
        deployedBrasilContract.address,
        _LinkToken,
        _LinkOracle
    )
    await deployedSwapContract.deployed()
    const swapAddress = deployedSwapContract.address
    console.log('Swap Contract Address', swapAddress)
    console.log("");
    console.log("");



    /////////////////////////////////////////////////////////
    // Calling the functions after contracts are deployed //
    ///////////////////////////////////////////////////////


    //MUMBAI
    const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
    const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

    //HARDHAT NETWORK
    const NODE_PROVIDER_TESTNET_URL = "http://127.0.0.1:8545/"
    const HARDHAT_TESTNET_PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"


    // Connnecting the Wallet  
    const provider = new ethers.providers.JsonRpcProvider(NODE_PROVIDER_API_KEY_URL)
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const swapABI = swap.abi;
    const _swapContract = new ethers.Contract(
        swapAddress,
        swapABI,
        signer
    )



    //////////////////////
    // INITIALIZATION //
    ///////////////////


    console.log('INITIALIZATION');
    console.log("");



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
    const weiApprove = "10000000000000000000000000000000000000000";
    //Amount that the user is willing to bet in MATIC .
    let maticAmount = "0.1"
    // ethers.BigNumber.from("1");
    maticAmount = ethers.utils.parseEther(maticAmount.toString())
    // console.log(ethers.BigNumber(maticAmount).toNumber())


    let BigMatic = ethers.utils.formatEther(BigInt(maticAmount))
    BigMatic = parseFloat(BigMatic).toFixed(0)



    //Matic amount = 10000000000000000000 = 10e18
    //BigMatic = 10

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


    let teamALiquidity = ethers.BigNumber.from(`${initialValues[0]}`)
    teamALiquidity = utils.parseEther(teamALiquidity.toString())
    let teamBLiquidity = ethers.BigNumber.from(`${initialValues[1]}`)
    teamBLiquidity = utils.parseEther(teamBLiquidity.toString())



    //Liquidity Amont = 10000000000000000000000 = 10000*1e18
    try {
        let tx = await _swapContract.addLiquidity(teamALiquidity, teamBLiquidity, { gasLimit: 5000000 })
        await tx.wait();
        console.log("Liquidity Added ");
        console.log("");

    } catch (error) {
        console.log(error);
    }


    //callStatic is used to Read data from a "view" function
    try {
        let tx = await _swapContract.callStatic.getReserveFrance()
        console.log(`There is ${utils.formatEther(tx)} France Tokens in the Pool`);
        tx = await _swapContract.callStatic.getReserveBrasil()
        console.log(`There is ${utils.formatEther(tx)} Brasil Tokens in the Pool`)
        console.log("");
    } catch (error) {
        console.log(error);
    }


    /////////////////////////////
    // CONTRACT INTERACTIONS //
    //////////////////////////





    // console.log('CONTRACT INTERACTION');
    // console.log("");


    // try {

    //     let tx = await _swapContract.callStatic.walletBalance()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2)
    //     console.log(`You have ${tx} Matic in your Wall et`);

    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     let _swapContract = new ethers.Contract(
    //         deployedSwapContract.address,
    //         swapABI,
    //         signer
    //     )

    //     let tx = await _swapContract.deposit({
    //         value: maticAmount,
    //         gasLimit: 5000000
    //     })

    //     //Matic Amount here is 10 so 10x10^18 wei
    //     console.log(`Deposit of ${ethers.utils.formatEther(maticAmount)} Matic successfull `);
    //     console.log("");
    //     tx = await _swapContract.callStatic.getBalanceWalletFrance()
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
    //     console.log(`You have ${tx} France Tokens in your wallet`)
    //     tx = await _swapContract.callStatic.getBalanceWalletBrasil()
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
    //     console.log(`You have ${tx} Brasil Tokens in your wallet`)

    //     tx = await _swapContract.swapBRAtoFR(maticAmount, { gasLimit: 5000000 })
    //     await tx.wait();
    //     console.log(`${BigMatic} Bra token send to the Pool`);
    //     tx = await _swapContract.callStatic.getReserveFrance()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2);
    //     console.log(`There is ${tx} France Tokens in the Pool`);
    //     tx = await _swapContract.callStatic.getReserveBrasil()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2);
    //     console.log(`There is ${tx} Brasil Tokens in the Pool`);
    //     console.log("");

    //     tx = await _swapContract.callStatic.getBalanceWalletFrance();
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2);
    //     console.log(`You have ${tx} France Tokens in your wallet`);
    //     tx = await _swapContract.callStatic.getBalanceWalletBrasil();
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2);
    //     console.log(`You have ${tx} Brasil Tokens in your wallet`)

    // } catch (error) {
    //     console.log(error);
    // }




    // try {
    //     // let tx = await _swapContract.callStatic.getReserveFrance()
    //     // console.log(`There is ${tx.toNumber()} France Tokens in the Pool`);
    //     let tx = await _swapContract.callStatic.getReserveBrasil()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2)
    //     console.log(`There is  ${tx} Brasil Tokens in the Pool`)

    // } catch (error) {
    //     console.log(error);
    // }


    // try {
    //     let tx = await _swapContract.callStatic.contractBalance()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2)
    //     console.log(`There is ${tx} Matics in the contract `);

    // } catch (error) {
    //     console.log(error);
    // }
    // try {

    //     let tx = await _swapContract.callStatic.walletBalance()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2)
    //     console.log(`You have ${tx} Matic in your Wallet`);
    //     console.log("");

    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     let tx = await _swapContract.gameOver({ gasLimit: 5000000 })
    //     await tx.wait();
    //     console.log("Game Over");
    //     console.log("");

    // } catch (error) {
    //     console.log(error);
    // }
    // try {

    //     let tx = await _swapContract.callStatic.walletBalance()
    //     tx = parseFloat(utils.formatEther(tx)).toFixed(2)
    //     console.log(`You have ${tx} Matic in your Wallet`);

    // } catch (error) {
    //     console.log(error);
    // }

    // let frTokens = ethers.BigNumber.from("9")
    // frTokens = utils.parseEther(frTokens.toString())

    // try {
    //     let tx = await _swapContract.sendMoneyBack(frTokens, { gasLimit: 5000000 })
    //     await tx.wait();
    //     console.log("Money Sent");
    //     console.log("");

    // } catch (error) {
    //     console.log(error);
    // }




    // try {
    //     let tx = await _swapContract.backMoney()
    //     await tx.wait();
    //     console.log("BackMoney Call");

    // } catch (error) {
    //     console.log(error);
    // }

    // try {

    //     let tx = await _swapContract.callStatic.walletBalance()
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
    //     console.log(`You have ${tx} Matic in your Wallet`);

    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     let tx = await _swapContract.callStatic.contractBalance()
    //     tx = parseFloat(ethers.utils.formatEther(BigInt(tx))).toFixed(2)
    //     console.log(`There is ${tx} Matic in the Contract`);

    // } catch (error) {
    //     console.log(error);
    // }


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


    const calculOdds = (tokenReserveFrance, tokenReserveBrasil) => {
        const oddsA = (tokenReserveFrance / 10000) * initialValues[2]
        const oddsB = (tokenReserveBrasil / 10000) * initialValues[2]
        return [oddsA, oddsB]
    }




    (async function repeat() {
        try {
            let txA = await _swapContract.callStatic.getReserveFrance()
            let txB = await _swapContract.callStatic.getReserveBrasil()
            const finalValue = calculOdds(txA, txB)
            console.log(`Odd Team A is :${finalValue[2]}`);
            console.log(`Odd Team B is :${finalValue[2]}`);
        } catch (error) {
            console.log(error);
        }
        setTimeout(repeat, 5000);
    })();


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })

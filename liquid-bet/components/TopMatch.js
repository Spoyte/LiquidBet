import styles from '../styles/Home.module.css'
import brazil from '../assets/brazil.svg'
import france from '../assets/france.svg'
import { useAccount, useContractEvent, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite } from 'wagmi';
import {
    BRAZIL_TOKEN_ABI,
    BRAZIL_TOKEN_ADDRESS,
    FRANCE_TOKEN_ADDRESS,
    FRANCE_TOKEN_ABI,
    SWAP_CONTRACT_ADDRESS,
    SWAP_CONTRACT_ABI,

} from "../constants"

import { ethers, utils } from 'ethers'
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { parseEther, formatEther } from 'ethers/lib/utils';




const TopMatch = () => {

    const [titleFR, settitleFR] = useState("")
    const [titleBRA, settitleBRA] = useState("")
    const ref = useRef(null);
    const disableApproveBtn = () => {
        ref.current.hidden = true;
    }
    /**
     * Send BRA Token to pool for user who bets on France
     */
    const { address } = useAccount();



    const { config: brazilApproveConfig } = usePrepareContractWrite({
        address: BRAZIL_TOKEN_ADDRESS,
        abi: BRAZIL_TOKEN_ABI,
        functionName: "approve",
        args: [SWAP_CONTRACT_ADDRESS, utils.parseEther("100000")]
    })
    const { write: brazilWrite } = useContractWrite(brazilApproveConfig);


    /***
   * Approve Function on FRA Tokens
   */
    const { config: franceApproveConfig } = usePrepareContractWrite({
        address: FRANCE_TOKEN_ADDRESS,
        abi: FRANCE_TOKEN_ABI,
        functionName: "approve",
        args: [SWAP_CONTRACT_ADDRESS, utils.parseEther("100000")],

    })
    const { write: franceWrite } = useContractWrite({
        ...franceApproveConfig,
        onSuccess() {
            disableApproveBtn()
        }
    })

    const { config: gameOverConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        functionName: "gameOver",
        enabled: false,

    })
    const { write: gameOverWrite } = useContractWrite({
        ...gameOverConfig,
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })

    const { config: deposit_swapBRAtoFRConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        functionName: "deposit_swapBRAtoFR",
        enabled: false,
        overrides: {
            from: address,
            value: ethers.utils.parseEther(titleFR ? titleFR : "0.001")
        },

    })
    const { write: deposit_swapBRAtoFRWrite } = useContractWrite({
        ...deposit_swapBRAtoFRConfig,
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })
    const { config: deposit_swapFRtoBRAConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        functionName: "deposit_swapFRtoBRA",
        enabled: false,
        overrides: {
            from: address,
            value: ethers.utils.parseEther(titleBRA ? titleBRA : "0.001")
        },

    })
    const { write: deposit_swapFRtoBRAWrite } = useContractWrite({
        ...deposit_swapFRtoBRAConfig,
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })

    useContractEvent({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        eventName: 'DepositMade',
        enabled: false,
        listener(userAddress, amount, tokenReceived, functionName) {
            console.log(`User Address :${userAddress}`)
            console.log(`Amount Deposit in Matic ${amount}`)
            console.log(`Amount Received from the Swap${tokenReceived}`)
            console.log(`Function called ${functionName}`)
        },
    })

    const { data, isError, isLoading } = useContractReads({
        // address: SWAP_CONTRACT_ADDRESS,
        // abi: SWAP_CONTRACT_ABI,
        // functionName: 'getReserveFrance',
        // enabled: false,
        contracts: [
            {
                address: SWAP_CONTRACT_ADDRESS,
                abi: SWAP_CONTRACT_ABI,
                functionName: 'getReserveFrance',
            },
            {
                address: SWAP_CONTRACT_ADDRESS,
                abi: SWAP_CONTRACT_ABI,
                functionName: 'getReserveBrasil',
            },
        ]
    })


    // let odd_A
    // let odd_B

    // useEffect(() => {
    //     if (isLoading) setTimeout(function () { alert("Is Loading!"); }, 50);
    //     if (isError) console.log(isError);
    //     if (data != undefined) {
    //         odd_A = parseFloat(parseInt(data[0]._hex, 16) / 1e18).toFixed(2)
    //         odd_A = ((odd_A / 10000) * 5.6).toFixed(2)
    //         console.log(odd_A);

    //         odd_B = parseFloat(parseInt(data[1]._hex, 16) / 1e18).toFixed(2)
    //         odd_B = ((odd_B / 10000) * 5.6).toFixed(2)
    //         console.log(odd_B);
    //     }

    // }, [data])




    return (
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>

            <div className={styles.matches}>
                <p>World cup - FIFA</p>
                {/* <span>{info}</span> */}
                <div>
                    <button className={styles.approve} ref={ref} onClick={() => {
                        brazilWrite()
                        franceWrite()
                    }}>
                        Approve before deposit
                    </button>
                </div>
                <div className={styles.flags}>


                    <div>
                        <span><Image src={france.src} width='50px' height='50px' alt="france flag" /></span>
                        <span>France</span>
                        {/* <div>{odd_A}</div> */}
                        <div className={styles.depositContainer}>
                            <p>Deposit Matic to place Bets</p>
                            <form>
                                <input
                                    type='number'
                                    title="Amount of MATIC to deposit"
                                    placeholder='MATIC Amount'
                                    onChange={e => settitleFR(e.target.value)}
                                    value={titleFR}
                                />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    deposit_swapBRAtoFRWrite()
                                }}>Deposit</button>
                            </form>
                        </div>
                    </div>


                    <div>Today <br />20:45</div>


                    <div>

                        <span><Image src={brazil.src} width='50px' height='50px' alt="brazil flag" /></span>
                        <span>Brazil</span>
                        {/* <div>{typeof odd_B !== 'undefined' ? odd_B : "Not Working"}</div> */}
                        <div className={styles.depositContainer}>
                            <p>Deposit Matic to place Bets</p>
                            <form>
                                <input
                                    type='number'
                                    title="Amount of MATIC to deposit"
                                    placeholder='MATIC Amount'
                                    onChange={e => settitleBRA(e.target.value)}
                                    value={titleBRA}
                                /><br />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    deposit_swapFRtoBRAWrite()
                                }}>Deposit</button>
                            </form>
                        </div>
                    </div>
                </div>
                <button onClick={() => gameOverWrite()} className={styles.gameOver}>
                    The Game Over Function
                </button>
            </div>
        </div>
    );
}


export default TopMatch;
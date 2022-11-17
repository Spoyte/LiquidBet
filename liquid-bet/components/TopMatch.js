import styles from '../styles/Home.module.css'
import brazil from '../assets/brazil.svg'
import france from '../assets/france.svg'
import { useAccount } from 'wagmi';
import {
    BRAZIL_TOKEN_ABI,
    BRAZIL_TOKEN_ADDRESS,
    FRANCE_TOKEN_ADDRESS,
    FRANCE_TOKEN_ABI,
    SWAP_CONTRACT_ADDRESS,
    SWAP_CONTRACT_ABI,

} from "../constants"
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers'
import { useState, useRef } from 'react';
import Image from 'next/image';




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
        args: [SWAP_CONTRACT_ADDRESS, 10000000]
    })
    const { write: brazilWrite } = useContractWrite(brazilApproveConfig);


    /***
   * Approve Function on FRA Tokens
   */
    const { config: franceApproveConfig } = usePrepareContractWrite({
        address: FRANCE_TOKEN_ADDRESS,
        abi: FRANCE_TOKEN_ABI,
        functionName: "approve",
        args: [SWAP_CONTRACT_ADDRESS, 10000000],

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


    return (
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>

            <div className={styles.matches}>
                <p>World cup - FIFA</p>
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
                        <span><Image src={france.src} width='50px'height='50px' alt="france flag" /></span>
                        <span>France</span>
                        <div className={styles.depositContainer}>
                            <p>Deposit Matic to place Bets</p>
                            <form>
                                <input
                                    type='number'
                                    titleFR="Amount of MATIC to deposit"
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
                        
                        <span><Image src={brazil.src} width='50px'height='50px' alt="brazil flag" /></span>
                        <span>Brazil</span>
                        <div className={styles.depositContainer}>
                            <p>Deposit Matic to place Bets</p>
                            <form>
                                <input
                                    type='number'
                                    titleFR="Amount of MATIC to deposit"
                                    placeholder='MATIC Amount'
                                    onChange={e => settitleBRA(e.target.value)}
                                    value={titleBRA}
                                />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    deposit_swapFRtoBRAWrite()
                                }}>Deposit</button>
                            </form>
                        </div>
                    </div>


                    <button onClick={() => gameOverWrite()}>
                        The Game Over Function
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TopMatch;
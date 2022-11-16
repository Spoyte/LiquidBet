import styles from '../styles/Home.module.css'
import brazil from '../assets/brazil.svg'
import france from '../assets/france.svg'
import { useAccount } from 'wagmi';
import {
    SWAP_CONTRACT_ABI,
    SWAP_CONTRACT_ADDRESS,
} from "../constants"
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers'
import { useState } from 'react';



const TopMatch = () => {

    const [titleFR, settitleFR] = useState("")
    const [titleBRA, settitleBRA] = useState("")
    /**
     * Send BRA Token to pool for user who bets on France
     */
    const { address } = useAccount();

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

    // const { config: swapBraToFrConfig } = usePrepareContractWrite({
    //     address: SWAP_CONTRACT_ADDRESS,
    //     abi: SWAP_CONTRACT_ABI,
    //     functionName: "swapBRAtoFR",
    //     args: [100],
    // })
    // const { write: swapBraToFrWrite } = useContractWrite({
    //     ...swapBraToFrConfig,
    //     onError(error) {
    //         console.error(error)
    //     }

    // })

    // /**
    //  * Send FRA Token to pool for user who bets on Brazil
    //  */
    // const { config: swapFrToBraConfig } = usePrepareContractWrite({
    //     address: SWAP_CONTRACT_ADDRESS,
    //     abi: SWAP_CONTRACT_ABI,
    //     functionName: "swapFRtoBRA",
    //     args: [1],
    // })
    // const { write: swapFrToBraWrite } = useContractWrite({
    //     ...swapFrToBraConfig,
    //     onError(error) {
    //         alert(error.message.slice(0, 25))
    //     }
    // })

    return (
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>
            <div className={styles.matches}>
                <p>World cup - FIFA</p>
                <div className={styles.flags}>


                    <div>
                        <span><img src={france.src} width='50px' alt="france flag" /></span>
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
                        {/* <span className={styles.odds} onClick={() => deposit_swapBRAtoFRWrite()}>1 <span>3.20</span></span> */}
                    </div>


                    <div>Today <br />20:45</div>


                    <div>
                        <span><img src={brazil.src} width='50px' alt="brazil flag" /></span>
                        <span>Brazil</span>
                        <div className={styles.depositContainer}>
                            <p>Deposit Matic to place Bets <br /></p>
                            <form>
                                <input
                                    type='number'
                                    titleFR="Amount of MATIC to deposit"
                                    placeholder='MATIC Amount'
                                    onChange={e => settitleFR(e.target.value)}
                                    value={titleBRA}
                                />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    deposit_swapFRtoBRAWrite()
                                }}>Deposit</button>
                            </form>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default TopMatch;
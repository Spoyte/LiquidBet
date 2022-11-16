import styles from '../styles/Home.module.css'
import brazil from '../assets/brazil.svg'
import france from '../assets/france.svg'
import {
    SWAP_CONTRACT_ABI,
    SWAP_CONTRACT_ADDRESS,
} from "../constants"
import { useContractWrite, usePrepareContractWrite } from 'wagmi';


const TopMatch = () => {
    /**
     * Send BRA Token to pool for user who bets on France
     */
    const { config: swapBraToFrConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        functionName: "swapBRAtoFR",
        args: [1],
    })
    const { write: swapBraToFrWrite } = useContractWrite({
        ...swapBraToFrConfig,
        onSuccess() {
            alert('Transaction Successful')
        },
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })

    /**
     * Send FRA Token to pool for user who bets on Brazil
     */
    const { config: swapFrToBraConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_CONTRACT_ABI,
        functionName: "swapFRtoBRA",
        args: [1],
    })
    const { write: swapFrToBraWrite } = useContractWrite({
        ...swapFrToBraConfig,
        onSuccess() {
            alert('Transaction Successful')
        },
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })


    return (
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>
            <div className={styles.matches}>
                <p>World cup - FIFA</p>
                <div className={styles.flags}>
                    <div>
                        <span><img src={france.src} width='50px' alt="france flag" /></span>
                        <span>France</span>
                        <span className={styles.odds} onClick={() => {
                            swapBraToFrWrite()
                        }
                        }>1 <span>3.20</span></span>
                    </div>
                    <div>Today <br />20:45</div>
                    <div>
                        <span><img src={brazil.src} width='50px' alt="brazil flag" /></span>
                        <span>Brazil</span>
                        <span className={styles.odds} onClick={() => sendFRATokenWrite()}>2 <span>2.20</span></span>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default TopMatch;
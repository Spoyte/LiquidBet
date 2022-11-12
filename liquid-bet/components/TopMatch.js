import styles from '../styles/Home.module.css'
import  brazil from '../assets/brazil.svg'
import  france from '../assets/france.svg'
import { 
    SWAP_CONTRACT_ADDRESS, 
    SWAP_CONTRACT_ABI,
    SWAP_CONTRACT_ABI2,
    SWAP_CONTRACT_ADDRESS2,
  } from "../constants"
  import { useContractWrite, usePrepareContractWrite } from 'wagmi';


const TopMatch = () => {
    /**
     * Send BRA Token to pool for user who bets on France
     */
    const { config: sendBRATokenConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS2,
        abi: SWAP_CONTRACT_ABI2,
        functionName: "swapBRAtoFR",
        args: [1],
      })
       const { write: sendBRATokenWrite } = useContractWrite({
       ...sendBRATokenConfig,
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
    const { config: sendFRATokenConfig } = usePrepareContractWrite({
        address: SWAP_CONTRACT_ADDRESS2,
        abi: SWAP_CONTRACT_ABI2,
        functionName: "swapFRtoBRA",
        args: [1],
      })
       const { write: sendFRATokenWrite } = useContractWrite({
       ...sendFRATokenConfig,
        onSuccess() {
            alert('Transaction Successful')
        },
        onError(error) {
            alert(error.message.slice(0, 25))
        }
    })

    // /**
    //  * Receive BRA Tokens for user who bets on Brazil
    //  */
    // const { config: receivedBraTokenConfig } = usePrepareContractWrite({
    //     address: SWAP_CONTRACT_ADDRESS,
    //     abi: SWAP_CONTRACT_ABI,
    //     functionName: "receivedBraToken",
    //     args: [1],
    //   })
    //    const { write: receivedBraTokenWrite } = useContractWrite({
    //    ...receivedBraTokenConfig,
    //     onSuccess() {
    //         alert('Transaction Successful')
    //     },
    //     onError(error) {
    //         alert(error.message.slice(0, 25))
    //     }
    // })


    // /**
    //  * Receive FRA Tokens for user who bets on France
    //  */
    // const { config: receivedFrTokenConfig } = usePrepareContractWrite({
    //     address: SWAP_CONTRACT_ADDRESS,
    //     abi: SWAP_CONTRACT_ABI,
    //     functionName: "receivedFrToken",
    //     args: [1],
    //   })
    //    const { write: receivedFrTokenWrite } = useContractWrite({
    //    ...receivedFrTokenConfig,
    //     onSuccess() {
    //         alert('Transaction Successful')
    //     },
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
                        <span><img src={france.src} width='50px' alt="france flag"/></span>
                        <span>France</span>
                        <span className={styles.odds}  onClick={()=>{
                            sendBRATokenWrite() 
                            // receivedFrTokenWrite()
                            // receivedBraTokenWrite()
                        }
                        }>1 <span>3.20</span></span>
                    </div>
                    <div>Today <br/>20:45</div>
                    <div>
                        <span><img src={brazil.src} width='50px' alt="brazil flag"/></span>
                        <span>Brazil</span>
                        <span className={styles.odds} onClick={()=>sendFRATokenWrite()}>2 <span>2.20</span></span>
                    </div>

                </div>
            </div>

        </div>
     );
}
 
export default TopMatch;
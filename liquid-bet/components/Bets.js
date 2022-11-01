import styles from '../styles/Home.module.css'
import { BRAZIL_TOKEN_ABI, 
    BRAZIL_TOKEN_ADDRESS, 
    FRANCE_TOKEN_ADDRESS, 
    FRANCE_TOKEN_ABI, 
    SWAP_CONTRACT_ADDRESS, 
    SWAP_CONTRACT_ABI
  } from "../constants"
  import { useAccount, useContract, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

const Bets = () => {
    
    return (
        <div className={styles.bets}>
            <p className={styles.title}>BETSLIP</p>
            <div className={styles.slipdetails}>
                <p className={styles.teamname}>France - Brasil</p>
                <p>Full Time Result</p>
                <p><span>1</span><span className={styles.slipOdds}>2.20</span></p>
            </div>
            <p className={styles.betAmount}>Bet Amount <span>2MATIC</span></p>
            <button className={styles.betBTN}>PLACE BET</button>
        </div>
      );
}
 
export default Bets;
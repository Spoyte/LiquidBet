import styles from '../styles/Home.module.css'

const Bets = () => {
    return (
        <div className={styles.bets}>
            <p className={styles.title}>BETSLIP</p>
            <div className={styles.slipdetails}>
                <p>France - Brasil</p>
                <p>Full Time Result</p>
                <p><span>1</span><span className={styles.slipOdds}>3.20</span></p>
            </div>
            <p className={styles.betAmount}>Bet Amount - 2MATIC</p>
            <button className={styles.betBTN}>PLACE BET</button>
        </div>
      );
}
 
export default Bets;
import styles from '../styles/Home.module.css'

const Bets = () => {
    return (
        <div className={styles.bets}>
            <p>Your Bets</p>
            <p>France - Brasil</p>
            <p>Bet Amount - 2MATIC</p>
            <button>PLACE BET</button>
        </div>
      );
}
 
export default Bets;
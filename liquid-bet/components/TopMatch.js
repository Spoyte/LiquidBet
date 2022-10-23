import styles from '../styles/Home.module.css'

const TopMatch = () => {
    return ( 
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>
            <div>
                <p>Flags</p>
                <p>France-Brasil</p>
                <div>
                    <span>Bet France</span>
                    <span>Bet Brasil</span>
                </div>
            </div>

        </div>
     );
}
 
export default TopMatch;
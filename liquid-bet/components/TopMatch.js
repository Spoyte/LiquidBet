import styles from '../styles/Home.module.css'

const TopMatch = () => {
    return ( 
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>
            <div>
                <p>World cup - FIFA</p>
                <div>
                    <span>Fra flag</span>
                    <span>France</span>
                    <span>1 <span>3.20</span></span>
                </div>
                <div>Today 20:45</div>
                <div>
                    <span>Bra flag</span>
                    <span>Brazil</span>
                    <span></span>
                </div>
                {/* <p>Flags</p>
                <p>France-Brasil</p>
                <div>
                    <span>Bet France</span>
                    <span>Bet Brasil</span>
                </div> */}
            </div>

        </div>
     );
}
 
export default TopMatch;
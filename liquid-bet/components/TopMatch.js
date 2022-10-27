import styles from '../styles/Home.module.css'
import  brazil from '../assets/brazil.svg'
import  france from '../assets/france.svg'

const TopMatch = () => {
    return ( 
        <div className={styles.topmatch}>
            <p>⚽ Top Football Matches!</p>
            <div className={styles.matches}>
                <p>World cup - FIFA</p>
                <div className={styles.flags}>
                    <div>
                        <span><img src={france.src} width='50px' alt="france flag"/></span>
                        <span>France</span>
                        <span className={styles.odds}>1 <span>3.20</span></span>
                    </div>
                    <div>Today <br/>20:45</div>
                    <div>
                        <span><img src={brazil.src} width='50px' alt="brazil flag"/></span>
                        <span>Brazil</span>
                        <span className={styles.odds}>1 <span>3.20</span></span>
                    </div>

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
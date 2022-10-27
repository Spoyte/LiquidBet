import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Home.module.css'
import logo from '../assets/logo.svg'

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={logo.src} alt="df" width='30px' />
                <span>Liquid Bet</span>
            </div>
            

            <span className={styles.connect}><ConnectButton 
                label='Connect Wallet'
                accountStatus="address"
                borderRadius="none"
            /></span>
        </nav>
      );
}
 
export default Navbar;
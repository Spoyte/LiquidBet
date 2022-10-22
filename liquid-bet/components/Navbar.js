import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Home.module.css'

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div>Liquid Bet</div>
            <span className={styles.connect}><ConnectButton 
                label='Connect Wallet'
                accountStatus="address"
                borderRadius="none"
            /></span>
        </nav>
      );
}
 
export default Navbar;
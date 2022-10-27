import styles from '../styles/Home.module.css'
import logo from '../assets/logo.svg'
import gmail from '../assets/gmail.svg'
import twitter from '../assets/twitter.svg'
import github from '../assets/github.svg'
import Link from 'next/link'


const Footer = () => {
    return (  
        <footer className={styles.footer}>
            <div className={styles.logo}>
                <img src={logo.src} alt="liquidbet-logo" width='30px' />
                <span> Liquid Bet</span>
            </div>
            <div className={styles.socials}>
                <Link href="#"><img src={twitter.src} alt="twitter" width='30px' /></Link>
                <Link href="#"><img src={github.src} alt="github" width='30px' /></Link>
                <Link href="#"><img src={gmail.src} alt="gmail" width='30px' /></Link>
                
                
                
             </div>
        </footer>
    );
}
 
export default Footer;
import styles from '../styles/Home.module.css'
import logo from '../assets/logo.svg'
import gmail from '../assets/gmail.svg'
import twitter from '../assets/twitter.svg'
import github from '../assets/github.svg'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
    return (  
        <footer className={styles.footer}>
            <div className={styles.logo}>
                <Image src={logo.src} alt="liquidbet-logo" width='30px' height='30px'/>
                <span> Liquid Bet</span>
            </div>
            <div className={styles.socials}>
                <Link href="#"><Image src={twitter.src} alt="twitter" width='30px' height='30px'/></Link>
                <Link href="#"><Image src={github.src} alt="github" width='30px' height='30px'/></Link>
                <Link href="#"><Image src={gmail.src} alt="gmail" width='30px' height='30px'/></Link>
                
                
                
             </div>
        </footer>
    );
}
 
export default Footer;
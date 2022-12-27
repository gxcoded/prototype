import '../assets/css/SuperAdmin.css'
import '../assets/css/SchoolAdmin.css'
import PsuLogo from '../assets/images/psuLogo.png'
import Image from '../assets/images/security.jpg'
import {Link} from 'react-router-dom';
import StaffGuestScan from './subComponents/StaffGuestScan';
import StaffAccount from './subComponents/StaffAccount';
import ManualLog from './subComponents/ManualLog';

import {useState} from 'react';

const Guard = () => {
  
    const [guestScan,setGuestScan] = useState(true)
    const [account,setAccount] = useState(false)
    const [manual,setManual] = useState(false)
   
 
    const resetState = (e)=>{
     setAccount(false)
     setGuestScan(false)
     toggleLeftBar()
     setManual(false)
     
     document.querySelectorAll('.side-button').forEach(button=>{
          button.classList.remove('activ')
     })
      
     e.target.classList.add('activ')
    }
 
    const toggleLeftBar = ()=>{
     document.querySelector('#navLeft').classList.toggle('shown')
    }
 
 
     return(
         <div className="sudo-container">
         <div id='navLeft' className="sudo-left">
             <div className="sudo-left-header">
                 <div className="img-top">
                     <img className='logo-top' src={PsuLogo} alt="logo" />
                 </div>
                 <div className="psu-title text-center mt-2">
                    Pangasinan State University
                 </div>
                 <div className="psu-sub-text text-center mt-2">
                   Urdaneta City Campus
                 </div>
             </div>
             <hr className='mt-5' />
             <div className="admin-label my-4">
                 <img src={Image} alt="img" className='me-3'/>
                 <div className="label-container">
                     <div className='sudo-name me-5'>Juan Dela Cruz</div>
                     <div className='sub-name-title'>Security</div>
                 </div>
             </div>
             <hr className='mt-3' />
             <div className="links">
                 <ul className="list-group list-group-light">
                     <li className="list-group-item px-4 border-0">
                         <div  onClick={(e)=>{resetState(e); setGuestScan(true)}} className="side-button activ"><i className="fas fa-id-card me-3"></i>Scan QR</div>
                     </li>
                     <li className="list-group-item px-4 border-0">
                         <div  onClick={(e)=>{resetState(e); setManual(true)}} className="side-button"><i className="fab fa-wpforms me-3"></i>Manual Log</div>
                     </li>
                 </ul>
             </div>
             <div className="links-bottom mt-5">
                 <hr />
                 <div className="sub-label px-5">
                     <i className="fas fa-sliders-h me-3"></i>Options
                 </div>
                 <ul className="list-group list-group-light">
                     <li className="list-group-item px-4 border-0">
                         <div onClick={(e)=>{resetState(e); setAccount(true)}} className="side-button"><i className="fas fa-cogs me-3"></i>Account</div>
                     </li>
                     <li className="list-group-item px-4 border-0">
                         <Link to='/login'>
                             <div className="side-button"><i className="fas fa-sign-out-alt me-3"></i>Logout</div>
                         </Link>
                     </li>
                 </ul>
             </div>
         </div>
         <div className="sudo-right bg-light">
             <div className="sudo-right-top">
                 <div>
                     <i className="fas fa-qrcode me-3 "></i>
                     <span>PSU-Trace</span>
                 </div>
                 <div  className="burger-menu  d-flex justify-content-end align-items-center">
                         <div onClick={toggleLeftBar} className="burger-bars p-3"><i className="fas fa-bars"></i></div>
                 </div>
             </div>
             <div className="sudo-right-main">
               
                 {
                     guestScan && <StaffGuestScan type='1'/>
                 }
                 {
                     account && <StaffAccount name={'Juan Dela Cuz'} idNumber={'SEC-UR-1234'} img={'security.jpg'} />
                 }
                 {
                     manual && <ManualLog type={'1'} area='Entrance'/>
                 }
                 
             </div>
         </div>
     </div>
     )
}

export default Guard
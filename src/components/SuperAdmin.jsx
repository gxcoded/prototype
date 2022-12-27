import '../assets/css/SuperAdmin.css'
import PsuLogo from '../assets/images/psuLogo.png'
import Sudo from '../assets/images/sudo.png'
import SudoDashboard from './subComponents/SudoDashboard'
import SudoAdmins from './subComponents/SudoAdmins'
import SudoCampuses from './subComponents/SudoCampuses'
import SudoAccount from './subComponents/SudoAccount'
import {Link} from 'react-router-dom';
import { useState,useEffect } from 'react'
import axios from 'axios';

const SuperAdmin = ({toggler})=>{
     const [isDashboard,setIsDashboard] = useState(true)
     const [isCampus,setIsCampus] = useState(false)
     const [isAdmins,setIsAdmins] = useState(false)
     const [isAccount,setIsAccount] = useState(false)
     const [campusList,setCampusList] = useState([]);

     useEffect(()=>{
        const getData = async()=>{
            const fetchedData = await fetchCampus();
            setCampusList(fetchedData)
        }

        getData()
    },[])

    const fetchCampus = async()=>{
        const response = await axios.get('http://localhost:5000/api/campusList');
        const data = await response.data;

        return data;
    }
     const reset = (e)=>{
        setIsAdmins(false)
        setIsCampus(false)
        setIsDashboard(false)
        setIsAccount(false)

        document.querySelectorAll('.side-button').forEach(button=>{
            button.classList.remove('activ')
        })
        e.target.classList.add('activ')
        toggleLeftBar()
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
                      Region's Premier University of Choice
                    </div>
                </div>
                <hr className='mt-5' />
                <div className="admin-label my-4">
                    <img src={Sudo} alt="img" className='me-3'/>
                    <span className='sudo-name me-5'>Super Admin</span>
                </div>
                <hr className='mt-3' />
                <div className="links">
                    <ul className="list-group list-group-light">
                        <li className="list-group-item px-4 border-0">
                            <div onClick={(e)=>{reset(e); setIsDashboard(true)}} className="side-button activ"><i className="fas fa-table me-3"></i>Dashboard</div>
                        </li>
                        <li className="list-group-item px-4 border-0">
                            <div onClick={(e)=>{reset(e); setIsCampus(true)}} className="side-button"><i className="fas fa-school me-3"></i>Campuses</div>
                        </li>
                        <li className="list-group-item px-4">
                            <div onClick={(e)=>{reset(e); setIsAdmins(true)}} className="side-button"><i className="fas fa-users-cog me-3"></i>Admins</div>
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
                            <div onClick={(e)=>{reset(e); setIsAccount(true)}} className="side-button"><i className="fas fa-cogs me-3"></i>Account</div>
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
                <div  className="sudo-right-top">
                    <div>
                        <i className="qr fas fa-qrcode me-3 "></i>
                        <span>PSU-Trace</span>
                    </div>
                    <div  className="burger-menu  d-flex justify-content-end align-items-center">
                        <div onClick={toggleLeftBar} className="burger-bars p-3"><i className="fas fa-bars"></i></div>
                    </div>
                </div>
                <div className="sudo-right-main bg-light">
                    {
                        isDashboard && <SudoDashboard/>
                    }
                    {
                        isCampus && <SudoCampuses campusList={campusList}/>
                    }
                    {
                        isAdmins && <SudoAdmins campusList={campusList}/>
                    }
                    {
                        isAccount && <SudoAccount/>
                    }
                </div>
            </div>
        </div>
    )
}

export default SuperAdmin;
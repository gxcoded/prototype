import '../assets/css/ViewOptions.css';
import {Link} from 'react-router-dom'

const ViewOptions = () =>{
    return(
        <div className='wrapper'>
            <div className="view-options">
              
                <div className="view-options-text">
                    Create an Account now and Generate your Personal QR-Code.
                </div>
                <div className="view-options-links mt-4 d-flex justify-content-around">
                    <Link to='/staffSignUp'>
                        <div className="option">
                           
                        </div>
                    </Link>
                   
                </div>
              
            </div>
        </div>
    )
}

export default ViewOptions;
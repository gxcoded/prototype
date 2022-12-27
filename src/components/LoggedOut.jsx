import { Link } from 'react-router-dom';

const LoggedOut = () => {
  return (
    <div className='please-login'>
        <div className="please-login-box">
            <div className="please-login-text-section">
                <div className="please-login-text-title">
                    You've been Logged Out
                </div>
                <div className="please-login-text-sub">
                Please Login back in.
                </div>
            <hr />
                <Link to={'/login'}>
                    <button className="btn btn-primary btn-block">Ok</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default LoggedOut
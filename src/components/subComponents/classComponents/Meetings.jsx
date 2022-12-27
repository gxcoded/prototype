import './Class.css'
import AttendancePreview from '../AttendancePreview';
import { useState } from 'react';

const Meetings = () => {

  const [preview,setPreview] = useState(false);
  
  return (
  
   <div className="meeting-container">
      {
      preview && <AttendancePreview id={1} setPreview={setPreview}/> 
    }
      <div className="meeting-log-title">
        <i className="me-2 fas fa-clipboard-check"></i>Meeting Log
      </div>
      <div className="meeting-log-table mt-2 ">
      <table className="campus-table campus-table-list table table-bordered">
                    <thead>
                        <tr>
                        <th className='fw-bold' scope="col"><i className="ms-2 fas fa-hashtag"></i></th>
                        <th className='fw-bold' scope="col">Subject</th>
                        <th className='fw-bold' scope="col">Section</th>
                        <th className='fw-bold' scope="col">Room</th>
                        <th className='fw-bold' scope="col">Date</th>
                        <th className='fw-bold text-center' scope="col"><i className="ms-2 fas fas fa-tools"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <th scope="row">1</th>
                            <td>CC 101</td>
                            <td>BSIT-1S</td>
                            <td>AB1-201</td>
                            <td>{ Date().toString().slice(0,16)}</td>
                            <td>
                                <div className="table-options">
                                    <span onClick={()=>{setPreview(true);}}  className='mx-2 controls option-view text-warning'><i className="fas fa-eye"></i></span>
                                    <span   className='mx-2 controls option-download text-primary'><i className="fas fa-download"></i></span>
                                    <span   className='mx-2 controls option-delete'><i className="fas fa-trash-alt"></i></span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
      </div>
   </div>
  )
}

export default Meetings
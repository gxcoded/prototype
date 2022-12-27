import React from 'react'
import {useState,useEffect} from 'react';
import axios from 'axios';


const Remarks = ({data}) => {
  const [allData, setAllData] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  
  useEffect(()=>{


  },[])

  const dataLoader = async ()=>{
    const {data} = await axios.post(`${url}`,{
        data
    })
  }

  return (
    <div></div>
  )
}

export default Remarks
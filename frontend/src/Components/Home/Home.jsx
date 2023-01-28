import React from 'react'
import "./Home.css"
import Dashboard from '../Dashboard/Dashboard';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';



function Home() {

  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);

  var server = "http://localhost:3001/user"
  var token = localStorage.getItem("token")

//Fetch and store token from Query
  useEffect(() => {
    if(searchParams.get('acesstoken')){
      const token = searchParams.get('acesstoken');
      localStorage.setItem("token",token)

      const refresh_token = searchParams.get('refreshtoken');
      localStorage.setItem("refresh_token",refresh_token)

      const exps = searchParams.get('exp');
      var exp = Math.floor(exps/1000)
      localStorage.setItem("exp",exp)

      window.location.replace('/')

    }

  // eslint-disable-next-line  
  }, [token])

  
//Function to login using OAuth
  async function logingoogle() {
    axios.get(`${server}/auth/google`).then((data) => {
      window.location.replace(data.data);

    });

  }


  return (
    <div>
    {!token?

    <div className='homepage'>
      <div className='notlogin'>
        <div className='boxnotlog'>
        <p>Login to read your Emails</p>
         <div className='gloginbtn' onClick={logingoogle}>
           <div className="google-btn">
             <div className="google-icon-wrapper">
                <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt=''/>
             </div>
             <p className="btn-text"><b>Sign in with google</b></p>
           </div>
         </div>
       </div>
      </div>
    </div>:
  <Dashboard/>
  }
  </div>
  )
}

export default Home;
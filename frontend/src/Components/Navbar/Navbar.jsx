import React from 'react'
import { useEffect } from 'react'
import "./Navbar.css"

function Navbar() {

  var token = localStorage.getItem("token")

//Clear Token after expiry time
  useEffect(()=>{
    var currentTime = Math.floor(Date.now() /1000)
    var timestamp = localStorage.getItem("exp");
    var timestamps = parseInt(timestamp)
    if(!timestamp){
      return
    }
    else if(currentTime > timestamps) {
      localStorage.clear();
      window.location.replace('/')
     }
  },[token]);


 
//Logout User
function logout() {
  localStorage.clear()
  window.location.replace("/")
}

  return (
    <div className='navbar'>

      <div className='nav22'>

        <div className='logonav'><a href='/'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png" style={{"width":"60px"}} alt="" /></a></div>

        <div className='loginoutbtn'>
         {!token? <button className="button button1">Login</button>:<div/>}
         {token?<button className="button button2" onClick={()=>{logout()}}>Logout</button>:<div/>}
        </div>
      </div>

    </div>
  )
}

export default Navbar
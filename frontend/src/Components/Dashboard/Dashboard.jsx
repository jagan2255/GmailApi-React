import React from 'react'
import "./Dashboard.css"
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react';

var server = "http://localhost:3001/user"


function Dashboard() {

  var token = localStorage.getItem("token");
  var refreshtoken = localStorage.getItem("refresh_token");

  const [emails, setEmails] = useState([]);
  const[loading, setLoading]=useState(true);
  const[ nxtpagetoken , setnxttpage]= useState('')
  const[ homebutton , setHomebutton]= useState(false)


  //Fetch all emails details after authorisation
  useEffect(() => {
    try{
    async function fetchEmails() {
      const response = await axios.get(`${server}/api/emails?token=${token}&refreshtoken${refreshtoken}`);
      const data = await response;
      console.log(data.data)
      console.log(data.data.nextPageToken)
      if(data.data.code===403){
        alert("Authentication Error:- Gmail Permission Needed ")
      }else if(data.data.code===401){
        alert("Invalid Credentials Login Again")
      }else{
      setEmails(data.data.emails);
      setLoading(false);

      if(data.data.nextPageToken===''){
        setnxttpage("")
      }else{
        setnxttpage(data.data.nextPageToken)

      }

    }
  }

    fetchEmails();

  }
  catch(err){
    console.log(err)
  }
  
    
  }, [token,refreshtoken]);


  //Function to get next 50 emails 
  const loadmore=async()=>{
    try{
      if(nxtpagetoken===undefined){
        alert("No more Pages Availble")
      }else{
        const response = await axios.get(`${server}/api/emails?token=${token}&refreshtoken${refreshtoken}&nxtpagetoken=${nxtpagetoken}`);
        const data = await response;
        console.log(data.data.emails)
        console.log(data.data.nextPageToken)
        if(data.data.nextPageToken===''){
          setnxttpage("")
        }else{
          setnxttpage(data.data.nextPageToken)
          setHomebutton(true)
  
        }

        setEmails(data.data.emails);
      }
 
  }catch(err){
    console.log(err)
  }
  }

  //Home button state management
  const homecontent=()=>{
    setHomebutton(false)
    window.location.replace('/')
  }

//Redirect to individual email page using id
  const reademail=(id)=>{
    window.location.replace(`/email?id=${id}`)

  }



  return (
    <div className='homecontents'>
      <div className='dgsjgdj' >
      
          {!loading?<div><table id="tables">
         <thead>
           <tr>
               <th>From</th>
               <th>Subject</th>
           </tr>
          </thead>
          <tbody>
           {
        emails.map((item,k)=>
            <tr className='hovereffect' key={k} onClick={()=>{reademail(item.id)}}>
              <td className='subject'>{item.payload.headers.map(header => {
                if (header.name === "From") {
                  const name = header.value.split('<')[0];
                return <div><b>{name}</b></div>
                
              }
              //eslint-disable-next-line
              return
            })}</td>
              <td className='body22'>{item.snippet}</td>
             
            </tr>
    
    )}
    </tbody>
          </table>
          <div>
          <div className='sfdgyhugwdu'>
          <div></div>
          {homebutton?<div className='iiiviv'><button className='loadmore' onClick={homecontent}>Home</button></div>:<div></div>}
          <div className='retergdf'><button className='loadmore' onClick={loadmore}>Next Page</button> </div>
          </div>
          </div>
          </div>:
          <div className='spinner'>
            
            <div className="loader"></div>
            
          </div>}
          
      </div>

    </div>
  )
}

export default Dashboard
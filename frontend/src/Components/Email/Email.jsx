import React from 'react';
import "./Email.css";
import { useLocation } from 'react-router-dom';
import { useEffect , useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';
import {Buffer} from 'buffer';


var server = "http://localhost:3001/user"


export default function Email() {

  const iframeRef = useRef(null);
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);

  var token = localStorage.getItem("token");
  var refreshtoken = localStorage.getItem("refresh_token");

  const [emails, setEmails] = useState([]);
  const[loading, setLoading]=useState(true);
  

  useEffect(() => {
  try{
    async function getuseremail(){
    const id = searchParams.get('id');

    const response = await axios.get(`${server}/email/details?token=${token}&refreshtoken${refreshtoken}&id=${id}`);
    const data = await response;
    console.log(data.data)
    setEmails(data.data);
    setLoading(false);
    
    }

    getuseremail();

  }
  catch(err){
  }

  // eslint-disable-next-line 
  }, [token,refreshtoken])


//Redirect to home
const homecontent=()=>{
  window.location.replace('/')
}

//Function to adjust the height of iframe
const handleIframeLoad=()=>{
  const iframe = iframeRef.current;
  if (iframe && iframe.contentDocument) {
    const iframeBody = iframe.contentDocument.body;
    iframe.height = iframeBody.scrollHeight + "px";
  }
}


  return (
    <div>
      {!loading?<div>
        <div className='emailbody'>
         {
          emails.map((item,k)=>
           <div className='emailbody22' key={k}>
            <div className='gfdjggd'>
            <div><img className='propicture' src="https://lh3.googleusercontent.com/a/default-user=s40-p" alt="" /></div>
            {item.payload.headers.map(header => {
                if (header.name === "From") {

                  if (header.value.includes("<")) {
                        const name = header.value.split('<')[0];
                        const email = header.value.match(/<(.*?)>/)[1];
                        return <div className='emaildata'><div><b>{name}</b></div><div className='wfdsfdf'><pre>{"<"}{email}{">"}</pre></div></div>
                  } else {
                    return <div className='emaildata'><b>{header.value}</b></div>
                  }
                  
                
              }
              //eslint-disable-next-line
              return
            })}
            </div>

           
            <div className='subject22'>
            {item.payload.headers.map(header => {
                if (header.name === "Subject") {
                return <div>{header.value}</div>
                
              }
              //eslint-disable-next-line
              return
            })}
           </div>

          <div className='framhdd'>

           {item.payload.parts?<iframe ref={iframeRef} scrolling="no" className='framebody' onLoad={handleIframeLoad} title="emailbody" srcDoc={emails? Buffer.from((item.payload.parts.find(part => part.mimeType === 'text/html').body.data), 'base64').toString() :<div/>}/>:<div/>}
           </div>

             
        </div>
        )}


    </div>

    <div className='qsscscs'>
    <div ><button className='asdasd' onClick={homecontent}>Back to Home</button></div>
    </div>

    </div>
    :
    <div className='spinner htt22'>
      
      <div className="loader"></div>
      
      </div>}
    </div>
   
  )
}

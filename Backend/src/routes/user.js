const express =require('express');
const router = express.Router();
const {google} = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const userData = require("../models/userDetails")

//OAuth Credentials
const clientId = 'YOUR-CLIENT-ID';
const clientSecret = 'YOUR-CLIENT-SECRET-ID';
const redirectUri = 'http://localhost:3001/user/auth/google/callback';

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);


//Route to Login user via Google Oauth
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly',"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
  });
  res.send(url);
}); 



// Handle the response from the Google OAuth server
router.get('/auth/google/callback', async (req, res) => {
    try{
    const { code } = req.query; 
    const { tokens } = await oauth2Client.getToken(code);
    

//Fetch User Details from acess token
    oauth2Client.setCredentials({access_token: tokens.access_token})
    const service = await google.people({ version: 'v1', auth: oauth2Client });

  
    const results = await service.people.get({ 
      resourceName: 'people/me', 
      personFields: 'emailAddresses,names,photos,metadata'
    });


    const email = results.data.emailAddresses[0].value;
    const name = results.data.names[0].displayName;
    const givenName = results.data.names[0].givenName;
    const photo = results.data.photos[0].url;
    const userId = results.data.metadata.sources[0].id;

    userlog= {
      email: email,
      name: name,
      username:givenName,
      userId: userId,
      photo:photo

   }


    // Save the User Details to Database
    userData.findOne({email:email}).then((data)=>{
      if(data===null){
          var newuser = new userData(userlog)
          newuser.save()
      }
      
    })
 
  res.redirect(`http://localhost:3000?acesstoken=${tokens.access_token}&refreshtoken=${tokens.refresh_token}&exp=${tokens.expiry_date}`)
}catch(err){
    console.log(err)
    res.send(err)
}
});



//Route to Fetch all Email of user after Authorization
router.get('/api/emails', async (req, res) => {

  try{
    var token = req.query.token;
    var refreshtoken= req.query.refreshtoken;
    var pageToken = req.query.nxtpagetoken;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshtoken
    });


  // Fetch emails from  Gmail API
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const response = await gmail.users.messages.list({
    userId: 'me',
    labelIds:'INBOX',
    maxResults: 50,
    pageToken: pageToken,

  });
  const messages = response.data.messages;
  const nextPageToken = response.data.nextPageToken;
  // console.log(nextPageToken)


  // Fetch full details for each email
  const emails = await Promise.all(
    messages.map(async message => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });
      return email.data;
    })
  ); 

  // Send the list of emails back to the frontend
  res.json({emails , nextPageToken});
}
catch(err){
   console.log(err)
   res.send(err)
}
});




//Route to Fetch details of Individual email using ID
router.get("/email/details" , async(req,res)=>{
  try{
  var id = req.query.id;
  var token = req.query.token;
  var refreshtoken= req.query.refreshtoken;

  // console.log(id)
  oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshtoken
  });

  // Fetch individual emails from Gmail API
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const response = await gmail.users.messages.list({
    userId: 'me',
    id:id,

  });
  const messages = response.data.messages;
  const desiredMessage = messages.filter(message => message.id === id);


// Fetch full details for individual email
  const emails = await Promise.all(
    desiredMessage.map(async message => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });
      return email.data;
    })
  ); 

  res.json(emails)
  }
  catch(err){

    console.log(err)
    res.send(err)
  }

})





module.exports=router;

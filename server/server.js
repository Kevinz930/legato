const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');
const dotenv = require('dotenv');
const url = require("url");

const app = express();
app.use(cors());
const port = 3001;

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = '18b8e0981c764810be1327e237fc07f5';
const CLIENT_SECRET = '13bbb6e95397420aae084fc97f4ed4fa';
const REDIRECT_URI = 'http://localhost:3000/loading';

app.get('/getAccessToken', async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify(
        {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }), 

        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
          },
          json: true
        }

      );
    res.json(data);
  }

  catch (e){
    console.log(e);
  }
});

app.get('/getUserLibrary', async (req, res) => {
  const access_token = req['query']['access_token'];
  const params = {
    limit: '50',
    offset: 0,
  }
  const headers = {
    'Authorization': 'Bearer ' + access_token
  }


  const urlSearchParams = new url.URLSearchParams(params);
  let urlParams = '';
  if (req.query.next) {
    urlParams = req.query.next;
  } else {
    urlParams = `https://api.spotify.com/v1/me/tracks/?${urlSearchParams}`;
  }
  // console.log(urlParams);

  try {
    const { data } = await axios.get(urlParams, {headers});
    res.json(data);
  }
  catch (e){
    // console.log(e);
    console.log('/getUserLibrary failed')
  }
});

app.get('/getUserProfile', async (req, res) => {
  const { access_token } = req.query;
  console.log(access_token);

  try {
    const { data } = await axios.post('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + access_token },
    });
    console.log(data)
    res.json(data);
  }
  catch (e){
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
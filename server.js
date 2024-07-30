const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173'], // Frontend URL
  credentials: true
}));

app.post('/api/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/accounts/login_api/', req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
      // withCredentials: true // This ensures cookies are handled
    });

    // console.log(response.headers['set-cookie']); // Debugging cookie header

    // Set cookies received from Site B to the client
    if (response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(cookie => {
        res.append('Set-Cookie', cookie);
      });
    }

    res.json(response.data);
  } catch (error) {
    // Enhanced error handling to understand the Axios error
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received:', error.request);
      res.status(500).json({ message: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in request setup:', error.message);
      res.status(500).json({ message: 'Error in request setup: ' + error.message });
    }
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

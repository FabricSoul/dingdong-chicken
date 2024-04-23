/* eslint-disable import/order */
import axios from 'axios';
import 'dotenv/config';

const apiURL = process.env.API_ENDPOINT;

function generateResponseMessage(messages) {
  
  // Stringify the messages object
  const messageString = JSON.stringify(messages);
  
  const request = {
    "model": "llama3",
    "prompt": messageString,
    "stream": false,
  };

  console.log('[INFO] Request:', request);
  
  // Send the request and return the response
  const response = axios.post(apiURL, request);
  return response;
}

export { generateResponseMessage };

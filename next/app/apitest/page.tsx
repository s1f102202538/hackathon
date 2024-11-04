'use client';
import React from 'react';
import axios from 'axios';

const onSubmit = async () => {
  const data = { content: 'I want to go to Ikebukuro' };
  try {
    const response = await axios.post('/api/translation', data);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const ApiTest = () => (
  <div>
    <button onClick={onSubmit}>Test</button>
  </div>
);

export default ApiTest;

'use client';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { GetWordsParams, GetWordsResponse } from 'app/api/get-words/route';
import { TranslateParams, TranslateResponse } from 'app/api/translation/route';

const testGetWords = async () => {
  const data: GetWordsParams = { content: 'I want to go to Ikebukuro' };
  try {
    const response: AxiosResponse<GetWordsResponse> = await axios.post('/api/get-words', data);
    console.log(response.data.wordsArray);
  } catch (error) {
    console.log(error);
  }
};

const testTranslate = async () => {
  const date: TranslateParams = { text: '私は日本に住んでいます' };
  try {
    const response: AxiosResponse<TranslateResponse> = await axios.post('/api/translation', date);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const ApiTest = () => (
  <div>
    <button onClick={testGetWords}>get-words API</button>
    <br />
    <button onClick={testTranslate}>deepl API</button>
  </div>
);

export default ApiTest;

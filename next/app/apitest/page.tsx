'use client';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { ExtractionWordsParams, ExtractionWordsResponse } from 'app/api/user/word/extraction/route';
import { TranslateParams, TranslateResponse } from 'app/api/translation/route';

const testGetWords = async () => {
  const data: ExtractionWordsParams = { clientId: 'xxx', content: 'I want to go to Ikebukuro' };
  try {
    const response: AxiosResponse<ExtractionWordsResponse> = await axios.post('/api/get-words', data);
    console.log(response.data.wordsList);
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

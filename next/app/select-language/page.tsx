import React, { useState } from 'react';
import axios from 'axios';

// 言語コードの対応関係を定義
const languageMap: { [key: string]: string } = {
  'en-US': 'EN',
  'en-GB': 'EN-GB',
  'ja-JP': 'JA',
  'fr-FR': 'FR',
  'de-DE': 'DE',
  'es-ES': 'ES',
  'zh-CN': 'ZH',
  'ko-KR': 'KO',
  'it-IT': 'IT',
  'ru-RU': 'RU',
};

const LanguageSelector: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('en-US');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userLang = e.target.value;
    setSelectedLang(userLang);

    // 対応するDeepLの言語コードを取得
    const deepLLang = languageMap[userLang];

    // データベースに保存するためのAPIリクエストを送信
    axios
      .post('/api/saveLanguage', {
        userLang,
        deepLLang,
      })
      .then((response) => {
        console.log('言語設定が保存されました:', response.data);
      })
      .catch((error) => {
        console.error('言語設定の保存中にエラーが発生しました:', error);
      });
  };

  return (
    <div>
      <label htmlFor="language-select">言語を選択してください:</label>
      <select id="language-select" value={selectedLang} onChange={handleLanguageChange}>
        <option value="en-US">英語（米国）</option>
        <option value="en-GB">英語（英国）</option>
        <option value="ja-JP">日本語</option>
        <option value="fr-FR">フランス語</option>
        <option value="de-DE">ドイツ語</option>
        <option value="es-ES">スペイン語</option>
        <option value="zh-CN">中国語（簡体字）</option>
        <option value="ko-KR">韓国語</option>
        <option value="it-IT">イタリア語</option>
        <option value="ru-RU">ロシア語</option>
      </select>
    </div>
  );
};

export default LanguageSelector;

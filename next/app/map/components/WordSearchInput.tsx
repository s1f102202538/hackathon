// components/WordSearchInput.tsx
import React, { useState } from 'react';

interface WordSearchInputProps {
  placeholder: string;
  onSearch: (searchTerm: string) => void; // onSearchプロパティを追加
}

const WordSearchInput: React.FC<WordSearchInputProps> = ({ placeholder, onSearch }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '80%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #CCC',
          fontSize: '16px',
        }}
      />
      <button
        type="submit"
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007BFF',
          color: '#FFF',
          cursor: 'pointer',
          transition: '0.3s',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(window.innerWidth <= 480 && {
            width: '20%',
            fontSize: '15px',
            marginLeft: '5px',
          }),
        }}
      >
        検索
      </button>
    </form>
  );
};

export default WordSearchInput;

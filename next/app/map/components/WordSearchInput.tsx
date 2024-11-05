import React from 'react';

interface WordSearchInputProps {
  placeholder: string;
}

const WordSearchInput: React.FC<WordSearchInputProps> = ({ placeholder }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: '80%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #CCC',
          fontSize: '16px'
        }}
      />
    </div>
  );
};

export default WordSearchInput;

import React from 'react';

const WordUsageStats = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Usage of おはよう</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        <li>
          Home <span style={{ float: 'right' }}>15 times</span>
        </li>
        <li>
          School <span style={{ float: 'right' }}>8 times</span>
        </li>
        <li>
          Cafe <span style={{ float: 'right' }}>3 times</span>
        </li>
      </ul>
    </div>
  );
};

export default WordUsageStats;

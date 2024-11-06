/*'use client';
// app/components/Map.tsx
import { useEffect, useState } from 'react';*/
type MapProps = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const Map = ({ latitude, longitude, zoom }: MapProps) => {
  /*const [isAllowed, setIsAllowed] = useState(false);*/
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_APIKEY}=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`;

  /*useEffect(() => {
    const checkLimit = async () => {
      const response = await fetch('http://localhost:3000/api/map_limitter/limit');
      const data = await response.json();
      setIsAllowed(data.allowed);
    };

    checkLimit();
  }, []);*/

  return (
    <div style={{ marginBottom: '100px' }}>
      <iframe
        width="100%"
        height="400"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        title="Google Map"
      ></iframe>
    </div>
  );
};

export default Map;
/*
) : (
  <p>API呼び出し件数が上限に達しました。地図を表示できません。</p>
)}
{isAllowed ? (*/

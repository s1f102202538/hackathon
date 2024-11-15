import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={80}
        height={80}
        style={{ animation: "spin 1.5s linear infinite" }} // 1.5秒で1周
        className="cursor-pointer transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};

export default Loading;

import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={80}
        height={80}
        className="animate-spin cursor-pointer transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};

export default Loading;

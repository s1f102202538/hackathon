import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="relative flex items-center bg-gradient-to-r from-sky-400 to-blue-500 p-4">
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white">{title}</h1>
      <div className="ml-auto">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;

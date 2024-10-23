import Image from "next/image";
import MobileSheet from "./MobileSheet";

const Header = () => {
  return (
    <div className='bg-gray-50 backdrop-filter backdrop-blur-md p-4 border-b sticky top-0 z-50'>
      <div className="flex items-center justify-between md:justify-center">
        <Image
          alt=''
          priority
          width={50}
          height={50}
          src='/logo.webp'
          className='object-cover  md:hidden'
        />

        <p className='text-center text-2xl sm:text-3xl font-semibold'>Dashboard</p>

        <MobileSheet />
      </div>

      {/* <Image
        alt=''
        priority
        width={50}
        height={50}
        src='/logo.webp'
        className='object-cover absolute top-4 md:hidden'
      /> */}
    </div>
  );
};

export default Header;

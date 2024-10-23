import Image from "next/image";
import MobileSheet from "./MobileSheet";
import { createClient } from "@/utils/supabase/server";

const Header = async () => {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();




  return (
    <div className='bg-gray-50 backdrop-filter backdrop-blur-md p-4 border-b sticky top-0 z-50'>
      <div className='flex items-center justify-between md:justify-center'>
        <Image
          alt=''
          priority
          width={50}
          height={50}
          src='/logo.webp'
          className='object-cover  md:hidden'
        />

        <p className='text-center text-2xl sm:text-3xl font-semibold'>
          Dashboard
        </p>

        {user  && <MobileSheet />}
      </div>
    </div>
  );
};

export default Header;

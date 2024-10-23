import FormComponent from "@/components/FormComponent";
// import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
// import { redirect } from "next/navigation";

type SearchParamsProps = {
  searchParams: {
    message: string;
  };
};

const LoginPage = async ({ searchParams }: SearchParamsProps) => {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (user) {
//     redirect("/");
//   }

  return (
    <div className='w-full px-4 max-w-md mx-auto'>
      <div className='flex justify-center mt-6'>
        <Image alt='' priority width={100} height={100} src='/login.gif' />
      </div>

      {searchParams.message && (
        <p className='text-red-500 bg-red-500/10 rounded-lg p-3 my-4 text-sm text-center '>
          {searchParams.message}
        </p>
      )}
      <FormComponent />
    </div>
  );
};

export default LoginPage;

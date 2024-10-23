import Image from "next/image";

const ErrorPage = () => {
  return (
    <div className='px-4 py-32 flex flex-col justify-center items-center'>
      <Image alt='' width={180} height={180} src='/fail.gif' />
      <p>Something went wrong. Try again!</p>
    </div>
  );
};

export default ErrorPage;

import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

const CompletedProjects = async () => {
  const supabase = createClient();
  const { data } = await supabase.from("completed").select("*");
  return (
    <div className='px-4 py-8 w-full min-h-screen max-w-6xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center mb-3'>
        Completed Projects
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
        {data &&
          data.map((item) => (
            <Link href={`/completed-projects/${item.id}`} key={item.id}>
              <div className=' rounded-xl overflow-hidden shadow-md border'>
                <div className='p-3'>
                  <h3 className='font-medium'>{item.title}</h3>
                  <p className='text-sm text-gray-500'>{item.desc}</p>
                </div>
                <div className='relative w-full h-32'>
                  <Image
                    alt=''
                    fill
                    src={item.imgUrl}
                    className='aspect-video object-cover'
                  />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CompletedProjects;

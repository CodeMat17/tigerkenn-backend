import DeleteBlogPost from "@/components/DeleteBlogPost";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
 
export const revalidate = 0

const BlogPage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (!blogs) {
    return <div className='w-full py-32 text-center'>No blogs found.</div>;
  }

  return (
    <div className='px-4 py-12'>
      <h1 className='text-3xl font-semibold text-center mb-3'>Blog Post</h1>
      <div className='flex justify-center mb-12'>
        <Button asChild>
          <Link href={`/blogs/add-new-blog-post`}> Add Blog Post</Link>
        </Button>
      </div>

      <div className='flex flex-wrap justify-center gap-4'>
        {blogs &&
          blogs.map((blog) => (
            <div
              key={blog.id}
              className='w-[300px] rounded-xl overflow-hidden shadow-md'>
              <Link href={`/blogs/${blog.id}`}>
                <div className='relative w-[300px] aspect-video'>
                  <Image alt='' priority fill src={blog.img} />
                </div>
                <div className='px-5 py-3 bg-gray-100 dark:bg-gray-900'>
                  <h2 className='font-medium dark:text-gray-300 line-clamp-2 leading-6'>
                    {blog.title}
                  </h2>
                </div>
              </Link>
              <div className='pl-5 pr-4 flex items-center justify-between'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Published on{"  "}
                  {dayjs(blog.published_at).format("MMM DD, YYYY")}
                </p>
              
                <DeleteBlogPost id={blog.id} title={blog.title} img={blog.img} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlogPage;

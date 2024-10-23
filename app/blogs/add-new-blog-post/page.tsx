import AddBlogPost from "@/components/AddBlogPost";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const AddNewBlogPost = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="px-4">
       <AddBlogPost user={user} />
    </div>
  );
};

export default AddNewBlogPost;

import ListingsPage from "@/components/ListingsPage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Listings = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='px-2 py-12 '>
      <ListingsPage user={user} />
    </div>
  );
};

export default Listings;

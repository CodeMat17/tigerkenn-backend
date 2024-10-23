
import AddListing from '@/components/AddListing'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const AddNewList = async () => {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='max-w-2xl min-h-screen mx-auto pb-12 pt-6 px-4'>
    <AddListing user={user} />
    </div>
  );
};

export default AddNewList;

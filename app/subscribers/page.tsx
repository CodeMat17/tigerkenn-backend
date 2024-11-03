import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { MailCheckIcon } from "lucide-react";

const Subscribers = async () => {
  const supabase = createClient();
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className='px-4 py-10 w-full max-w-md mx-auto'>
      <h3 className='text-xl font-semibold text-center'>Subscribers</h3>
      <div className='mt-6'>
        {subscribers && subscribers?.length < 1 ? (
          <p className='text-center py-32'>No subscriber at the moment</p>
        ) : (
          subscribers?.map((subscriber) => (
            <div key={subscriber.id} className='flex items-center gap-3 mb-3'>
              <MailCheckIcon size={26} className='text-gray-500' />
              <div>
                      <p>{subscriber.email}</p>
                <p className='text-gray-500 text-sm'>
                  Subscribed on{" "}
                  {dayjs(subscriber.created_at).format("MMM DD, YYYY")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Subscribers;

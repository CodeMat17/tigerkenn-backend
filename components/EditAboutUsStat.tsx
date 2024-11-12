"use client";

import { createClient } from "@/utils/supabase/server";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const EditAboutUsStat = () => {

    const supabase = createClient();

    const [stat, setStat] = useState([])


    useEffect(() => {
        fetchStat();
    }, [])

    const fetchStat = async () => {
        const { data, error } = await supabase.from('stat').select('*')
        if (error) {
            console.error(error);
            toast.error('ERROR!', {description: `Something went wrong: ${error.message}`})
            return;
        }

        if (data) {
            setStat(data[0]);
        }
    }

    
  return (
    <div className=' max-w-3xl mx-auto mb-16'>
    
      <h2 className='text-3xl text-center font-medium mb-6'>Stat</h2>
          <pre>{ JSON.stringify(stat, null,2)}</pre>
    </div>
  );
};

export default EditAboutUsStat;

import EditAboutUsChooseUs from "@/components/EditAboutUsChooseUs";
import EditAboutUsIntro from "@/components/EditAboutUsIntro";
import EditAboutUsMission from "@/components/EditAboutUsMission";
import EditAboutUsServices from "@/components/EditAboutUsServices";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const revalidate = 0;

const AboutUs = async () => {
  const supabase = createClient();

 const {
   data: { user },
 } = await supabase.auth.getUser();

 if (!user) {
   redirect("/login");
 }


  const { data: intro } = await supabase.from("intro").select("*").single();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .single();

  const { data: mission } = await supabase.from("mission").select("*").single();

  const { data: choose } = await supabase.from("choose").select("*").single();

  return (
    <div className='px-4 py-12 w-full min-h-screen'>
      <h1 className='text-xl font-semibold text-center'>Edit About-Us Page</h1>

      <div>
        <EditAboutUsIntro
          id={intro.id}
          dataTitle={intro.title}
          dataDesc={intro.desc}
        />

        {/* <EditAboutUsStat /> */}

        <EditAboutUsServices
          id={services.id}
          dataTitle={services.title}
          dataDesc={services.desc}
        />

        <EditAboutUsMission
          id={mission.id}
          dataTitle={mission.title}
          dataDesc={mission.desc}
        />

        <EditAboutUsChooseUs
          id={choose.id}
          dataTitle={choose.title}
          dataDesc={choose.desc}
        />
      </div>
    </div>
  );
};

export default AboutUs;

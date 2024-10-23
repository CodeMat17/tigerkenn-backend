import ContactInfo from '@/components/ContactInfo';
import {createClient} from '@/utils/supabase/server'
import { redirect } from 'next/navigation';

const ContactUs = async () => {
  const supabase = createClient()

   const {
     data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
     redirect("/login");
   }
  
  const {data: contact} = await supabase.from('contact').select('*').single()

  return (
    <div className='p-4 w-full min-h-screen max-w-xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center mb-6'>Contact Us</h1>
      <ContactInfo
        id={contact.id}
        contact_title={contact.title}
        contact_sub={contact.subtitle}
        contact_phone={contact.phone}
        contact_whatsapp={contact.whatsapp}
        contact_add={contact.address}
        contact_hours={contact.hours}
      />
    </div>
  );
}

export default ContactUs
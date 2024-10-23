"use client";

import { MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  id: string;
  contact_title: string;
  contact_sub: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_add: string;
  contact_hours: string;
};

const ContactInfo = ({
  id,
  contact_title,
  contact_sub,
  contact_phone,
  contact_whatsapp,
  contact_add,
  contact_hours,
}: Props) => {
  const [title, setTitle] = useState(contact_title);
  const [subtitle, setSubtitle] = useState(contact_sub);
  const [phone, setPhone] = useState(contact_phone);
  const [whatsapp, setWhatsapp] = useState(contact_whatsapp);
  const [address, setAddress] = useState(contact_add);
  const [hours, setHours] = useState(contact_hours);
  const [loading, setLoading] = useState(false);

 const handleUpdate = async () => {
   if (
     !id ||
     !title ||
     !phone ||
     !subtitle ||
     !whatsapp ||
     !address ||
     !hours
   ) {
     toast.error("ERROR!", {
       description: "Please fill in all the required fields.",
     });
     return; // Exit the function early if fields are missing
   }

   setLoading(true);

   const formData = new FormData();
   formData.append("id", id);
   formData.append("title", title);
   formData.append("subtitle", subtitle);
   formData.append("phone", phone);
   formData.append("whatsapp", whatsapp);
   formData.append("address", address);
   formData.append("hours", hours);

   try {
     const res = await fetch("/api/contact", {
       method: "POST",
       body: formData,
     });

     const result = await res.json();

     if (res.ok) {
       toast("DONE!", {
         description: "Contact information updated successfully",
       });
     } else {
       toast.error("ERROR!", {
         description: `Failed to update contact information: ${result.error}`,
       });
     }
   } catch (error) {
     console.error("Failed to update contact information: ", error);
     toast.error("ERROR!", {
       description: "Error updating contact information",
     });
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className='space-y-4 mb-12'>
      <div>
        <label className='text-sm mb-1'>Title</label>
        <Input
          placeholder='Enter the contact page title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='bg-blue-50 outline-none'
        />
      </div>

      <div>
        <label className='text-sm mb-1'>Subtitle</label>
        <Textarea
          placeholder='Enter the contact page subtitle'
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className='bg-blue-50 outline-none'
        />
      </div>

      <div>
        <label className='text-sm mb-1'>Address</label>
        <Input
          placeholder='Enter office address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className='bg-blue-50 outline-none'
        />
      </div>

      <div className='flex gap-4 w-full'>
        <div className='w-full'>
          <label className='text-sm mb-1'>Phone no</label>
          <Input
            placeholder='Enter the contact page title'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='bg-blue-50 outline-none '
          />
        </div>
        <div className='w-full'>
          <label className='text-sm mb-1'>Whatsapp no</label>
          <Input
            placeholder='Enter the contact page title'
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className='bg-blue-50 outline-none w-full'
          />
        </div>
      </div>
      <div>
        <label className='text-sm mb-1'>Working hours</label>
        <ReactQuill value={hours} onChange={setHours} />
      </div>
      <Button onClick={handleUpdate} className='w-full'>
        {loading ? <MinusIcon className='animate-spin' /> : "Submit"}
      </Button>
    </div>
  );
};

export default ContactInfo;

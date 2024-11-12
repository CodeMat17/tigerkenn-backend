"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/clients";
import { MinusIcon } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  params: { id: string };
};

const CompletedProjectsComponent = ({ params: { id } }: Props) => {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("completed")
      .select("*")
      .eq("id", id)
      .single();

    if (!data || error) {
      notFound();
      return null;
    }

    if (data) {
      setTitle(data.title);
      setDesc(data.desc);
      setImgUrl(data.imgUrl);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);

      // Immediate preview for the new image
      const objectUrl = URL.createObjectURL(file);
      setImgUrl(objectUrl);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("desc", desc);

      if (newImageFile) {
        formData.append("img", newImageFile);
      }

      const response = await fetch("/api/completed-projects", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast("DONE!", {
          description: "Project updated successfully",
        });
        console.log("Data updated successfully");
        router.push("/completed-projects");
      } else {
        toast.error(`Update Failed!`, {
          description: `${result.error} || Something went wrong`,
        });
           throw new Error(result.error || "Error updating data");
      }
    } catch (error) {
      toast.error(`Update Failed!`, { description: `${error}` });
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen max-w-2xl mx-auto p-4'>
      <h1 className='text-3xl font-semibold text-center mb-3'>Edit Project</h1>

      <div className='mt-4 space-y-4'>
        <div>
          <label className='text-sm text-gray-600 '>Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='mt-1'
          />
        </div>
        <div>
          <label className='text-sm text-gray-600 '>Description</label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className='mt-1'
          />
        </div>
        <div>
          <label className='text-sm text-gray-600 '>Image</label>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-1'>
            <Image
              alt='Project Image'
              priority
              width={300}
              height={200}
              src={imgUrl}
              className='object-cover aspect-video rounded-xl'
            />
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='mt-2'
            />
          </div>
        </div>

        <Button
          onClick={handleSaveChanges}
          disabled={loading}
          className='mt-5 w-full'>
          {loading ? <MinusIcon className='animate-spin' /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default CompletedProjectsComponent;

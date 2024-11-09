"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  id: string;
  title: string;
  img: string;
};

const DeleteListing = ({ id, title, img }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deletePost = async () => {
    if (!id) {
      toast.error("ERROR!", {
        description: "Something went wrong",
      });
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(`/api/delete-listing`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (res.ok) {
        setOpen(false);
        toast.success(`DONE!`, {
          description: "Listing deleted successfully",
        });
      } else {
        alert(`Something went wrong: ${result.message}`);
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ERROR", error);
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <TrashIcon className='text-red-500' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this listing?
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <div className='relative w-full h-40 aspect-video'>
          <Image
            alt=''
            priority
            fill
            src={img}
            className='rounded-xl aspect-square object-cover'
          />
        </div>
        <Button onClick={deletePost}>
          {loading ? <MinusIcon className='animate-spin' /> : "Delete"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteListing;

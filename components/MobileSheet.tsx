"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlignRightIcon,
  LayoutList,
  LayoutPanelLeftIcon,
  PodcastIcon,
  PowerOffIcon,
  RssIcon,
  UserRoundPenIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const links = [
  { label: "HERO", href: "/hero-page", icon: LayoutPanelLeftIcon },
  { label: "ABOUT Us", href: "/about-us", icon: UsersIcon },
  { label: "LISTINGS", href: "/listings", icon: LayoutList },
  { label: "BLOG POSTS", href: "/blogs", icon: RssIcon },
  { label: "CONTACT US", href: "/contact-us", icon: UserRoundPenIcon },
  { label: "SUBSCRIBERS", href: "/subscribers", icon: PodcastIcon },
];

const MobileSheet = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className='md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <AlignRightIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className='flex justify-center items-center'>
            <Image
              alt=''
              priority
              width={50}
              height={50}
              src='/logo.webp'
              className='object-cover  md:hidden'
            />
          </SheetHeader>
          <nav className='py-12 px-4 flex flex-col justify-center gap-4'>
            {links.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  onClick={() => setOpen(false)}
                  key={i}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg flex justify-start hover:bg-gray-100 ${
                    link.href === pathname && "bg-gray-200"
                  }`}>
                  <Icon className='w-6 h-6' />
                  <span className='ml-2 font-medium'>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className='flex justify-center mt-8'>
            <form action='/auth/signout' method='post'>
              <Button variant='ghost' className='bg-red-100 w-full' type='submit'>
                <PowerOffIcon /> <span className="ml-1">Sign Out</span>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSheet;

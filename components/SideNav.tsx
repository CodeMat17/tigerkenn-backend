"use client";

import {
  BookmarkCheckIcon,
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
import { Button } from "./ui/button";

const links = [
  { label: "HERO", href: "/hero-page", icon: LayoutPanelLeftIcon },
  { label: "ABOUT Us", href: "/about-us", icon: UsersIcon },
  { label: "LISTINGS", href: "/listings", icon: LayoutList },
  { label: "BLOG POSTS", href: "/blogs", icon: RssIcon },
  {
    label: "COMPLETED PROJECTS",
    href: "/completed-projects",
    icon: BookmarkCheckIcon,
  },
  { label: "CONTACT US", href: "/contact-us", icon: UserRoundPenIcon },
  { label: "SUBSCRIBERS", href: "/subscribers", icon: PodcastIcon },
];

const SideNav = () => {
  const pathname = usePathname();

  return (
    <div className='hidden md:flex md:flex-col h-screen w-32 lg:w-64 xl:w-72 py-6'>
      <div className='flex justify-center bg-gray-50 p-4'>
        <Image
          alt=''
          priority
          width={80}
          height={80}
          src='/logo.webp'
          className='object-cover'
        />
      </div>
      <nav className='p-4 flex flex-col justify-center gap-4'>
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link
              key={i}
              href={link.href}
              className={`px-4 py-1 rounded-lg flex justify-center lg:justify-start hover:bg-gray-100 ${
                link.href === pathname && "bg-gray-200"
              }`}>
              <Icon className='w-6 h-6 flex-shrink-0' />
              <span className='hidden lg:block ml-2 font-medium'>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className=' mt-3 px-4'>
        <form
          action='/auth/signout'
          method='post'
          className='flex justify-center items-center'>
          <Button
            variant='ghost'
            className='bg-red-100 w-full hover:bg-red-400 hover:text-white'
            type='submit'>
            <PowerOffIcon />{" "}
            <span className='ml-1 text hidden lg:block'>Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SideNav;

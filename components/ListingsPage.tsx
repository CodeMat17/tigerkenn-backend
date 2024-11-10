"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { createClient } from "@/utils/supabase/clients";
import { type User } from "@supabase/supabase-js";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  MinusIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteListing from "./DeleteListing";

type ListingsProps = {
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  img: string;
  status: string;
  location: string;
  sqm: number;
  available: boolean;
  desc: string;
  slug: string;
  category: string;
  fenced: boolean;
  gate: boolean;
};

const ListingsPage = ({ user }: { user: User }) => {
  const router = useRouter();
  if (!user) {
    router.push("/login");
  }

  const supabase = createClient();

  const [listings, setListings] = useState<ListingsProps[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false);

  useEffect(() => {
    fetchListings();
  }, [page, searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    const perPage = 9;
    const from = page * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("listings")
      .select(
        "id, img, price, status, title, beds, baths, sqm, location, available, desc, slug, category, fenced, gate",
        {
          count: "exact",
        }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchQuery) {
      query = supabase
        .from("listings")
        .select(
          "id, img, price, status, title, beds, baths, sqm, location, available, desc, slug, category, fenced, gate",
          {
            count: "exact",
          }
        )
        .or(`location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false })
        .range(from, to);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setListings(data || []);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setNoMatchFound(data?.length === 0);
      // setTotalCount(count || 0);
    }

    setLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page on new search
  };

  return (
    <div className='px-2 py-12 w-full max-w-5xl mx-auto min-h-screen'>
      <h1 className='text-3xl mb-3 font-semibold text-center'>
        Update Listings
      </h1>
      <div className='flex justify-center mb-8'>
        <Button asChild>
          <Link href='/listings/add-new-listing'>Add New Listing</Link>
        </Button>
      </div>

      <div className='relative w-full max-w-md mx-auto mb-8'>
        <Input
          type='search'
          placeholder='Search listings by location or by category: land or house...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='mb-4 pl-10 py-2 pb-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 '
        />
        <SearchIcon className='absolute top-2.5 w-5 h-5 ml-3 text-sky-600' />
      </div>

      {loading ? (
        <div className='w-full flex items-center justify-center px-4 py-32'>
          <MinusIcon className='animate-spin mr-3' /> Please wait...
        </div>
      ) : (
        <>
          {noMatchFound ? (
            <div className='w-full text-center px-4 py-32'>
              No match found. Try again.
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-4'>
              {listings &&
                listings.map((list) => (
                  <div
                    key={list.id}
                    className='max-w-[300px] border  rounded-xl overflow-hidden shadow-md '>
                    <Link href={`/listings/${list.slug}`}>
                      <div>
                        <Image
                          alt={list.id}
                          priority
                          width={320}
                          height={150}
                          src={list.img}
                          className='w-[320px] aspect-video object-cover'
                        />
                        <div className='px-4 pb-4 pt-2 space-y-2'>
                          <h2 className='leading-5 font-medium truncate'>
                            {list.title}
                          </h2>
                          <div
                            className='text-[17px] leading-relaxed  [&_p]:-my-1 line-clamp-2 text-sm dark:text-gray-400'
                            dangerouslySetInnerHTML={{ __html: list.desc }}
                          />
                          {list.category === "house" && (
                            <div className='text-xs flex items-center justify-between'>
                              <p>{list.beds} Beds</p>
                              <p>{list.baths} Baths</p>
                              <p>{list.sqm} Sqm</p>
                            </div>
                          )}

                          {list.category === "land" && (
                            <div className='text-xs flex items-center justify-between'>
                              <p>{list.fenced ? "Fenced" : "Not fenced"}</p> |
                              <p>{list.gate ? "Gated" : "No gate"}</p> |
                              <p>{list.sqm} Sqm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className='flex items-center justify-between px-4 text-sm mb-2'>
                      <div className='flex items-center gap-1 text-blue-800'>
                        {" "}
                        <MapPinIcon className='w-4 h-4' />
                        <p>{list.location}</p>
                      </div>
                      <DeleteListing
                        id={list.id}
                        title={list.title}
                        img={list.img}
                        reload={fetchListings}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      <div className='my-7'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant='ghost'
                onClick={() => setPage(page - 1)}
                disabled={page === 0}>
                <ChevronLeftIcon className='mr-2' /> Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className='text-sm'>
                Page {page + 1} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <Button
                variant='ghost'
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}>
                Next <ChevronRightIcon className='ml-2' />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ListingsPage;

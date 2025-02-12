"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { signOut } from "next-auth/react";

const Header = () => {
  return (
    <div className="h-20 bg-white  w-full flex justify-between items-center px-5 lg:px-10 xl:px-20 border-b border-slate-300">
      <Link href="/book">
        <Image src="/images/book.png" alt="book icon" height={50} width={50} />
      </Link>
      <section>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-black text-3xl outline-none">
              <CgProfile />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-8">
            <DropdownMenuItem>
              <Link href="add-book">Add Book</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                Log Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
};

export default Header;

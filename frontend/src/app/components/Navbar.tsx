"use client";

import { Navbar } from "flowbite-react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();
  
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Homebroker Simulator
        </span>
      </Navbar.Brand>
      <Link className="list-none"
        href={`/${params.wallet_id}`}
      >
        Home
      </Link>
      <div className="flex md:order-2 text-white">Hello, user {params.wallet_id}</div>
    </Navbar>
  );
}
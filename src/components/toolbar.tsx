"use client";

import { Cross, MessagesSquare, UserRound, X } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

const Toolbar: React.FC = () => {
  const router = useRouter();
  const { customer, setCustomer } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const links: Record<string, { link: string; icon: React.JSX.Element }> =
    React.useMemo(() => {
      const rest = { "Contact Us": { link: "", icon: <MessagesSquare /> } };
      if (customer?.id) {
        return {
          Account: { link: "/account", icon: <UserRound /> },
          ...rest,
        };
      }
      return { Login: { link: "/login", icon: <UserRound /> }, ...rest };
    }, [customer]);

  const handleHomeClick = React.useCallback(() => {
    setCustomer(null);
    router.push("/");
  }, [setCustomer, router]);

  return (
    <div className="bg-white text-black p-4 fixed top-0 w-full flex justify-between items-center shadow-md z-50">
      <Image
        src={"/hastings-direct-logo.svg"}
        height={50}
        width={200}
        alt={"hastings logo"}
        className="cursor-pointer"
        onClick={handleHomeClick}
      />
      <div className="space-x-4 hidden sm:flex">
        {Object.entries(links).map(([name, info]) => (
          <a
            key={name}
            href={info.link}
            className="hover:text-gray-500 flex flex-row gap-2"
          >
            {info.icon}
            {name}
          </a>
        ))}
      </div>
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-black focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-4 sm:hidden">
          {Object.entries(links).map(([name, info]) => (
            <a
              href={info.link}
              className="hover:text-gray-500 flex flex-row gap-2 text-xl"
            >
              {info.icon}
              {name}
            </a>
          ))}
          <X
            onClick={toggleMenu}
            className="text-black focus:outline-none mt-4"
          >
            Close
          </X>
        </div>
      )}
    </div>
  );
};

export default Toolbar;

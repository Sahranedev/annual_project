"use client";

import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiChevronDown,
  FiChevronUp,
  FiUser,
} from "react-icons/fi";
import ApiHelper from "./ApiHelper";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "./store/cartStore";
import { HeaderDataProps } from "@/types/header";

export default function Header() {
  const [headerData, setHeaderData] = useState<HeaderDataProps>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ajout du panier
  const { items } = useCartStore();
  const cartItemsCount = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const route =
          "header?populate[0]=logo&populate[1]=links&populate[2]=links.sublinks&populate[3]=links.sublinks.img";
        const { data } = await ApiHelper(route, "GET");
        setHeaderData(data || {});
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveMegaMenu(null);
  };

  const toggleMegaMenu = (linkId: number) => {
    setActiveMegaMenu(activeMegaMenu === linkId ? null : linkId);
  };

  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          {headerData.logo && (
            <Link
              className="flex items-center"
              href="/"
              onClick={handleLinkClick}
            >
              <Image
                src={"http://localhost:1337" + headerData.logo.url}
                alt={headerData.logo.alternativeText || "Logo"}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          )}

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="flex space-x-4">
              {headerData.links &&
                headerData.links.map((link) => (
                  <div
                    key={link.id}
                    className="group"
                    onMouseEnter={() => setActiveMegaMenu(link.id)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <div className="flex items-center">
                      <Link
                        href={link.url}
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </Link>
                      {link.sublinks && link.sublinks.length > 0 && (
                        <FiChevronDown className="h-4 w-4 text-gray-700" />
                      )}
                    </div>
                    {/* Mega Menu Responsive */}
                    {link.sublinks &&
                      link.sublinks.length > 0 &&
                      activeMegaMenu === link.id && (
                        <div className="absolute left-0 w-screen p-2 bg-white shadow-lg rounded-md z-50">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 justify-center w-fit mx-auto">
                            {link.sublinks.map((sublink) => (
                              <Link
                                key={sublink.id}
                                href={sublink.url}
                                className="flex flex-col items-start rounded-lg hover:bg-gray-100 transition p-2 w-[200px]"
                                onClick={() => {
                                  handleLinkClick();
                                  setActiveMegaMenu(null);
                                }}
                              >
                                {sublink.img && (
                                  <div className="relative flex-shrink-0 aspect-square w-[200px] h-[200px]">
                                    <Image
                                      src={"http://localhost:1337" + sublink.img.url}
                                      alt={sublink.img.alternativeText || "Image"}
                                      fill
                                      objectFit="cover"
                                      className="rounded-md size-full"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-base font-medium text-gray-900">
                                    {sublink.label}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {sublink.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>

          {/* Boutons de droite (toujours visibles) */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gray-900"
              onClick={handleLinkClick}
            >
              <FiShoppingCart className="h-6 w-6" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="text-gray-700 hover:text-gray-900"
              onClick={handleLinkClick}
            >
              <FiUser className="h-6 w-6" />
            </Link>

            {/* Bouton menu burger (mobile uniquement) */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {headerData.links &&
              headerData.links.map((link) => (
                <div key={link.id}>
                  <div
                    onClick={() => toggleMegaMenu(link.id)}
                    className="flex justify-between items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium w-full text-left"
                  >
                    <Link
                      key={link.id}
                      href={link.url}
                      className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </Link>
                    {link.sublinks &&
                      link.sublinks.length > 0 &&
                      (activeMegaMenu === link.id ? (
                        <FiChevronUp className="h-4 w-4 text-gray-700" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-gray-700" />
                      ))}
                  </div>

                  {/* Sous-menu mobile */}
                  {link.sublinks &&
                    link.sublinks.length > 0 &&
                    activeMegaMenu === link.id && (
                      <div className="pl-4">
                        {link.sublinks.map((sublink) => (
                          <Link
                            key={sublink.id}
                            href={sublink.url}
                            className="text-lg font-semibold hover:text-gray-900 block px-4 py-3"
                            onClick={() => {
                              handleLinkClick();
                              setActiveMegaMenu(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}

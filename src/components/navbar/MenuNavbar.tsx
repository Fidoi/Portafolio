"use client";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";
import { MobileNavbar } from "./dropdown/MobileNavbar";

import { ThemeSwitcher } from "./ThemeSwitcher";

import { TitleAnimation } from "../ui/titles/titleAnimation";
import { usePathname } from "next/navigation";
import { ImageAudio } from "./image/ImageAudio";

export const MenuNavbar = () => {
  const pathname = usePathname();
  return (
    <Navbar
      isBordered
      maxWidth="full"
      height="5rem"
      position="sticky"
      className="top-0 z-50 bg-background/80 backdrop-blur-md"
    >
      <NavbarContent justify="start">
        <ImageAudio />
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="center">
        <MobileNavbar />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem isActive>
          <Link
            href="/projects"
            className={`
             ${pathname.startsWith("/projects") ? "text-primary" : "text-foreground"} 
            hover:text-primary-700 
            transition-colors duration-500
          `}
          >
            <TitleAnimation title="Proyectos" className="text-2xl" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/"
            className={`
            ${pathname === "/" ? "text-primary" : "text-foreground"} 
            hover:text-primary-700 
            transition-colors duration-500
          `}
          >
            <TitleAnimation title="Inicio" className="text-2xl" />
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            color="foreground"
            href="/integrations"
            className={`
            ${pathname === "/integrations" ? "text-primary" : "text-foreground"} 
            hover:text-primary-700 
            transition-colors duration-500
          `}
          >
            <TitleAnimation title="Integraciones" className="text-2xl" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/contact"
            className={`
            ${pathname === "/contact" ? "text-primary" : "text-foreground"} 
            hover:text-primary-700 
            transition-colors duration-500
          `}
          >
            <TitleAnimation title="Contacto" className="text-2xl" />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
};

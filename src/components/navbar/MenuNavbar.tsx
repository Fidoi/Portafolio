"use client";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";

import { ImageAudio } from "./image/music";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { DropDown } from "./dropdown/DropDown";
import { TitleAnimation } from "../ui/titles/titleAnimation";
import { usePathname } from "next/navigation";

export const MenuNavbar = () => {
  const pathname = usePathname();
  return (
    <Navbar
      isBordered
      maxWidth="full"
      height={"5rem"}
      className="flex justify-between items-center fixed"
    >
      <NavbarContent justify="start">
        <ImageAudio />
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="center">
        <DropDown />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem isActive>
          <Link
            href="/projects"
            className={`
            ${pathname === "/projects" ? "text-primary" : "text-foreground"} 
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

        <NavbarItem isActive={false}>
          <Link
            color="foreground"
            href="#"
            className="pointer-events-none cursor-default opacity-50"
          >
            <TitleAnimation title="Integraciones" className="text-2xl" />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
};

"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@heroui/react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { MdWork, MdEmail } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { CiMenuBurger } from "react-icons/ci";

export const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <NavbarItem>
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Button disableRipple radius="sm" color="primary">
            <CiMenuBurger />
            Menu
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Navegación" className="w-[340px]">
          <DropdownItem key="home" textValue="Inicio">
            <Button
              as={Link}
              href="/"
              variant="light"
              className="w-full justify-start text-xl"
            >
              <FaHome />
              Inicio
            </Button>
          </DropdownItem>

          <DropdownItem key="projects" textValue="Proyectos">
            <Button
              as={Link}
              href="/projects"
              variant="light"
              className="w-full justify-start text-xl"
            >
              <MdWork />
              Proyectos
            </Button>
          </DropdownItem>

          <DropdownItem key="integrations" textValue="Integraciones">
            <Button
              as={Link}
              href="/integrations"
              variant="light"
              className="w-full justify-start text-xl"
            >
              <AiFillEye />
              Integraciones
            </Button>
          </DropdownItem>

          <DropdownItem key="contact" textValue="Contacto">
            <Button
              as={Link}
              href="/contact"
              variant="light"
              className="w-full justify-start text-xl"
            >
              <MdEmail />
              Contacto
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
};

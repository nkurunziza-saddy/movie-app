"use client";

import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

type NavigationLink = {
  href: string;
  label: string;
};

type NavigationMenuItemsProps = {
  links: NavigationLink[];
  isDesktop: boolean;
};

export default function NavigationMenuItems({
  links,
  isDesktop,
}: NavigationMenuItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, index) => (
        <NavigationMenuItem key={index} className={!isDesktop ? "w-full" : ""}>
          <NavigationMenuLink
            href={link.href}
            className="py-1 capitalize"
            active={pathname === link.href}
          >
            {link.label}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );
}

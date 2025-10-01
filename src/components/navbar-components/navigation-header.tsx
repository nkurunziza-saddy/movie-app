import InfoMenu from "@/components/navbar-components/info-menu";
import Logo from "@/components/navbar-components/logo";
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Equal } from "lucide-react";
import Link from "next/link";
import CreateFormQuickLinks from "./quick-create-links";
import { ThemeTogglerResponsive } from "../settings-components/theme-toggler-responsive";
import { getServerSession } from "@/lib/auth/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const navigationLinks = [
  { href: "/", label: "home" },
  { href: "/popular", label: "popular" },
];

export default async function Header() {
  const session = await getServerSession();

  const betterNav =
    session?.user.email === process.env.ADMIN_EMAIL
      ? [
          ...navigationLinks,
          { href: "/activity/bookmarks", label: "bookmarks" },
          { href: "/dashboard", label: "dashboard" },
        ]
      : session?.user.email
      ? [
          ...navigationLinks,
          { href: "/activity/bookmarks", label: "bookmarks" },
        ]
      : navigationLinks;
  return (
    <header className="border-b ">
      <div className="flex h-16 items-center justify-between gap-4 container mx-auto px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>

            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {betterNav.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <InfoMenu />
                {session.user.email === process.env.ADMIN_EMAIL && (
                  <CreateFormQuickLinks />
                )}
              </div>
              <UserMenu user={session.user} />
            </div>
          ) : (
            <div className="md:flex hidden items-center gap-2">
              <Button asChild size="sm" className="text-sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger className="group size-10 md:hidden">
              <Button size={"icon"} variant={"ghost"}>
                <Equal />
              </Button>
            </SheetTrigger>
            <SheetContent className="md:hidden" side="left">
              <SheetHeader className="border-b">
                <SheetTitle>All Movies</SheetTitle>
                <SheetDescription>
                  A collection site that allows you to download movies and TV
                  shows.
                </SheetDescription>
              </SheetHeader>
              <NavigationMenu className="max-w-none *:w-full flex flex-col items-center justify-start">
                <NavigationMenuList className="flex-col px-2 items-start gap-2 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5 text-2xl"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              <SheetFooter>
                {session ? (
                  <ThemeTogglerResponsive />
                ) : (
                  <div className="flex flex-col gap-2">
                    <ThemeTogglerResponsive />
                    <Card className="gap-2 py-4 shadow-none card-glass">
                      <CardHeader className="px-4 border-b border-b-input">
                        <CardTitle className="">Sign in</CardTitle>
                        <CardDescription>
                          Sign in to get more features
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4">
                        <div className="flex text-sm flex-col text-foreground/85 gap-0.5">
                          <li className="">Bookmarking</li>
                          <li className="">Specific suggestions</li>
                          <li className="">Record your activities</li>
                          <li className="">and many more</li>
                        </div>
                        <CardFooter className="px-0 mt-3">
                          <Button asChild>
                            <Link href="/auth/signin">Sign In</Link>
                          </Button>
                        </CardFooter>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import {
  BookOpen,
  FolderOpen,
  Home,
  Library,
  ShoppingBag,
  User,
} from "lucide-react";

export interface NavLink {
  title: string;
  href: string;
  icon?: React.ElementType;
}

export const NAV_LINKS: NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Books",
    href: "/books",
    icon: BookOpen,
  },
  {
    title: "Shop",
    href: "/shop",
    icon: FolderOpen,
  },
];

export const USER_LINKS: NavLink[] = [
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "My Library",
    href: "/library",
    icon: Library,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
];

export const ADMIN_LINK = {
  title: "Dashboard",
  href: "/admin",
};
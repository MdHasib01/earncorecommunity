"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/search-dialog-ui";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommandInput } from "./ui/command";
import { Search } from "lucide-react";
import { SearchForm } from "./search-form";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchDialouge() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState("");
  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const basePath = `/`;

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 px-6 py-2 border rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Search className="text-muted-foreground w-5 h-5" />
            <p className="text-muted-foreground text-sm">Search</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[495px]">
          <div className="flex items-center gap-2 mt-2 border-b-1">
            <Search />
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search or ask a question"
                className="w-full outline-none p-2"
              />
            </form>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Search />
            <h2 className="text-center font-semibold text-xl">
              Search in the community
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Try searching for keywords in posts, comments, events, lessons,
              spaces and more...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Search className="text-muted-foreground w-5 h-5" />
          <p className="text-muted-foreground text-sm">Search</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <div className="flex gap-2 w-full">
            <div className="flex items-center gap-2  border rounded-lg w-full bg-background dark:bg-input/30">
              <Search className="w-6 h-6 ml-2" />
              <input
                type="text"
                placeholder="Search or ask a question"
                className="w-full outline-none p-[5px]"
              />
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <Search />
            <h2 className="text-center font-semibold text-xl">
              Search in the community
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Try searching for keywords in posts, comments, events, lessons,
              spaces and more...
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

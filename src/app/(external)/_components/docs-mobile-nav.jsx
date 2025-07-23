"use client";
import React from "react";

import Link from "next/link";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function DocsMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" size="icon" variant="outline">
          <Bars3BottomRightIcon className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-72" side="left">
        <SheetHeader className={"flex flex-col items-start"}>
          <SheetTitle>API Documentation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-start gap-2 text-sm mt-4">
          <Link
            className="flex items-center gap-2 rounded-md bg-muted w-full px-2 py-2 text-primary font-medium"
            href="#"
          >
            PayBoss Collections API
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default DocsMobileNav;

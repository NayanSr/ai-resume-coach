import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Resume Coach
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-foreground">
            How it works
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get started</Button>
            </SignUpButton>
          </Show>

           

          <Show when="signed-in">
            <Button  variant="ghost" className="hidden sm:inline-flex" nativeButton={false}
            render={<Link href="/dashboard" />}>
              Dashboard
            </Button>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}




/* 
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Resume Coach
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="hover:text-foreground">
            Features
          </Link>

          <Link href="/#how-it-works" className="hover:text-foreground">
            How it works
          </Link>

          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            Sign in
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
 */
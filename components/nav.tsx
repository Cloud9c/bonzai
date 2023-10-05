import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Loader, Search } from "lucide-react";
import Link from "next/link";
import { NodeObject } from "react-force-graph-2d";

export function Nav({
  onSearchSubmit,
  focused,
  loading,
}: {
  onSearchSubmit: any;
  focused: NodeObject | undefined;
  loading: boolean;
}) {
  return (
    <div className="fixed z-10 text-primary w-full flex h-14 items-center px-8">
      <div className="mr-4 hidden md:flex">
        <a className="mr-6 flex items-center space-x-2" href="/">
          <span className="hidden font-bold sm:inline-block">Bonzai</span>
        </a>
      </div>
      <form className="w-full flex gap-2" onSubmit={onSearchSubmit}>
        {focused ? (
          <Link
            className={`${buttonVariants({ variant: "outline" })} w-full`}
            href={focused.url}
            target="_blank"
          >
            {focused.title}
          </Link>
        ) : (
          <Input
            type="text"
            id="searchbar"
            placeholder="Search..."
            autoComplete="off"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
        <Button
          variant={focused ? "default" : "outline"}
          size="icon"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Loader className="h-4 w-4" />
          ) : focused ? (
            <Leaf className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

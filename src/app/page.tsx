"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

export default function HomePage() {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    async function fetchData() {
      if (!input) return setSearchResults(undefined);

      const res = await fetch(`/api/search?q=${input}`);
      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResults(data);
    }

    void fetchData().catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, [input]);

  return (
    <main className="grainy h-screen w-screen">
      <div className="animate flex flex-col items-center gap-6 pt-32 duration-500 animate-in fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl font-bold tracking-tight">Tempest Search</h1>
        <p className="max-w-prose text-center text-lg text-zinc-600">
          A blazing fast search engine for countries around the world.
          <br /> Start typing a country name to and get a result in
          milliseconds.
        </p>

        <div className="w-full max-w-md">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}
              {searchResults?.results ? (
                <CommandGroup heading="Results">
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {searchResults?.results ? (
                <>
                  <div className="h-px w-full bg-zinc-200" />
                  <p className="xs p-2 text-zinc-500">
                    Found {searchResults.results.length} results in{" "}
                    {searchResults?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  );
}

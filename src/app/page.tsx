"use client";

import { CommandInput } from "cmdk";
import { useEffect, useState } from "react";
import { Command } from "~/components/ui/command";

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
    }

    fetchData();
  }, [input]);
  return (
    <main className="grainy h-screen w-screen">
      <div className="animate-in animate fade-in-5 slide-in-from-bottom-2.5 flex flex-col items-center gap-6 pt-32 duration-500">
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
          </Command>
        </div>

        <input
          className="text-zinc-900"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </main>
  );
}

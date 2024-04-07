"use client";

import { useEffect, useState } from "react";

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
      <input
        className="text-zinc-900"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </main>
  );
}

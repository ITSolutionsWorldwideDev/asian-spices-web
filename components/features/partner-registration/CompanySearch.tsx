"use client";

import { useState } from "react";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Building2,
  Check,
} from "lucide-react";
import BusinessVerification from "./BusinessVerification";

type SearchTab = "name" | "kvk";

interface Company {
  id: number;
  name: string;
  kvk: string;
  city: string;
  country: string;
}

const mockResults: Company[] = [
  {
    id: 1,
    name: "Asian Spices Import B.V.",
    kvk: "12345678",
    city: "Amsterdam",
    country: "Nederland",
  },
];

export default function CompanyRegistration() {
  const [result, setResult] = useState([]);
  const [activeTab, setActiveTab] = useState<SearchTab>("name");
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    // setLoading(true);
    // {
    //   setResults(mockResults);
    // }

    const res = await fetch(`/api/kvk?naam=${name}`);
    const data = await res.json();
    setResult(data.resultaten || []);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className=" bg-gray-100 flex items-start justify-center pt-10 px-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full  p-8">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Company Registration
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          Search for your company using either the company name or Chamber of
          Commerce number.
        </p>

        {/* Read aloud */}
        <button className="flex items-center gap-1.5 text-blue-600 text-sm mb-6 hover:underline">
          <Volume2 size={16} />
          Read aloud
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["name", "kvk"] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? "bg-white border-gray-400 text-gray-900 shadow-sm"
                  : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {tab === "name" ? "Company Name" : "KVK Number"}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {activeTab === "name" ? "Company Name" : "KVK Number"}
        </label>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeTab === "name" ? "Compnay name" : "12345678"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}

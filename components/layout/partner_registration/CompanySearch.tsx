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
          {/* <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Search size={20} />
          </button> */}
        </div>

        {/* Results */}
        {/* {results.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold text-gray-800 mb-3">Search Results:</p>
            <div className="flex flex-col gap-3">
              {results.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelected(company)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border text-left transition-colors ${
                    selected?.id === company.id
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={22} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {company.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        KVK: {company.kvk}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {company.city}, {company.country}
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-500 text-white rounded-full p-1.5">
                    <ArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Selected Banner */}
        {/* {selected && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-green-700 text-sm">
            <Check size={16} className="shrink-0" />
            <span>
              Company selected: <strong>{selected.name}</strong>
            </span>
          </div>
        )} */}
        {/* <BusinessVerification /> */}
        {/* Footer Buttons */}
        {/* <div className="flex justify-between">
          <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            disabled={!selected}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
}

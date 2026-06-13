"use client";
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { useState } from "react";
const SubscribeNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return alert("Please enter email");

    try {
      setLoading(true);

      const res = await fetch("/api/newsletter_subscriber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Subscribed successfully Thanks for Subscribing 🎉");
        setEmail("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-md w-full justify-between">
      {/* Icon */}
      <div className="flex items-center justify-center px-3 py-2 text-gray-400 sm:py-0">
        <AiOutlineMail size={20} />

        {/* Input */}
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="Enter your email address"
          className="w-full outline-none py-3 px-3 text-sm"
        />
      </div>
      {/* Button */}
      <button
        className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 duration-150 sm:w-auto"
        type="submit"
        onClick={handleSubscribe}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </div>
  );
};

export default SubscribeNewsletter;

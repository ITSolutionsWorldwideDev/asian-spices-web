"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useNavbarVisibility
 * - Navbar visible hota hai jab user scroll kare
 * - Navbar hide ho jata hai jab user idle ho jaye (koi scroll na ho) `idleDelay` ms tak
 * - Page ke top par (topThreshold se kam scrollY) navbar hamesha visible rahega
 *
 * @param {number} idleDelay - kitne ms baad idle consider karna hai (default 1500ms)
 * @param {number} topThreshold - kitne pixels tak "top" consider karna hai (default 50)
 */
export default function useNavbarVisibility(idleDelay = 1500, topThreshold = 150) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Agar user page ke top ke qareeb hai -> hamesha visible rakho, timer mat lagao
      if (window.scrollY <= topThreshold) {
        setVisible(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      // Scroll ho raha hai -> navbar show karo
      setVisible(true);

      // Purana timer clear karo
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Naya timer set karo -> idleDelay ke baad hide ho jayega
      timerRef.current = setTimeout(() => {
        // Hide karne se pehle dobara check karo ke user top par to nahi aa gaya
        if (window.scrollY > topThreshold) {
          setVisible(false);
        }
      }, idleDelay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check (agar page already scrolled state mein load ho)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idleDelay, topThreshold]);

  return visible;
}
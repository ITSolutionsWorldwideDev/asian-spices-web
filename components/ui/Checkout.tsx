// apps/web/components/ui/Checkout.tsx

"use client";

import { useCartStore } from "@/store/useCartStore";
import OrderSummary from "../layout/checkout/OrderSummary";
import ContactForm from "../layout/checkout/ContactForm";
import ShippingForm from "../layout/checkout/ShippingForm";
import PaymentForm from "../layout/checkout/PaymentForm";
import Nav from "./Nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { checkoutSchema } from "@/lib/validation/checkout";
import { useLoaderStore } from "@/store/useLoaderStore";
import { calculateTotals, convertTotals } from "@/lib/pricing";
// import { SHIPPING_OPTIONS, ShippingMethod } from "@/lib/pricing";

import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";

export type CheckoutData = {
  email: string;
  phone: string;

  firstName: string;
  lastName: string;
  address: string;
  appartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  latitude?: number;
  longitude?: number;

  cardNumber: string;
  expiry: string;
};

export default function Checkout() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const { show, hide } = useLoaderStore();
  const { cart, clearCart } = useCartStore();
  const { rate, selectedCurrency } = useCurrencyStore();

  const { taxRate, setSelectedCountry, fetchInitialData } = useGlobalStore();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState<string>("standard");

  const [availableShippingOptions, setAvailableShippingOptions] = useState<
    any[]
  >([]);

  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    phone: "",

    firstName: "",
    lastName: "",
    address: "",
    appartment: "",
    city: "",
    state: "",
    zip: "",
    country: "NL",

    latitude: 0,
    longitude: 0,

    cardNumber: "",
    expiry: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [session]);

  const selectedOption = availableShippingOptions.find(
    (opt: any) =>
      String(opt.id) === String(shippingMethod) ||
      opt.code?.toLowerCase() === shippingMethod.toLowerCase(),
  );

  const isStandardOption = 
    selectedOption?.code?.toLowerCase() === "standard" || 
    selectedOption?.name?.toLowerCase().includes("standard") ||
    shippingMethod === "standard";

  const baseSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const FREE_SHIPPING_THRESHOLD = 50;
  const qualifiesForFreeStandard = baseSubtotal >= FREE_SHIPPING_THRESHOLD;

  const currentShippingPrice = selectedOption 
    ? (qualifiesForFreeStandard && isStandardOption ? 0 : selectedOption.price)
    : 5.99;

  useEffect(() => {
    if (availableShippingOptions.length > 0) {
      const hasActiveSelection = availableShippingOptions.some(
        (opt: any) => String(opt.id) === String(shippingMethod),
      );

      if (!hasActiveSelection) {
        const standardDbOption = availableShippingOptions.find(
          (opt: any) =>
            opt.code?.toLowerCase() === "standard" ||
            opt.name?.toLowerCase().includes("standard"),
        );

        setShippingMethod(
          String(
            standardDbOption
              ? standardDbOption.id
              : availableShippingOptions[0].id,
          ),
        );
      }
    }
  }, [availableShippingOptions, shippingMethod]); 
 
  // const totals = calculateTotals(cart, currentShippingPrice, taxRate);
  const totals = calculateTotals(
    cart,
    currentShippingPrice,
    taxRate,
    selectedOption?.name || selectedOption?.code || shippingMethod,
  );
  const convertedTotals = convertTotals(totals, rate || 1, selectedCurrency);

  // const totals = calculateTotals(cart, shippingMethod);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!session?.user) return;

      try {
        show("Loading Addresses...");

        const res = await fetch("/api/account/addresses");
        const data = await res.json();

        setAddresses(data.addresses || []);

        const defaultAddr = data.addresses?.find((a: any) => a.is_default);

        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
          const activeCountry = defaultAddr.country || "NL";

          setFormData((prev) => ({
            ...prev,
            phone: defaultAddr.phone || "",
            firstName: defaultAddr.first_name || "",
            lastName: defaultAddr.last_name || "",
            address: defaultAddr.address_line1 || "",
            appartment: defaultAddr.address_line2 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zip: defaultAddr.postal_code || "",
            country: defaultAddr.country || "NL",
          }));

          await setSelectedCountry(activeCountry);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        hide();
      }
    };

    loadAddresses();
  }, [session]);

  useEffect(() => {
    if (formData.country) {
      setSelectedCountry(formData.country);
    }
  }, [formData.country]);

  const isFormValid = checkoutSchema.safeParse(formData).success;

  const placeOrder = async (method: "paynl" | "paypal") => {
    // Validate form
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (field) fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);

      // Scroll + focus first error
      const firstField = result.error.issues[0]?.path[0] as string;

      if (firstField) {
        const el = document.querySelector(
          `[name="${firstField}"]`,
        ) as HTMLInputElement | null;

        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }

    setErrors({});

    try {
      show("Placing your order..."); // 🔥 START LOADER
      const geocodeAddress = async (address: string) => {
        try {
          const res = await fetch(
            `/api/geocode?address=${encodeURIComponent(address)}`,
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.error || "Geocoding failed");
          }

          const lat = Number(data?.lat);
          const lng = Number(data?.lng);

          if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid coordinates received");
          }

          return { latitude: lat, longitude: lng };
        } catch (error) {
          console.error("Geocode error:", error);
          throw error;
        }
      };

      // Before calling placeOrder:
      let latitude = formData.latitude;
      let longitude = formData.longitude;

      if (!latitude || !longitude) {
        // if (!formData.latitude || !formData.longitude) {
        const fullAddress = [formData.zip, formData.country]
          .filter(Boolean)
          .join(", ");

        const geo = await geocodeAddress(fullAddress);

        // formData.latitude = geo.latitude;
        // formData.longitude = geo.longitude;

        latitude = geo.latitude;
        longitude = geo.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      }
      // Create Order

      if (!cart.length) {
        setApiError("Your cart is empty.");
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            address_line1: formData.address,
            address_line2: formData.appartment,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
            country: formData.country,

            latitude,
            longitude,
            // latitude: formData.latitude,
            // longitude: formData.longitude,
          },
          cartItems: cart,
          pricing: {
            subtotal: convertedTotals.subtotal,
            discount: 0,
            tax_amount: convertedTotals.tax,
            shipping: convertedTotals.shipping,
            total: convertedTotals.total,
          },
          // shippingMethod,
          shippingMethod: selectedOption
            ? selectedOption.name
            : "Standard Delivery",
          payment_status: "pending",
          order_status: "pending",
        }),
      });
      const order = await res.json();

      if (!res.ok || !order.success) {
        throw {
          message: order.error || "Order failed",
          code: order.code,
        };
      }

      const orderId = order.orderId;

      // Initiate payment
      if (method === "paynl" || method === "paypal") {
        const payment = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: convertedTotals.total,
            customerEmail: formData.email,
            paymentMethod: method,
          }),
        });

        const data = await payment.json();

        if (!data.success) {
          throw {
            message: "Failed to initiate payment. Please try again.",
            code: "PAYMENT_FAILED",
          };
        }
        // Redirect user to payment gateway
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      // console.error("Checkout error:", err);

      setApiError(err.message || "Something went wrong");

      // 🔥 special handling
      if (err.code === "NO_STORE_AVAILABLE") {
        setApiError(
          "Some items are not available together. Try removing a few items.",
        );
      }

      if (err.code === "OUT_OF_STOCK") {
        setApiError(
          "One or more products are out of stock. Please update your cart.",
        );
      }

      if (err.code === "NO_NEARBY_STORES") {
        setApiError("We currently don’t deliver to your area.");
      }

      if (err.code === "MISSING_LOCATION") {
        setApiError("Please enter your full delivery address.");
      }

      if (err.code === "PAYMENT_FAILED") {
        setApiError("Failed to initiate payment. Please try again.");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      hide();
    }
  };

  const deliveryDaysString = selectedOption
    ? selectedOption.minDays === selectedOption.maxDays
      ? `Delivery in ${selectedOption.minDays} business day${selectedOption.minDays > 1 ? "s" : ""}`
      : `Delivery in ${selectedOption.minDays}-${selectedOption.maxDays} business days`
    : "";

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>

        {!isLoggedIn && (
          <div className="bg-yellow-50 p-4 rounded mb-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-8">
          <div className="space-y-8">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {apiError}
              </div>
            )}
            <ContactForm
              data={formData}
              setFormData={setFormData}
              errors={errors}
            />

            <ShippingForm
              data={formData}
              setFormData={setFormData}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              subtotal={convertedTotals.subtotal}
              shipping={convertedTotals.shipping}
              errors={errors}
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              onShippingOptionsFetched={(options) =>
                setAvailableShippingOptions(options)
              }
            />
            <PaymentForm placeOrder={placeOrder} disabled={!isFormValid} />
          </div>

          <OrderSummary
            items={cart}
            shippingMethod={shippingMethod}
            subtotal={convertedTotals.subtotal}
            tax={convertedTotals.tax}
            shipping={convertedTotals.shipping}
            total={convertedTotals.total}
            shippingMethodName={
              selectedOption ? selectedOption.name : "Shipping"
            }
            deliveryDaysText={deliveryDaysString}
          />
        </div>
      </div>
    </div>
  );
}

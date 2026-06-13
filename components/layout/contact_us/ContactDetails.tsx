import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function ContactDetails() {
  return (
    <div className=" bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="container mx-auto w-full">
        {/* Header */}
        <div className=" mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mt-10">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Email Us
            </h3>
            <Link
              href="mailto:support@asianspices.com"
              className=" hover:text-orange-700 font-medium mb-3 block break-all"
            >
              support@asianspices.com
            </Link>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </div>

          {/* Call Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Phone className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Call Us
            </h3>
            <Link
              href="tel:+15551234567"
              className=" hover:text-orange-700 font-medium mb-3 block"
            >
              +1 (555) 123-4567
            </Link>
            <p className="text-sm text-gray-500">Mon-Fri, 9AM-8PM EST</p>
          </div>

          {/* Visit Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Visit Us
            </h3>
            <p className="text-gray-700 font-medium mb-3">
              123 Spice Street, New York, NY 10001
            </p>
            <p className="text-sm text-gray-500">By appointment only</p>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Business Hours
            </h3>
            <p className="text-gray-700 font-medium mb-3">
              Monday - Friday: 9AM - 6PM EST
            </p>
            <p className="text-sm text-gray-500">Weekend: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from 'next/link';

import { FaFacebook } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';
import { FaWhatsappSquare } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-sm w-full mt-20">
      
      {/* Back to top */}
      <div className="flex justify-center items-center py-3">
        <button
          className="py-2 font-extrabold text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top
        </button>
      </div>

      <div className="border-t border-gray-300" />

      {/* Main footer content */}
      <div className="max-w-5xl mx-auto px-6 py-6 
                      flex flex-col gap-6 
                      sm:flex-row sm:justify-between 
                      text-white">

        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <Link href="/">
            <img
              src="/assets/pharmat_logo_white_cropped.png"
              alt="Logo"
              className="h-16 sm:h-20 w-auto"
            />
          </Link>
        </div>

        {/* Contact */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="space-y-1">
            <li>+855-123-456-78</li>
            <li>+855-123-098-78</li>
            <li>example123@gmail.com</li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-2">Quick link</h3>
          <ul className="space-y-1">
            <li className="cursor-pointer hover:underline">Home</li>
            <li className="cursor-pointer hover:underline">Other Projects</li>
          </ul>
        </div>

        {/* Social media */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-2">Social media</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            <Link href="/"><FaFacebook size={24} /></Link>
            <Link href="/"><FaTelegram size={24} /></Link>
            <Link href="/"><FaWhatsappSquare size={24} /></Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 py-2 flex justify-center">
        <span className="text-sm text-white text-center">
          © 2077 <a href="/" className="hover:underline">ITE-TRIO™</a>. All Rights Are Not Reserved.
        </span>
      </div>

    </footer>
  );
}


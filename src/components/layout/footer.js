"use client";
import Link from 'next/link';

import { FaFacebook } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';
import { FaWhatsappSquare } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-sm w-screen mt-30">
      <div  className=" border-gray-300 flex justify-center items-center  py-2"> 
        <button className=" border-gray-300 item-center py-2 cursor-pointer font-extrabold text-white"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to Top</button>
      </div>

      <div className="border-t border-gray-300 py-2 text-center"/>

     

      <div className="max-w-5xl mx-auto px-6 py-6 flex  justify-between text-white">

       
      <Link href="/" className="font-semibold  object-contain w-auto h-8/12">
                    <img src="/assets/pharmat_logo_white_cropped.png" className='w-auto h-30' alt="Logo"/>
      </Link>
        

        <div>
          <h3 className="text-sm font-semibold mb-2">Contact</h3>
          <ul className="space-y-1">
            <li>+855-123-456-78</li>
            <li>+855-123-098-78</li>
            <li>example123@gmail.com</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Quick link</h3>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Other Projects</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Social media</h3>
          <div className="flex space-x-3">
            <span>
              <Link href="/">
                <FaFacebook size={24}/>
              </Link>
            </span>
            <span>
              <Link href="/">
                <FaTelegram size={24}/>
              </Link>
            </span>
            <span>
              <Link href="/">
                <FaWhatsappSquare size={24}/>
              </Link>
            </span>
            <span></span>
          </div>
        </div>
      </div>
      {/* <div className="border-t border-gray-300 py-1"/> */}
      <div className="border-t border-gray-300 py-1 flex justify-center">
      <span className="block text-sm text-white sm:text-center py-2"> © 2077 <a href="/" className="hover:underline"> ITE-TRIO™ </a>. All Rights Are Not Reserved.</span>
      </div>
    
    </footer>
  );
}

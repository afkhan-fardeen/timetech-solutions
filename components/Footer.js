// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-apple-gray text-sm">&copy; {new Date().getFullYear()} TimeTech. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <Link href="/" className="text-apple-blue hover:text-apple-blueHover text-sm font-medium">
            Home
          </Link>
          <Link href="/about" className="text-apple-blue hover:text-apple-blueHover text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-apple-blue hover:text-apple-blueHover text-sm font-medium">
            Contact
          </Link>
          <Link href="/privacy" className="text-apple-blue hover:text-apple-blueHover text-sm font-medium">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
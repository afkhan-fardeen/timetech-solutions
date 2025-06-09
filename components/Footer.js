export default function Footer() {
  return (
    <footer className="bg-apple-black text-apple-light py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} TimeTech Solutions. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="/about" className="text-apple-gray hover:text-apple-light">About</a>
          <a href="/contact" className="text-apple-gray hover:text-apple-light">Contact</a>
          <a
            href="https://wa.me/1234567890?text=I'm%20interested%20in%20TimeTech%20solutions."
            target="_blank"
            rel="noopener noreferrer"
            className="text-apple-gray hover:text-apple-light"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
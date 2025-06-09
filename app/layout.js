import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '980px', background: '#1d1d1f', color: '#fff' } }} />
      </body>
    </html>
  );
}
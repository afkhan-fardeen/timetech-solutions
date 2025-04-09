// app/layout.js
import './globals.css';
import { SessionProvider } from '../lib/SessionContext';
import { AdminProvider } from '../lib/AdminContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="TimeTech Solutions" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <AdminProvider>
            <Toaster position="top-right" />
            {children}
          </AdminProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
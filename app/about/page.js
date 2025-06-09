'use client';
import Link from 'next/link';
import Head from 'next/head';

export default function About() {
  const team = [
    { name: 'Jane Doe', role: 'Founder & CEO', bio: 'Leading TimeTech with a vision for innovation.' },
    { name: 'John Smith', role: 'Chief Technology Officer', bio: 'Architecting robust tech solutions.' },
    { name: 'Emily Chen', role: 'Head of Design', bio: 'Crafting intuitive user experiences.' },
  ];

  return (
    <>
      <Head>
        <title>About TimeTech Solutions</title>
        <meta name="description" content="Learn about TimeTech Solutions, our mission, and our team dedicated to innovative business technology." />
        <meta name="keywords" content="TimeTech, about, business solutions, technology" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="About TimeTech Solutions" />
        <meta property="og:description" content="Discover the story and mission behind TimeTech’s innovative solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-timetech-domain.vercel.app/about" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="canonical" href="https://your-timetech-domain.vercel.app/about" />
      </Head>
      <div className="min-h-screen bg-apple-light pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Hero Section */}
          <section className="relative text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-50"></div>
            <img
              src="./images/office.jpg"
              alt="TimeTech Office"
              className="w-full h-64 object-cover rounded-xl shadow-apple-lg mb-8"
            />
            <h1 className="text-hero font-bold text-apple-black mb-4 tracking-tight relative z-10">
              About TimeTech
            </h1>
            <p className="text-subhero text-apple-gray max-w-2xl mx-auto leading-relaxed relative z-10">
              Innovating business solutions with simplicity and impact.
            </p>
          </section>

          {/* Our Story Section */}
          <section className="bg-white rounded-xl apple-shadow p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-apple-black mb-4 tracking-tight">
                  Our Story
                </h2>
                <p className="text-lg text-apple-gray leading-relaxed mb-6">
                  Since 2018, TimeTech has been at the forefront of business technology, creating solutions that streamline operations and enhance customer experiences. From our humble beginnings, we’ve grown into a trusted partner for organizations seeking innovative queuing systems, RFID tracking, and digital signage.
                </p>
                <Link
                  href="/products"
                  className="inline-block text-apple-blue hover:text-apple-blueHover font-medium"
                >
                  Discover Our Products
                </Link>
              </div>
              <div className="lg:w-1/2">
                <img
                  src="./images/inovation.png"
                  alt="TimeTech Innovation"
                  className="w-full h-64 object-cover rounded-xl shadow-apple"
                />
              </div>
            </div>
          </section>

          {/* Our Mission Section */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold text-apple-black mb-6 tracking-tight">
              Our Mission
            </h2>
            <p className="text-lg text-apple-gray max-w-3xl mx-auto leading-relaxed">
              At TimeTech, we’re dedicated to empowering businesses with intuitive, reliable technology. Our mission is to simplify complexity, delivering solutions that drive efficiency and growth while keeping user experience at the core.
            </p>
          </section>

          {/* Team Section */}
          <section className="bg-white rounded-xl apple-shadow p-8 sm:p-12">
            <h2 className="text-3xl font-semibold text-apple-black text-center mb-8 tracking-tight">
              Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="relative bg-gray-50 rounded-lg p-6 text-center transform hover:scale-105 transition-all apple-shadow"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-apple-black">{member.name}</h3>
                  <p className="text-sm text-apple-gray mb-2">{member.role}</p>
                  <p className="text-sm text-apple-gray">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-semibold text-apple-black mb-4 tracking-tight">
              Join the TimeTech Revolution
            </h2>
            <p className="text-lg text-apple-gray max-w-xl mx-auto mb-6 leading-relaxed">
              Ready to transform your business with cutting-edge technology? Let’s connect.
            </p>
            <div className="space-x-4">
              <Link
                href="/products"
                className="inline-block bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-apple"
              >
                Explore Solutions
              </Link>
              <a
                href="https://wa.me/1234567890?text=I'm%20interested%20in%20TimeTech%20solutions.%20Please%20provide%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-apple-blue hover:text-apple-blueHover font-medium"
              >
                Chat on WhatsApp
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
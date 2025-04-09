export default function About() {
    return (
      <div className="min-h-screen bg-apple-light pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-hero font-semibold text-apple-black mb-4 tracking-tight">
              About TimeTech
            </h1>
            <p className="text-apple-gray text-lg max-w-2xl mx-auto">
              Innovating the way businesses connect, manage, and grow.
            </p>
          </section>
  
          {/* Our Story */}
          <section className="bg-white rounded-xl apple-shadow p-8">
            <h2 className="text-2xl font-semibold text-apple-black mb-4 tracking-tight">
              Our Story
            </h2>
            <p className="text-apple-gray text-lg">
              TimeTech was born from a simple idea: technology should make life easier, not more complicated. Since our founding, we’ve been crafting solutions that blend cutting-edge innovation with intuitive design, helping businesses thrive in a fast-paced world.
            </p>
          </section>
  
          {/* Mission */}
          <section className="bg-white rounded-xl apple-shadow p-8">
            <h2 className="text-2xl font-semibold text-apple-black mb-4 tracking-tight">
              Our Mission
            </h2>
            <p className="text-apple-gray text-lg">
              We’re on a mission to empower businesses with tools that enhance efficiency and elevate experiences. From queuing systems to digital signage, every product we create is designed to simplify complexity and deliver results.
            </p>
          </section>
  
          {/* Team */}
          <section className="bg-white rounded-xl apple-shadow p-8">
            <h2 className="text-2xl font-semibold text-apple-black mb-6 tracking-tight">
              Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-apple-black font-medium">Jane Doe</p>
                <p className="text-apple-gray text-sm">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-apple-black font-medium">John Smith</p>
                <p className="text-apple-gray text-sm">Chief Technology Officer</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-apple-black font-medium">Emily Chen</p>
                <p className="text-apple-gray text-sm">Head of Design</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
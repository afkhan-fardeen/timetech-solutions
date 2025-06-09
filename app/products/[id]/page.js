import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, categories, productDetails } from '../../../lib/products';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ProductDetail({ params }) {
  const product = products.find((p) => p.id === parseInt(params.id));
  if (!product) {
    notFound();
  }

  const category = categories.find((c) => c.id === product.category_id);
  const details = productDetails[product.id] || { features: [], useCases: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative aspect-square max-h-[600px] bg-white rounded-xl shadow-sm border border-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="flex flex-col justify-center">
            <p className="text-apple-gray text-base mb-2">
              {category ? category.name : 'Unknown'}
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold text-apple-black tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-apple-gray text-lg leading-relaxed mb-6 max-w-lg">
              {product.description}
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'}?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20provide%20more%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-apple-blue text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-apple-black transition-all shadow-apple flex items-center w-fit"
            >
              Contact for More Details
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {details.features.length > 0 && (
        <section className="py-16 bg-white max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-apple-black text-center mb-12">
            Why Choose {product.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <CheckCircleIcon className="w-8 h-8 text-apple-blue mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-apple-black mb-2">{feature}</h3>
                <p className="text-apple-gray text-base">
                  Discover how this feature transforms your {category ? category.name.toLowerCase() : 'operations'}. Contact us to learn more.
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'}?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20provide%20more%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-apple-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-apple-blue transition-all shadow-apple flex items-center justify-center mx-auto"
            >
              Inquire Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="py-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-apple-black text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-apple-gray text-base italic mb-4">
              “The {product.name} revolutionized our operations, saving time and boosting efficiency.”
            </p>
            <p className="text-apple-black font-semibold">John Doe, Retail Manager</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-apple-gray text-base italic mb-4">
              “A game-changer for our team. Highly recommend exploring its capabilities!”
            </p>
            <p className="text-apple-black font-semibold">Jane Smith, Operations Director</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-apple-blue text-white text-center max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 rounded-xl">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Transform with {product.name}?
        </h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Get all the details and see how it fits your needs. Contact us now!
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'}?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20provide%20more%20details.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-apple-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-apple flex items-center justify-center mx-auto"
        >
          Contact Us Now
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </a>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }) {
  const product = products.find((p) => p.id === parseInt(params.id));
  return {
    title: product ? `${product.name} | TimeTech` : 'Product Not Found',
    description: product ? `Discover ${product.name} - ${product.description}` : 'Explore our products.',
  };
}
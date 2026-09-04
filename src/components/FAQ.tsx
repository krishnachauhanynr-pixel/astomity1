import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: "What is ASTOMITY?", a: "ASTOMITY is an online marketplace where customers can discover and shop products across mobiles, electronics, fashion, beauty, grocery, sports, books, toys and other categories." },
  { q: "What products can I buy on ASTOMITY?", a: "Customers can browse products including smartphones, electronics, clothing, beauty products, groceries, sports equipment, books, toys and more." },
  { q: "Can I shop online on ASTOMITY?", a: "Yes. ASTOMITY is designed as an online shopping marketplace where customers can browse products, add items to their cart and complete the checkout process." },
  { q: "Does ASTOMITY offer deals and discounts?", a: "Yes. ASTOMITY includes a dedicated Deals section featuring discounted products, promotional offers and limited-time deals." },
  { q: "How can I search for products on ASTOMITY?", a: "Use the ASTOMITY search bar to search by product name, category, brand or related keyword. You can also use filters such as price, rating, discount and availability." },
  { q: "Can I filter ASTOMITY products by price?", a: "Yes. Product listings can be filtered by price range, category, brand, rating, discount and availability." },
  { q: "Can I add products to my wishlist?", a: "Yes. Customers can save products to their wishlist and return to them later." },
  { q: "How can I place an order on ASTOMITY?", a: "Select a product, choose the required variant, add it to your cart or select Buy Now, enter your delivery address, select a payment method and confirm the order." },
  { q: "What payment methods will ASTOMITY support?", a: "ASTOMITY can support payment methods such as UPI, cards, net banking, wallets and Cash on Delivery, depending on availability." },
  { q: "Can I track my ASTOMITY order?", a: "Yes. Customers can track their order through the order-tracking section and view stages such as confirmed, packed, shipped, out for delivery and delivered." },
  { q: "Can I cancel an ASTOMITY order?", a: "Orders can be cancelled according to the applicable order and shipping status and ASTOMITY's cancellation policy." },
  { q: "Can I return a product?", a: "Eligible products can be returned according to the applicable return policy displayed for the product/order." },
  { q: "How do refunds work?", a: "After an eligible return or cancellation is approved, the refund can be processed according to the payment method and ASTOMITY's refund policy." },
  { q: "Can sellers sell products on ASTOMITY?", a: "Yes. ASTOMITY is designed as a multi-vendor marketplace where approved sellers can list and manage products through a seller dashboard." },
  { q: "How can I become an ASTOMITY seller?", a: "Sellers can register through the seller registration section and provide the required business and verification information." },
  { q: "Does ASTOMITY have customer support?", a: "Yes. ASTOMITY should provide a Help Center, FAQs and customer-support options for order, payment, delivery and return-related questions." },
  { q: "Does ASTOMITY have mobile and electronics products?", a: "Yes. ASTOMITY includes dedicated Mobiles and Electronics categories containing smartphones, laptops, earbuds, speakers, smartwatches and other electronics." },
  { q: "Does ASTOMITY offer fashion products?", a: "Yes. ASTOMITY includes Fashion, Men and Women categories with clothing, footwear, bags, accessories and other fashion products." },
  { q: "Can I read product reviews before buying?", a: "Yes. Product pages should display customer ratings and reviews to help shoppers make purchasing decisions." },
  { q: "Is ASTOMITY available in India?", a: "ASTOMITY can be positioned as an India-focused online marketplace, with product availability and delivery depending on the seller and serviceable location." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-colors ${openIndex === index ? 'border-slate-400 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-slate-900"
                onClick={() => toggleFAQ(index)}
              >
                {faq.q}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

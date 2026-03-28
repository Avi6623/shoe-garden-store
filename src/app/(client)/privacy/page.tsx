import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 uppercase">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-brand-muted font-medium leading-relaxed">
        <section>
          <h2 className="text-2xl font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest mb-4">1. Introduction</h2>
          <p>
            Welcome to Shoe Garden. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you how we handle your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest mb-4">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes bank account and payment card details (processed via secure payment gateways).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest mb-4">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To register you as a new customer.</li>
            <li>To process and deliver your order including managing payments, fees and charges.</li>
            <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest mb-4">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We use SSL encryption to protect your data during transmission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us via our official WhatsApp support or email.
          </p>
        </section>

        <footer className="pt-10 border-t border-gray-100 dark:border-white/5">
          <p className="text-sm italic">Last updated: March 2026</p>
          <Link href="/" className="inline-block mt-6 text-brand-accent font-bold hover:underline uppercase tracking-widest">
            Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}

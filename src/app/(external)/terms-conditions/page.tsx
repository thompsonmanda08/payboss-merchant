import React from 'react';

const TermsAndConditions = () => {
  return (
    <main className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Terms and Conditions
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using BGS PayBoss services, you accept and agree
              to be bound by the terms and provision of this agreement. These
              Terms and Conditions constitute a legally binding agreement
              between you and BGS PayBoss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Payment Processing Services
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BGS PayBoss provides payment processing services that enable
              merchants to accept payments from customers. Our services include
              but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Credit and debit card processing</li>
              <li>Mobile payment solutions</li>
              <li>Fraud protection services</li>
              <li>Real-time transaction monitoring</li>
              <li>Payment analytics and reporting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Merchant Responsibilities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              As a merchant using our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete business information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain PCI DSS compliance standards</li>
              <li>Protect customer payment information</li>
              <li>
                Process transactions in accordance with card network rules
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Fees and Charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our pricing structure is transparent and competitive. Processing
              fees, monthly fees, and any additional charges will be clearly
              outlined in your merchant agreement. We reserve the right to
              modify our fee structure with 30 days written notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Either party may terminate this agreement with 30 days written
              notice. Upon termination, all outstanding obligations must be
              fulfilled, and access to our services will be discontinued.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BGS PayBoss shall not be liable for any indirect, incidental,
              special, or consequential damages arising from the use of our
              services. Our total liability shall not exceed the fees paid by
              you in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For questions regarding these Terms and Conditions, please contact
              us at:
            </p>
            <div className="mt-4 text-gray-600">
              <p>Email: legal@bgspayboss.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Business Ave, New York, NY 10001</p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: December 12, 2024
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsAndConditions;

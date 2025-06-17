import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BGS PayBoss collects information necessary to provide our payment
              processing services effectively and securely:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Business information (company name, address, tax ID)</li>
              <li>
                Personal information of business owners and authorized users
              </li>
              <li>
                Financial information (bank account details, transaction data)
              </li>
              <li>
                Technical information (IP addresses, device information, usage
                data)
              </li>
              <li>Customer payment information processed on your behalf</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Processing payments and transactions</li>
              <li>Fraud detection and prevention</li>
              <li>Compliance with legal and regulatory requirements</li>
              <li>Providing customer support</li>
              <li>Improving our services and developing new features</li>
              <li>Communication regarding your account and our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>
                Card networks and financial institutions for transaction
                processing
              </li>
              <li>
                Third-party service providers who assist in our operations
              </li>
              <li>Regulatory authorities when required by law</li>
              <li>Law enforcement agencies when legally obligated</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We do not sell, rent, or trade your personal information to third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your
              information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
              <li>PCI DSS Level 1 compliance</li>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data centers with physical security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations. Transaction data may
              be retained for up to seven years to meet regulatory requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>
                Request deletion of your information (subject to legal
                requirements)
              </li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies and similar technologies to enhance your
              experience, analyze usage patterns, and provide personalized
              content. You can manage your cookie preferences through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or wish to
              exercise your rights, contact us at:
            </p>
            <div className="mt-4 text-gray-600">
              <p>Email: privacy@bgspayboss.com</p>
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

export default PrivacyPolicy;

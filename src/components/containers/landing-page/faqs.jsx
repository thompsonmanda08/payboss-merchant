import Image from "next/image";

import { Container } from "@/components/base/Container";

const faqs = [
  [
    {
      question: "What is PayBoss?",
      answer:
        "PayBoss is a comprehensive financial management platform offering digital tools to help businesses of all sizes manage their inflows and outflows of funds efficiently.",
    },
    {
      question: "How does API Integration benefit my business?",
      answer:
        "API Integration allows you to seamlessly connect PayBoss with your existing systems, automating financial workflows and reducing manual intervention, thus saving time and minimizing errors.",
    },
    {
      question: "Can I create and send invoices using PayBoss?",
      answer:
        "Yes, with Invoicing, you can create, send, and manage professional invoices easily, ensuring you stay on top of your receivables and receive timely payments.",
    },
  ],
  [
    {
      question: "How can PayBoss simplify transactions for my customers?",
      answer:
        "Payment Forms on PayBoss can be customized and deployed to cater to your business needs, simplifying the payment process and enhancing the customer experience.",
    },
    {
      question: "What are the options for selling products with PayBoss?",
      answer:
        "PayBoss offers a Store feature, allowing you to sell products and services online through a web store or via WhatsApp, expanding your sales channels and reaching more customers.",
    },
    {
      question: "How does PayBoss handle recurring payments?",
      answer:
        "With the Subscriptions feature, you can manage recurring payments and subscriptions effortlessly, keeping track of subscribers and their payments in one centralized location.",
    },
  ],
  [
    {
      question: "Can PayBoss facilitate in-store payments?",
      answer:
        "Yes, the USSD: In-Store Payments feature enables quick and secure in-store payments, providing your customers with a convenient and cashless payment option.",
    },
    {
      question: "What spending management features does PayBoss offer?",
      answer:
        "PayBoss offers several spending management features, including Bill Payments, Bulk Data, Bulk Airtime, Bulk Direct Payment, Bulk Vouchers Payment, and Expense Cards (Virtual or Physical), allowing you to manage various expenses efficiently.",
    },
    {
      question: "How secure is my financial data with PayBoss?",
      answer:
        "PayBoss prioritizes the security of your financial data by implementing robust encryption and security protocols, ensuring your data is protected and your transactions are secure.",
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="payBoss FAQs"
      className="relative overflow-hidden bg-card py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none dark:bg-blend-color-burn dark:opacity-0 -translate-y-1/4 translate-x-[-30%] "
        src={"/images/background-faqs.jpg"}
        alt="background image"
        width={1558}
        height={946}
        unoptimized
      />
      <div className="relative container">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-bold text-3xl tracking-tight sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-foreground/70">
            If you can’t find what you’re looking for, email our support team
            and someone will get back to you soon.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-bold text-lg leading-7 ">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-foreground-600">
                      {faq.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

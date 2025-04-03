import { Footer } from "@/components/landing-sections/footer";

function CheckoutLayout({ children }) {
  return (
    <>
      <section className="flex min-h-[calc(100svh-120px)] w-full flex-1 flex-col h-full p-4">
        {children}
      </section>
      <Footer showLinks={false} showLogo={false} />
    </>
  );
}

export default CheckoutLayout;

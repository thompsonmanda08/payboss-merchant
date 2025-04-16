import Logo from "@/components/base/payboss-logo";

async function InvoiceLayout({ children }) {
  return (
    <>
      <section className="flex min-h-[calc(100svh-100px)] w-full flex-1 items-center justify-center flex-col h-full p-4">
        {children}
      </section>
      <div className="flex flex-col gap-2 justify-center w-full container items-center  px-8 my-4 max-h-[100px]">
        <span className="font-medium italic flex gap-2  items-center">
          Powered by <Logo />
        </span>
        <p className="mx-auto text-center text-sm text-foreground/50 sm:mt-0">
          Copyright &copy; {new Date().getFullYear()} PayBoss. All rights
          reserved.
        </p>
      </div>
    </>
  );
}

export default InvoiceLayout;

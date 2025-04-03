import Link from "next/link";

import Logo from "@/components/base/payboss-logo";
import LoginForm from "@/components/forms/login-form";

function LoginPage() {
  return (
    <div className="relative -mt-[320px] flex min-w-0 flex-col break-words rounded-2xl border-0 bg-transparent bg-clip-border shadow-none">
      <div className="mb-10 flex flex-col items-center rounded-t-2xl border-b-0 p-6 pb-0 ">
        <Logo isWhite classNames={{ wrapper: "scale-[1.5] mb-4" }} />
        <h2
          className={
            "w-full text-center text-[clamp(18px,18px+1vw,48px)] font-bold text-transparent text-white"
          }
        >
          Welcome Back!
        </h2>
        <p className="text-shadow-sm mb-0 text-center text-white">
          Enter your email and password to sign in
        </p>
      </div>
      {/********************* LOGIN FORM *********************/}
      <LoginForm />
      {/********************* LOGIN FORM *********************/}
      <div className="my-10 bg-transparent text-center">
        <p className="mx-auto  font-inter text-base font-medium leading-6 tracking-normal text-foreground/50">
          Don&apos;t have an account?
          <Link
            className="relative z-10 ml-1 bg-gradient-to-br from-primary to-primary/80 bg-clip-text font-bold text-transparent"
            href="/register"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

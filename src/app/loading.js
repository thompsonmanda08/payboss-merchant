"use client";
import Loader from "@/components/ui/loader";

export default function LoadingPage({ loadingText = "Please wait..." }) {
  return (
    <div className="grid h-[85vh] w-full place-content-center place-items-center">
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Loader color="#1B64CE" loadingText={loadingText} size={60} />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/custom-spinner";
import EmptyLogs from "./empty-logs";

const IframeWithFallback = ({
  title,
  src,
  className,
  classNames,
  ...props
}: {
  title?: string;
  src: string;
  className?: string;
  classNames?: {
    base?: string;
    iframe?: string;
  };
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  const handleIframeError = () => {
    setHasError(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Assumes the iframe is loaded
    const closeLoader = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(closeLoader); // Clear the timeout if the component unmounts();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center pt-2">
        <Spinner size={80} />
      </div>
    );
  }

  if (hasError || !src) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center pt-2">
        <EmptyLogs
          className={"my-auto"}
          subTitle={
            "The requested content could not be loaded. Please try again later."
          }
          title={"Oops! No content available"}
        />
      </div>
    );
  }

  return (
    <iframe
      title={title || "Iframe"}
      className={cn(
        "min-h-[80vh] w-full h-full flex flex-1",
        className,
        classNames?.iframe,
      )}
      src={src}
      onError={handleIframeError}
      onLoad={handleIframeLoad}
      ref={iframeRef}
      style={{ border: "none", width: "100%" }}
      {...props}
    />
  );
};

export default IframeWithFallback;

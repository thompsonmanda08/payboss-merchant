import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/custom-spinner";

const IframeWithFallback = ({ src, className, classNames, ...props }) => {
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

  if (hasError) {
    return (
      <EmptyLogs
        className={"my-auto"}
        subTitle={
          "The requested content could not be loaded. Please try again later."
        }
        title={"Oops! No content available"}
      />
    );
  }

  return (
    <iframe
      className={cn(
        "min-h-[80vh] w-full h-full flex flex-1",
        className,
        classNames?.iframe
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

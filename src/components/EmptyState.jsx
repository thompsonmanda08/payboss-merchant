import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

function EmptyState({
  title,
  message,
  href,
  buttonText,
  onButtonClick,
  children,
}) {
  return (
    <div className="w-full flex flex-col text-gray-300 h-full justify-center items-center my-12">
      <h3
        className={`${""} text-2xl md:text-[48px] text-center text-primary-800 font-bold leading-8`}
      >
        {title || "Whoops-a-daisy!"}
      </h3>
      <p
        className={`max-w-[380px] md:max-w-[480px] text-sm md:text-base text-center mb-4 my-6 text-gray-400/80 px-5 p-2`}
      >
        {message || "There is nothing here yet. Please try again later."}
      </p>
      {children ||
        (!onButtonClick ? (
          <Link href={href || "/"}>
            <Button className={"px-8 h-12"}>{buttonText || "Go Home"}</Button>
          </Link>
        ) : (
          <Button className={"px-8 py-3"} onClick={onButtonClick}>
            {buttonText || "Done"}
          </Button>
        ))}
    </div>
  );
}

export default EmptyState;

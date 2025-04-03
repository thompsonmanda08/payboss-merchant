import { cn } from "@/lib/utils";

function SoftBoxIcon({ className, classNames, children }) {
  return (
    <div
      className={cn(
        "z-10 grid aspect-square h-12 w-12 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white transition-all duration-300 ease-in-out",
        className,
        classNames,
      )}
    >
      {children}
    </div>
  );
}

export default SoftBoxIcon;

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { Input } from "./input-field";
import { Button } from "./button";

export default function Search({
  placeholder,
  onChange,
  value,
  handleSearch,
  isClearable,
  classNames,
  className,
  ...props
}) {
  function resolveSearch(e) {
    e.preventDefault();
    if (handleSearch) return handleSearch();
  }

  const { icon, input, base, wrapper, button } = classNames || "";
  return (
    <form
      onSubmit={resolveSearch}
      className={cn(
        "group relative flex h-fit w-full flex-grow-0 gap-2",
        className,
        wrapper
      )}
    >
      <MagnifyingGlassIcon
        className={cn(
          "absolute left-3 top-[28%] h-5 w-5 text-slate-400 transition-all group-focus-within:text-primary",
          icon
        )}
      />
      <Input
        // isClearable={isClearable}
        containerClasses={"max-w-xl"}
        className={cn(
          "w-full max-w-xl  pl-10 text-base placeholder:font-normal placeholder:text-slate-400 border-none h-10",
          base,
          input
        )}
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        {...props}
      />
      {handleSearch && (
        <Button type="submit" className={cn("px-8", button)}>
          Search
        </Button>
      )}
    </form>
  );
}

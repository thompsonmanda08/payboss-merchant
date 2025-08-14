'use client';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Input } from './input-field';

export default function Search({
  placeholder,
  onChange,
  value,
  handleSearch,
  isClearable,
  classNames,
  className,
  ...props
}: {
  placeholder?: string;
  onChange?: (v: string) => void;
  value?: string;
  handleSearch?: any;
  isClearable?: boolean;
  classNames?: {
    icon?: string;
    input?: string;
    base?: string;
    wrapper?: string;
    button?: string;
  };
  className?: string;
  [key: string]: any;
}) {
  function resolveSearch(e: React.FormEvent) {
    e.preventDefault();
    if (handleSearch) return handleSearch();
  }

  const { icon, input, base, wrapper, button } = classNames || {};

  return (
    <form
      className={cn(
        'group relative flex h-fit w-full flex-grow-0 gap-2',
        className,
        wrapper,
      )}
      onSubmit={resolveSearch}
    >
      <SearchIcon
        className={cn(
          'absolute left-3 top-[28%] h-5 w-5 text-slate-400 transition-all group-focus-within:text-primary',
          icon,
        )}
      />
      <Input
        className={cn(
          'w-full max-w-xl  pl-10 text-base placeholder:font-normal placeholder:text-slate-400 border-none h-10',
          base,
          input,
        )}
        classNames={{ wrapper: 'max-w-xl' }}
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
        {...props}
      />
      {handleSearch && (
        <Button className={cn('px-8', button)} type="submit">
          Search
        </Button>
      )}
    </form>
  );
}

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { cn } from '@/lib/utils'
import { Input } from './input'
import { Button } from './Button'

export default function Search({ placeholder, onChange, value, handleSearch }) {
  function resolveSearch(e) {
    e.preventDefault()
    if (handleSearch) return handleSearch()
  }
  return (
    <form
      onSubmit={resolveSearch}
      className={cn('group relative flex h-fit w-full flex-grow-0 gap-2 ')}
    >
      <MagnifyingGlassIcon className="absolute left-3 top-[28%] h-6 w-6 text-slate-400 transition-all group-focus-within:text-primary" />
      <Input
        containerClasses={'max-w-xl'}
        className={
          'h-12 w-full max-w-xl  pl-10 text-base placeholder:font-normal placeholder:text-slate-400'
        }
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={onChange}
      />
      {handleSearch && (
        <Button type="submit" className={'px-8'}>
          Search
        </Button>
      )}
    </form>
  )
}

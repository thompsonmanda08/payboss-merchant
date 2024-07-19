import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "../ui/input";


export default function Search({onChange, value}) {
    return (
    <div className="relative">
    <MagnifyingGlassIcon  className="absolute left-2 top-[25%] h-5 w-5 text-gray-500" />
    <Input className={'max-w-sm pl-9'} placeholder={'Search...'} value={value} onChange={onChange}/>
  </div>
    )
}
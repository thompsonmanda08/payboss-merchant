import Loader from '@/components/ui/Loader'
import Spinner from '@/components/ui/Spinner'

export default function LoadingPage() {
  return (
    <div className="grid h-[85vh] w-full place-content-center place-items-center">
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Loader size={60} color="#1B64CE" text={'  Please wait...'} />
        {/* <p className="mt-8 max-w-sm break-words font-bold text-slate-800">
          Please wait...
        </p> */}
      </div>
    </div>
  )
}

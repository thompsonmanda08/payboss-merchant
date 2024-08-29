import Loader from '@/components/ui/Loader'

export default function LoadingPage() {
  return (
    <div className="grid h-[85vh] w-full place-content-center place-items-center">
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Loader size={60} color="#1B64CE" loadingText={'Please wait...'} />
      </div>
    </div>
  )
}

import { LoaderIcon } from "lucide-react"

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
    <LoaderIcon className="animate-spin text-white size-10 text-primary" />
    </div>
  )
}

export default PageLoader
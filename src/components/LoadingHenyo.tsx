import logo from '@/assets/gimme5-logo.png'
import { Loader } from 'lucide-react'

function LoadingHenyo() {
  return (
    <div id="loading-henyo" className="flex flex-col text-center h-screen justify-center -mt-10">
      <img src={logo} alt="gimme5 logo" width={200} className="mx-auto"/>
      <div className='mx-auto'><Loader className='animate-spin inline' />&nbsp;<span>Loading Henyo...</span></div>
    </div>
  )
}

export default LoadingHenyo
import logo from './assets/logo.svg'
import letsStart from './assets/illustration_lets-start.svg'

export function App() {

  return (
   <div className="h-screen flex fle-col items-center justify-center gap-8">
    <img src={logo} alt="in.orbit" />
    <img src={letsStart} alt="Ilustração de um garaota chamanda para começar a criar as metas" />
   </div>
  )
}


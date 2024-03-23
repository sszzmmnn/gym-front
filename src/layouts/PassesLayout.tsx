import { Outlet } from 'react-router-dom'

const PassesLayout = () => { 
  return (
    <div className="passes-layout">
        <h3>Passes</h3>
        <Outlet/>
    </div>
  )
}

export default PassesLayout
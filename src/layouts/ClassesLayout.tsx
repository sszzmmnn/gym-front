import { Outlet } from "react-router-dom"

const ClassesLayout = () => {
  return (
    <div className="classes-layout">
        <h3>Classes</h3>
        <Outlet/>
    </div>
  )
}

export default ClassesLayout
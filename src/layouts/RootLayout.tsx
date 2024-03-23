import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"

import { Navbar } from "../components/Navbar"

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    console.log(path);
    document.title = `${(path.charAt(0).toUpperCase() + path.slice(1) || 'Home')} - FitTime`;
  })
  return (
    <>
      <div className='root-layout'>
        <Navbar/>
        <main>
          <Outlet/>
        </main>
      </div>
    </>
  )
}

export default RootLayout
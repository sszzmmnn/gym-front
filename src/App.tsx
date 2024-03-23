import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom' 

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Coaches, coachesLoader } from './pages/Coaches';
import { CoachDetails, coachDetailsLoader } from './pages/CoachDetails';
import CoachError from './pages/CoachError';
import Classes from './pages/Classes';
import Passes from './pages/Passes';
import User from './pages/User';
import UserPassword from './pages/UserPassword';
import Checkout from './pages/Checkout';
import Transaction from './pages/Transaction';
import Private from './pages/Private';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Error from './pages/Error';

import RootLayout from './layouts/RootLayout';
import CoachesLayout from './layouts/CoachesLayout';
import ClassesLayout from './layouts/ClassesLayout';
import PassesLayout from './layouts/PassesLayout';
import UserLayout from './layouts/UserLayout';

import RequireAuth from './middleware/requireAuth';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>} errorElement={<Error />}>
        <Route index element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='coaches' element={<CoachesLayout/>} errorElement={<CoachError />}>
          <Route index element={<Coaches />} loader={coachesLoader}/>
          <Route path=':id' element={<CoachDetails />} loader={coachDetailsLoader}/>
        </Route>
        <Route path='classes' element={<ClassesLayout/>}>
          <Route index element={<Classes />}/>
        </Route>
        <Route path='passes' element={<PassesLayout/>}>
          <Route index element={<Passes/>}/>
        </Route>
        <Route element={ <RequireAuth allowedRoles={[1001]} /> }>
          <Route path='user' element={<UserLayout />}>
            <Route index element={< User/>}/>
            <Route path='password' element={<UserPassword />} />
          </Route>
          <Route path='checkout' element={<Checkout />} />
        </Route>
        <Route element={ <RequireAuth allowedRoles={[5000]} /> }>
          <Route path='private' element={<Private/>}/>
        </Route> 
        
        <Route path='transaction' element={<Transaction />} />
        
        <Route path='unauthorized' element={<Unauthorized />}/>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    )
  );

  return (
    <RouterProvider router={router}/>
  )
}

export default App

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import SpotsIndex from './components/SpotsIndex/index';
import SpotDetails from './components/SpotDetails/index';
import Navigation from './components/Navigation';
import CreateSpotForm from './components/CreateSpotForm';
import UpdateSpotForm from './components/UpdateSpotForm';
import ManageSpots from './components/ManageSpots';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} navigate={useNavigate()} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

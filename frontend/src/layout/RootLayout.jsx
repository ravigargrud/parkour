import React, { useContext } from 'react';
import Navbar from '../components/custom_components/Navbar';
import { Outlet } from 'react-router-dom';
import UserContext from '../store/user-context';

const RootLayout = () => {
  const userCtx = useContext(UserContext);

  return (
    <div className="root-layout">
      <Navbar />
      <header className="header">
        <h1>Welcome, Guest</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;

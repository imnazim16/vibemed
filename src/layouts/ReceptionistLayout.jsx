import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

export const ReceptionistLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px 32px', maxWidth: 'calc(100vw - 240px)', overflowX: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;

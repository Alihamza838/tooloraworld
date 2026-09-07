import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TooloraProvider } from './context/TooloraContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <TooloraProvider>
        <Layout />
      </TooloraProvider>
    </BrowserRouter>
  );
}


import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const PropertyPage = lazy(() => import('./pages/PropertyPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={null} />
          <Route
            path="propiedades/:slug"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white/60 text-xs font-mono tracking-widest uppercase">
                    Cargando propiedad...
                  </div>
                }
              >
                <PropertyPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

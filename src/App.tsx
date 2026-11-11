import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PropertyPage from './pages/PropertyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="propiedades/:slug" element={<PropertyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

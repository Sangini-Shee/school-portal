import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HierarchyView from './pages/HierarchyView';
import SearchPage from './pages/SearchPage';
import AdminPanel from './pages/AdminPanel';
import PersonDetail from './pages/PersonDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020818] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hierarchy" element={<HierarchyView />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/person/:role/:id" element={<PersonDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
import { Route, Routes } from 'react-router';
import { Header } from './components/Header';
import { TermDetailPage } from './pages/TermDetail';
import { TermFormPage } from './pages/TermForm';
import { TermListPage } from './pages/TermList';
import { TopicsPage } from './pages/Topics';

export function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<TermListPage />} />
          <Route path="/terms/new" element={<TermFormPage />} />
          <Route path="/terms/:id" element={<TermDetailPage />} />
          <Route path="/terms/:id/edit" element={<TermFormPage />} />
          <Route path="/topics" element={<TopicsPage />} />
        </Routes>
      </main>
    </>
  );
}

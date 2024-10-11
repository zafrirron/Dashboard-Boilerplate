import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Replace Switch with Routes
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';

function App() {
  return (
    <Router>
      <Routes>  {/* Use Routes instead of Switch */}
        <Route path="/" element={<HomePage />} />  {/* Use element prop instead of component */}
        <Route path="/items" element={<ItemsPage />} />  {/* Same for ItemsPage */}
      </Routes>
    </Router>
  );
}

export default App;

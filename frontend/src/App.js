
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home'
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

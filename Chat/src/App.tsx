import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Home } from "./Home";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/Dashboard/:roomId" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
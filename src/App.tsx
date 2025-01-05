import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import RHCA from "@/pages/RHCA";
import IGM from "@/pages/IGM";
import ADC from "@/pages/ADC";
import IndexMedicus from "@/pages/IndexMedicus";
import Submission from "@/pages/Submission";
import Directives from "@/pages/rhca/Directives";
import EditorialCommittee from "@/pages/EditorialCommittee";
import Donate from "@/pages/Donate";
import Annuaire from "@/pages/Annuaire";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rhca" element={<RHCA />} />
        <Route path="/igm" element={<IGM />} />
        <Route path="/adc" element={<ADC />} />
        <Route path="/index-medicus" element={<IndexMedicus />} />
        <Route path="/submit" element={<Submission />} />
        <Route path="/directives" element={<Directives />} />
        <Route path="/editorial" element={<EditorialCommittee />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/annuaire" element={<Annuaire />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
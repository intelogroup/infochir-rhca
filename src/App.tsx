import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import RHCA from "@/pages/RHCA";
import IGM from "@/pages/IGM";
import ADC from "@/pages/ADC";
import IndexMedicus from "@/pages/IndexMedicus";
import About from "@/pages/About";
import EditorialCommittee from "@/pages/EditorialCommittee";
import Submission from "@/pages/Submission";
import Annuaire from "@/pages/Annuaire";
import Donate from "@/pages/Donate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rhca" element={<RHCA />} />
        <Route path="/igm" element={<IGM />} />
        <Route path="/adc/*" element={<ADC />} />
        <Route path="/igm/editorial-committee" element={<EditorialCommittee />} />
        <Route path="/index-medicus" element={<IndexMedicus />} />
        <Route path="/about" element={<About />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/annuaire" element={<Annuaire />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </Router>
  );
}

export default App;
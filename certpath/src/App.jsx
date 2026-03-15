import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Roadmap from "./pages/Roadmap";
import CertDetail from "./pages/CertDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fields/:slug" element={<Roadmap />} />
        <Route path="fields/:slug/certs/:certId" element={<CertDetail />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import Layout, { HomeLayout, OnboardingLayout, LessonLayout } from "./components/Layout";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Explore from "./pages/Explore";
import Roadmap from "./pages/Roadmap";
import CertDetail from "./pages/CertDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import SkillOverview from "./pages/SkillOverview";
import LessonViewer from "./pages/LessonViewer";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<OnboardingLayout />}>
        <Route path="onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<LessonLayout />}>
        <Route path="skills/:skillSlug/:lessonId" element={<LessonViewer />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="skills/:skillSlug" element={<SkillOverview />} />
        <Route path="explore" element={<Explore />} />
        <Route path="fields/:slug" element={<Roadmap />} />
        <Route path="fields/:slug/certs/:certId" element={<CertDetail />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

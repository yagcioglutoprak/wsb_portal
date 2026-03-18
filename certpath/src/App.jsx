import { Routes, Route } from "react-router-dom";
import Layout, { HomeLayout, OnboardingLayout, LessonLayout } from "./components/Layout";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Reveal from "./pages/Reveal";
import Explore from "./pages/Explore";
import Roadmap from "./pages/Roadmap";
import CertDetail from "./pages/CertDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard_gemini";
import SkillOverview from "./pages/SkillOverview";
import LessonViewer from "./pages/LessonViewer";
import NotFound from "./pages/NotFound";
import DevLessons from "./pages/DevLessons";
import Lessons from "./pages/Lessons";
import Certificates from "./pages/Certificates";

export default function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<OnboardingLayout />}>
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="reveal" element={<Reveal />} />
      </Route>
      <Route element={<LessonLayout />}>
        <Route path="skills/:skillSlug/:lessonId" element={<LessonViewer />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="skills/:skillSlug" element={<SkillOverview />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="explore" element={<Explore />} />
        <Route path="fields/:slug" element={<Roadmap />} />
        <Route path="fields/:slug/certs/:certId" element={<CertDetail />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        {import.meta.env.DEV && <Route path="dev/lessons" element={<DevLessons />} />}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

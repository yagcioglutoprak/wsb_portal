import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

function Shell({ children, fullWidth = false, hideFooter = false }) {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(20,34,68,0.035) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(20,34,68,0.035) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        {fullWidth ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        )}
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function HomeLayout() {
  return (
    <Shell fullWidth>
      <Outlet />
    </Shell>
  );
}

export function OnboardingLayout() {
  return (
    <Shell hideFooter>
      <Outlet />
    </Shell>
  );
}

export function LessonLayout() {
  return (
    <Shell fullWidth hideFooter>
      <Outlet />
    </Shell>
  );
}

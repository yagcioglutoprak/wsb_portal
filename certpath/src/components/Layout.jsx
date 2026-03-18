import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

function Shell({ children, fullWidth = false, hideFooter = false, hideNav = false }) {
  return (
    <div className="relative min-h-screen bg-paper">
      <div className="flex min-h-screen flex-col">
        {!hideNav && <Nav />}
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
    <Shell fullWidth hideFooter hideNav>
      <Outlet />
    </Shell>
  );
}

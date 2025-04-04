import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";

import useStore from "./store";
import { setAuthToken } from "./libs/apiCall";
import { Toaster } from "sonner";
import Transactions from "./pages/Transactions";
import AccountDetails from "./pages/AccountDetails";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const RootLayout = () => {
  const { user } = useStore((state: any) => state);
  setAuthToken(user?.token || "");
  return !user ? (
    <Navigate to="/sign-in" replace={true} />
  ) : (
    <div className="min-h-[cal(h-screen-100px)]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  const theme = useStore((state: any) => state.theme);
  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.body.classList.add("dark");
  //     document.body.classList.remove("light");
  //   } else {
  //     document.body.classList.add("light");
  //     document.body.classList.remove("dark");
  //   }
  // }, [theme]);
  return (
    <main className={theme}>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
        <Router>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Navigate to="/overview" />} />
              <Route path="/overview" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<AccountDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </Router>

        <Toaster richColors position="top-center" />
      </div>
    </main>
  );
}

export default App;

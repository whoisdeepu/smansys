import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ title, children }) => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user?.role} />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

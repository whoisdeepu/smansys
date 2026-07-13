import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  ClipboardCheck,
  Users,
  UserPlus,
  Receipt,
  GraduationCap,
} from "lucide-react";

const superAdminLinks = [
  { to: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/super-admin/onboarding", label: "School Onboarding", icon: School },
  { to: "/super-admin/approvals", label: "Approvals", icon: ClipboardCheck },
];

const schoolAdminLinks = [
  { to: "/school-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/school-admin/teachers", label: "Import Teachers", icon: UserPlus },
  { to: "/school-admin/students", label: "Import Students", icon: Users },
  { to: "/school-admin/fee-structure", label: "Fee Structure", icon: Receipt },
];

const Sidebar = ({ role }) => {
  const links = role === "superadmin" ? superAdminLinks : schoolAdminLinks;

  return (
    <aside className="w-64 shrink-0 bg-navy-900 text-white h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <GraduationCap className="w-7 h-7 text-teal-400" />
        <span className="font-display font-bold text-xl tracking-tight">Smansys</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-500/15 text-teal-400"
                  : "text-navy-100 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 text-xs text-navy-100/60 border-t border-white/10">
        {role === "superadmin" ? "Super Admin Panel" : "School Admin Panel"}
      </div>
    </aside>
  );
};

export default Sidebar;

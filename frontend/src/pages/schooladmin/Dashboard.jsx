import { useEffect, useState } from "react";
import { Users, UserPlus, Receipt } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

const SchoolAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/school-admin/dashboard")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "student", label: "Student", render: (row) => row.student?.name || "—" },
    { key: "parentEmail", label: "Parent Email" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "createdAt",
      label: "Sent On",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <p className="text-navy-400">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Students" value={data.stats.totalStudents} icon={Users} accent="navy" />
            <StatCard label="Total Teachers" value={data.stats.totalTeachers} icon={UserPlus} accent="teal" />
            <StatCard label="Fee Structures" value={data.stats.feeStructuresCount} icon={Receipt} accent="teal" />
          </div>

          <h2 className="font-display font-semibold text-navy-900 mb-3">Recent Fee Reminders</h2>
          <DataTable columns={columns} rows={data.recentReminders} emptyMessage="No reminders sent yet" />
        </>
      )}
    </DashboardLayout>
  );
};

export default SchoolAdminDashboard;

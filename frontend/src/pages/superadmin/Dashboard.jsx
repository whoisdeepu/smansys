import { useEffect, useState } from "react";
import { School, Clock, CheckCircle2, XCircle } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/super-admin/dashboard")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "name", label: "School Name" },
    { key: "city", label: "City" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      label: "Onboarded On",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <p className="text-navy-400">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Schools" value={data.stats.totalSchools} icon={School} accent="navy" />
            <StatCard label="Pending Approvals" value={data.stats.pendingApprovals} icon={Clock} accent="teal" />
            <StatCard label="Approved Schools" value={data.stats.approvedSchools} icon={CheckCircle2} accent="teal" />
            <StatCard label="Rejected" value={data.stats.rejectedSchools} icon={XCircle} accent="navy" />
          </div>

          <h2 className="font-display font-semibold text-navy-900 mb-3">Recently Onboarded Schools</h2>
          <DataTable columns={columns} rows={data.recentSchools} emptyMessage="No schools onboarded yet" />
        </>
      )}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;

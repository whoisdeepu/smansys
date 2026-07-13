import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import api from "../../services/api";

const Approvals = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");

  const fetchPending = () => {
    setLoading(true);
    api
      .get("/super-admin/schools", { params: { status: "pending" } })
      .then((res) => setSchools(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPending, []);

  const handleApprove = async (id) => {
    await api.patch(`/super-admin/schools/${id}/approve`);
    fetchPending();
  };

  const handleReject = async () => {
    await api.patch(`/super-admin/schools/${rejectTarget}/reject`, { reason });
    setRejectTarget(null);
    setReason("");
    fetchPending();
  };

  const columns = [
    { key: "name", label: "School Name" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "city", label: "City" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleApprove(row._id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100"
          >
            <Check className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => setRejectTarget(row._id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
          >
            <X className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="School Approval Workflow">
      {loading ? (
        <p className="text-navy-400">Loading pending schools...</p>
      ) : (
        <DataTable columns={columns} rows={schools} emptyMessage="No schools awaiting approval" />
      )}

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject School">
        <FormInput
          label="Reason for rejection"
          as="textarea"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button
          onClick={handleReject}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Confirm Rejection
        </button>
      </Modal>
    </DashboardLayout>
  );
};

export default Approvals;

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Mail, Trash2, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import api from "../../services/api";

const schema = z.object({
  class: z.string().min(1, "Class is required"),
  feeType: z.enum(["Tuition", "Transport", "Library", "Lab", "Sports", "Other"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  frequency: z.enum(["Monthly", "Quarterly", "Annual"]),
  dueDate: z.string().min(1, "Due date is required"),
});

const FeeStructurePage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { frequency: "Monthly", feeType: "Tuition" } });

  const fetchFees = () => {
    setLoading(true);
    api
      .get("/school-admin/fee-structure")
      .then((res) => setFees(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchFees, []);

  const onSubmit = async (values) => {
    await api.post("/school-admin/fee-structure", values);
    reset();
    setModalOpen(false);
    fetchFees();
  };

  const handleDelete = async (id) => {
    await api.delete(`/school-admin/fee-structure/${id}`);
    fetchFees();
  };

  const handleSendReminders = async (id) => {
    setSendingId(id);
    try {
      const { data } = await api.post(`/school-admin/fee-structure/${id}/send-reminders`);
      setToast(data.message);
      setTimeout(() => setToast(""), 4000);
    } finally {
      setSendingId(null);
    }
  };

  const columns = [
    { key: "class", label: "Class" },
    { key: "feeType", label: "Fee Type" },
    { key: "amount", label: "Amount", render: (row) => `₹${row.amount}` },
    { key: "frequency", label: "Frequency" },
    { key: "dueDate", label: "Due Date", render: (row) => new Date(row.dueDate).toLocaleDateString() },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleSendReminders(row._id)}
            disabled={sendingId === row._id}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-600 text-xs font-medium hover:bg-teal-500/20 disabled:opacity-50"
          >
            {sendingId === row._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            Send Reminders
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Fee Structure">
      {toast && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">{toast}</div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-navy-900 hover:bg-navy-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Fee Structure
        </button>
      </div>

      {loading ? (
        <p className="text-navy-400">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={fees} emptyMessage="No fee structures set up yet" />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Fee Structure">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Class" placeholder="e.g. 5" error={errors.class?.message} {...register("class")} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-900 mb-1.5">Fee Type</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              {...register("feeType")}
            >
              {["Tuition", "Transport", "Library", "Lab", "Sports", "Other"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <FormInput label="Amount (₹)" type="number" error={errors.amount?.message} {...register("amount")} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-900 mb-1.5">Frequency</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              {...register("frequency")}
            >
              {["Monthly", "Quarterly", "Annual"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <FormInput label="Due Date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />

          <button
            type="submit"
            className="w-full mt-2 bg-navy-900 hover:bg-navy-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Save Fee Structure
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default FeeStructurePage;

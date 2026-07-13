import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import FormInput from "../../components/FormInput";
import api from "../../services/api";

const schema = z.object({
  name: z.string().min(2, "School name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().min(10, "Enter a valid phone number"),
  principalName: z.string().optional(),
  adminName: z.string().min(2, "School admin name is required"),
  adminEmail: z.string().email("Enter a valid admin email"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const Onboarding = () => {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError("");
    setSubmitting(true);
    setSuccess(false);
    try {
      await api.post("/super-admin/schools", values);
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to onboard school");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="School Onboarding">
      <div className="max-w-2xl">
        {success && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            School onboarded successfully. It's now pending approval.
          </div>
        )}
        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-navy-100 p-6">
          <h2 className="font-display font-semibold text-navy-900 mb-4">School Details</h2>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="School Name" error={errors.name?.message} {...register("name")} />
            <FormInput label="Principal Name" error={errors.principalName?.message} {...register("principalName")} />
            <FormInput label="Contact Email" type="email" error={errors.contactEmail?.message} {...register("contactEmail")} />
            <FormInput label="Contact Phone" error={errors.contactPhone?.message} {...register("contactPhone")} />
            <FormInput label="City" error={errors.city?.message} {...register("city")} />
            <FormInput label="State" error={errors.state?.message} {...register("state")} />
          </div>
          <FormInput label="Address" error={errors.address?.message} {...register("address")} />

          <h2 className="font-display font-semibold text-navy-900 mb-4 mt-6 pt-6 border-t border-navy-100">
            School Admin Account
          </h2>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="Admin Name" error={errors.adminName?.message} {...register("adminName")} />
            <FormInput label="Admin Email" type="email" error={errors.adminEmail?.message} {...register("adminEmail")} />
          </div>
          <FormInput
            label="Temporary Password"
            type="password"
            error={errors.adminPassword?.message}
            {...register("adminPassword")}
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-navy-900 hover:bg-navy-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Onboard School
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Onboarding;

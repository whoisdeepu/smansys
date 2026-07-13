import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/FormInput";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "superadmin" ? "/super-admin/dashboard" : "/school-admin/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-3">
            <GraduationCap className="w-6 h-6 text-teal-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Smansys</h1>
          <p className="text-sm text-navy-400 mt-1">School Management Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-navy-100 p-7">
          <h2 className="font-display font-semibold text-lg text-navy-900 mb-5">Sign in</h2>

          {serverError && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <FormInput
            label="Email"
            type="email"
            placeholder="you@school.edu"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-navy-900 hover:bg-navy-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="text-center text-xs text-navy-400 mt-6">
          Super Admin and School Admin accounts are created by the platform team.
        </p>
      </div>
    </div>
  );
};

export default Login;

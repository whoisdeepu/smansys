import { forwardRef } from "react";

const FormInput = forwardRef(({ label, error, as = "input", children, ...rest }, ref) => {
  const Tag = as;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-navy-900 mb-1.5">{label}</label>
      )}
      <Tag
        ref={ref}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-navy-900 placeholder:text-navy-400/60
          focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500
          ${error ? "border-red-400" : "border-navy-100"}`}
        {...rest}
      >
        {children}
      </Tag>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
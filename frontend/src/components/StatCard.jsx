const StatCard = ({ label, value, icon: Icon, accent = "teal" }) => {
  const accentClasses = {
    teal: "bg-teal-500/10 text-teal-600",
    navy: "bg-navy-600/10 text-navy-600",
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-navy-900 leading-none">{value}</p>
        <p className="text-sm text-navy-400 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

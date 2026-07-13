import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CSVImporter from "../../components/CSVImporter";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const ImportTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = () => {
    setLoading(true);
    api
      .get("/school-admin/teachers")
      .then((res) => setTeachers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTeachers, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "qualification", label: "Qualification" },
  ];

  return (
    <DashboardLayout title="Import Teachers">
      <div className="mb-6">
        <CSVImporter
          endpoint="/school-admin/teachers/import"
          sampleColumns="name, email, phone, subject, qualification"
          onImported={fetchTeachers}
        />
      </div>

      <h2 className="font-display font-semibold text-navy-900 mb-3">All Teachers</h2>
      {loading ? (
        <p className="text-navy-400">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={teachers} emptyMessage="No teachers imported yet" />
      )}
    </DashboardLayout>
  );
};

export default ImportTeachers;

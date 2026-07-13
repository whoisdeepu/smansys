import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CSVImporter from "../../components/CSVImporter";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const ImportStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    setLoading(true);
    api
      .get("/school-admin/students")
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchStudents, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "rollNumber", label: "Roll No." },
    { key: "class", label: "Class" },
    { key: "section", label: "Section" },
    { key: "parentEmail", label: "Parent Email" },
  ];

  return (
    <DashboardLayout title="Import Students">
      <div className="mb-6">
        <CSVImporter
          endpoint="/school-admin/students/import"
          sampleColumns="name, rollNumber, class, section, parentName, parentEmail, parentPhone"
          onImported={fetchStudents}
        />
      </div>

      <h2 className="font-display font-semibold text-navy-900 mb-3">All Students</h2>
      {loading ? (
        <p className="text-navy-400">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={students} emptyMessage="No students imported yet" />
      )}
    </DashboardLayout>
  );
};

export default ImportStudents;

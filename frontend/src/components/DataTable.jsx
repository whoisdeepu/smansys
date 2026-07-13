// columns: [{ key, label, render? }]
const DataTable = ({ columns, rows, emptyMessage = "No records found" }) => {
  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50/50">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-5 py-3 font-medium text-navy-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-navy-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row._id || i} className="border-b border-navy-50 last:border-0 hover:bg-navy-50/30">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 text-navy-900">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

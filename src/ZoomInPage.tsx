import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { useState } from "react";

interface TableData {
  id: string;
  title: string;
  rows: Array<{
    label: string;
    values: (string | number)[];
  }>;
  columns: string[];
}

interface LocationState {
  tableData: TableData;
  stockName: string;
  tabName: string;
}

function ZoomInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const state = location.state as LocationState;

  if (!state || !state.tableData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-600 mb-4">No Data Available</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { tableData, stockName, tabName } = state;

  const handleCopyCell = (value: string | number) => {
    const stringValue = String(value);
    navigator.clipboard.writeText(stringValue);
    setCopiedCell(stringValue);
    setTimeout(() => setCopiedCell(null), 2000);
  };

  const handleDownloadCSV = () => {
    let csv = `${tableData.title}\n`;
    csv += `Stock: ${stockName}\n`;
    csv += `Tab: ${tabName}\n\n`;

    // Add headers
    csv += tableData.columns.map(col => `"${col}"`).join(",") + "\n";

    // Add rows
    tableData.rows.forEach(row => {
      csv += `"${row.label}",${row.values.map(val => `"${val}"`).join(",")}\n`;
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `${tableData.id}_${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const scrollbarStyles = `
    .zoom-scroll-container::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    .zoom-scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 6px;
    }
    .zoom-scroll-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 6px;
    }
    .zoom-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    .zoom-scroll-container::-webkit-scrollbar-corner {
      background: #f1f1f1;
    }
  `;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Overview
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
              title="Download as CSV"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Breadcrumb and Title */}
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-medium">{stockName}</span> → <span className="font-medium">{tabName}</span>
          </p>
          <h1 className="text-3xl font-bold text-gray-800">{tableData.title}</h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 p-6 overflow-hidden">
        <div className="h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <style>{scrollbarStyles}</style>

          {/* Table Container with both scrollbars */}
          <div className="flex-1 min-h-0 overflow-auto zoom-scroll-container">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-20">
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  {tableData.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`px-6 py-4 text-left font-semibold whitespace-nowrap ${
                        idx === 0 ? "sticky left-0 bg-gradient-to-r from-blue-700 to-blue-800 z-30" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                      rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800 sticky left-0 z-10 whitespace-nowrap">
                      <div className={`${rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                        {row.label}
                      </div>
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-gray-700 whitespace-nowrap cursor-pointer hover:bg-blue-100 transition-colors relative group`}
                        onClick={() => handleCopyCell(val)}
                        title="Click to copy"
                      >
                        <div className="font-mono text-right">
                          {typeof val === "number" ? val.toFixed(2) : val}
                        </div>
                        {/* Copy tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Click to copy
                        </div>
                        {copiedCell === String(val) && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-green-600 text-white text-xs rounded whitespace-nowrap">
                            Copied!
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex-shrink-0 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>
                Total Rows: <span className="font-semibold text-gray-800">{tableData.rows.length}</span>
              </span>
              <span>
                Total Columns: <span className="font-semibold text-gray-800">{tableData.columns.length}</span>
              </span>
              <span>
                Data Points: <span className="font-semibold text-gray-800">{tableData.rows.length * (tableData.columns.length - 1)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-3 flex-shrink-0 text-sm text-blue-800">
        <p>💡 <span className="font-medium">Tip:</span> Click on any cell to copy the value. Use the Export button to download the table as CSV.</p>
      </div>
    </div>
  );
}

export default ZoomInPage;
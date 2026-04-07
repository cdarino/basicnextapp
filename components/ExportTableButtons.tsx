"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import { pdf } from "@react-pdf/renderer";
import ConfirmModal from "@/components/ConfirmModal";
import ExportTablePdfDocument, {
  ExportColumn,
  ExportRow,
} from "@/components/ExportTablePdfDocument";

interface ExportTableButtonsProps {
  title: string;
  fileName: string;
  columns: ExportColumn[];
  rows: ExportRow[];
}

function getWorksheetRows(columns: ExportColumn[], rows: ExportRow[]) {
  return rows.map((row) => {
    const out: Record<string, string | number | boolean | null> = {};
    columns.forEach((column) => {
      const value = row[column.key];
      out[column.key] = value === undefined ? null : value;
    });
    return out;
  });
}

export default function ExportTableButtons({
  title,
  fileName,
  columns,
  rows,
}: ExportTableButtonsProps) {
  const [isPreparingExcel, setIsPreparingExcel] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);

  const handleDownloadExcel = async () => {
    const confirmed = await ConfirmModal(`Download ${title} to Excel?`, {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-green-600 hover:bg-green-700",
    });

    if (!confirmed) {
      return;
    }

    setIsPreparingExcel(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title);

      worksheet.columns = columns.map((column) => ({
        header: column.label,
        key: column.key,
        width: Math.max(column.label.length + 4, 16),
      }));

      worksheet.addRows(getWorksheetRows(columns, rows));
      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${fileName}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsPreparingExcel(false);
    }
  };

  const handlePrintPdf = async () => {
    const confirmed = await ConfirmModal(`Prepare ${title} PDF (A4) for printing?`, {
      okText: "Yes, Prepare",
      cancelText: "Cancel",
      okColor: "bg-purple-600 hover:bg-purple-700",
    });

    if (!confirmed) {
      return;
    }

    setIsPreparingPdf(true);
    try {
      const blob = await pdf(
        <ExportTablePdfDocument title={title} columns={columns} rows={rows} />
      ).toBlob();

      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank", "noopener,noreferrer");

      if (!printWindow) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${fileName}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    } finally {
      setIsPreparingPdf(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleDownloadExcel}
        disabled={isPreparingExcel}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPreparingExcel ? "Preparing Excel..." : "Download Excel"}
      </button>

      <button
        onClick={handlePrintPdf}
        disabled={isPreparingPdf}
        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPreparingPdf ? "Preparing PDF..." : "Print PDF (A4)"}
      </button>
    </div>
  );
}

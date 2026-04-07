import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface ExportColumn {
  key: string;
  label: string;
}

export type ExportValue = string | number | boolean | null | undefined;
export type ExportRow = Record<string, ExportValue>;

interface ExportTablePdfDocumentProps {
  title: string;
  columns: ExportColumn[];
  rows: ExportRow[];
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#4B5563",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 4,
    marginBottom: 3,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 3,
  },
  cellHeader: {
    fontWeight: 700,
    paddingHorizontal: 3,
  },
  cell: {
    paddingHorizontal: 3,
  },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 4,
    fontSize: 8,
    color: "#6B7280",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function displayValue(value: ExportValue): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
}

const ExportTablePdfDocument: React.FC<ExportTablePdfDocumentProps> = ({
  title,
  columns,
  rows,
}) => {
  const columnWidth = `${100 / Math.max(columns.length, 1)}%`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Generated: {new Date().toLocaleString()}</Text>
        </View>

        <View style={styles.tableHeaderRow} fixed>
          {columns.map((column) => (
            <View key={column.key} style={{ width: columnWidth }}>
              <Text style={styles.cellHeader}>{column.label}</Text>
            </View>
          ))}
        </View>

        {rows.map((row, index) => (
          <View key={`${index}-${row[columns[0]?.key] ?? "row"}`} style={styles.row}>
            {columns.map((column) => (
              <View key={column.key} style={{ width: columnWidth }}>
                <Text style={styles.cell}>{displayValue(row[column.key])}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>Total rows: {rows.length}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export default ExportTablePdfDocument;

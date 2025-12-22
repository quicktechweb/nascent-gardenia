"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
    >
      Print Invoice
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface CartItem {
  roomTitle: string;
  packageName: string;
  price: number;
  quantity: number;
  guests: number;
  arrival: string;
  departure: string;
  serviceCharge: number;
}

interface Guest {
  firstName: string;
  lastName: string;
}

interface Facility {
  title: string;
  price: number;
}

interface Payment {
  cardNumber?: string;
  expiry?: string;
  securityCode?: string;
}

interface Booking {
  _id: string;
  tran_id:string;
  payments?:string;
  contact?: Contact;
  cart?: CartItem[];
  guests?: Guest[];
  facilities?: Facility[];
  payment?: Payment;
  address?: string;
  specialRequests?: string;
  nidUrl?: string;
  passportUrl?: string;
  totalPrice?: number;
  status?: string;
  createdAt?: string;
}

export default function PendingBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [showInvoice, setShowInvoice] = useState<Booking | null>(null);
const ITEMS_PER_PAGE = 10;

const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(30);



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/booking/pending");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
  const searchText = search.toLowerCase();

  const phone = b.contact?.phone?.toLowerCase() || "";
  const tranId = b.tran_id?.toLowerCase() || "";

  return (
    phone.includes(searchText) ||
    tranId.includes(searchText)
  );
});


  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`https://nascent.virtualshopbd.com/api/booking/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

const paginatedBookings = filteredBookings.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);



// CSV export
// CSV export for all bookings
// CSV export for all bookings
const exportAllCSV = (bookings: Booking[]) => {
  if (!bookings.length) return alert("No bookings available");
  let csv = "Booking ID,Customer,Phone,Room,Package,Service Charge,Guests,Qty,Price,Total,Status,Created At\n";

  bookings.forEach((b) => {
    b.cart?.forEach((c) => {
      csv += `${b.tran_id},${b.contact?.firstName || ""} ${b.contact?.lastName || ""},${b.contact?.phone || ""},${c.roomTitle},${c.packageName},${c.serviceCharge},${c.guests},${c.quantity},${c.price},${b.totalPrice},${b.status},${b.createdAt}\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `all-bookings.csv`;
  a.click();
};

// Excel export for all bookings
const exportAllExcel = (bookings: Booking[]) => {
  if (!bookings.length) return alert("No bookings available");
  let table = `
    <table border="1">
      <tr>
        <th>Booking ID</th>
        <th>Customer</th>
        <th>Phone</th>
        <th>Room</th>
        <th>Package</th>
        <th>Service Charge</th>
        <th>Guests</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
  `;

  bookings.forEach((b) => {
    b.cart?.forEach((c) => {
      table += `
        <tr>
          <td>${b.tran_id}</td>
          <td>${b.contact?.firstName || ""} ${b.contact?.lastName || ""}</td>
          <td>${b.contact?.phone || ""}</td>
          <td>${c.roomTitle}</td>
          <td>${c.packageName}</td>
          <td>${c.serviceCharge}</td>
          <td>${c.guests}</td>
          <td>${c.quantity}</td>
          <td>${c.price}</td>
          <td>${b.totalPrice}</td>
          <td>${b.status}</td>
          <td>${b.createdAt}</td>
        </tr>
      `;
    });
  });

  table += `</table>`;

  const blob = new Blob([table], { type: "application/vnd.ms-excel" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `all-bookings.xls`;
  a.click();
};

// PDF download for all bookings
const exportAllPDFDownload = (bookings: Booking[]) => {
  if (!bookings.length) {
    alert("No bookings available");
    return;
  }

  const doc = new jsPDF("l", "mm", "a4");

  doc.setFontSize(18);
  doc.text("All Pending Bookings", 14, 15);

  const columns = [
    "Booking ID",
    "Customer",
    "Phone",
    "Room",
    "Package",
    "Service",
    "Guests",
    "Qty",
    "Price",
    "Total",
    "Status",
    "Created At",
  ];

  const rows: (string | number)[][] = [];

  bookings.forEach((b) => {
    b.cart?.forEach((c) => {
      const createdDate = b.createdAt
        ? new Date(b.createdAt).toLocaleDateString()
        : "-";

      rows.push([
        b.tran_id,
        `${b.contact?.firstName || ""} ${b.contact?.lastName || ""}`,
        b.contact?.phone || "",
        c.roomTitle,
        c.packageName,
        c.serviceCharge,
        c.guests,
        c.quantity,
        c.price,
        b.totalPrice || 0,
        b.status || "pending",
        createdDate,
      ]);
    });
  });

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 22,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [199, 132, 54],
      textColor: 255,
    },
  });

  doc.save(`all-bookings-${Date.now()}.pdf`);
};



// Print for all bookings (no blank window)
const printAllBookings = (bookings: Booking[]) => {
  if (!bookings?.length) {
    alert("No bookings available");
    return;
  }

  const printWindow = window.open("", "", "width=1200,height=800");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>All Pending Bookings</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
          }
          th {
            background: #c78436;
            color: white;
          }
        </style>
      </head>
      <body>
        <h2>All Pending Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Package</th>
              <th>Service</th>
              <th>Guests</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${bookings
              .map((b) =>
                b.cart
                  ?.map(
                    (c) => `
                  <tr>
                    <td>${b.tran_id}</td>
                    <td>${b.contact?.firstName || ""} ${
                      b.contact?.lastName || ""
                    }</td>
                    <td>${b.contact?.phone || ""}</td>
                    <td>${c.roomTitle}</td>
                    <td>${c.packageName}</td>
                    <td>${c.serviceCharge}</td>
                    <td>${c.guests}</td>
                    <td>${c.quantity}</td>
                    <td>${c.price}</td>
                    <td>${b.totalPrice}</td>
                    <td>${b.status}</td>
                   <td>${
          b.createdAt
            ? new Date(b.createdAt).toLocaleDateString()
            : "-"
        }</td>
                  </tr>
                `
                  )
                  .join("")
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};


// AI JSON export
const exportAllAI = (bookings: Booking[]) => {
  if (!bookings.length) return alert("No bookings available");
  const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `all-bookings.json`;
  a.click();
};


  return (
    <div className="p-6 text-black">

      {/* Actions */}
{/* Actions */}
<div className="flex flex-wrap gap-2 mb-4">
  <button
    onClick={() => printAllBookings(bookings)}
    className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white text-sm"
  >
    Print
  </button>

  <button
    onClick={() => exportAllExcel(bookings)}
    className="px-4 py-2 border border-green-600 text-green-700 hover:bg-green-600 hover:text-white text-sm"
  >
    Excel
  </button>

  <button
    onClick={() => exportAllCSV(bookings)}
    className="px-4 py-2 border border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white text-sm"
  >
    CSV
  </button>

  <button
    onClick={() => exportAllPDFDownload(bookings)}
    className="px-4 py-2 border border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white text-sm"
  >
    Pdf
  </button>
  <button
    onClick={() => exportAllAI(bookings)}
    className="px-4 py-2 border border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white text-sm"
  >
    AI JSON
  </button>
</div>




      <h1 className="text-2xl font-bold mb-4">Pending Bookings</h1>

      <div className="flex items-center gap-3 mb-5">
  <span className="text-sm font-medium">Show</span>

  <select
    value={itemsPerPage}
    onChange={(e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1); // reset page
    }}
    className="border rounded px-2 py-1 text-sm"
  >
    <option value={30}>30</option>
    <option value={60}>60</option>
    <option value={120}>120</option>
    <option value={150}>150</option>
  </select>

  <span className="text-sm font-medium">entries</span>
</div>

      
      {/* Search + Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-medium">Total Pending: {bookings.length}</p>
         <input
      type="text"
      placeholder="Search by Booking ID or Phone"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded px-3 py-1 text-sm"
    />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Booking ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((b) => (
              <tr key={b._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.tran_id}</td>
                <td className="px-4 py-3">{b.contact?.firstName} {b.contact?.lastName}</td>
                <td className="px-4 py-3">{b.contact?.phone}</td>
                <td className="px-4 py-3 font-semibold">৳ {b.totalPrice}</td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm ${
                      b.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
               <td className="px-4 py-3 flex gap-2">
  <button
    onClick={() => setSelected(b)}
    className="px-3 py-1 text-xs bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white rounded"
  >
    View
  </button>

  <button
    onClick={() => setShowInvoice(b)}
    className="px-3 py-1 text-xs border border-[#c78436] text-black rounded hover:bg-black hover:text-white transition"
  >
    Invoice
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
<div className="flex justify-between items-center mt-4 ms-4 mb-5 me-5">
  <p className="text-sm">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className={`px-3 py-1 border text-sm ${
        currentPage === 1
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-black hover:text-white"
      }`}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 border text-sm ${
          page === currentPage
            ? "bg-black text-white"
            : "hover:bg-gray-200"
        }`}
      >
        {page}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className={`px-3 py-1 border text-sm ${
        currentPage === totalPages
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-black hover:text-white"
      }`}
    >
      Next
    </button>
  </div>
</div>

      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex  items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-12 text-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-red-600 text-lg font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p><b>Booking ID:</b> {selected.tran_id}</p>
              <p><b>Payment:</b> {selected.payments}</p>
              <p><b>Status:</b> {selected.status}</p>
              <p><b>Created At:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "-"}</p>
              <p><b>Total Price:</b> ৳ {selected.totalPrice}</p>
            </div>

            {selected.contact && (
              <>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p><b>Name:</b> {selected.contact.firstName} {selected.contact.lastName}</p>
                <p><b>Phone:</b> {selected.contact.phone}</p>
                <p><b>Email:</b> {selected.contact.email}</p>
                <hr className="my-4" />
              </>
            )}

          {selected.cart?.length ? (
  <>
    <h3 className="font-semibold mb-2">Rooms</h3>
    {(selected.cart || []).map((c, i) => (
      <div key={i} className="border rounded p-3 mb-2">
        <p><b>Room:</b> {c.roomTitle}</p>
        <p><b>Package:</b> {c.packageName}</p>
        <p><b>Price:</b> ৳ {c.price}</p>
        <p><b>Quantity:</b> {c.quantity}</p>
        <p><b>Guests:</b> {c.guests}</p>
        <p><b>Arrival:</b> {c.arrival}</p>
        <p><b>Departure:</b> {c.departure}</p>
        <p><b>Service Charge:</b> ৳ {c.serviceCharge}</p>
      </div>
    ))}
    <hr className="my-4" />
  </>
) : null}

          {selected.guests?.length ? (
  <>
    <h3 className="font-semibold mb-2">Guests</h3>
    {(selected.guests || []).map((g, i) => (
      <p key={i}><b>Guest {i+1}:</b> First Name:{g.firstName} <br/> Last Name:{g.lastName}</p>
    ))}
    <hr className="my-4" />
  </>
) : null}

           {selected.facilities?.length ? (
  <>
    <h3 className="font-semibold mb-2">Facilities</h3>
    {(selected.facilities || []).map((f, i) => (
      <p key={i}><b>{f.title}</b> — ৳ {f.price}</p>
    ))}
    <hr className="my-4" />
  </>
) : null}

            {selected.payment && (
              <>
                <h3 className="font-semibold mb-2">Payment</h3>
                <p><b>Card Number:</b> {selected.payment.cardNumber}</p>
                <p><b>Expiry:</b> {selected.payment.expiry}</p>
                <p><b>Security Code:</b> {selected.payment.securityCode}</p>
                <hr className="my-4" />
              </>
            )}

            {selected.specialRequests && (
              <>
                <h3 className="font-semibold mb-2">Special Requests</h3>
                <p>{selected.specialRequests}</p>
                <hr className="my-4" />
              </>
            )}

            <h3 className="font-semibold mb-2">Documents</h3>
            <div className="flex gap-4">
              {selected.nidUrl && <a href={selected.nidUrl} target="_blank" className="text-white rounded-md bg-[#c78436] px-3 py-2 underline">View NID</a>}
              {selected.passportUrl && <a href={selected.passportUrl} target="_blank" className="text-white rounded-md bg-[#c78436] px-3 py-2 underline">View Passport</a>}
            </div>
          </div>
        </div>
      )}


      {/* invoice  */}

    {showInvoice && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div
      id="invoice-print"
      className="bg-white w-[900px] max-h-[90vh] overflow-y-auto p-10 rounded-lg text-black"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src="https://i.ibb.co.com/svhxtPX2/NG-LOGO-BARIDHARA-icon.png"
            alt="NASCENT GARDENIA BARIDHARA"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold uppercase">
              NASCENT GARDENIA BARIDHARA
            </h2>
            <p className="text-sm">Baridhara, Dhaka, Bangladesh</p>
            <p className="text-sm">Phone: +880184100112</p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-2xl font-bold tracking-wide">INVOICE</h3>
          <p className="text-sm">Invoice No: {showInvoice.tran_id}</p>
          <p className="text-sm">
            Date:{" "}
            {new Date(showInvoice.createdAt || "").toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <h4 className="font-semibold mb-1">Billed From</h4>
          <p>NASCENT GARDENIA BARIDHARA</p>
          <p>Dhaka, Bangladesh</p>
          <p>+880184100112</p>
        </div>

        <div className="text-right">
          <h4 className="font-semibold mb-1">Billed To</h4>
          <p>
            {showInvoice.contact?.firstName}{" "}
            {showInvoice.contact?.lastName}
          </p>
          <p>{showInvoice.contact?.phone}</p>
          <p>{showInvoice.contact?.email}</p>
        </div>
      </div>

      {/* Rooms Table */}
      <table className="w-full border border-black text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-black px-3 py-2 text-left">Room</th>
            <th className="border border-black px-3 py-2 text-left">
              Package
            </th>
            <th className="border border-black px-3 py-2 text-left">
              serviceCharge
            </th>
            <th className="border border-black px-3 py-2 text-center">
              Guests
            </th>
            <th className="border border-black px-3 py-2 text-center">
              Qty
            </th>
            <th className="border border-black px-3 py-2 text-right">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {showInvoice.cart?.map((c, i) => (
            <tr key={i}>
              <td className="border border-black px-3 py-2">
                {c.roomTitle}
              </td>
              <td className="border border-black px-3 py-2">
                {c.packageName}
              </td>
              <td className="border border-black px-3 py-2">
                {c.serviceCharge}
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {c.guests}
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {c.quantity}
              </td>
              <td className="border border-black px-3 py-2 text-right">
                ৳ {c.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Facilities */}
      {showInvoice.facilities?.length ? (
        <div className="mb-6 text-sm">
          <h4 className="font-semibold mb-2">Additional Facilities</h4>
          {showInvoice.facilities.map((f, i) => (
            <p key={i}>
              {f.title} — ৳ {f.price}
            </p>
          ))}
        </div>
      ) : null}

      {/* Total */}
      <div className="flex justify-end mb-10">
        <div className="w-64 text-sm">
          <div className="flex justify-between border-t border-black pt-2 font-bold text-lg">
            <span>Total</span>
            <span>৳ {showInvoice.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs border-t pt-4">
        Thank you for choosing Nascent Gardenia Baridhara.<br />
        This is a system generated invoice.
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition text-sm"
        >
          Print Invoice
        </button>

        <button
          onClick={() => setShowInvoice(null)}
          className="px-4 py-2 border border-gray-400 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

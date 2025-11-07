import { useState } from "react";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  ClipboardCheck,
  Download,
  DownloadIcon,
  Eye,
  FileClock,
  FileImage,
} from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { useAccountantOrder } from "../../hooks/useAccountant.js";
import { TbFileInvoice } from "react-icons/tb";
import { downloadFile } from "../../utils/downloadFile.js";
import { useUser } from "../../hooks/useUser.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadInvoice = ({
  accName,
  accEmail,
  partyName,
  partyAddress,
  partyContact,
  totalAmount,
  advanceAmount,
  dueAmount,
  dueDate,
  paymentMode,
}) => {
  const invoiceBy = { name: accName, email: accEmail };
  const partyDetails = {
    company: partyName,
    address: partyAddress,
    contact: partyContact,
  };
  const paymentInfo = {
    total: totalAmount,
    advance: advanceAmount,
    due: dueAmount,
    dueDate: dueDate,
    paymentMode: paymentMode,
  };

  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // dark blue
  doc.text("INVOICE", 14, 20);

  // Reset color
  doc.setTextColor(0, 0, 0);

  // Invoice By
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice By:", 14, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${invoiceBy.name}`, 14, 42);
  doc.text(`Email: ${invoiceBy.email}`, 14, 49);

  // Party Details
  doc.setFont("helvetica", "bold");
  doc.text("Party Details:", 14, 65);
  doc.setFont("helvetica", "normal");
  doc.text(`Company Name: ${partyDetails.company}`, 14, 72);
  doc.text(`Address: ${partyDetails.address}`, 14, 79);
  doc.text(`Contact Person Number: ${partyDetails.contact}`, 14, 86);

  // Payment Information Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(231, 76, 60); // red heading
  doc.text("Payment Information:", 14, 105);

  doc.setTextColor(0, 0, 0); // reset to black
  autoTable(doc, {
    startY: 110,
    theme: "striped",
    headStyles: {
      fillColor: [52, 152, 219], // blue header background
      textColor: 255, // white text
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 12,
    },
    head: [
      [
        "Total Amount",
        "Advance Amount",
        "Due Amount",
        "Due Date",
        "Payment Mode",
      ],
    ],
    body: [
      [
        `${formatRupee(paymentInfo.total)}`,
        `${formatRupee(paymentInfo.advance)}`,
        `${formatRupee(paymentInfo.due)}`,
        paymentInfo.dueDate,
        paymentInfo.paymentMode,
      ],
    ],
  });

  // Save file
  doc.save("invoice.pdf");
};

const ApproveDuePaymentOrders = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openDueInvoice, setOpenDueInvoice] = useState(false);

  const { user } = useUser();

  const {
    ordersToApproveDuePayment,
    ordersToApproveDuePaymentLoading,
    singleOrderInAccountant,
    singleOrderInAccountantLoading,
    approveDuePayment,
    isApprovingDuePayment,
    generateDueInvoice,
    isGeneratingDueInvoice,
  } = useAccountantOrder(singleOrderId);

  const totalBeforeDiscount =
    singleOrderInAccountant?.totalAmount /
    (1 - singleOrderInAccountant?.discount / 100);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleInvoiceGeneration = () => {
    const data = {
      orderId: singleOrderId,
      dueDate: format(singleOrderInAccountant?.dueDate, "yyyy-MM-dd"),
    };
    generateDueInvoice(data);
  };

  const handleDownloadDueInvoice = () => {
    downloadInvoice({
      accName: singleOrderInAccountant?.dueInvoiceDetails?.invoicedBy?.name,
      accEmail: singleOrderInAccountant?.dueInvoiceDetails?.invoicedBy?.email,
      partyName: singleOrderInAccountant?.dueInvoiceDetails?.party?.companyName,
      partyAddress: singleOrderInAccountant?.dueInvoiceDetails?.party?.address,
      partyContact:
        singleOrderInAccountant?.dueInvoiceDetails?.party?.contactPersonNumber,
      totalAmount: singleOrderInAccountant?.dueInvoiceDetails?.totalAmount,
      advanceAmount: singleOrderInAccountant?.dueInvoiceDetails?.advanceAmount,
      dueAmount: singleOrderInAccountant?.dueInvoiceDetails?.dueAmount,
      dueDate: format(
        singleOrderInAccountant?.dueInvoiceDetails?.dueDate,
        "dd MMM yyyy"
      ),
      paymentMode: singleOrderInAccountant?.dueInvoiceDetails?.paymentMode,
    });
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
      minWidth: 80,
      maxWidth: 100,
    },
    { field: "product", headerName: "Product", flex: 1, minWidth: 120 },
    { field: "party", headerName: "Party", flex: 1, minWidth: 100 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "advanceAmount",
      headerName: "Advance Amount",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-green-700"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-red-600"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`${
            params.value === "Cancelled"
              ? "text-red-800 bg-red-100 p-1 px-3 rounded-full"
              : params.value === "Delivered"
              ? "text-green-800 bg-green-100 p-1 px-3 rounded-full"
              : "text-gray-800 bg-gray-200 p-1 px-3 rounded-full"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-1">
          <Tooltip title="View Order" placement="left" enterDelay={500}>
            <Eye
              color="blue"
              className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>
          <Tooltip
            title="View advance payment invoice"
            enterDelay={500}
            placement="top"
          >
            <FileImage
              strokeWidth={2.1}
              color="green"
              className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => {
                setSingleOrderId(params.row.id);
                setOpenInvoice(true);
              }}
            />
          </Tooltip>
          {params.row.dueInvoiceGenerated && (
            <Tooltip
              title="View Due payment invoice"
              enterDelay={500}
              placement="top"
            >
              <FileClock
                strokeWidth={2.1}
                color="green"
                className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenDueInvoice(true);
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const rows = ordersToApproveDuePayment?.map((order) => ({
    id: order._id,
    orderId: `#${order.orderId}`,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.items?.map((p) => p.product?.name).join(", "),
    quantity: order?.items?.map((p) => `${p.quantity} bags`).join(", "),
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
    dueInvoiceGenerated: order.dueInvoiceGenerated,
  }));

  if (ordersToApproveDuePaymentLoading || singleOrderInAccountantLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="transition-all rounded-lg mt-5 max-w-full">
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        pagination
        autoHeight
        sx={{
          width: "100%",
          borderRadius: "8px",
          minWidth: "100%",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto !important",
            overflowY: "auto",
          },
          "& .MuiDataGrid-main": {
            maxWidth: "100%",
          },
        }}
        disableColumnResize={false}
      />
      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative lg:p-7 p-5 rounded-lg lg:max-w-[60%] lg:min-w-[50%] lg:max-h-[95%] w-[95%] max-h-[95%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="lg:text-xl text-base font-semibold">
                  Order Details - #{singleOrderInAccountant?.orderId}
                </p>
                <div className="hidden sm:block md:block lg:block">
                  {singleOrderInAccountant?.duePaymentStatus ===
                    "SentForApproval" && (
                    <Button
                      loading={isApprovingDuePayment}
                      onClick={() => approveDuePayment(singleOrderId)}
                      sx={{ textTransform: "none" }}
                      startIcon={<ClipboardCheck size={18} />}
                    >
                      Confirm received dues
                    </Button>
                  )}
                  {!singleOrderInAccountant?.dueInvoiceGenerated &&
                    singleOrderInAccountant?.duePaymentStatus ===
                      "Approved" && (
                      <Button
                        loading={isGeneratingDueInvoice}
                        onClick={handleInvoiceGeneration}
                        sx={{ textTransform: "none" }}
                        startIcon={<FileClock size={18} />}
                      >
                        Generate due invoice
                      </Button>
                    )}
                </div>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="text-center sm:hidden md:hidden lg:hidden">
                {singleOrderInAccountant?.duePaymentStatus ===
                  "SentForApproval" && (
                  <Button
                    loading={isApprovingDuePayment}
                    onClick={() => approveDuePayment(singleOrderId)}
                    sx={{ textTransform: "none", fontSize: "12px" }}
                    startIcon={<ClipboardCheck size={15} />}
                  >
                    Confirm received dues
                  </Button>
                )}
                {!singleOrderInAccountant?.dueInvoiceGenerated &&
                  singleOrderInAccountant?.duePaymentStatus === "Approved" && (
                    <Button
                      loading={isGeneratingDueInvoice}
                      onClick={handleInvoiceGeneration}
                      sx={{ textTransform: "none", fontSize: "12px" }}
                      startIcon={<FileClock size={15} />}
                    >
                      Generate due invoice
                    </Button>
                  )}
              </div>

              {/* products table */}
              <div className="relative overflow-x-auto lg:mt-5 mt-2 max-h-52">
                <table className="w-full lg:text-sm text-xs text-left text-gray-500 overflow-auto">
                  <thead className="sticky top-0 bg-gray-100 text-gray-800 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price/bag
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="lg:text-sm text-xs">
                    {singleOrderInAccountant?.items?.map((item) => (
                      <tr className="bg-white border-b border-gray-200">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item?.product?.name}
                        </th>
                        <td className="px-6 py-4">{item?.product?.category}</td>
                        <td className="px-6 py-4">
                          {formatRupee(item?.product?.price)}
                        </td>
                        <td className="px-6 py-4">{item?.quantity} bags</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderInAccountant?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {format(singleOrderInAccountant?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Payment Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Subtotal:</span>
                    {formatRupee(totalBeforeDiscount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Discount ({singleOrderInAccountant?.discount}%):
                    </span>
                    -
                    {formatRupee(
                      totalBeforeDiscount - singleOrderInAccountant?.totalAmount
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Net Total:
                    </span>
                    {formatRupee(singleOrderInAccountant?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>
                    {formatRupee(singleOrderInAccountant?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>
                    {formatRupee(singleOrderInAccountant?.dueAmount)}
                  </div>
                  {singleOrderInAccountant?.advanceAmount > 0 && (
                    <div className="flex items-center justify-between font-semibold text-red-700">
                      <span className="text-gray-600 font-normal">
                        Advance Confirmation:
                      </span>
                      {singleOrderInAccountant?.advancePaymentStatus ===
                        "Approved" && (
                        <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Confirmed
                        </span>
                      )}
                      {singleOrderInAccountant?.advancePaymentStatus ===
                        "SentForApproval" && (
                        <span className="text-indigo-700 font-semibold bg-indigo-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Sent For Confirmation
                        </span>
                      )}
                      {singleOrderInAccountant?.advancePaymentStatus ===
                        "Pending" && (
                        <span className="text-yellow-700 font-semibold bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Pending
                        </span>
                      )}
                      {singleOrderInAccountant?.advancePaymentStatus ===
                        "Rejected" && (
                        <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Rejected
                        </span>
                      )}
                    </div>
                  )}
                  {singleOrderInAccountant?.duePaymentStatus && (
                    <div className="flex items-center justify-between font-semibold text-red-700">
                      <span className="text-gray-600 font-normal">
                        Due Confirmation:
                      </span>
                      {singleOrderInAccountant?.duePaymentStatus ===
                        "Approved" && (
                        <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Confirmed
                        </span>
                      )}
                      {singleOrderInAccountant?.duePaymentStatus ===
                        "SentForApproval" && (
                        <span className="text-indigo-700 font-semibold bg-indigo-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Sent For Confirmation
                        </span>
                      )}
                      {singleOrderInAccountant?.duePaymentStatus ===
                        "Pending" && (
                        <span className="text-yellow-700 font-semibold bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Pending
                        </span>
                      )}
                      {singleOrderInAccountant?.duePaymentStatus ===
                        "Rejected" && (
                        <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Rejected
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Advance Payment Mode:
                    </span>
                    {singleOrderInAccountant?.paymentMode}
                  </div>
                  {singleOrderInAccountant?.duePaymentMode && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Payment Mode:
                      </span>
                      {singleOrderInAccountant?.duePaymentMode}
                    </div>
                  )}
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>
                    {format(singleOrderInAccountant?.dueDate, "dd MMM yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Order Status
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Status:
                    </span>
                    {singleOrderInAccountant?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        {singleOrderInAccountant?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        {singleOrderInAccountant?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderInAccountant?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Paid
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus ===
                      "ConfirmationPending" && (
                      <span className="text-yellow-700 bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Confirmation Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>
                    {singleOrderInAccountant?.invoiceGenerated === true ? (
                      <span className="text-green-700 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Yes
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        No
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Shipping Details
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Address:</span>
                    {singleOrderInAccountant?.shippingAddress}
                  </div>
                </div>
                {singleOrderInAccountant?.assignedWarehouse && (
                  <div className="flex flex-col gap-2 lg:text-sm text-xs">
                    <div className="flex justify-between text-sm">
                      <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                        Assigned Plant
                      </h1>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">Plant:</span>
                      {singleOrderInAccountant?.assignedWarehouse ? (
                        <div className="flex flex-col items-center">
                          <p>
                            {singleOrderInAccountant?.assignedWarehouse?.name}
                          </p>
                          <p className="text-xs font-normal text-gray-600">
                            (
                            {
                              singleOrderInAccountant?.assignedWarehouse
                                ?.location
                            }
                            )
                          </p>
                        </div>
                      ) : (
                        <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Not Assigned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Plant Approval:
                      </span>
                      {singleOrderInAccountant?.approvedBy ? (
                        <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Approved
                        </span>
                      ) : (
                        <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:text-sm text-xs mt-5">
              <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                Notes
              </h1>
              <p className="bg-yellow-50 rounded-lg p-3">
                {singleOrderInAccountant?.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Open Invoice Modal */}
      {openInvoice && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg max-w-[60%] min-w-[35%] max-h-[90%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Due Payment Proof</p>
                <div className="flex items-center gap-5">
                  {user.isActive ? (
                    <Tooltip
                      title="Download invoice"
                      enterDelay={500}
                      placement="top"
                    >
                      <Download
                        color="blue"
                        className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                        size={30}
                        onClick={() =>
                          downloadFile(
                            singleOrderInAccountant?.duePaymentDoc,
                            "invoice"
                          )
                        }
                      />
                    </Tooltip>
                  ) : (
                    <Download
                      color="blue"
                      className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                      size={30}
                      onClick={() =>
                        downloadFile(
                          singleOrderInAccountant?.duePaymentDoc,
                          "invoice"
                        )
                      }
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => setOpenInvoice(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow mb-5">
              {singleOrderInAccountant?.duePaymentDoc?.endsWith(".pdf") ? (
                <iframe
                  src={singleOrderInAccountant?.duePaymentDoc}
                  className="w-full h-96"
                  title="Advance Payment Invoice PDF"
                />
              ) : (
                <Tooltip title="Click to view invoice in new tab" followCursor>
                  <a
                    href={singleOrderInAccountant?.duePaymentDoc}
                    target="_blank"
                  >
                    <img
                      src={singleOrderInAccountant?.duePaymentDoc}
                      className="w-full h-full object-contain"
                      alt="Advance Payment Invoice"
                    />
                  </a>
                </Tooltip>
              )}
            </div>

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Payment Collected By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderInAccountant?.paymentCollectedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderInAccountant?.paymentCollectedBy?.email}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Payment Details
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {singleOrderInAccountant?.dueAmount === 0 ? (
                    "Paid"
                  ) : (
                    <span>
                      {formatRupee(singleOrderInAccountant?.dueAmount)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Payment Mode:
                  </span>
                  {singleOrderInAccountant?.paymentMode}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- View Invoice Modal --- */}
      {openDueInvoice && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 w-[35%] rounded-lg overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Due Payment Invoice</p>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {user.isActive ? (
                      <Tooltip
                        title="Download Invoice"
                        placement="top"
                        enterDelay={500}
                      >
                        <DownloadIcon
                          onClick={handleDownloadDueInvoice}
                          className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg active:scale-95 transition-all"
                          size={30}
                        />
                      </Tooltip>
                    ) : (
                      <DownloadIcon
                        className="text-gray-400 cursor-not-allowed p-1.5 rounded-lg"
                        size={30}
                      />
                    )}
                  </div>

                  <IconButton
                    size="small"
                    onClick={() => setOpenDueInvoice(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Invoiced By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderInAccountant?.dueInvoiceDetails?.invoicedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {
                    singleOrderInAccountant?.dueInvoiceDetails?.invoicedBy
                      ?.email
                  }
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm mt-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Party Details
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Company Name:
                  </span>
                  {
                    singleOrderInAccountant?.dueInvoiceDetails?.party
                      ?.companyName
                  }
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrderInAccountant?.dueInvoiceDetails?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {
                    singleOrderInAccountant?.dueInvoiceDetails?.party
                      ?.contactPersonNumber
                  }
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm mt-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Payment Information
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Total Amount:
                  </span>
                  {formatRupee(
                    singleOrderInAccountant?.dueInvoiceDetails?.totalAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-green-700">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(
                    singleOrderInAccountant?.dueInvoiceDetails?.advanceAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-red-700">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {formatRupee(
                    singleOrderInAccountant?.dueInvoiceDetails?.dueAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Due Date:</span>
                  {format(
                    singleOrderInAccountant?.dueInvoiceDetails?.dueDate,
                    "dd MMM yyyy"
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Due Payment Mode:
                  </span>
                  {singleOrderInAccountant?.dueInvoiceDetails?.duePaymentMode}
                </div>
              </div>
              <hr className="my-3" />
              <div>
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span className="text-gray-600 font-normal">
                    Invoice Generated on:
                  </span>
                  {format(
                    singleOrderInAccountant?.dueInvoiceDetails?.generatedAt,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveDuePaymentOrders;

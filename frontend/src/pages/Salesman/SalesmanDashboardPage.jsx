import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../hooks/useProduct";
import { CircularProgress } from "@mui/material";
import { formatRupee } from "../../utils/formatRupee";
import Box from "@mui/material/Box";
import AllOrdersForSalesman from "../../components/Salesman/OrderManagement/AllOrdersForSalesman";
import { useSalesmanOrder } from "../../hooks/useSalesmanOrder";
import DueOrdersForSalesman from "../../components/Salesman/OrderManagement/DueOrdersForSalesman";
import { format } from "date-fns";
import { useUser } from "../../hooks/useUser";

const SalesmanDashboardPage = () => {
  const [price, setPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [selectedParty, setSelectedParty] = useState({});

  const { user } = useUser();

  const { allProducts, isLoading } = useProduct();
  const {
    createOrder,
    isCreatingOrder,
    approvedParties,
    approvedPartiesLoading,
  } = useSalesmanOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const advanceAmountDocs = watch("advanceAmountDocs");
  const advanceAmountFile = advanceAmountDocs ? advanceAmountDocs[0] : null;

  const selectedProductId = watch("item");
  useEffect(() => {
    const selectedProduct = allProducts?.find(
      (product) => product._id === selectedProductId
    );
    setPrice(selectedProduct?.price);
  }, [selectedProductId]);

  const quantity = watch("quantity");
  useEffect(() => {
    const total = price * quantity;
    setTotalAmount(total);
  }, [quantity]);

  const advanceAmount = watch("advanceAmount");
  const dueAmount = totalAmount - advanceAmount;
  useEffect(() => {
    if (advanceAmount > totalAmount) {
      setError("Advance cannot be greater than total amount");
    } else {
      setError("");
    }
  }, [totalAmount, advanceAmount]);

  const selectedPartyId = watch("party");
  useEffect(() => {
    const Party = approvedParties?.find(
      (party) => party._id === selectedPartyId
    );
    setSelectedParty(Party);
  }, [selectedPartyId]);

  const dueDate = watch("dueDate");

  useEffect(() => {
    if (dueDate < format(new Date(), "yyyy-MM-dd")) {
      setDueDateError("Due Date cannot be in past");
    } else if (!dueDate) {
      setDueDateError("");
    } else {
      setDueDateError("");
    }
  }, [dueDate]);

  const [openForm, setOpenForm] = useState(false);

  const orderTypes = ["All Orders", "Due Orders"];
  const [isActive, setIsActive] = useState("All Orders");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("item", data.item);
    formData.append("party", JSON.stringify(selectedParty));
    formData.append("quantity", data.quantity);
    formData.append("advanceAmount", data.advanceAmount);
    formData.append("dueDate", data.dueDate);
    formData.append("paymentMode", data.paymentMode);
    formData.append("notes", data.notes);
    formData.append("advanceAmountDocs", advanceAmountFile);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    createOrder(formData, { onSuccess: () => setOpenForm(false) });
  };

  if (isLoading || approvedPartiesLoading)
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">{isActive}</h1>
        <Button
          disabled={!user.isActive}
          disableElevation
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: "600",
          }}
          onClick={() => setOpenForm(true)}
        >
          Place Order
        </Button>
      </div>

      <div className="mb-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {orderTypes.map((order) => (
            <Button
              key={order._id}
              disableElevation
              variant={isActive === order ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(order)}
            >
              {order}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div>
        {isActive === "All Orders" && <AllOrdersForSalesman />}
        {isActive === "Due Orders" && <DueOrdersForSalesman />}
      </div>

      {/* Place Order Modal */}
      {openForm && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[50%]">
            <p className="text-xl font-semibold mb-5">Place a new Order</p>
            <form
              className="grid grid-cols-2 gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <div className="mb-5">
                  <div className="flex items-start justify-between">
                    <h1 className="font-semibold text-gray-800 mb-3">
                      Party Information
                    </h1>

                    {!isNaN(selectedParty?.balance) && (
                      <div>
                        {selectedParty?.balance > 666666 && (
                          <span className="text-green-600 text-sm font-semibold">
                            Max Loan: {formatRupee(selectedParty?.balance)}
                          </span>
                        )}
                        {selectedParty?.balance < 666666 && (
                          <span className="text-yellow-600 text-sm font-semibold">
                            Max Loan: {formatRupee(selectedParty?.balance)}
                          </span>
                        )}
                        {selectedParty?.balance < 333333 && (
                          <span className="text-orange-600 text-sm font-semibold">
                            Max Loan: {formatRupee(selectedParty?.balance)}
                          </span>
                        )}
                        {selectedParty?.balance < 100000 && (
                          <span className="text-red-600 text-sm font-semibold">
                            Max Loan: {formatRupee(selectedParty?.balance)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.party}
                    className="mb-4"
                  >
                    <InputLabel id="party-label">Party</InputLabel>
                    <Controller
                      name="party"
                      control={control}
                      rules={{ required: "Party is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Party"
                          size="small"
                          fullWidth
                          variant="outlined"
                          error={!!errors.party}
                        >
                          <MenuItem>Select Party</MenuItem>
                          {approvedParties?.map((party) => (
                            <MenuItem key={party._id} value={party._id}>
                              {party.companyName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </div>

                <div>
                  <div className="flex items-start justify-between">
                    <h1 className="font-semibold text-gray-800 mb-3">
                      Product Information
                    </h1>
                    {!isNaN(totalAmount) && (
                      <span className="text-blue-600 text-sm font-semibold">
                        Total: {formatRupee(totalAmount)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-5">
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.item}
                      className="mb-4"
                    >
                      <InputLabel id="item-label">Product</InputLabel>
                      <Controller
                        name="item"
                        control={control}
                        rules={{ required: "Product is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="item-label"
                            id="item"
                            label="Product"
                          >
                            <MenuItem>Select Product</MenuItem>
                            {allProducts?.map((product) => (
                              <MenuItem key={product._id} value={product._id}>
                                {product.name} ({formatRupee(product.price)}{" "}
                                M.R.P / bag)
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors?.item && (
                        <span className="text-red-600 text-xs mt-1">
                          {errors.item.message}
                        </span>
                      )}
                    </FormControl>
                    <div>
                      <TextField
                        error={!!errors.quantity}
                        size="small"
                        fullWidth
                        type="number"
                        id="outlined-basic"
                        label="Quantity in bags"
                        variant="outlined"
                        {...register("quantity", {
                          required: {
                            value: true,
                            message: "Quantity is required",
                          },
                        })}
                      />
                      {errors.quantity && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div className="flex items-start justify-between">
                    <h1 className="font-semibold text-gray-800 mb-3">
                      Payment Information
                    </h1>
                    {!isNaN(dueAmount) && (
                      <span className="text-red-600 text-sm font-semibold">
                        Due: {formatRupee(dueAmount)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <TextField
                        error={!!errors.advanceAmount || error}
                        size="small"
                        fullWidth
                        type="number"
                        id="outlined-basic"
                        label="Advance Amount"
                        variant="outlined"
                        {...register("advanceAmount", {
                          required: {
                            value: true,
                            message:
                              "Advance Amount is required, enter 0 if null",
                          },
                        })}
                      />
                      {errors.advanceAmount && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.advanceAmount.message}
                        </p>
                      )}
                      {error && (
                        <p className="text-red-600 text-xs mt-1">{error}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm mb-1">
                        Upload advance payment receipt
                      </span>
                      <input
                        disabled={advanceAmount <= 0 || !advanceAmount}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none "
                        type="file"
                        id="formFileMultiple"
                        multiple
                        {...register("advanceAmountDocs")}
                      />
                      {errors.advanceAmountDocs && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.advanceAmountDocs.message}
                        </p>
                      )}
                    </div>
                    <Box sx={{ width: "100%" }}>
                      {dueAmount === 0 ? (
                        <TextField
                          disabled
                          error={!!errors.dueDate}
                          fullWidth
                          label="Due Date"
                          type="date"
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      ) : (
                        <TextField
                          error={!!errors.dueDate}
                          fullWidth
                          label="Due Date"
                          type="date"
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("dueDate", {
                            required: {
                              value: true,
                              message: "Due Date is required",
                            },
                          })}
                        />
                      )}
                      {errors.dueDate && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </Box>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.paymentMode}
                      className="mb-4"
                    >
                      <InputLabel id="paymentMode-label">
                        Payment Mode
                      </InputLabel>
                      <Controller
                        name="paymentMode"
                        control={control}
                        rules={{ required: "Payment Mode is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="paymentMode-label"
                            id="paymentMode"
                            label="Payment Mode"
                          >
                            <MenuItem value="">Select Payment Mode</MenuItem>
                            {Number(watch("advanceAmount")) === 0 ? (
                              <MenuItem value="Not Paid">Not Paid</MenuItem>
                            ) : (
                              [
                                <MenuItem key="upi" value="UPI">
                                  UPI
                                </MenuItem>,
                                <MenuItem key="cash" value="Cash">
                                  Cash
                                </MenuItem>,
                                <MenuItem key="bank" value="Bank Transfer">
                                  Bank Transfer
                                </MenuItem>,
                              ]
                            )}
                          </Select>
                        )}
                      />
                      {errors.paymentMode && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.paymentMode.message}
                        </p>
                      )}
                    </FormControl>

                    <div>
                      <TextField
                        size="small"
                        error={!!errors.notes}
                        fullWidth
                        rows={2}
                        multiline
                        id="outlined-basic"
                        label="Notes"
                        variant="outlined"
                        {...register("notes", {
                          required: {
                            value: true,
                            message: "Notes is required",
                          },
                        })}
                      />
                      {errors.notes && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-5">
                    <Button
                      variant="outlined"
                      disableElevation
                      sx={{ textTransform: "none" }}
                      onClick={() => setOpenForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={isCreatingOrder}
                      variant="contained"
                      disableElevation
                      sx={{ textTransform: "none" }}
                      type="submit"
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesmanDashboardPage;

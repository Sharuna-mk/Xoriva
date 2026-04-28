import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createAddressAPI, AddressAPI, UpdateAddressAPI, deleteAddressAPI } from '../../services/allAPI'

type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type FormData = Omit<Address, "id" | "isDefault">;

const EMPTY_FORM: FormData = {
  name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
};


function AddressForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Save Address",
}: {
  initial?: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState<FormData>(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  const field = (
    key: keyof FormData,
    placeholder: string,
    type = "text"
  ) => (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [key]: e.target.value }));
          setErrors((err) => ({ ...err, [key]: undefined }));
        }}
        className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-stone-50 text-gray-800
          placeholder-gray-400 focus:outline-none focus:ring-2 transition
          ${errors[key]
            ? "border-red-400 focus:ring-red-100"
            : "border-stone-200 focus:ring-gray-200 focus:border-gray-400"
          }`}
      />
      {errors[key] && (
        <p className="text-xs text-red-500 mt-1 ml-1">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="mt-4 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          {field("name", "Full name")}
          {field("phone", "Phone number", "tel")}
        </div>
        {field("address", "Street address")}
        <div className="grid grid-cols-2 gap-3">
          {field("city", "City")}
          {field("pincode", "Pincode")}
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            className="flex-1 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 active:scale-[0.98] transition-all"
          >
            {saveLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-stone-200 text-sm font-medium py-2.5 rounded-xl hover:bg-stone-50 active:scale-[0.98] transition-all text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const AddressPage = () => {

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [address, setAddress] = useState<any[]>([]);
  const selectedAddr = address.find((a) => a._id === selectedId);

  const handleAddNew = async (data: FormData) => {
    try {

      const reqBody = {
        fullName: data.name,
        phoneNum: data.phone,
        address: data.address,
        city: data.city,
        pinCode: data.pincode,
      };

      const res = await createAddressAPI(reqBody);
      console.log(res);

      const a = res.newAddress;
      console.log(a);

      const newAddress = {
        _id: a._id,
        name: a.fullName,
        phone: a.phoneNum,
        address: a.address,
        city: a.city,
        pincode: a.pinCode,
      };

      setAddress((prev: any) => [...prev, newAddress]);
      setShowAddForm(false);

    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await AddressAPI();
      console.log(res);

      const mapped = res.savedAddress.map((a: any) => ({
        _id: a._id,
        name: a.fullName,
        phone: a.phoneNum,
        address: a.address,
        city: a.city,
        pincode: a.pinCode,
      }));

      setAddress(mapped);

      if (mapped.length > 0) {
        setSelectedId(mapped[0]._id);
      }

    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };
  const handleSaveEdit = async (id: string, data: FormData) => {
    try {
      const reqBody = {
        fullName: data.name,
        phoneNum: data.phone,
        address: data.address,
        city: data.city,
        pinCode: data.pincode,
      };

      const res = await UpdateAddressAPI(id, reqBody);
      console.log(res);


      const updated = res.updatedAddress;

      setAddress((prev) =>
        prev.map((a) =>
          a._id === id
            ? {
              ...a,
              name: updated.fullName,
              phone: updated.phoneNum,
              address: updated.address,
              city: updated.city,
              pincode: updated.pinCode,
            }
            : a
        )
      );

      setEditId(null);

    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAddressAPI(id);
      console.log(res);


      setAddress((prev) => prev.filter((a) => a._id !== id));

      // reset selected if deleted
      if (selectedId === id) {
        const remaining = address.filter((a) => a._id !== id);
        if (remaining.length > 0) {
          setSelectedId(remaining[0]._id);
        } else {
          setSelectedId(null);
        }
      }

      setDeletingId(null);

    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };


  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 px-4 pt-6 pb-32 sm:px-6 font-sans">
      {/* Header */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
          Delivery Address
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Select or add a delivery address
        </p>

        <div className="space-y-3">
          {/* Address list */}
          <AnimatePresence>
            {address.map((addr) => (
              <motion.div
                key={addr._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (editId !== addr._id && deletingId !== addr._id) {
                    setSelectedId(addr._id);
                  }
                }}
                className={`bg-white border rounded-2xl p-4 transition cursor-pointer shadow-sm
                ${selectedId === addr._id
                    ? "border-gray-900 ring-1 ring-gray-900"
                    : "border-stone-200 hover:border-stone-300"
                  }
                  }`}
              >
                <div className="flex justify-between items-start gap-3">
                  {/* Radio + details */}
                  <div className="flex gap-3 min-w-0">
                    <input
                      type="radio"
                      checked={selectedId === addr._id}
                      onChange={() => setSelectedId(addr._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 accent-gray-900 scale-110 shrink-0"
                    />
                    <div className="text-sm min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{addr.name}</p>
                        {addr.isDefault && (
                          <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 mt-0.5">{addr.phone}</p>
                      <p className="text-gray-500 leading-snug mt-0.5 break-words">
                        {addr.address}, {addr.city} — {addr.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex gap-3 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setEditId(editId === addr._id ? null : addr._id)
                      }
                      className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeletingId(deletingId === addr._id ? null : addr._id)
                      }
                      className="text-xs text-red-400 underline hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete confirm */}
                <AnimatePresence>
                  {deletingId === addr._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex justify-between items-center gap-3">
                        <p className="text-xs text-red-600 font-medium">
                          Remove this address?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(addr._id)}
                            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Yes, remove
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Edit form */}
                <AnimatePresence>
                  {editId === addr._id && (
                    <AddressForm
                      initial={{
                        name: addr.name,
                        phone: addr.phone,
                        address: addr.address,
                        city: addr.city,
                        pincode: addr.pincode,
                      }}
                      onSave={(data) => handleSaveEdit(addr._id, data)}
                      onCancel={() => setEditId(null)}
                      saveLabel="Update Address"
                    />
                  )}
                </AnimatePresence>

                {/* Set as default */}
                {!addr.isDefault && editId !== addr._id && deletingId !== addr._id &&  (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleSetDefault(addr.id);
                    }}
                    className="mt-3 text-xs text-gray-400 hover:text-gray-700 transition-colors underline"
                  >
                    Set as default
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add new address */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              Add New Address
            </button>

            <AnimatePresence>
              {showAddForm && (
                <AddressForm
                  onSave={handleAddNew}
                  onCancel={() => setShowAddForm(false)}
                  saveLabel="Save Address"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <AnimatePresence>
        {editId === null && deletingId === null && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-3 flex justify-between items-center shadow-lg"
          >
            <div className="text-sm">
              <p className="text-gray-400 text-xs">Delivering to</p>
              <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                {selectedAddr?.name}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                {selectedAddr?.city} — {selectedAddr?.pincode}
              </p>
            </div>

            <Link to="/payment" state={{ addressId: selectedId }}>
              <button className="bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-700 active:scale-95 transition-all">
                Continue →
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressPage;
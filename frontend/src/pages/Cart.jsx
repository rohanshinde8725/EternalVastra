import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdGridView, MdViewList } from "react-icons/md";
import { useToast } from "../context/ToastContext";

const Cart = () => {
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);
  const [viewMode, setViewMode] = useState("4");

  useEffect(() => {
    const savedViewMode = localStorage.getItem("cartViewMode");
    if (savedViewMode === "4" || savedViewMode === "table") {
      setViewMode(savedViewMode);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("cartViewMode", mode);
  };

  // Load cart
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // Update localStorage
  const updateStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increase / Decrease quantity
  const updateQuantity = (id, type) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (type === "inc") {
          return { ...item, quantity: item.quantity + 1 };
        }
        if (type === "dec" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    updateStorage(updatedCart);
  };

  // Remove item
  const removeItem = (id) => {
    const itemToRemove = cart.find((item) => item.id === id);
    const updatedCart = cart.filter((item) => item.id !== id);
    updateStorage(updatedCart);
    showToast.info(`Removed "${itemToRemove?.title || "Item"}" from cart.`);
  };

  // Clear cart
  const clearCart = () => {
    updateStorage([]);
    showToast.info("Cart cleared.");
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const discount = Math.floor(subtotal * 0.15); // 15% discount
  const total = subtotal - discount;

  return (
<<<<<<< HEAD
    <div className="w-full bg-[#FEFAF8]">
=======
    <div className="container bg-[#FEFAF8]">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
      {/* Banner */}
      <div className="h-60 bg-[url(/images/banner/banner-3.png)] bg-cover bg-center">
        <div className="py-20 px-5 sm:px-8 md:px-10 lg:px-12">
          <h1 className="text-4xl font-semibold text-[#74202D]">
            Your Cart
          </h1>
        </div>
      </div>

<<<<<<< HEAD
      <div className="container p-5 md:p-10 flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
=======
      <div className="p-5 md:p-10 flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[70%] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Cart Items</h2>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "4", label: "4/4", icon: <MdGridView className="h-5 w-5" /> },
                { id: "table", label: "List", icon: <MdViewList className="h-5 w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleViewModeChange(option.id)}
                  aria-label={option.label}
<<<<<<< HEAD
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition cursor-pointer ${
=======
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                    viewMode === option.id
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "bg-white text-[#3b3737] border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>

          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#FEFAF8] text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded" />
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.category?.join(", ") || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top font-semibold text-[#74202D]">₹{item.discountPrice}</td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, "dec")}
<<<<<<< HEAD
                            className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300 cursor-pointer">
=======
                            className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, "inc")}
<<<<<<< HEAD
                            className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300 cursor-pointer">
=======
                            className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top font-bold text-[#74202D]">₹{item.discountPrice * item.quantity}</td>
                      <td className="px-4 py-4 align-top">
<<<<<<< HEAD
                        <button onClick={() => removeItem(item.id)} className="text-[#74202D] hover:text-[#5c1b2b] transition-colors cursor-pointer">
=======
                        <button onClick={() => removeItem(item.id)} className="text-[#74202D] hover:text-[#5c1b2b] transition-colors">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                          <FaTrash className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
<<<<<<< HEAD
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
              {cart.map((item) => (
                <div key={item.id} className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <img loading="lazy" decoding="async" src={item.img} alt={item.title} className="w-full h-44 object-cover rounded" />
                  <div className="mt-4 space-y-3">
                    <h2 className="font-semibold text-base truncate">{item.title}</h2>
                    <p className="text-[#74202D] font-bold">₹{item.discountPrice}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, "dec")}
<<<<<<< HEAD
                        className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300 cursor-pointer">
=======
                        className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, "inc")}
<<<<<<< HEAD
                        className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300 cursor-pointer">
=======
                        className="px-3 py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D] transition-all duration-300">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                        +
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-[#74202D]">₹{item.discountPrice * item.quantity}</span>
                    </div>
<<<<<<< HEAD
                    <button onClick={() => removeItem(item.id)} className="w-full rounded-md border border-[#74202D] py-2 text-sm font-semibold text-[#74202D] hover:bg-[#74202D] hover:text-white transition cursor-pointer">
=======
                    <button onClick={() => removeItem(item.id)} className="w-full rounded-md border border-[#74202D] py-2 text-sm font-semibold text-[#74202D] hover:bg-[#74202D] hover:text-white transition">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clear Cart */}
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[#74202D] font-semibold cursor-pointer transition-all duration-300"
            >
              CLEAR CART
            </button>
          )}
        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="w-full lg:w-[30%] bg-white border border-gray-200 shadow-xl p-5 rounded-lg h-fit scroll-mt-24">
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#74202D]">₹{total}</span>
          </div>

          <button
            onClick={() => showToast.info("Proceeding to secure checkout...")}
            className='uppercase bg-[#74202D] text-white py-2 px-4 text-xs sm:text-sm font-semibold
            border-2 border-[#74202D] hover:text-[#74202D] rounded-sm hover:bg-transparent cursor-pointer
            transition duration-300 mt-2 w-full text-center'>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
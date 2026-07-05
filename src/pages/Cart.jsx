import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);

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
    const updatedCart = cart.filter((item) => item.id !== id);
    updateStorage(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    updateStorage([]);
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const discount = Math.floor(subtotal * 0.15); // 15% discount
  const total = subtotal - discount;

  return (
    <div className="bg-[#FEFAF8]">
      {/* Banner */}
      <div className="h-60 bg-[url(/images/banner-3.png)] bg-cover bg-center">
        <div className="py-20 px-10 md:px-30">
          <h1 className="text-4xl font-semibold text-[#74202D]">
            Your Cart
          </h1>
        </div>
      </div>

      <div className="p-5 md:p-10 flex flex-col lg:flex-row gap-10">
        
        {/* LEFT SIDE */}
        <div className="lg:w-[70%] space-y-5">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id}
                className="flex items-center gap-5 border-gray-300r p-4 rounded-lg shadow-lg">
                {/* Image */}
                <img loading="lazy" decoding="async"
                  src={item.img} alt="" className="w-24 h-24 object-cover rounded"/>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-[#74202D] font-bold">
                    ₹{item.discountPrice}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, "dec")}
                      className="px-2 -py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent cursor-pointer 
                      hover:text-[#74202D] hover:border-[#74202D] transition-all duration-300" >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => updateQuantity(item.id, "inc")}
                      className="px-2 -py-1 border rounded-sm bg-[#74202D] text-white hover:bg-transparent cursor-pointer 
                      hover:text-[#74202D] hover:border-[#74202D] transition-all duration-300">
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="font-bold text-[#74202D]">
                  ₹{item.discountPrice * item.quantity}
                </div>

                {/* Remove */}
                <button onClick={() => removeItem(item.id)}>
                  <FaTrash className="text-[#74202D] cursor-pointer" />
                </button>
              </div>
            ))
          )}

          {/* Clear Cart */}
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[#74202D] font-semibold cursor-pointer hover:text-red-500 transition-all duration-300"
            >
              CLEAR CART
            </button>
          )}
        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="lg:w-[30%] border-gray-600 shadow-xl p-5 rounded-lg h-fit">
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

          <button className='uppercase bg-[#74202D] text-white py-2 px-4 text-xs sm:text-sm font-semibold
            border-2 border-[#74202D] hover:text-[#74202D] rounded-sm hover:bg-transparent cursor-pointer
            transition duration-300 mt-2'>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
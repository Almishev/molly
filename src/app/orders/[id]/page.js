'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useSettings} from "@/components/UseSettings";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const {id} = useParams();
  const {calculateDeliveryFee} = useSettings();
  
  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?_id='+id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      })
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }
  // Закръгляне на общата сума до втория знак след десетичната запетая
  subtotal = parseFloat(subtotal.toFixed(2));
  
  // Използване на доставката от поръчката, ако е налична, или изчисляване с хука
  const deliveryFee = order?.deliveryFee !== undefined ? order.deliveryFee : calculateDeliveryFee(subtotal);
  const total = parseFloat((subtotal + deliveryFee).toFixed(2));

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Вашата поръчка" />
        <div className="mt-4 mb-8">
          <p>Благодарим Ви за поръчката.</p>
          <p>Ще Ви се обадим когато поръчката е готова.</p>
        </div>
      </div>
      {loadingOrder && (
        <div>Loading order...</div>
      )}
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map(product => (
              <CartProduct key={product._id} product={product} />
            ))}
            <div className="text-right py-4 px-2 bg-black rounded-lg mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Междинна сума:</span>
                <span className="text-white font-bold">{subtotal.toFixed(2)} лв</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Доставка:</span>
                <span className="text-white font-bold">{deliveryFee.toFixed(2)} лв</span>
              </div>
              {deliveryFee === 0 && (
                <div className="text-center text-green-500 text-sm mb-2">
                  Безплатна доставка! 🎉
                </div>
              )}
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-gray-300 font-semibold">Общо:</span>
                <span className="text-white font-bold text-lg">
                  {total.toFixed(2)} лв
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-black p-4 rounded-lg">
              <AddressInputs
                disabled={true}
                addressProps={order}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
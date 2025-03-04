'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const {id} = useParams();
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
                <span className="text-white font-bold">{subtotal} лв</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Доставка:</span>
                <span className="text-white font-bold">1 лв</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-gray-300 font-semibold">Общо:</span>
                <span className="text-white font-bold text-lg">
                  {subtotal + 1} лв
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
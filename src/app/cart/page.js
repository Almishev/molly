'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useProfile} from "@/components/UseProfile";
import {useSettings} from "@/components/UseSettings";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {cartProducts,removeCartProduct} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const {data:profileData} = useProfile();
  const {
    calculateDeliveryFee, 
    loading: loadingSettings, 
    isDeliveryAvailable, 
    deliveryUnavailableMessage,
    isWithinBusinessHours
  } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const {phone, streetAddress, city, notes} = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        notes
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  // Закръгляне на общата сума до втория знак след десетичната запетая
  subtotal = parseFloat(subtotal.toFixed(2));
  
  // Изчисляване на такса за доставка въз основа на настройките
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = parseFloat((subtotal + deliveryFee).toFixed(2));
  
  function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }
  async function proceedToCheckout(ev) {
    ev.preventDefault();
    
    // Предотвратяване на повторно изпращане
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Проверка за задължителни полета
    if (!address.phone || !address.streetAddress || !address.city) {
      toast.error('Моля, попълнете всички задължителни полета (телефон, адрес и град)');
      setIsSubmitting(false);
      return;
    }
    
    // address and shopping cart products
    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: 'Preparing your order...',
      success: 'Redirecting to payment...',
      error: 'Something went wrong... Please try again later',
    })
  }

  function handleCashOnDelivery() {
    // Предотвратяване на повторно изпращане
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Проверка за задължителни полета
    if (!address.phone || !address.streetAddress || !address.city) {
      toast.error('Моля, попълнете всички задължителни полета (телефон, адрес и град)');
      setIsSubmitting(false);
      return;
    }
    
    fetch('/api/orders', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        address,
        cartProducts,
        paid: false,
      }),
    }).then(async (response) => {
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        data = null;
      }
      console.log('Server response:', data);
      if (response.ok) {
        toast.success('Поръчката е приета за плащане при доставка!');
        // Redirect to the order page
        if (data && data.orderId) {
          window.location = `/orders/${data.orderId}?clear-cart=1`;
        }
      } else {
        toast.error('Грешка при обработка на поръчката.');
        setIsSubmitting(false);
      }
    }).catch(error => {
      console.error('Error submitting order:', error);
      toast.error('Грешка при обработка на поръчката.');
      setIsSubmitting(false);
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Вашата кошница е празна 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Вашата кошница" />
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2 grid-cols-1">
        <div>
          {cartProducts?.length === 0 && (
            <div>Няма продукти в кошницата</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <CartProduct
              key={index}
              product={product}
              onRemove={removeCartProduct}
              index={index}
            />
          ))}
          <div className="py-4 px-4 mt-4 bg-black rounded-lg">
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
        <div className="bg-black p-4 rounded-lg">
          <h2 className="text-white text-xl font-bold mb-4">Информация за доставка</h2>
          <form onSubmit={proceedToCheckout}>
            <div className="mb-4">
              <AddressInputs
                addressProps={address}
                setAddressProp={handleAddressChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              {!isDeliveryAvailable ? (
                <div className="p-6 mb-4 rounded-lg bg-gray-900 border border-yellow-400 text-center shadow-lg">
                  <div className="text-red-500 text-3xl mb-3">⚠️</div>
                  <h3 className="text-yellow-400 text-xl font-bold mb-3">Доставките временно недостъпни</h3>
                  <div className="bg-black bg-opacity-50 p-4 rounded-md mb-4">
                    <p className="text-white">{deliveryUnavailableMessage}</p>
                  </div>
                  {!isWithinBusinessHours() && (
                    <div className="mt-3 border-t border-gray-700 pt-3">
                      <p className="text-gray-300">Работно време: <span className="text-yellow-400 font-semibold">09:00 - 23:00</span></p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    type="button" 
                    onClick={handleCashOnDelivery} 
                    className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-yellow-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Обработка...' : `Плати при доставка`}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
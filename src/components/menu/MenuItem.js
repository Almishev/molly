import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import {useContext, useState} from "react";
import FlyingButton from "react-flying-item";
import toast from "react-hot-toast";

export default function MenuItem(menuItem) {
  const {
    image, name, description, basePrice,
    sizes, extraIngredientPrices, _id
  } = menuItem;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const {addToCart} = useContext(CartContext);

  // Check if the item has sizes or extras
  const hasSizesOrExtras = (sizes && sizes.length > 0) || (extraIngredientPrices && extraIngredientPrices.length > 0);

  async function handleAddToCartButtonClick() {
    console.log('add to cart');
    const hasOptions = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    toast.success('Добавено в кошницата!');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('hiding popup');
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }
  // Закръгляне до втория знак след десетичната запетая
  selectedPrice = parseFloat(selectedPrice.toFixed(2));

  // Common button style
  const buttonStyle = "bg-yellow-500 hover:bg-yellow-300 text-black py-2 px-4 rounded-full transition-colors";

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-[#2d2d2d] p-4 rounded-lg max-w-md">
            <div
              className="overflow-y-scroll p-2"
              style={{maxHeight:'calc(100vh - 100px)'}}>
              <Image
                src={image}
                alt={name}
                width={300} height={200}
                className="mx-auto" />
              <h2 className="text-lg font-bold text-center mb-2 text-yellow-500">{name}</h2>
              <p className="text-center text-gray-300 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-yellow-500">Избери размер</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border border-gray-700 rounded-md mb-1 text-gray-200">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"/>
                      {size.name} {(basePrice + size.price).toFixed(2)} лв
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-yellow-500">Екстри?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className="flex items-center gap-2 p-4 border border-gray-700 rounded-md mb-1 text-gray-200">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                        name={extraThing.name} />
                      {extraThing.name} +{extraThing.price.toFixed(2)} лв
                    </label>
                  ))}
                </div>
              )}
              <FlyingButton
                targetTop={'5%'}
                targetLeft={'95%'}
                src={image}>
                <div className="bg-yellow-500 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full transition-colors sticky bottom-2"
                     onClick={handleAddToCartButtonClick}>
                  Вземи за {selectedPrice.toFixed(2)} лв
                </div>
              </FlyingButton>
              <button
                className="mt-2 bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors w-full py-2 rounded-full"
                onClick={() => setShowPopup(false)}>
                Откажи
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}
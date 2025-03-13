import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {
    image, description, name, basePrice,
    sizes, extraIngredientPrices, _id
  } = item;
  
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
  
  return (
    <div className="bg-[#2d2d2d] p-4 rounded-lg text-center
      group hover:bg-gray-800 hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        <img 
          src={image} 
          className="max-h-auto max-h-24 block mx-auto rounded-lg" 
          alt={name}
        />
      </div>
      <h4 className="font-semibold text-xl my-3 text-yellow-500">{name}</h4>
      <p className="text-gray-300 text-sm line-clamp-3">
        {description}
      </p>
      <div className="mt-4">
        <AddToCartButton
          name={name}
          description={description}
          image={image}
          basePrice={basePrice}
          _id={_id}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
        />
      </div>
    </div>
  );
}
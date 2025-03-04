import FlyingButton from 'react-flying-item'

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image}>
          <div onClick={onClick}>
            Добави в количка {basePrice} лв
          </div>
        </FlyingButton>
      </div>
    );
  }
  return (
    <button
    type="button"
    onClick={onClick}
    className="mt-4 bg-yellow-500 hover:bg-yellow-300 text-black font-semibold rounded-full px-6 py-2 mx-auto block whitespace-nowrap  min-w-[90px]"
  >
    Вземи (от {basePrice} лв)
  </button>
  
  

  );
}
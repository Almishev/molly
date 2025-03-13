import FlyingButton from 'react-flying-item';

// Стил за общите бутони
const buttonStyle = "bg-yellow-500 hover:bg-yellow-300 text-black font-semibold rounded-full px-6 py-2 mx-auto block whitespace-nowrap min-w-[120px]";

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent" style={{background: 'none'}}>
        <style jsx global>{`
          .flying-button-parent {
            background: #2d2d2d !important;
            
          }
          .flying-button-parent > div {
            background: #2d2d2d !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        `}</style>
        <FlyingButton
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image}>
          <button 
            type="button"
            onClick={onClick} 
            className={buttonStyle}>
            Вземи за {basePrice.toFixed(2)} лв
          </button>
        </FlyingButton>
      </div>
    );
  }
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonStyle}
    >
      Вземи (от {basePrice.toFixed(2)} лв)
    </button>
  );
}

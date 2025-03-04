import ChevronDown from "@/components/icons/ChevronDown";
import ChevronUp from "@/components/icons/ChevronUp";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import {useState} from "react";

export default function MenuItemPriceProps({name,addLabel,props,setProps}) {

  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps(oldProps => {
      return [...oldProps, {name:'', price:0}];
    });
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps(prevSizes => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove) {
    setProps(prev => prev.filter((v,index) => index !== indexToRemove));
  }

  return (
    <div className="bg-[#2d2d2d] p-4 rounded-lg mb-4 border border-gray-700">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex p-2 justify-start items-center gap-2 text-gray-200 hover:text-primary transition-colors w-full"
        type="button">
        {isOpen && (
          <ChevronUp className="w-6 h-6" />
        )}
        {!isOpen && (
          <ChevronDown className="w-6 h-6" />
        )}
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-gray-400">({props?.length})</span>
      </button>
      <div className={isOpen ? 'block mt-4' : 'hidden'}>
        {props?.length > 0 && props.map((size,index) => (
          <div key={index} className="flex items-end gap-4 mb-4">
            <div className="flex-grow">
              <label className="text-gray-300 block mb-1">Название</label>
              <input type="text"
                     placeholder="Size name"
                     value={size.name}
                     onChange={ev => editProp(ev, index, 'name')}
                     className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-grow">
              <label className="text-gray-300 block mb-1">Добавка цена</label>
              <input type="text" 
                     placeholder="Extra price"
                     value={size.price}
                     onChange={ev => editProp(ev, index, 'price')}
                     className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <button type="button"
                      onClick={() => removeProp(index)}
                      className="bg-[#1e1e1e] text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg border border-gray-700">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addProp}
          className="inline-flex items-center gap-2 bg-[#1e1e1e] text-gray-200 hover:text-primary transition-colors p-2 rounded-lg border border-gray-700">
          <Plus className="w-5 h-5" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}
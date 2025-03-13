export default function AddressInputs({addressProps,setAddressProp,disabled=false}) {
  const {phone, streetAddress, city, notes} = addressProps;
  return (
    <>
      <label>Телефон <span className="text-red-500">*</span></label>
      <input
        disabled={disabled}
        type="tel" placeholder="Телефон"
        value={phone || ''} onChange={ev => setAddressProp('phone', ev.target.value)}
        required={!disabled} />
      <label>Улица <span className="text-red-500">*</span></label>
      <input
        disabled={disabled}
        type="text" placeholder="Улица №, Блок"
        value={streetAddress || ''} onChange={ev => setAddressProp('streetAddress', ev.target.value)}
        required={!disabled}
      />
      <label>Град <span className="text-red-500">*</span></label>
      <input
        disabled={disabled}
        type="text" placeholder="Град/Село"
        value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
        required={!disabled}
      />
      <label>Забележки</label>
      <textarea
        disabled={disabled}
        placeholder="Забележки към поръчките"
        value={notes || ''} 
        onChange={ev => setAddressProp('notes', ev.target.value)}
        className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#3b82f6]"
      />
    </>
  );
}
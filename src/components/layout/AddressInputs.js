export default function AddressInputs({addressProps,setAddressProp,disabled=false}) {
  const {phone, streetAddress, postalCode, city, country} = addressProps;
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Пощенски код</label>
          <input
            disabled={disabled}
            type="text" placeholder="Postal code"
            value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>Град <span className="text-red-500">*</span></label>
          <input
            disabled={disabled}
            type="text" placeholder="Град/Село"
            value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
            required={!disabled}
          />
        </div>
      </div>
      <label>Държава</label>
      <input
        disabled={disabled}
        type="text" placeholder="Държава"
        value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
      />
    </>
  );
}
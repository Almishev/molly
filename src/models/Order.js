import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Object,
  paid: {type: Boolean, default: false},
  bulgarianTime: String,
  deliveryFee: {type: Number, default: 1},
}, {
  timestamps: true,
  timezones: {
    createdAt: 'Europe/Sofia',
    updatedAt: 'Europe/Sofia'
  }
});

OrderSchema.pre('save', function(next) {
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Sofia'
  };
  
  this.bulgarianTime = new Intl.DateTimeFormat('bg-BG', options).format(now);
  next();
});

export const Order = models?.Order || model('Order', OrderSchema);
/**
 * StudyEarn AI — Redemption Model
 * Tracks all reward redemption requests
 */
import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  // Which reward was redeemed
  rewardId:    { type: String, required: true },   // e.g. "tier_2500"
  rewardTitle: { type: String, required: true },   // e.g. "₹10 Paytm Voucher"
  pointsCost:  { type: Number, required: true },   // points deducted

  // Delivery details provided by user
  deliveryInfo: { type: String, default: '' },     // UPI ID / email for gift card

  // Status flow: pending → processing → fulfilled / rejected
  status: {
    type: String,
    enum: ['pending', 'processing', 'fulfilled', 'rejected'],
    default: 'pending',
  },

  // Admin notes (optional)
  adminNote: { type: String, default: '' },

  // When this premium redemption becomes eligible for fraud check processing
  // Set at redeem time: now + 30 mins. Polling job checks this field.
  eligibleAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

redemptionSchema.index({ userId: 1, createdAt: -1 });
redemptionSchema.index({ status: 1 });
redemptionSchema.index({ status: 1, eligibleAt: 1 }); // For polling query

export const Redemption = mongoose.model('Redemption', redemptionSchema);
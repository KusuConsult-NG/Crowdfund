# Payment Methods Documentation

## Overview

CrowdFund supports multiple payment methods through Paystack integration, making it easy for donors to contribute using their preferred payment channel.

---

## Supported Payment Methods

### 1. **Card Payment** 💳
- **Supported Cards:** Visa, Mastercard, Verve
- **Process:** Instant payment confirmation
- **Best for:** Quick one-time donations

**How to use:**
1. Select "Card Payment" in the Paystack popup
2. Enter card details (number, expiry, CVV)
3. Authenticate with PIN/OTP if required
4. Payment confirmed instantly

---

### 2. **Bank Transfer** 🏦
- **Supported Banks:** All Nigerian banks including Access, GTBank, First Bank, UBA, Zenith, etc.
- **Process:** Generate account number and transfer
- **Best for:** Large donations, corporate contributions

**How to use:**
1. Select "Bank Transfer" in the Paystack popup
2. Paystack generates a temporary account number
3. Transfer the amount from your bank app
4. Payment confirmed automatically (usually within minutes)

---

### 3. **Opay** 💰
- **Process:** Direct transfer via Opay wallet
- **Speed:** Instant confirmation
- **Best for:** Opay users, mobile-first donors

**How to use:**
1. Select "Bank Transfer" in the Paystack popup
2. Choose "Opay" from the list of payment options
3. Complete payment in your Opay app
4. Return to CrowdFund for confirmation

> **Note:** Opay appears under the Bank Transfer channel in Paystack. It offers instant transfers with low fees for Opay wallet users.

---

### 4. **USSD** 📱
- **Process:** Dial USSD code from your phone
- **Networks:** Works on all mobile networks
- **Best for:** Donors without internet access

**How to use:**
1. Select "USSD" in the Paystack popup
2. Choose your bank
3. Dial the generated USSD code on your phone
4. Follow prompts to complete payment

**Supported Banks:**
- GTBank: `*737#`
- Access Bank: `*901#`
- UBA: `*919#`
- First Bank: `*894#`
- Zenith: `*966#`
- And more...

---

### 5. **Mobile Money** 📲
- **Supported:** MTN, Airtel, 9mobile wallets
- **Process:** Pay from your mobile wallet
- **Best for:** Mobile wallet users

**How to use:**
1. Select "Mobile Money" in the Paystack popup
2. Choose your network provider
3. Enter your phone number
4. Approve payment in your mobile money app

---

### 6. **QR Code** 📷
- **Process:** Scan QR code with banking app
- **Supported:** Banks with QR payment features
- **Best for:** In-person donations, modern banking app users

**How to use:**
1. Select "QR Code" in the Paystack popup
2. QR code is generated
3. Scan with your bank's mobile app
4. Confirm payment in your app

---

## Payment Security

All payments are processed through **Paystack**, a PCI DSS compliant payment processor. Your payment information is encrypted and secure.

### Security Features:
- ✅ SSL/TLS encryption
- ✅ 3D Secure authentication
- ✅ PCI DSS Level 1 compliance
- ✅ Fraud detection and prevention
- ✅ Secure token storage

---

## Testing Payments (Development)

### Test Card Details
When using test mode (test API keys), use these test cards:

**Successful Payment:**
```
Card Number: 5060 6666 6666 6666 6666
CVV: 123
Expiry: Any future date
PIN: 1234
OTP: 123456
```

**Insufficient Funds:**
```
Card Number: 5060 6666 6666 6666 6610
```

**Failed Transaction:**
```
Card Number: 5060 6666 6666 6666 6620
```

> **Important:** Test cards only work with Paystack test keys. Live payments require real payment methods.

---

## Transaction Flow

1. **Donor selects amount** on pledge page
2. **Clicks "Complete Contribution"** button
3. **Paystack popup opens** with payment options
4. **Donor chooses payment method** (Card, Opay, USSD, etc.)
5. **Completes payment** through selected channel
6. **Payment confirmed** by Paystack
7. **Donation recorded** in CrowdFund database
8. **Email receipt sent** to donor
9. **Project funding updated** automatically
10. **Donor redirected** to their dashboard

---

## Fees & Limits

### Paystack Transaction Fees
- **Local Cards:** 1.5% capped at ₦2,000
- **International Cards:** 3.9% + ₦100
- **Bank Transfer:** ₦50 flat
- **USSD:** ₦50 flat
- **Mobile Money:** 1.5%

> Note: Fees are automatically deducted by Paystack. Donors see the exact amount they're contributing.

### Minimum/Maximum
- **Minimum Donation:** ₦100
- **Maximum per transaction:** ₦5,000,000 (varies by payment method)

---

## Troubleshooting

### Common Issues

**1. Payment popup doesn't open**
- Check if popup blocker is disabled
- Ensure JavaScript is enabled
- Try a different browser

**2. Payment failed but money was debited**
- Don't retry immediately
- Contact support with transaction reference
- Refund processed within 3-5 business days

**3. "Insufficient funds" error**
- Verify account balance
- Check daily transaction limits
- Try alternative payment method

**4. Opay not showing in options**
- Ensure you selected "Bank Transfer"
- Check if Paystack account is verified
- Opay available only for Nigerian transactions

**5. OTP not received**
- Check phone number is correct
- Wait 2-3 minutes
- Request new OTP
- Check SMS/email spam folder

---

## For Developers

### Enabling/Disabling Payment Channels

Edit the `channels` array in `PledgeProject.tsx`:

```typescript
channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
```

To disable a channel, remove it from the array.

### Payment Metadata

Transactions include custom metadata:
- Project ID
- Donor user ID  
- Project name

This helps with reconciliation and analytics.

### Testing Locally

1. Ensure `.env` has test Paystack key:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Navigate to any project and click "Back This Project"

4. Use test card details above

---

## Support

**For payment issues:**
- Email: support@crowdfund.com
- Paystack Support: https://support.paystack.com

**For transaction disputes:**
Include your transaction reference number (shown on success/error page)

---

**Last Updated:** December 24, 2025

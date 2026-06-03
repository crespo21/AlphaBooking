import React, { useState } from 'react';
import { CreditCardIcon, LockIcon, ShieldCheckIcon } from 'lucide-react';

type Errors = { cardNumber?: string; expiryDate?: string; cvv?: string; nameOnCard?: string };

export const PaymentForm: React.FC = () => {
  const [cardNumber,  setCardNumber]  = useState('');
  const [expiryDate,  setExpiryDate]  = useState('');
  const [cvv,         setCvv]         = useState('');
  const [nameOnCard,  setNameOnCard]  = useState('');
  const [errors,      setErrors]      = useState<Errors>({});

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits    = e.target.value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    setCardNumber(formatted);
    setErrors((p) => ({ ...p, cardNumber: undefined }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    setExpiryDate(v);
    setErrors((p) => ({ ...p, expiryDate: undefined }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
    setErrors((p) => ({ ...p, cvv: undefined }));
  };

  const validate = (field: keyof Errors) => {
    const newErrors = { ...errors };
    if (field === 'cardNumber' && !/^\d{16}$/.test(cardNumber.replace(/\s/g, '')))
      newErrors.cardNumber = 'Please enter a valid 16-digit card number.';
    if (field === 'expiryDate' && !/^\d{2}\/\d{2}$/.test(expiryDate))
      newErrors.expiryDate = 'Format: MM/YY';
    if (field === 'cvv' && !/^\d{3,4}$/.test(cvv))
      newErrors.cvv = '3 or 4 digit CVV required.';
    if (field === 'nameOnCard' && !nameOnCard.trim())
      newErrors.nameOnCard = 'Name on card is required.';
    setErrors(newErrors);
  };

  /* Card type detection */
  const getCardType = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num))  return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num))  return 'Amex';
    return null;
  };
  const cardType = getCardType();

  const inputBase = (err?: string) =>
    `input-venus ${err ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : ''}`;

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Payment Information</h2>
      <p className="text-sm text-gray-500 mb-6">Your card details are encrypted and never stored.</p>

      {/* Security badge */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-green-700">
        <ShieldCheckIcon className="w-4 h-4 text-green-500 shrink-0" />
        256-bit SSL encrypted · PCI DSS compliant
      </div>

      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <LockIcon className="w-4 h-4 text-venus-500" />
            Secure Payment
          </div>
          <div className="flex gap-2">
            {['Visa', 'MC', 'Amex'].map((brand) => (
              <div
                key={brand}
                className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${
                  cardType === brand || (cardType === 'Mastercard' && brand === 'MC')
                    ? 'bg-venus-100 border-venus-400 text-venus-700'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Card number */}
        <div>
          <label className="label-venus">Card Number</label>
          <div className="relative">
            <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardNumberChange}
              onBlur={() => validate('cardNumber')}
              placeholder="1234 5678 9012 3456"
              className={`${inputBase(errors.cardNumber)} pl-11`}
            />
          </div>
          {errors.cardNumber && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.cardNumber}</p>}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-venus">Expiry Date</label>
            <input
              type="text"
              inputMode="numeric"
              value={expiryDate}
              onChange={handleExpiryChange}
              onBlur={() => validate('expiryDate')}
              placeholder="MM/YY"
              className={inputBase(errors.expiryDate)}
            />
            {errors.expiryDate && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.expiryDate}</p>}
          </div>
          <div>
            <label className="label-venus">CVV</label>
            <input
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={handleCvvChange}
              onBlur={() => validate('cvv')}
              placeholder="123"
              className={inputBase(errors.cvv)}
            />
            {errors.cvv && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.cvv}</p>}
          </div>
        </div>

        {/* Name on card */}
        <div>
          <label className="label-venus">Name on Card</label>
          <input
            type="text"
            autoComplete="cc-name"
            value={nameOnCard}
            onChange={(e) => { setNameOnCard(e.target.value); setErrors((p) => ({ ...p, nameOnCard: undefined })); }}
            onBlur={() => validate('nameOnCard')}
            placeholder="Jane Smith"
            className={inputBase(errors.nameOnCard)}
          />
          {errors.nameOnCard && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.nameOnCard}</p>}
        </div>
      </div>
    </div>
  );
};

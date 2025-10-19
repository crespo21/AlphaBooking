import React, { useState } from 'react';
export const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const validateCardNumber = (number: string): boolean => {
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };
  const validateExpiryDate = (date: string): boolean => {
    return /^\d{2}\/\d{2}$/.test(date);
  };
  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    setCardNumber(formattedValue);
    if (errors.cardNumber) {
      setErrors({
        ...errors,
        cardNumber: ''
      });
    }
  };
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
    if (errors.expiryDate) {
      setErrors({
        ...errors,
        expiryDate: ''
      });
    }
  };
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
    if (errors.cvv) {
      setErrors({
        ...errors,
        cvv: ''
      });
    }
  };
  const handleBlur = (field: string) => {
    const newErrors = {
      ...errors
    };
    switch (field) {
      case 'cardNumber':
        if (!validateCardNumber(cardNumber)) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        break;
      case 'expiryDate':
        if (!validateExpiryDate(expiryDate)) {
          newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }
        break;
      case 'cvv':
        if (!validateCVV(cvv)) {
          newErrors.cvv = 'Please enter a valid CVV code';
        }
        break;
      case 'nameOnCard':
        if (!nameOnCard) {
          newErrors.nameOnCard = 'Please enter the name on card';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };
  return <div className="w-full mt-6">
      <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">Secure Payment</p>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-blue-100 rounded"></div>
            <div className="w-8 h-5 bg-red-100 rounded"></div>
            <div className="w-8 h-5 bg-yellow-100 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input type="text" id="cardNumber" value={cardNumber} onChange={handleCardNumberChange} onBlur={() => handleBlur('cardNumber')} className="w-full p-2 border border-gray-300 rounded-md" placeholder="1234 5678 9012 3456" />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input type="text" id="expiryDate" value={expiryDate} onChange={handleExpiryDateChange} onBlur={() => handleBlur('expiryDate')} className="w-full p-2 border border-gray-300 rounded-md" placeholder="MM/YY" />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input type="text" id="cvv" value={cvv} onChange={handleCvvChange} onBlur={() => handleBlur('cvv')} className="w-full p-2 border border-gray-300 rounded-md" placeholder="123" />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input type="text" id="nameOnCard" value={nameOnCard} onChange={e => {
            setNameOnCard(e.target.value);
            if (errors.nameOnCard) {
              setErrors({
                ...errors,
                nameOnCard: ''
              });
            }
          }} onBlur={() => handleBlur('nameOnCard')} className="w-full p-2 border border-gray-300 rounded-md" />
            {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
          </div>
        </div>
      </div>
    </div>;
};
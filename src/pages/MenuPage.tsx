import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { X, Upload, Camera, Check, Banknote, Smartphone } from 'lucide-react';
import { OrderItem } from '../types';
import { useMenuTheme } from '../hooks/useMenuTheme';

interface PaymentModalProps {
  items: OrderItem[];
  totalAmount: number;
  tableNumber: string;
  onClose: () => void;
  onPaymentSubmit: (paymentData: { screenshotUrl: string; method: string }) => void | Promise<void>;
}

export const MenuPage: React.FC<PaymentModalProps> = ({
  items,
  totalAmount,
  tableNumber,
  onClose,
  onPaymentSubmit,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const { theme, colors, loading: themeLoading } = useMenuTheme(userId || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mobile_money'>('bank_transfer');
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (themeLoading || !colors) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getModalStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          modal: 'bg-white rounded-3xl shadow-2xl',
          button: 'rounded-xl font-semibold'
        };
      case 'elegant':
        return {
          modal: 'bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl border border-amber-100',
          button: 'rounded-lg font-serif font-semibold'
        };
      case 'minimal':
        return {
          modal: 'bg-white rounded-lg shadow-lg border',
          button: 'rounded font-medium'
        };
      default:
        return {
          modal: 'bg-white rounded-2xl shadow-xl',
          button: 'rounded-lg font-semibold'
        };
    }
  };

  const styles = getModalStyles();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      // Upload screenshot to ImgBB
      const { imgbbService } = await import('../services/imgbb');
      const screenshotUrl = await imgbbService.uploadImage(selectedFile, `payment_${Date.now()}`);

      await onPaymentSubmit({ screenshotUrl, method: paymentMethod });
      onClose();
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${styles.modal} w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up flex flex-col`}>
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            Payment Confirmation
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Order Summary */}
          <div 
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: colors.surface }}
          >
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              Order Summary - Table {tableNumber}
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div 
                  key={`${item.id}-${item.quantity}`} 
                  className="flex justify-between"
                  style={{ color: colors.textSecondary }}
                >
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div 
              className="border-t mt-3 pt-2 flex justify-between font-bold"
              style={{ borderColor: colors.border }}
            >
              <span>Total:</span>
              <span style={{ color: colors.primary }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 text-sm rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Bank Transfer
              </button>
              <button
                onClick={() => setPaymentMethod('mobile_money')}
                className={`p-3 text-sm rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  paymentMethod === 'mobile_money'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile Money
              </button>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Payment Proof</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Payment proof upload"
            />

            {!preview ? (
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Click to upload payment proof</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Payment proof screenshot"
                  className="w-full h-40 object-contain rounded-lg border bg-gray-50"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg transition-all shadow-sm"
                  aria-label="Change payment proof"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <h4 className="font-semibold text-blue-900 mb-1">Payment Instructions:</h4>
            {paymentMethod === 'bank_transfer' ? (
              <div className="space-y-1">
                <p><span className="inline-block min-w-[6em]">Account:</span> 123-456-789 (Example Bank)</p>
                <p><span className="inline-block min-w-[6em]">Reference:</span> Table {tableNumber}</p>
                <p><span className="inline-block min-w-[6em]">Amount:</span> ${totalAmount.toFixed(2)}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p><span className="inline-block min-w-[6em]">Number:</span> +251-912-345-678</p>
                <p><span className="inline-block min-w-[6em]">Service:</span> Telebirr / M-Birr</p>
                <p><span className="inline-block min-w-[6em]">Reference:</span> Table {tableNumber}</p>
                <p><span className="inline-block min-w-[6em]">Amount:</span> ${totalAmount.toFixed(2)}</p>
              </div>
            )}
            <p className="mt-2 text-blue-700 font-medium">• Upload proof after payment</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
import { useState, useMemo } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { storage, STORAGE_KEYS, Payment, User } from '../../lib/storage';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess?: (newPayments: Payment[]) => void;
}

const FEES = [
  { name: 'Standard Scholarship', amount: 1500, type: 'Scholarship' },
  { name: 'Sports Fee (Yearly)', amount: 100, type: 'Sports Fee' },
  { name: 'Library Fee (Yearly)', amount: 5, type: 'Library Fee' },
  { name: 'Lab Fees (Yearly)', amount: 300, type: 'Lab Fee' },
];

export function PaymentForm({ isOpen, onClose, currentUser, onSuccess }: PaymentFormProps) {
  const [installments, setInstallments] = useState<number>(1);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const totalAmount = useMemo(() => FEES.reduce((sum, fee) => sum + fee.amount, 0), []);
  const monthlyPayment = useMemo(() => totalAmount / installments, [totalAmount, installments]);

  const paymentSchedule = useMemo(() => {
    const schedule = [];
    const today = new Date();
    for (let i = 0; i < installments; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      schedule.push({
        installment: i + 1,
        amount: monthlyPayment,
        date: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })
      });
    }
    return schedule;
  }, [installments, monthlyPayment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return;
    }

    if (!currentUser) {
      toast.error('User not found');
      return;
    }

    const transactionId = `TX-${Date.now()}`;

    // Save payments to storage
    const currentPayments = storage.get<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const newPaymentsToAdd: Payment[] = [];

    FEES.forEach(fee => {
      const installmentAmount = fee.amount / installments;
      for (let i = 0; i < installments; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        
        const newPayment: Payment = {
          id: Date.now() + Math.random(),
          studentId: currentUser.studentId || String(currentUser.id),
          studentName: currentUser.name,
          description: installments > 1 
            ? `${fee.name} (Installment ${i + 1}/${installments})`
            : fee.name,
          amount: installmentAmount,
          date: date.toISOString().split('T')[0],
          status: i === 0 ? 'paid' : 'pending',
          installments: installments,
          type: fee.type as any,
          totalInstallments: installments,
          remainingInstallments: installments - (i + 1),
          cardNumber: `**** **** **** ${cardDetails.number.slice(-4)}`,
          transactionId: `${transactionId}-${i}` // Grouping by transaction and month index
        };
        newPaymentsToAdd.push(newPayment);
      }
    });

    const updatedPayments = [...currentPayments, ...newPaymentsToAdd];
    storage.set(STORAGE_KEYS.PAYMENTS, updatedPayments);

    if (onSuccess) {
      onSuccess(updatedPayments);
    }

    toast.success('Payment processed successfully!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="University Fees Payment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fee Summary */}
          <div className="space-y-4">
            <h4 className="text-gray-900 font-medium">Fee Breakdown</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {FEES.map((fee, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{fee.name}</span>
                  <span className="text-gray-900 font-medium">BAM {fee.amount}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total Amount</span>
                <span>BAM {totalAmount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Installments (Monthly)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500">Choose between 1 to 12 monthly payments.</p>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <h4 className="text-gray-900 font-medium">Card Details</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        {installments > 1 && (
          <div className="mt-6">
            <h4 className="text-gray-900 font-medium mb-3">Payment Schedule</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentSchedule.map((item) => (
                    <tr key={item.installment}>
                      <td className="px-4 py-2 text-gray-600">{item.installment}</td>
                      <td className="px-4 py-2 text-gray-900">{item.date}</td>
                      <td className="px-4 py-2 text-gray-900 font-medium">BAM {item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Pay BAM {totalAmount.toFixed(2)}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

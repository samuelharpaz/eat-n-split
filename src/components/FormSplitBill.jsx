import { useState } from 'react';
import Button from './Button';

export default function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [userExpense, setUserExpense] = useState('');
  const [payer, setPayer] = useState('user');

  const friendExpense = bill ? bill - userExpense : '';

  const handleSetBill = function (e) {
    const billVal = +e.target.value;

    setBill(billVal);

    if (billVal < userExpense) {
      setUserExpense(billVal);
    }
  };

  const handleSubmitSplitBill = function (e) {
    e.preventDefault();

    if (!bill) return;

    const balanceChange = payer === 'user' ? friendExpense : -userExpense;

    onSplitBill(balanceChange);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmitSplitBill}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={handleSetBill} />

      <label>🕴 Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={e => setUserExpense(+e.target.value > bill ? userExpense : +e.target.value)}
      />

      <label>👬 {selectedFriend.name}'s expense</label>
      <input type="text" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill?</label>
      <select value={payer} onChange={e => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

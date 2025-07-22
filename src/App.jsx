import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0
  }
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleToggleAddFriend = function () {
    setShowAddFriend(show => !show);
    setSelectedFriend(null);
  };

  const handleAddFriend = function (newFriend) {
    setFriends(friends => [...friends, newFriend]);
  };

  const handleSelection = function (friend) {
    setSelectedFriend(cur => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = function (value) {
    setFriends(friends =>
      friends.map(friend => {
        return friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend;
      })
    );

    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelection={handleSelection} selectedFriend={selectedFriend} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleToggleAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend key={friend.id} friend={friend} onSelection={onSelection} selectedFriend={selectedFriend} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : undefined}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmitAddFriend = function (e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0
    };

    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmitAddFriend}>
      <label>👬 Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>🖼 Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
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

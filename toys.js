import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';
import { useCart } from './components/CartContext'; // Assuming useCart hook is provided by CartContext
import Navbar from './components/Navbar'; // Importing Navbar component
import './categories.css';
import CartMessage from './CartMessage';

export default function Toys() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart(); // Assuming addToCart function is provided by CartContext
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const toysRef = ref(database, 'items/toys');
        const toysSnapshot = await get(toysRef);

        const toysItems = toysSnapshot.exists() ? Object.entries(toysSnapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        })) : [];
        
        setItems(toysItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);
  const handleAddToCart = (item) => {
    addToCart(item);
    setMessage(`${item.product_name} added to cart`);
    setShowMessage(true);
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      <main className="container">
        <div className="grid">
          {items.map((item) => (
            <div key={item.id} className="card">
              <img src={item.img_url} alt={item.product_name} className="image" />
              <h2 className="product-name">{item.product_name}</h2>
              <p className="price">₹{item.price}</p>
              <p className="description">{item.description}</p>
              <button className="go-to-cart-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <CartMessage message={message} showMessage={showMessage} setShowMessage={setShowMessage} />
      </main>
    </div>
  );
}

import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';
import { useCart } from './components/CartContext';  // Import useCart context
import './categories.css';
import Navbar from './components/Navbar';
import CartMessage from './CartMessage';

export default function Clothes() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();  
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const clothesRef = ref(database, 'items/clothing');
        const clothesSnapshot = await get(clothesRef);

        const clothesItems = clothesSnapshot.exists() ? Object.entries(clothesSnapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        })) : [];
        
        setItems(clothesItems);
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
      <Navbar />
      <main className="container">
        <div className="grid">
          {items.map((item) => (
            <div key={item.id} className="card">
              <img src={item.img_url} alt={item.product_name} className="image" />
              <h2 className="product-name">{item.product_name}</h2>
              <p className="price">₹{item.price}</p>
              <p className="description">{item.description}</p>
              <button className="go-to-cart-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>  {/* Add onClick to add item to cart */}
            </div>
          ))}
        </div>
        <CartMessage message={message} showMessage={showMessage} setShowMessage={setShowMessage} />
      </main>
    </div>
  );
}
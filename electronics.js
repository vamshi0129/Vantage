import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';
import { useCart } from './components/CartContext';  // Import useCart context
import './categories.css';
import Navbar from './components/Navbar'; // Import Navbar component
import CartMessage from './CartMessage';


export default function Electronics() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();  // Destructure addToCart from useCar
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const electronicsRef = ref(database, 'items/electronics');
        const electronicsSnapshot = await get(electronicsRef);

        const electronicsItems = electronicsSnapshot.exists() ? Object.entries(electronicsSnapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        })) : [];
        
        setItems(electronicsItems);
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
      <Navbar /> {/* Render the Navbar component */}
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
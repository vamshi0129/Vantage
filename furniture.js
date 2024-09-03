import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';
import { useCart } from './components/CartContext'; // Import useCart context
import Navbar from './components/Navbar'; // Import Navbar component
import './categories.css';
import CartMessage from './CartMessage';

export default function Furniture() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart(); // Destructure addToCart from useCar
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const furnitureRef = ref(database, 'items/furniture');
        const furnitureSnapshot = await get(furnitureRef);

        const furnitureItems = furnitureSnapshot.exists()
          ? Object.entries(furnitureSnapshot.val()).map(([id, data]) => ({
              id,
              ...data,
            }))
          : [];
        
        setItems(furnitureItems);
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
      <header>
        
      </header>
      <main className="container">
        <div className="grid">
          {items.map((item) => (
            <div key={item.id} className="card">
              <img src={item.img_url} alt={item.product_name} className="image" />
              <h2 className="product-name">{item.product_name}</h2>
              <p className="price">₹{item.price.toFixed(2)}</p>
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
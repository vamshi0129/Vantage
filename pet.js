import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';
import { useCart } from './components/CartContext'; // Import useCart context
import Navbar from './components/Navbar'; // Import Navbar component
import './categories.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import CartMessage from './CartMessage';

export default function Pet() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart(); // Destructure addToCart from useCart
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const petcareRef = ref(database, 'items/pet');
        const petcareSnapshot = await get(petcareRef);

        const petcareItems = petcareSnapshot.exists()
          ? Object.entries(petcareSnapshot.val()).map(([id, data]) => ({
              id,
              ...data,
            }))
          : [];
        
        setItems(petcareItems);
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

  // Function to navigate to the cart page
  const goToCart = () => {
    navigate('/cart'); // Replace with your actual cart page route
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
              <button className="go-to-cart-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <CartMessage message={message} showMessage={showMessage} setShowMessage={setShowMessage} />
      </main>
    </div>
  );
}
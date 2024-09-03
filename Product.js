import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './components/firebaseConfig';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const categories = [
          'furniture',
          'clothing',
          'beauty',
          'electronics',
          'footwear',
          'health',
          'pet',
          'toy'
        ];
        
        const promises = categories.map(category => {
          const categoryRef = ref(database, `items/${category}`);
          return get(categoryRef);
        });

        const snapshots = await Promise.all(promises);

        const allItems = snapshots.flatMap((snapshot, index) => {
          if (snapshot.exists()) {
            return Object.entries(snapshot.val()).map(([id, data]) => ({
              id,
              category: categories[index],
              ...data,
            }));
          }
          return [];
        });

        setItems(allItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-10">Fetch data from db</h1>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-100 p-4 rounded-lg">
            <img src={item.img_url} alt={item.product_name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-2xl text-gray-900 mb-2">{item.product_name}</h2>
            <p className="text-gray-600 mb-2">${item.price}</p>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-gray-600 italic">{item.category}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

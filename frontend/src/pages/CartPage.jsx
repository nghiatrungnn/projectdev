import { useEffect, useState, useContext } from 'react';
import '../css/CartPage.css';
import { FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 1 ? newQty : 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.warning('⚠️ Vui lòng đăng nhập để thanh toán!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h1>Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <p>Không có sản phẩm nào trong giỏ hàng.</p>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Hãng: {item.brand}</p>
                  <p className="price">Giá: {Number(item.price).toLocaleString()} VND</p>
                  <div className="cart-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      title="Xoá sản phẩm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <h2>Tổng cộng: {totalPrice.toLocaleString()} VND</h2>
              <button onClick={handleCheckout}>Thanh toán</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default CartPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import '../css/CheckoutPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../services/axios';

const provinces = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
  "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
  "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên",
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An",
  "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc",
  "Yên Bái"
];

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    address: "",
    note: "",
    payment: "cod"
  });

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate(); // Thêm dòng này

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    setTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token'); // 👈 LẤY TOKEN Ở ĐÂY
  if (!token) {
    alert("❌ Vui lòng đăng nhập để đặt hàng!");
    return;
  }

  try {
    const orderData = {
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      })),
      total,
      ...form // 👈 thêm các trường name, email, phone, address, v.v.
    };

    await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    alert("🎉 Đặt hàng thành công!");
    localStorage.removeItem('cart');
    setCart([]);
    navigate('/');
  } catch (err) {
    console.error("Lỗi đặt hàng:", err?.response?.data || err.message);
    alert("❌ Đặt hàng thất bại!");
  }
};


  return (
    <div>
      <Navbar />
      <div className="checkout-page">
        <h2>Thông tin thanh toán</h2>

        {/* Hiển thị sản phẩm trong giỏ hàng */}
        <div style={{marginBottom: 24, background: "#f7f7fa", borderRadius: 8, padding: 16}}>
          <h3 style={{margin: 0, marginBottom: 12, fontSize: "1.08rem"}}>Sản phẩm trong đơn hàng</h3>
          {cart.length === 0 ? (
            <p>Không có sản phẩm nào trong giỏ hàng.</p>
          ) : (
            <ul style={{listStyle: "none", padding: 0, margin: 0}}>
              {cart.map(item => (
                <li key={item._id} style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 10}}>
                  <img src={item.image} alt={item.name} style={{width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e0e0e0"}} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 500}}>{item.name}</div>
                    <div style={{fontSize: "0.95rem", color: "#555"}}>x{item.quantity}</div>
                  </div>
                  <div style={{fontWeight: 600, color: "#2d6a4f"}}>
                    {(item.price * item.quantity).toLocaleString()} VND
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Tổng tiền */}
          <div style={{borderTop: "1px solid #e0e0e0", marginTop: 12, paddingTop: 10, textAlign: "right"}}>
            <div style={{fontSize: "1rem", marginBottom: 4}}>Tổng tạm tính: <b>{total.toLocaleString()} VND</b></div>
            <div style={{fontSize: "1.08rem", fontWeight: 600, color: "#1976d2"}}>Thành tiền: {total.toLocaleString()} VND</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} required />
          <select name="province" value={form.province} onChange={handleChange} required>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} required />
          <textarea name="note" placeholder="Ghi chú (tuỳ chọn)" value={form.note} onChange={handleChange} rows={3} />
          <div style={{display: "flex", gap: 24, margin: "8px 0"}}>
            <label>
              <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={handleChange} />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input type="radio" name="payment" value="bank" checked={form.payment === "bank"} onChange={handleChange} />
              Chuyển khoản
            </label>
          </div>
          <button type="submit">Đặt hàng</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
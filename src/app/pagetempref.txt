  // =============================================
  // 4. src/app/page.jsx (HOÀN CHỈNH 100% giống HTML cũ)
  // =============================================
  "use client";
  import { useEffect, useState } from "react";
  import Header from "../components/Header";
  import Footer from "../components/Footer";
  import Link from "next/link";
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/navigation';
  import 'swiper/css/effect-fade';

  export default function Home() {
    const [toast, setToast] = useState({ message: "", type: "", visible: false });
    const [contactData, setContactData] = useState({ name: "", email: "", phone: "", message: "" });
    const [newsletterEmail, setNewsletterEmail] = useState("");

    const showToast = (message, type = 'success') => {
      setToast({ message, type, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    // Counter animation
    useEffect(() => {
      const counters = document.querySelectorAll('.counter');
      const speed = 200;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const increment = target / speed;
            const updateCount = () => {
              if (count < target) {
                count = Math.ceil(count + increment);
                counter.innerText = count;
                setTimeout(updateCount, 20);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
      return () => observer.disconnect();
    }, []);

    const handleContactSubmit = (e) => {
      e.preventDefault();
      showToast(`Cảm ơn ${contactData.name}! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.`, 'success');
      setContactData({ name: "", email: "", phone: "", message: "" });
    };

    const handleNewsletterSubmit = () => {
      if (newsletterEmail && newsletterEmail.includes('@')) {
        showToast('Đăng ký thành công! Cảm ơn bạn.', 'success');
        setNewsletterEmail("");
      } else {
        showToast('Vui lòng nhập email hợp lệ', 'error');
      }
    };

    return (
      <>
        <Header />

        <main>
          {/* HERO SECTION - SLIDER */}
          <section className="relative h-screen min-h-[600px] overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              className="absolute inset-0 h-full w-full"
            >
              <SwiperSlide>
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600')"}}></div>
                <div className="hero-overlay absolute inset-0"></div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1600')"}}></div>
                <div className="hero-overlay absolute inset-0"></div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1600')"}}></div>
                <div className="hero-overlay absolute inset-0"></div>
              </SwiperSlide>
            </Swiper>

            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white pointer-events-none">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">Chào mừng đến LORTEL</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-slide-up opacity-90">Trải nghiệm nghỉ dưỡng đẳng cấp giữa thiên nhiên hùng vĩ</p>
              <div className="flex gap-4 animate-slide-up pointer-events-auto">
                <a href="#rooms" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
                  <i className="fas fa-calendar-check"></i>Đặt phòng ngay
                </a>
                <a href="#about" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                  <i className="fas fa-info-circle mr-2"></i>Tìm hiểu thêm
                </a>
              </div>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Về LORTEL Resort</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Nơi thiên nhiên gặp gỡ sự sang trọng</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <img src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Resort view" className="rounded-2xl shadow-xl w-full" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Thiên đường nghỉ dưỡng giữa lòng thiên nhiên</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">Tọa lạc tại vị trí đắc địa với view biển và rừng núi hùng vĩ, LORTEL Resort mang đến không gian nghỉ dưỡng lý tưởng cho những ai tìm kiếm sự bình yên và sang trọng.</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">Với kiến trúc độc đáo kết hợp hài hòa giữa phong cách hiện đại và văn hóa bản địa, mỗi góc tại LORTEL đều là một tác phẩm nghệ thuật.</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-600"></i><span>150+ phòng nghỉ cao cấp</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-600"></i><span>Nhà hàng 5 sao</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-600"></i><span>Hồ bơi vô cực</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-600"></i><span>Spa & Wellness</span></div>
                  </div>
                  <a href="#rooms" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
                    Khám phá ngay <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* STATS SECTION */}
          <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="150">0</div>
                  <p className="text-sm opacity-90">Phòng nghỉ cao cấp</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000">0</div>
                  <p className="text-sm opacity-90">Khách hàng hài lòng</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="25">0</div>
                  <p className="text-sm opacity-90">Năm kinh nghiệm</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="98">0</div>
                  <p className="text-sm opacity-90">% Đánh giá tích cực</p>
                </div>
              </div>
            </div>
          </section>

          {/* ROOM TYPES SECTION */}
          <section id="rooms" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Loại phòng nổi bật</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Trải nghiệm không gian nghỉ dưỡng đẳng cấp với các loại phòng đa dạng</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Room 1 */}
                <div className="room-card bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-56 overflow-hidden">
                    <img src="https://picsum.photos/id/164/400/300" className="w-full h-full object-cover hover:scale-110 transition duration-500" alt="Deluxe Forest View" />
                    <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">Phổ biến</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Deluxe Forest View</h3>
                    <p className="text-gray-500 text-sm mb-3">View rừng thông • 35m² • 2 người</p>
                    <div className="flex items-center gap-1 mb-3">
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star-half-alt text-yellow-400"></i>
                      <span className="text-sm text-gray-500 ml-1">(128 đánh giá)</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Phòng rộng rãi với ban công nhìn ra khu rừng thông, đầy đủ tiện nghi cao cấp.</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-emerald-600">1.200.000đ</span>
                      <span className="text-gray-400 text-sm">/đêm</span>
                    </div>
                    <Link href="/booking" className="mt-4 block text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">Đặt ngay</Link>
                  </div>
                </div>

                {/* Room 2 */}
                <div className="room-card bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-56 overflow-hidden">
                    <img src="https://picsum.photos/id/20/400/300" className="w-full h-full object-cover hover:scale-110 transition duration-500" alt="Deluxe Ocean View" />
                    <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">Best Seller</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Deluxe Ocean View</h3>
                    <p className="text-gray-500 text-sm mb-3">View biển • 38m² • 2 người</p>
                    <div className="flex items-center gap-1 mb-3">
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <span className="text-sm text-gray-500 ml-1">(95 đánh giá)</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">View biển tuyệt đẹp từ ban công, giường king size và bồn tắm massage.</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-emerald-600">1.500.000đ</span>
                      <span className="text-gray-400 text-sm">/đêm</span>
                    </div>
                    <Link href="/booking" className="mt-4 block text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">Đặt ngay</Link>
                  </div>
                </div>

                {/* Room 3 */}
                <div className="room-card bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-56 overflow-hidden">
                    <img src="https://picsum.photos/id/29/400/300" className="w-full h-full object-cover hover:scale-110 transition duration-500" alt="Suite Premium" />
                    <span className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Premium</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Suite Premium</h3>
                    <p className="text-gray-500 text-sm mb-3">View toàn cảnh • 52m² • 4 người</p>
                    <div className="flex items-center gap-1 mb-3">
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <span className="text-sm text-gray-500 ml-1">(67 đánh giá)</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Suite cao cấp với phòng khách riêng, bồn tắm ngoài trời, view resort.</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-emerald-600">2.200.000đ</span>
                      <span className="text-gray-400 text-sm">/đêm</span>
                    </div>
                    <Link href="/booking" className="mt-4 block text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">Đặt ngay</Link>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link href="/booking" className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition">
                  Xem tất cả phòng <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </section>

          {/* PROMOTIONS SECTION */}
          <section id="promotions" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">🎉 Khuyến mãi hấp dẫn</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Ưu đãi đặc biệt dành cho khách hàng của LORTEL</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="promo-card bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
                  <i className="fas fa-gift text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Giảm 30%</h3>
                  <p className="mb-2">Cho tất cả phòng Deluxe</p>
                  <p className="text-sm opacity-90">Áp dụng đến 30/04/2024</p>
                  <div className="mt-4 bg-white/20 rounded-lg px-4 py-2 inline-block">
                    <span className="font-mono">SUMMER30</span>
                  </div>
                </div>
                <div className="promo-card bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                  <i className="fas fa-calendar-week text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Đặt 3 tặng 1</h3>
                  <p className="mb-2">Đặt 3 đêm tặng 1 đêm miễn phí</p>
                  <p className="text-sm opacity-90">Dịp lễ 30/4 - 1/5</p>
                  <div className="mt-4 bg-white/20 rounded-lg px-4 py-2 inline-block">
                    <span className="font-mono">STAY4FREE</span>
                  </div>
                </div>
                <div className="promo-card bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
                  <i className="fas fa-users text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Ưu đãi nhóm</h3>
                  <p className="mb-2">Đặt từ 3 phòng trở lên giảm 15%</p>
                  <p className="text-sm opacity-90">Áp dụng quanh năm</p>
                  <div className="mt-4 bg-white/20 rounded-lg px-4 py-2 inline-block">
                    <span className="font-mono">GROUP15</span>
                  </div>
                </div>
              </div>

              {/* VIP Box */}
              <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">🎁 Ưu đãi thành viên VIP</h3>
                    <p className="text-gray-600">Đăng nhập để nhận thêm nhiều ưu đãi độc quyền</p>
                  </div>
                  <Link href="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    Đăng nhập ngay
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES SECTION */}
          <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Dịch vụ & Tiện ích</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Trải nghiệm đẳng cấp với các dịch vụ cao cấp</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="service-card text-center p-6 border rounded-2xl hover:border-emerald-600 bg-white">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-utensils text-3xl text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nhà hàng 5 sao</h3>
                  <p className="text-gray-500 text-sm">Ẩm thực đa dạng với các món Á - Âu tinh tế</p>
                </div>
                <div className="service-card text-center p-6 border rounded-2xl hover:border-emerald-600 bg-white">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-spa text-3xl text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Spa & Wellness</h3>
                  <p className="text-gray-500 text-sm">Liệu pháp thư giãn đẳng cấp, chăm sóc sức khỏe</p>
                </div>
                <div className="service-card text-center p-6 border rounded-2xl hover:border-emerald-600 bg-white">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-swimming-pool text-3xl text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hồ bơi vô cực</h3>
                  <p className="text-gray-500 text-sm">Hồ bơi vô cực với view biển tuyệt đẹp</p>
                </div>
                <div className="service-card text-center p-6 border rounded-2xl hover:border-emerald-600 bg-white">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-dumbbell text-3xl text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fitness Center</h3>
                  <p className="text-gray-500 text-sm">Phòng gym hiện đại với thiết bị cao cấp</p>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="testimonial-card bg-gray-50 p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-1 mb-4">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <p className="text-gray-600 italic mb-4">"Trải nghiệm tuyệt vời! Phòng đẹp, view biển cực kỳ ấn tượng. Nhân viên thân thiện, nhiệt tình. Nhất định sẽ quay lại!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-emerald-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Nguyễn Văn A</h4>
                      <p className="text-xs text-gray-400">Đã ở 3 đêm</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card bg-gray-50 p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-1 mb-4">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <p className="text-gray-600 italic mb-4">"Không gian resort rất đẹp, yên tĩnh. Ẩm thực phong phú, đặc biệt là buffet sáng. Spa thư giãn tuyệt vời!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-emerald-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Trần Thị B</h4>
                      <p className="text-xs text-gray-400">Kỳ nghỉ gia đình</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card bg-gray-50 p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-1 mb-4">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <p className="text-gray-600 italic mb-4">"Dịch vụ chuyên nghiệp, phòng sạch sẽ, view rừng thông rất thơ mộng. Sẽ giới thiệu bạn bè đến đây."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-emerald-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Lê Văn C</h4>
                      <p className="text-xs text-gray-400">Du lịch cùng bạn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">📞 Liên hệ & Hỗ trợ</h2>
                <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">Gửi yêu cầu hỗ trợ</h3>
                    <form onSubmit={handleContactSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                        <input type="text" required value={contactData.name} onChange={e => setContactData({ ...contactData, name: e.target.value })} className="contact-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" required value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} className="contact-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input type="tel" value={contactData.phone} onChange={e => setContactData({ ...contactData, phone: e.target.value })} className="contact-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                        <textarea rows="4" required value={contactData.message} onChange={e => setContactData({ ...contactData, message: e.target.value })} className="contact-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">Gửi yêu cầu</button>
                    </form>
                  </div>
                </div>

                {/* Thông tin liên hệ */}
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-map-marker-alt text-emerald-600 text-xl mt-1"></i>
                        <div>
                          <p className="font-semibold">Địa chỉ</p>
                          <p className="text-gray-600">123 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <i className="fas fa-phone text-emerald-600 text-xl mt-1"></i>
                        <div>
                          <p className="font-semibold">Điện thoại</p>
                          <p className="text-gray-600">1900 1234 (24/7)</p>
                          <p className="text-gray-600">028 1234 5678</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <i className="fas fa-envelope text-emerald-600 text-xl mt-1"></i>
                        <div>
                          <p className="font-semibold">Email</p>
                          <p className="text-gray-600">info@lortel.com</p>
                          <p className="text-gray-600">support@lortel.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <i className="fas fa-clock text-emerald-600 text-xl mt-1"></i>
                        <div>
                          <p className="font-semibold">Giờ làm việc</p>
                          <p className="text-gray-600">Lễ tân: 24/7</p>
                          <p className="text-gray-600">Văn phòng: 8:00 - 22:00</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-semibold mb-3">Kết nối với chúng tôi</h4>
                      <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><i className="fab fa-tiktok"></i></a>
                        <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><i className="fab fa-youtube"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NEWSLETTER SECTION */}
          <section className="py-16 bg-emerald-600">
            <div className="container mx-auto px-4 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Nhận ưu đãi đặc biệt</h2>
              <p className="mb-6 opacity-90">Đăng ký nhận bản tin để nhận thông tin khuyến mãi mới nhất</p>
              <div className="max-w-md mx-auto flex gap-2">
                <input type="email" placeholder="Email của bạn" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none" />
                <button onClick={handleNewsletterSubmit} className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Đăng ký</button>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* TOAST */}
        {toast.visible && (
          <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-[1000] animate-slide-in ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
            {toast.message}
          </div>
        )}
      </>
    );
  }
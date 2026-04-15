// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "LORTEL - Resort & Spa Nghỉ Dưỡng Cao Cấp",
  description: "Trải nghiệm nghỉ dưỡng đẳng cấp giữa thiên nhiên hùng vĩ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        {/* Giữ Tailwind CDN để tương thích nhanh với code cũ */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Container cho Toast thông báo */}
        <div id="toast-container" className="fixed top-5 right-5 z-[9999] space-y-3"></div>
        {children}
      </body>
    </html>
  );
}
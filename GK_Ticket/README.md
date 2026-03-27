# Ticket_ToiGian

Project MVC toi gian cho de thi:
- Node.js + Express + EJS
- DynamoDB luu du lieu ve
- Amazon S3 upload anh

## Cau truc
- controllers/
- models/
- routes/
- middleware/
- service/
- utils/
- views/

## Chuc nang
- CRUD: them, sua, xoa, xem chi tiet
- Tim kiem theo eventName hoac holderName
- Loc theo status: Upcoming / Sold / Cancelled
- Validate:
  - quantity > 0
  - pricePerTicket > 0
  - eventDate >= ngay hien tai
  - category chi nhan Standard / VIP / VVIP
- Upload anh len S3 khi them/sua
- Nghiep vu:
  - totalAmount = quantity * pricePerTicket
  - VIP + quantity >= 4: giam 10%
  - VVIP + quantity >= 2: giam 15%
  - Hien thi ket qua: Duoc giam gia / Khong giam gia

## Chay project
1. Tao file .env tu .env.example
2. Cai package:
   npm install
3. Chay:
   npm run dev
   hoac
   npm start

# On Thi Nhanh - Project Quan Ly Mon Hoc

## 1) Muc tieu project
- Quan ly mon hoc theo CRUD: xem danh sach, them, sua, xoa.
- Upload anh len AWS S3, luu thong tin mon hoc trong DynamoDB.
- Giao dien dung EJS + Bootstrap.

## 2) Luong su kien tong quat
1. Nguoi dung thao tac tren giao dien EJS (nhan button Them/Sua/Xoa).
2. Form gui request len route (Express Router).
3. Route goi Controller tuong ung.
4. Controller:
   - Doc va validate du lieu.
   - Neu co file: goi service upload len S3.
   - Goi Model thao tac DynamoDB.
5. Model thuc hien lenh voi DynamoDB (scan/query/put/update/delete).
6. Controller tra ket qua:
   - Thanh cong: redirect ve danh sach + thong bao.
   - Loi: render lai form + danh sach loi.

## 3) Luong theo tung chuc nang
### A. Xem danh sach
1. GET /subjects.
2. Controller.get lay tat ca mon hoc tu Model.getSubjects().
3. Co the loc theo tu khoa q.
4. Render index.ejs.

### B. Them mon hoc
1. GET /subjects/create -> hien form create.ejs.
2. POST /subjects/create:
   - Multer nhan file image.
   - Controller validate cac field.
   - Upload anh len S3, lay URL.
   - Model.createSubject luu vao DynamoDB.
   - Redirect /subjects?msg=created.

### C. Sua mon hoc
1. GET /subjects/:id -> lay 1 mon hoc va hien form edit.ejs.
2. POST /subjects/:id/update:
   - Validate du lieu.
   - Neu co anh moi: upload anh moi, cap nhat URL.
   - Model.updateSubject cap nhat DynamoDB.
   - Neu co anh cu va da doi anh: xoa anh cu tren S3.
   - Redirect /subjects?msg=updated.

### D. Xoa mon hoc
1. POST /subjects/:id/delete.
2. Tim mon hoc theo id.
3. Xoa anh tren S3 (neu co).
4. Xoa record trong DynamoDB.
5. Redirect /subjects?msg=deleted.

## 4) Vai tro tung lop (hoc thuoc)
- index.js: khoi dong app, cau hinh middleware, view engine, gan router.
- routes/: dinh nghia URL va map sang controller.
- controllers/: xu ly request/response + validation + dieu phoi upload/model.
- models/: thao tac truc tiep DynamoDB.
- service/file.service.js: upload/xoa file tren S3.
- middleware/upload.js: nhan file tu form bang Multer.
- views/: giao dien EJS (index/create/edit).

## 5) Cac field mon hoc hien tai
- Co ban: name, type, semester, faculty, image.
- Bo sung de thi UI control:
  - Radio: delivery (offline/online/hybrid)
  - Select: credits (2/3/4/5)
  - Checkbox: features (lab/project/slide)
  - Button: submit + reset

## 6) Cac buoc lam project tu dau (checklist)
1. Tao app Express + cai package.
2. Cau hinh EJS, static, body parser.
3. Tao route subjects (CRUD).
4. Viet controller cho get/getOne/create/update/delete.
5. Viet model lam viec voi DynamoDB.
6. Them Multer middleware + S3 service upload file.
7. Tao view index/create/edit.
8. Them validate va thong bao loi.
9. Test full luong: them -> sua -> xoa -> tim kiem.

## 7) Lenh hay dung
- Chay project: npm start
- Truy cap: http://localhost:3000

## 8) Meo hoc thuoc nhanh
- Nho cau: View -> Route -> Controller -> Service/Model -> DB/S3 -> View.
- Moi chuc nang CRUD deu di theo 1 cau truc:
  - Nhan request
  - Validate
  - Xu ly du lieu
  - Tra response

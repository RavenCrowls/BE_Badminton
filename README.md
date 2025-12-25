# Hướng Dẫn Chạy Dự Án BE_Badminton

Đây là hướng dẫn chi tiết để thiết lập và chạy dự án Backend Badminton.

## Yêu Cầu Hệ Thống

- Node.js (v14 hoặc cao hơn)
- npm hoặc yarn
- MySQL Server
- Supabase Account (để sử dụng Vector Database)

## Các Bước Cài Đặt

### 1. Chuẩn Bị Biến Môi Trường

Sao chép file `.env.example` thành `.env` và cấu hình các biến môi trường:

```bash
cp .env.example .env
```

Mở file `.env` và cập nhật các biến cần thiết:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=badminton_db
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_secret_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

### 2. Cấu Hình Kết Nối Database

Cập nhật file `config/config.json` với thông tin kết nối MySQL:

```json
{
  "development": {
    "username": "root",
    "password": "your_password",
    "database": "badminton_db",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "your_password",
    "database": "badminton_test",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "your_password",
    "database": "badminton_prod",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

### 3. Cài Đặt Dependencies

```bash
npm install
```

### 4. Tạo Database Supabase cho Vector Database

Đăng nhập vào Supabase và chạy các câu lệnh SQL từ file `supabase.sql`:

```bash
# Mở file supabase.sql và copy toàn bộ nội dung
# Dán vào SQL Editor của Supabase và thực thi
```

Hoặc chạy trực tiếp từ terminal nếu bạn có CLI Supabase:

```bash
supabase db push < supabase.sql
```

### 5. Upload guide.md lên Supabase Storage

1. Đăng nhập vào Supabase Dashboard
2. Đi đến **Storage**
3. Tạo bucket mới hoặc sử dụng bucket hiện có (tên: `rag-docs`)
4. Upload file `guide.md` vào bucket
5. Lưu public URL của file để sử dụng trong ứng dụng

### 6. Chạy Script Ingest để Tạo Vector Database

Sau khi upload `guide.md` lên Supabase Storage, chạy script ingest để tách và lưu documents vào vector database:

```bash
npm run ingest:md
```

Hoặc chạy trực tiếp:

```bash
node scripts/ingest-md.js
```

Script này sẽ:

- Tải file `guide.md` từ Supabase Storage
- Tách nội dung thành các đoạn nhỏ
- Tạo embeddings sử dụng Google Generative AI
- Lưu vào bảng `documents` trong Supabase Vector Database

### 7. Tạo Database

```bash
# Sử dụng Sequelize CLI để tạo database
npx sequelize-cli db:create
```

Hoặc tạo database thủ công bằng MySQL:

```sql
CREATE DATABASE badminton_db;
```

### 8. Chạy Migration

```bash
# Chạy tất cả các migration
npx sequelize-cli db:migrate
```

Hoặc sử dụng npm script:

```bash
npm run db:migrate
```

### 9. Chạy Seeding

```bash
# Chạy tất cả các seeder để thêm dữ liệu ban đầu
npx sequelize-cli db:seed:all
```

Hoặc sử dụng npm script:

```bash
npm run db:seed
```

### 10. Chạy Dự Án

Chạy server ở chế độ development:

```bash
npm run dev
```

Server sẽ khởi động tại `http://localhost:3000`

# ✓ TodoList — Aplikasi Manajemen Tugas

Aplikasi full-stack **Todo List Management** yang dibangun dengan **Laravel 13** (REST API backend) dan **React + TypeScript** (frontend). Mendukung semua fitur CRUD, pencarian, filter, dan notifikasi toast.

---

## 📸 Fitur Aplikasi
- ✅ **Tambah Tugas** — Form dengan `title` (wajib) dan `description` (opsional)
- ✅ **Daftar Tugas** — Menampilkan semua tugas dari API
- ✅ **Toggle Selesai** — Checkbox untuk mengubah status `is_completed`, judul dicoret
- ✅ **Validasi & Error Handling** — Pesan error JSON terstruktur dari backend
- ✅ **Hapus Tugas** — Tombol delete dengan konfirmasi
- ✅ **Pencarian** — Cari berdasarkan judul (debounced, query ke API)
- ✅ **Edit Tugas** — Modal untuk mengubah `title` dan `description`
- ✅ **Toast Notification** — Umpan balik sukses/gagal pada setiap aksi
- ✅ **Filter Tampilan** — Tab Semua / Aktif / Selesai

---

## 🏗️ Arsitektur

```
to-do-list-management/
├── backend/          # Laravel 13 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/TaskController.php
│   │   │   └── Requests/
│   │   │       ├── StoreTaskRequest.php
│   │   │       └── UpdateTaskRequest.php
│   │   └── Models/Task.php
│   ├── database/migrations/
│   │   └── ..._create_tasks_table.php
│   ├── routes/api.php
│   └── config/cors.php
│
└── frontend/         # React + TypeScript (Vite)
    └── src/
        ├── components/
        │   ├── AddTaskForm.tsx
        │   ├── TaskList.tsx
        │   ├── TaskItem.tsx
        │   ├── EditTaskModal.tsx
        │   └── ToastContainer.tsx
        ├── hooks/useToast.ts
        ├── services/taskService.ts
        ├── types/index.ts
        └── App.tsx
```

---

## 🚀 Setup & Instalasi

### Prasyarat
- **PHP** >= 8.3 *(Laravel 13 minimum requirement)*
- **Composer** >= 2.x
- **Node.js** >= 18.x & **npm** >= 9.x

---

### 1. Clone Repository

```bash
git clone https://github.com/nursidin12-maker/to-do-list-management.git
cd todo-app
```

---

### 2. Setup Backend (Laravel 13)

```bash
# Masuk ke folder backend
cd ../to-do-list-management/backend

# Instal ext-xml terlebih dahulu jika belum dilakukan.
sudo apt-get install -y php8.3-xml php8.3-dom php8.3-mbstring php8.3-sqlite3

# Kemudian install dependencies
composer install

# Pastikan dua folder berikut dengan permission writable.
chmod 775 ../to-do-list-management/backend/bootstrap/cache
chmod -R 775 ../to-do-list-management/backend/storage
# Jika sudah berhasil, lanjutkan dengan:

# Salin file konfigurasi environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Konfigurasi Database

Aplikasi ini menggunakan **SQLite** secara default (tidak perlu setup database eksternal):

```bash
# Buat file database SQLite
touch database/database.sqlite

# Jalankan migrasi
php artisan migrate
```

> **Opsional — MySQL 8.0+ / MariaDB 10.3+:** Edit `.env` dan ubah `DB_CONNECTION=mysql`, lalu isi `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.

#### Jalankan Backend

```bash
php artisan serve --host=0.0.0.0 --port=8021
# Server berjalan di: http://<your-server-ip>:8021/
```

---

### 3. Setup Frontend (React)

```bash
cd ../to-do-list-management/frontend

# Install dependencies
npm install
```

#### Jalankan Frontend

```bash
npm run dev
# Aplikasi berjalan di: 
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://<your-server-ip>:5173/
```

> Vite secara otomatis melakukan **proxy** request `/api/*` ke `http://<your-server-ip>:8021/api`, sehingga tidak ada masalah CORS saat development.

---

## 🌐 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/tasks` | Ambil semua tugas |
| `GET` | `/api/tasks?search=kata` | Cari tugas berdasarkan judul |
| `POST` | `/api/tasks` | Buat tugas baru |
| `GET` | `/api/tasks/{id}` | Ambil satu tugas |
| `PATCH` | `/api/tasks/{id}` | Update tugas (sebagian) |
| `DELETE` | `/api/tasks/{id}` | Hapus tugas |
| `GET` | `/api/health` | Health check |

### Contoh Request

**POST /api/tasks**
```json
{
  "title": "Belajar Laravel",
  "description": "Pelajari konsep routing dan controller"
}
```

**PATCH /api/tasks/1**
```json
{
  "is_completed": true
}
```

### Contoh Response

**Sukses:**
```json
{
  "success": true,
  "message": "Task berhasil dibuat.",
  "data": {
    "id": 1,
    "title": "Belajar Laravel",
    "description": "Pelajari konsep routing dan controller",
    "is_completed": false,
    "created_at": "2026-05-01T00:00:00.000000Z",
    "updated_at": "2026-05-01T00:00:00.000000Z"
  }
}
```

**Validasi Gagal (422):**
```json
{
  "success": false,
  "message": "Validasi gagal.",
  "errors": {
    "title": ["Title wajib diisi."]
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Task tidak ditemukan."
}
```

---

## 🧪 Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Backend Framework | **Laravel 13** (rilis Maret 2026) |
| PHP Minimum | **PHP 8.3** |
| Database | SQLite (default) / MySQL 8.0+ / MariaDB 10.3+ |
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| HTTP Client | Axios |
| Styling | CSS murni (tanpa framework UI) |

---

## 📝 Catatan Pengembangan

- **Laravel 13** memperkenalkan dukungan penuh PHP 8.3 attribute syntax — `TaskController` menggunakan `#[Middleware('api')]`
- **CORS** dikonfigurasi di `config/cors.php` — ubah `allowed_origins` untuk production
- **Optimistic update** diterapkan pada toggle status untuk UX yang responsif
- **Debounce 400ms** pada fitur pencarian untuk mengurangi request ke API
- Semua endpoint menggunakan **Form Request classes** untuk validasi yang bersih dan terstruktur

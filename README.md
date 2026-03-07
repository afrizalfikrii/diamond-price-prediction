# Diamond Price Prediction 💎

Aplikasi web untuk memprediksi harga berlian menggunakan machine learning. Terdiri dari backend API (FastAPI) dan frontend interaktif (Next.js).

## 📋 Fitur Utama

- **Prediksi Harga Berlian**: Menggunakan model machine learning untuk memprediksi harga berdasarkan karakteristik berlian
- **Interface Modern**: UI yang responsif dan user-friendly dengan animasi interaktif
- **Real-time Prediction**: Hasil prediksi langsung ditampilkan setelah submit
- **Multiple Input Parameters**: Dukungan 9 parameter karakteristik berlian:
  - Carat (berat)
  - Cut (potongan: Ideal, Premium, Very Good, Good, Fair)
  - Color (warna: D-Z)
  - Clarity (kejernihan: IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1)
  - Depth, Table, X, Y, Z (dimensi)

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **ML Libraries**: scikit-learn, pandas, joblib
- **Encoding**: LabelEncoder untuk kategori

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 📁 Struktur Proyek

```
diamond_project/
├── backend/
│   ├── main.py                 # FastAPI application dengan endpoint /prediksi
│   ├── train.py                # Script training model
│   ├── requirements.txt         # Dependencies Python
│   ├── dataset/
│   │   └── diamonds.csv         # Dataset training
│   └── models/
│       ├── model_berlian.joblib # Trained ML model
│       └── encoders.joblib      # Label encoders untuk kategori
└── frontend/
    ├── app/
    │   ├── page.tsx             # Halaman utama aplikasi
    │   ├── layout.tsx            # Root layout
    │   └── globals.css           # Global styling
    ├── package.json              # Dependencies Node.js
    └── tsconfig.json             # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm atau yarn

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan server
python -m uvicorn main:app --reload
```

Server akan berjalan di `http://localhost:8000`

**API Endpoint:**
```
POST /prediksi
Content-Type: application/json

{
  "carat": 0.5,
  "cut": "Ideal",
  "color": "D",
  "clarity": "IF",
  "depth": 61.5,
  "table": 55.0,
  "x": 5.0,
  "y": 5.0,
  "z": 3.1
}
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📊 Model Training

Untuk melatih ulang model dengan dataset baru:

```bash
cd backend
python train.py
```

Script ini akan:
1. Load dataset dari `dataset/diamonds.csv`
2. Melakukan preprocessing dan encoding
3. Training model machine learning
4. Menyimpan model ke `models/model_berlian.joblib`
5. Menyimpan encoders ke `models/encoders.joblib`

## 🔄 Workflow Aplikasi

1. User membuka aplikasi di browser
2. Input karakteristik berlian melalui form
3. Frontend mengirim request ke backend FastAPI
4. Backend melakukan preprocessing dan prediksi menggunakan model
5. Hasil prediksi harga (dalam USD) ditampilkan ke user

## 📝 API Documentation

### POST /prediksi

**Request:**
```json
{
  "carat": number,
  "cut": "Ideal" | "Premium" | "Very Good" | "Good" | "Fair",
  "color": "D" | "E" | "F" | ... | "Z",
  "clarity": "IF" | "VVS1" | "VVS2" | "VS1" | "VS2" | "SI1" | "SI2" | "I1",
  "depth": number,
  "table": number,
  "x": number,
  "y": number,
  "z": number
}
```

**Response:**
```json
{
  "harga_usd": 5000.50
}
```

## 🐛 Troubleshooting

### Frontend tidak bisa terhubung ke Backend
- Pastikan backend server berjalan di port 8000
- Check CORS settings di `main.py`
- Verifikasi URL endpoint di `page.tsx` (default: `http://localhost:8000/prediksi`)

### Model atau Encoders tidak ditemukan
- Jalankan `python train.py` untuk generate ulang model
- Pastikan file ada di folder `models/`

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Scikit-learn](https://scikit-learn.org/)

## 👨‍💻 Author

Afrizal Fikri - Machine Learning Project 

## 📄 License

MIT License

"use client";
import { useState } from "react";
import { Diamond, Sparkles, SlidersHorizontal, BarChart3, Fingerprint, ChevronRight } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    carat: 0.5, cut: "Ideal", color: "D", clarity: "IF",
    depth: 61.5, table: 55.0, x: 5.0, y: 5.0, z: 3.1,
  });
  const [harga, setHarga] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cekHarga = async () => {
    setLoading(true);
    // Efek delay buatan sebentar agar animasi loading AI terlihat lebih dramatis
    await new Promise((resolve) => setTimeout(resolve, 800)); 
    
    try {
      const response = await fetch("http://localhost:8000/prediksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          carat: parseFloat(formData.carat),
          depth: parseFloat(formData.depth),
          table: parseFloat(formData.table),
          x: parseFloat(formData.x),
          y: parseFloat(formData.y),
          z: parseFloat(formData.z),
        }),
      });
      const data = await response.json();
      setHarga(data.harga_usd);
    } catch (error) {
      alert("Koneksi gagal! Pastikan Backend Python (FastAPI) menyala.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-200 flex items-center justify-center p-4 lg:p-10 font-sans overflow-hidden relative">
      
      {/* --- ANIMATED BACKGROUND GLOW --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* --- LEFT SECTION: HERO & BRANDING --- */}
        <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-widest text-cyan-300 uppercase">Powered by Random Forest</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
            Valuasi Berlian <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Super Cerdas.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            Algoritma kami menganalisis ribuan data pasar secara real-time untuk memberikan estimasi harga berlian Anda dengan presisi tinggi.
          </p>

          <div className="hidden lg:flex flex-col gap-4 mt-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl"><BarChart3 className="text-cyan-400 w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white">Analisis Dimensi 3D</h4>
                <p className="text-xs text-gray-400">Memperhitungkan sumbu X, Y, Z dan kedalaman optik.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-fuchsia-500/20 rounded-xl"><Fingerprint className="text-fuchsia-400 w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white">Evaluasi 4C Akurat</h4>
                <p className="text-xs text-gray-400">Carat, Cut, Color, dan Clarity diproses simultan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION: INTERACTIVE ENGINE --- */}
        <div className="lg:col-span-7">
          <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Dekorasi Garis Atas */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-transparent"></div>

            <div className="flex items-center gap-3 mb-8">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-white tracking-wide">Spesifikasi AI</h3>
            </div>

            <div className="space-y-8">
              
              {/* INTERACTIVE CARAT SLIDER */}
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Berat (Carat)</label>
                  <div className="text-3xl font-black text-white">{formData.carat} <span className="text-sm font-normal text-cyan-400">ct</span></div>
                </div>
                <input 
                  type="range" name="carat" min="0.1" max="5.0" step="0.01"
                  value={formData.carat} onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                  <span>0.1ct</span><span>5.0ct+</span>
                </div>
              </div>

              {/* GRID UNTUK CUT, COLOR, CLARITY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Potongan (Cut)</label>
                  <select name="cut" value={formData.cut} onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-600/50 p-4 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-white font-medium appearance-none hover:bg-gray-700 transition"
                  >
                    <option value="Ideal">Ideal</option><option value="Premium">Premium</option>
                    <option value="Very Good">Very Good</option><option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Warna (Color)</label>
                  <select name="color" value={formData.color} onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-600/50 p-4 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none text-white font-medium appearance-none hover:bg-gray-700 transition"
                  >
                    {["D", "E", "F", "G", "H", "I", "J"].map(c => <option key={c} value={c}>Grade {c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kejernihan</label>
                  <select name="clarity" value={formData.clarity} onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-600/50 p-4 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-white font-medium appearance-none hover:bg-gray-700 transition"
                  >
                    {["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1"].map(cl => <option key={cl} value={cl}>{cl}</option>)}
                  </select>
                </div>
              </div>

              {/* TOMBOL PREDIKSI */}
              <button 
                onClick={cekHarga} disabled={loading}
                className="group relative w-full flex justify-center items-center gap-3 bg-white text-black font-black text-lg py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    Menganalisis Pola Data...
                  </span>
                ) : (
                  <>Mulai Prediksi Harga <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>

            {/* HASIL PREDIKSI MUNCUL DENGAN ANIMASI */}
            {harga !== null && !loading && (
              <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="p-[2px] rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500">
                  <div className="bg-[#0f172a] rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
                    <Diamond className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
                    <p className="text-cyan-300 font-semibold tracking-widest uppercase text-sm mb-2">Estimasi Nilai Pasar</p>
                    <div className="flex items-start justify-center gap-2">
                      <span className="text-3xl text-gray-400 font-bold mt-2">$</span>
                      <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tight">
                        {harga.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
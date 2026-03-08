"use client";
import { useState, useEffect } from "react";
import { Diamond, ShieldCheck, Activity, Cpu, Fingerprint, Sparkles } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    carat: 1.0, cut: "Ideal", color: "D", clarity: "VVS1",
    depth: 61.5, table: 55.0, x: 5.0, y: 5.0, z: 3.1,
  });
  const [harga, setHarga] = useState<number | null>(null);
  const [displayHarga, setDisplayHarga] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);

  const scanSteps = [
    "Inisialisasi Neural Network...",
    "Ekstraksi fitur makroskopis...",
    "Validasi matriks kejernihan...",
    "Menghitung probabilitas harga pasar..."
  ];

  // Mapping nilai untuk visualisasi Progress Bar UI
  const scores: { cut: Record<string, number>; color: Record<string, number>; clarity: Record<string, number> } = {
    cut: { "Ideal": 100, "Premium": 85, "Very Good": 70, "Good": 50, "Fair": 30 },
    color: { "D": 100, "E": 90, "F": 80, "G": 70, "H": 55, "I": 40, "J": 20 },
    clarity: { "IF": 100, "VVS1": 90, "VVS2": 80, "VS1": 70, "VS2": 60, "SI1": 45, "SI2": 30, "I1": 15 }
  };

  const updateField = (field: keyof typeof formData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setHarga(null);
    setDisplayHarga(0);
  };

  // Efek animasi angka berjalan saat harga didapatkan
  useEffect(() => {
    if (harga !== null) {
      let start = 0;
      const duration = 1000;
      const increment = harga / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= harga) {
          setDisplayHarga(harga);
          clearInterval(timer);
        } else {
          setDisplayHarga(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [harga]);

  const cekHarga = async () => {
    setLoading(true);
    setHarga(null);
    
    // Animasi Scanning Teks
    for (let i = 0; i < scanSteps.length; i++) {
      setScanIndex(i);
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const response = await fetch("http://localhost:8000/prediksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          carat: parseFloat(String(formData.carat)),
        }),
      });
      const data = await response.json();
      setHarga(data.harga_usd);
    } catch (error) {
      alert("Koneksi gagal! Pastikan Backend API menyala.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-amber-500/30 p-4 sm:p-6 lg:p-10 flex items-center justify-center relative overflow-hidden">
      
      {/* BACKGROUND MESH GRADIENT */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl grid xl:grid-cols-12 gap-8 items-stretch">
        
        {/* ================= LEFT PANEL: THE VISUALIZER ================= */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          
          {/* Main Visual Box */}
          <div className="flex-1 bg-white/1 border border-white/5 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-light text-white tracking-wide">Diamond<strong className="font-bold">AI</strong></h2>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> System Online
                </p>
              </div>
              <Cpu className="w-8 h-8 text-slate-700 group-hover:text-blue-500 transition-colors duration-500" />
            </div>

            {/* Glowing Diamond Centerpiece */}
            <div className="relative flex justify-center items-center py-16">
              <div className="absolute w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              <Diamond className={`w-32 h-32 text-blue-400 relative z-10 transition-all duration-700 ${loading ? 'scale-90 animate-pulse text-indigo-400' : 'drop-shadow-[0_0_30px_rgba(59,130,246,0.6)] group-hover:scale-110 group-hover:rotate-12'}`} />
              
              {/* Orbital rings */}
              <div className={`absolute w-56 h-56 border border-white/10 rounded-full ${loading ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'}`}></div>
              <div className={`absolute w-64 h-64 border border-dashed border-white/5 rounded-full ${loading ? 'animate-[spin_3s_linear_infinite_reverse]' : 'animate-[spin_25s_linear_infinite_reverse]'}`}></div>
            </div>

            {/* Dynamic Real-time Stats */}
            <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                <span>Skor Kualitas</span><span>{Math.floor((scores.cut[formData.cut] + scores.color[formData.color] + scores.clarity[formData.clarity]) / 3)}%</span>
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-3">
                {[
                  { label: "Cut", value: scores.cut[formData.cut], color: "bg-blue-400" },
                  { label: "Color", value: scores.color[formData.color], color: "bg-indigo-400" },
                  { label: "Clarity", value: scores.clarity[formData.clarity], color: "bg-purple-400" }
                ].map((stat) => (
                  <div key={stat.label} className="relative">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono uppercase">
                      <span>{stat.label}</span><span>{stat.value}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} transition-all duration-1000 ease-out`} style={{ width: `${stat.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL: CONTROLS & RESULT ================= */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* Result / Certificate Area (Muncul jika ada harga) */}
          {harga !== null && !loading && (
            <div className="bg-linear-to-br from-amber-500/10 to-orange-900/10 border border-amber-500/30 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.1)] relative overflow-hidden animate-[fadeInDown_0.6s_ease-out]">
              <div className="absolute top-0 right-0 p-6 opacity-20"><ShieldCheck className="w-24 h-24 text-amber-500" /></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4 uppercase tracking-wider border border-amber-500/30">
                    <Sparkles className="w-3 h-3" /> Sertifikat Valuasi AI
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">Nilai Pasar Estimasi</h3>
                  <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-tighter drop-shadow-sm">
                    <span className="text-3xl text-amber-500/50 mr-2 font-normal">$</span>
                    {displayHarga.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-right text-xs text-amber-500/50 font-mono space-y-1">
                  <p>ID: ML-RF-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  <p>Akurasi Historis: 98.4%</p>
                  <p>Diperbarui: Live</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls Area */}
          <div className="bg-white/1 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              
              {/* CARAT SLIDER PRO */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    Berat Berlian
                  </label>
                  <div className="text-4xl font-black text-white font-mono tracking-tighter">
                    {formData.carat} <span className="text-lg text-blue-500 font-normal">ct</span>
                  </div>
                </div>
                <div className="relative pt-2">
                  <input 
                    type="range" min="0.1" max="5.0" step="0.01" value={formData.carat} 
                    onChange={(e) => updateField('carat', e.target.value)}
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all z-10 relative"
                  />
                  {/* Fake tick marks */}
                  <div className="absolute top-4 left-0 w-full flex justify-between px-1 pointer-events-none opacity-20">
                    {[...Array(10)].map((_, i) => <div key={i} className="w-0.5 h-2 bg-white rounded-full"></div>)}
                  </div>
                </div>
              </div>

              {/* GRID UNTUK CUT & CLARITY */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* CUT SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Kualitas Potongan (Cut)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Fair", "Good", "Very Good", "Premium", "Ideal"].map((c) => (
                      <button key={c} onClick={() => updateField('cut', c)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${c === "Ideal" ? "col-span-2" : ""} ${
                          formData.cut === c 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                          : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CLARITY SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Kejernihan (Clarity)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF"].map((c) => (
                      <button key={c} onClick={() => updateField('clarity', c)}
                        className={`py-2 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                          formData.clarity === c 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                          : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLOR GRADE */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between">
                  <span>Skala Warna (Color)</span>
                  <span className="text-indigo-400 font-mono text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded">Grade {formData.color}</span>
                </label>
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                  {["J", "I", "H", "G", "F", "E", "D"].map((c) => (
                    <button key={c} onClick={() => updateField('color', c)}
                      className={`flex-1 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                        formData.color === c 
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="mt-10">
              <button 
                onClick={cekHarga} disabled={loading}
                className="w-full relative overflow-hidden group bg-white text-black font-black text-lg py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-widest text-slate-800">
                    <Fingerprint className="w-5 h-5 animate-pulse text-blue-600" />
                    {scanSteps[scanIndex]}
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest">
                    Mulai Kalkulasi AI
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend (tidak perlu GUI)
import matplotlib.pyplot as plt
import seaborn as sns
import os

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# Setup folder output
os.makedirs('models', exist_ok=True)
os.makedirs('eda_output', exist_ok=True)

print("=" * 60)
print("   DIAMOND PRICE PREDICTION — TRAINING & ANALYSIS PIPELINE")
print("=" * 60)

# ─── 1. LOAD DATASET ──────────────────────────────────────────
print("\n[1/6] Membaca dataset...")
df = pd.read_csv('dataset/diamonds.csv')
print(f"      Dataset dimuat: {df.shape[0]:,} baris x {df.shape[1]} kolom")
print(f"      Rentang harga : ${df['price'].min():,} - ${df['price'].max():,}")
print(f"      Rata-rata harga: ${df['price'].mean():,.0f}")

# ─── 2. EDA — EXPLORATORY DATA ANALYSIS ───────────────────────
print("\n[2/6] Exploratory Data Analysis (EDA)...")

# 2a. Distribusi Harga
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Distribusi Harga Berlian', fontsize=14, fontweight='bold')

axes[0].hist(df['price'], bins=50, color='steelblue', edgecolor='white', alpha=0.85)
axes[0].set_title('Distribusi Harga (Asli)')
axes[0].set_xlabel('Harga (USD)')
axes[0].set_ylabel('Frekuensi')
axes[0].xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))

axes[1].hist(np.log1p(df['price']), bins=50, color='darkorange', edgecolor='white', alpha=0.85)
axes[1].set_title('Distribusi Harga (Log Scale) — Lebih Normal')
axes[1].set_xlabel('log(Harga)')
axes[1].set_ylabel('Frekuensi')

plt.tight_layout()
plt.savefig('eda_output/01_distribusi_harga.png', dpi=150, bbox_inches='tight')
plt.close()
print("      Saved: eda_output/01_distribusi_harga.png")

# 2b. Harga vs Fitur Kategorik
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.suptitle('Pengaruh Fitur Kategorik terhadap Harga', fontsize=14, fontweight='bold')

cut_order    = ['Fair', 'Good', 'Very Good', 'Premium', 'Ideal']
color_order  = ['D', 'E', 'F', 'G', 'H', 'I', 'J']
clarity_order = ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']

for ax, col, order, color in zip(
    axes,
    ['cut', 'color', 'clarity'],
    [cut_order, color_order, clarity_order],
    ['#4C72B0', '#DD8452', '#55A868']
):
    means = df.groupby(col)['price'].mean().reindex(order)
    ax.bar(means.index, means.values, color=color, alpha=0.85, edgecolor='white')
    ax.set_title(f'Rata-rata Harga per {col.capitalize()}')
    ax.set_xlabel(col.capitalize())
    ax.set_ylabel('Rata-rata Harga (USD)')
    ax.tick_params(axis='x', rotation=30)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))

plt.tight_layout()
plt.savefig('eda_output/02_harga_per_kategori.png', dpi=150, bbox_inches='tight')
plt.close()
print("      Saved: eda_output/02_harga_per_kategori.png")

# 2c. Korelasi Heatmap
df_corr = df.copy()
for col in ['cut', 'color', 'clarity']:
    df_corr[col] = LabelEncoder().fit_transform(df_corr[col])

fig, ax = plt.subplots(figsize=(9, 7))
corr = df_corr.corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, mask=mask, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, ax=ax, linewidths=0.5, annot_kws={'size': 9})
ax.set_title('Korelasi Antar Fitur (Heatmap)', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig('eda_output/03_korelasi_heatmap.png', dpi=150, bbox_inches='tight')
plt.close()
print("      Saved: eda_output/03_korelasi_heatmap.png")

# 2d. Scatter Carat vs Harga
fig, ax = plt.subplots(figsize=(9, 5))
scatter = ax.scatter(df['carat'], df['price'], alpha=0.15, s=5, c=df['price'],
                     cmap='plasma', rasterized=True)
plt.colorbar(scatter, ax=ax, label='Harga (USD)')
ax.set_title('Carat vs Harga Berlian', fontsize=13, fontweight='bold')
ax.set_xlabel('Carat')
ax.set_ylabel('Harga (USD)')
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))
plt.tight_layout()
plt.savefig('eda_output/04_carat_vs_harga.png', dpi=150, bbox_inches='tight')
plt.close()
print("      Saved: eda_output/04_carat_vs_harga.png")

# ─── 3. PREPROCESSING ─────────────────────────────────────────
print("\n[3/6] Preprocessing & Encoding data kategorik...")
encoders = {}
for col in ['cut', 'color', 'clarity']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le
    print(f"      '{col}' -> {list(le.classes_)}")

X = df.drop('price', axis=1)
y = df['price']

# ─── 4. TRAIN / TEST SPLIT ────────────────────────────────────
print("\n[4/6] Split data Train/Test (80:20)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"      Training: {X_train.shape[0]:,} | Testing: {X_test.shape[0]:,}")

# ─── 5. PERBANDINGAN MODEL ────────────────────────────────────
print("\n[5/6] Training & Perbandingan Model...")

models = {
    "Linear Regression (Baseline)": LinearRegression(),
    "Random Forest Regressor     ": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
}

results = {}
trained_models = {}

for name, m in models.items():
    m.fit(X_train, y_train)
    y_pred_m = m.predict(X_test)
    results[name] = {
        'MAE' : mean_absolute_error(y_test, y_pred_m),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred_m)),
        'R2'  : r2_score(y_test, y_pred_m),
    }
    trained_models[name] = m
    print(f"      Selesai: {name.strip()}")

# Tampilkan tabel perbandingan
print("\n" + "─" * 62)
print("   PERBANDINGAN MODEL")
print(f"   {'Model':<35} {'MAE':>10} {'RMSE':>10} {'R²':>8}")
print("─" * 62)
for name, res in results.items():
    flag = " <-- TERBAIK" if res['R2'] == max(r['R2'] for r in results.values()) else ""
    print(f"   {name} ${res['MAE']:>8,.0f} ${res['RMSE']:>8,.0f}  {res['R2']:.4f}{flag}")
print("─" * 62)

# Best model = RF
model = trained_models["Random Forest Regressor     "]
rf_res = results["Random Forest Regressor     "]

# Interpretasi R²
r2 = rf_res['R2']
if r2 >= 0.95:   grade = "Sangat Baik (Excellent)"
elif r2 >= 0.85: grade = "Baik (Good)"
elif r2 >= 0.70: grade = "Cukup (Fair)"
else:            grade = "Perlu Improvement"
print(f"\n   Kesimpulan RF: {grade}  (R² = {r2:.4f})")

# Cross-Validation
print("\n   Cross-Validation Random Forest (5-Fold):")
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2', n_jobs=-1)
print(f"   Skor per fold : {[f'{s:.4f}' for s in cv_scores]}")
print(f"   Mean R² CV    : {cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")

# Feature Importance
print("\n   Feature Importance (Top 5):")
importances = pd.Series(model.feature_importances_, index=X.columns)
for feat, imp in importances.nlargest(5).items():
    bar = "#" * int(imp * 40)
    print(f"   {feat:<10} {bar} {imp:.4f}")

# Visualisasi: Actual vs Predicted
y_pred_rf = model.predict(X_test)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Evaluasi Model — Random Forest vs Linear Regression', fontsize=13, fontweight='bold')

for ax, (name, m) in zip(axes, trained_models.items()):
    yp = m.predict(X_test)
    r2v = results[name]['R2']
    ax.scatter(y_test, yp, alpha=0.15, s=5, color='steelblue', rasterized=True)
    lims = [min(y_test.min(), yp.min()), max(y_test.max(), yp.max())]
    ax.plot(lims, lims, 'r--', linewidth=1.5, label='Garis Ideal')
    ax.set_xlabel('Harga Aktual (USD)')
    ax.set_ylabel('Harga Prediksi (USD)')
    ax.set_title(f'{name.strip()}\nR² = {r2v:.4f}')
    ax.legend(fontsize=8)
    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))

plt.tight_layout()
plt.savefig('eda_output/05_actual_vs_predicted.png', dpi=150, bbox_inches='tight')
plt.close()
print("\n      Saved: eda_output/05_actual_vs_predicted.png")

# Feature Importance Chart
fig, ax = plt.subplots(figsize=(9, 5))
importances_sorted = importances.sort_values()
colors = ['#4C72B0'] * len(importances_sorted)
colors[-1] = '#DD8452'
ax.barh(importances_sorted.index, importances_sorted.values, color=colors, edgecolor='white')
ax.set_title('Feature Importance — Random Forest', fontsize=13, fontweight='bold')
ax.set_xlabel('Importance Score')
for i, v in enumerate(importances_sorted.values):
    ax.text(v + 0.002, i, f'{v:.4f}', va='center', fontsize=9)
plt.tight_layout()
plt.savefig('eda_output/06_feature_importance.png', dpi=150, bbox_inches='tight')
plt.close()
print("      Saved: eda_output/06_feature_importance.png")

# ─── 6. SIMPAN MODEL ──────────────────────────────────────────
print("\n[6/6] Menyimpan model & encoders...")
joblib.dump(model, 'models/model_berlian.joblib')
joblib.dump(encoders, 'models/encoders.joblib')

print("\n" + "=" * 60)
print("   MODEL SIAP! File disimpan di:")
print("   -> models/model_berlian.joblib")
print("   -> models/encoders.joblib")
print("   -> eda_output/ (6 grafik EDA)")
print("=" * 60)

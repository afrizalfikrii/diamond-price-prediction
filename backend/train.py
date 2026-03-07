import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("1. Membaca dataset...")
df = pd.read_csv('dataset/diamonds.csv')

print("2. Preprocessing Data...")
encoders = {}
for col in ['cut', 'color', 'clarity']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

X = df.drop('price', axis=1)
y = df['price']

print("3. Melatih Model AI...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

print("4. Menyimpan Model...")
if not os.path.exists('models'):
    os.makedirs('models')
joblib.dump(model, 'models/model_berlian.joblib')
joblib.dump(encoders, 'models/encoders.joblib')
print("✅ Selesai! Model AI siap digunakan.")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Mengizinkan Frontend Next.js mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model AI
model = joblib.load('models/model_berlian.joblib')
encoders = joblib.load('models/encoders.joblib')

class BerlianData(BaseModel):
    carat: float
    cut: str
    color: str
    clarity: str
    depth: float
    table: float
    x: float
    y: float
    z: float

@app.post("/prediksi")
def hitung_prediksi(data: BerlianData):
    df_input = pd.DataFrame([data.dict()])
    df_input['cut'] = encoders['cut'].transform(df_input['cut'])
    df_input['color'] = encoders['color'].transform(df_input['color'])
    df_input['clarity'] = encoders['clarity'].transform(df_input['clarity'])
    
    harga_prediksi = model.predict(df_input)[0]
    return {"harga_usd": round(harga_prediksi, 2)}
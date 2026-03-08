from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Literal
import joblib
import pandas as pd

app = FastAPI(title="Diamond Price Prediction API")

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
    carat:   float
    cut:     Literal["Fair", "Good", "Very Good", "Premium", "Ideal"]
    color:   Literal["D", "E", "F", "G", "H", "I", "J"]
    clarity: Literal["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1"]
    depth:   float
    table:   float
    x:       float
    y:       float
    z:       float

    @field_validator('carat')
    @classmethod
    def carat_must_be_positive(cls, v):
        if v <= 0 or v > 30:
            raise ValueError('Carat harus antara 0 dan 30')
        return v

    @field_validator('depth')
    @classmethod
    def depth_range(cls, v):
        if v <= 0 or v > 100:
            raise ValueError('Depth harus antara 0 dan 100 (persentase)')
        return v

    @field_validator('table')
    @classmethod
    def table_range(cls, v):
        if v <= 0 or v > 100:
            raise ValueError('Table harus antara 0 dan 100 (persentase)')
        return v

    @field_validator('x', 'y', 'z')
    @classmethod
    def dimension_must_be_positive(cls, v):
        if v < 0 or v > 30:
            raise ValueError('Dimensi (x, y, z) harus antara 0 dan 30 mm')
        return v


@app.post("/prediksi")
def hitung_prediksi(data: BerlianData):
    try:
        df_input = pd.DataFrame([data.dict()])
        df_input['cut']     = encoders['cut'].transform(df_input['cut'])
        df_input['color']   = encoders['color'].transform(df_input['color'])
        df_input['clarity'] = encoders['clarity'].transform(df_input['clarity'])

        harga_prediksi = model.predict(df_input)[0]
        return {
            "harga_usd": round(float(harga_prediksi), 2),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediksi gagal: {str(e)}")


@app.get("/")
def root():
    return {"message": "Diamond Price Prediction API", "docs": "/docs"}
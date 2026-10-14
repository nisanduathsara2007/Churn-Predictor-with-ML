from pathlib import Path

import joblib
import pandas as pd
import numpy as np

# Load model files from this file's folder, whatever folder the server is started from
MODEL_DIR = Path(__file__).resolve().parent
encoder = joblib.load(MODEL_DIR / "encoder.joblib")
scaler = joblib.load(MODEL_DIR / "scaler.joblib")
stack_model = joblib.load(MODEL_DIR / "stack_model.joblib")

def predict_data(input_data):
    input_df = pd.DataFrame([input_data])
    changedtoCatCols = ['OnlineSecurity','OnlineBackup','DeviceProtection','TechSupport','StreamingTV','StreamingMovies']
    input_df[changedtoCatCols] = input_df[changedtoCatCols].replace({'No internet service':0,'No':0,'Yes':1})
    input_df['MultipleLines'] = input_df['MultipleLines'].replace({'No phone service':0,'No':0,'Yes':1})
    YesNoCols = ['Partner','Dependents','PhoneService','PaperlessBilling']
    input_df[YesNoCols] = input_df[YesNoCols].replace({"Yes":1,"No":0})
    input_df['gender'] = input_df['gender'].replace({"Male":1,"Female":0})
    categorical_cols = ['InternetService','Contract','PaymentMethod']
    encoded_cols = encoder.get_feature_names_out(categorical_cols)
    input_df[encoded_cols] = encoder.transform(input_df[categorical_cols])
    numerical_cols = ['tenure','MonthlyCharges']
    yesnoCols = ['gender','SeniorCitizen','Partner','Dependents','PhoneService','MultipleLines','OnlineSecurity','OnlineBackup'
            ,'DeviceProtection','TechSupport','StreamingTV','StreamingMovies','PaperlessBilling']
    wantedCols = numerical_cols + yesnoCols + list(encoded_cols)
    X = input_df[wantedCols].copy()
    X[numerical_cols] = scaler.transform(X[numerical_cols])
    X[yesnoCols] = X[yesnoCols].astype(int)
    prediction_probability = stack_model.predict_proba(X)
    prediction = np.argmax((prediction_probability >= 0.5).astype(int)).item()
    prediction_probability = np.array(prediction_probability)
    return prediction,np.max(prediction_probability).item()

sample_data = {
    'gender':"Male", 
    'SeniorCitizen':1, 
    'Partner':"Yes", 
    'Dependents':"No",
    'tenure':12, 
    'PhoneService':"Yes", 
    'MultipleLines':"No", 
    'InternetService':"DSL",
    'OnlineSecurity':"No", 
    'OnlineBackup':"No", 
    'DeviceProtection':"Yes", 
    'TechSupport':"Yes",
    'StreamingTV':"No", 
    'StreamingMovies':"No", 
    'Contract':"Month-to-month", 
    'PaperlessBilling':"No",
    'PaymentMethod':"Electronic check", 
    'MonthlyCharges':1130
}
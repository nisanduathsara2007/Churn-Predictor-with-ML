import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from predict import predict_data

app = FastAPI(title="Churn Prediction API")

# Frontend addresses allowed to call the API from the browser.
# On Render, set ALLOWED_ORIGINS to the static site URL (comma-separate several URLs).
LOCAL_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
extra_origins = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = LOCAL_ORIGINS + [
    origin.strip().rstrip("/") for origin in extra_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Allowed values for each categorical field (case and spacing must match exactly)
CATEGORICAL_FIELDS = {
    "gender": ["Female", "Male"],
    "Partner": ["Yes", "No"],
    "Dependents": ["No", "Yes"],
    "PhoneService": ["No", "Yes"],
    "MultipleLines": ["No phone service", "No", "Yes"],
    "InternetService": ["DSL", "Fiber optic", "No"],
    "OnlineSecurity": ["No", "Yes", "No internet service"],
    "OnlineBackup": ["Yes", "No", "No internet service"],
    "DeviceProtection": ["No", "Yes", "No internet service"],
    "TechSupport": ["No", "Yes", "No internet service"],
    "StreamingTV": ["No", "Yes", "No internet service"],
    "StreamingMovies": ["No", "Yes", "No internet service"],
    "Contract": ["Month-to-month", "One year", "Two year"],
    "PaperlessBilling": ["Yes", "No"],
    "PaymentMethod": [
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ],
}

REQUIRED_FIELDS = list(CATEGORICAL_FIELDS) + ["SeniorCitizen", "tenure", "MonthlyCharges"]

MISSING_MESSAGE = "Some data are missing. Check Them."
INVALID_MESSAGE = "Some data are invalid. Check Them."


def error_response(message):
    return JSONResponse(
        status_code=400,
        content={"prediction": -1, "probability": -1, "success": False, "message": message},
    )


def is_number(value):
    # bool is a subclass of int in Python, so exclude it explicitly
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_valid(data):
    for field, allowed in CATEGORICAL_FIELDS.items():
        if data[field] not in allowed:
            return False

    senior = data["SeniorCitizen"]
    if not is_number(senior) or senior not in (0, 1):
        return False

    tenure = data["tenure"]
    if not is_number(tenure) or tenure < 0 or tenure != int(tenure):
        return False

    charges = data["MonthlyCharges"]
    if not is_number(charges) or charges < 0:
        return False

    return True


@app.get("/health")
def health():
    # Used by Render's health check and by the frontend to wake the server up early
    return {"status": "ok"}


@app.post("/predict")
async def predict(request: Request):
    try:
        data = await request.json()
    except Exception:
        return error_response(INVALID_MESSAGE)

    if not isinstance(data, dict):
        return error_response(INVALID_MESSAGE)

    if any(data.get(field) is None for field in REQUIRED_FIELDS):
        return error_response(MISSING_MESSAGE)

    if not is_valid(data):
        return error_response(INVALID_MESSAGE)

    input_data = {field: data[field] for field in REQUIRED_FIELDS}
    input_data["SeniorCitizen"] = int(input_data["SeniorCitizen"])
    input_data["tenure"] = int(input_data["tenure"])
    input_data["MonthlyCharges"] = float(input_data["MonthlyCharges"])

    try:
        prediction, probability = predict_data(input_data)
    except Exception:
        return JSONResponse(
            status_code=500,
            content={
                "prediction": -1,
                "probability": -1,
                "success": False,
                "message": "Prediction failed due to a server error.",
            },
        )

    return {
        "prediction": prediction,
        "probability": probability,
        "success": True,
        "message": "Successfully calculated the Churn",
    }

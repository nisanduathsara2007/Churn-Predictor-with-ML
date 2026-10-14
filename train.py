import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score,roc_auc_score
from sklearn.ensemble import RandomForestClassifier,StackingClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from catboost import CatBoostClassifier
from lightgbm import LGBMClassifier
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer


df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(
    df['TotalCharges'].str.strip().replace('', np.nan),
    errors='coerce'
)
df['TotalCharges'] = df['TotalCharges'].fillna(df['MonthlyCharges'])
df['TotalCharges'] = df['TotalCharges'].astype(float)
changedtoCatCols = ['OnlineSecurity','OnlineBackup','DeviceProtection','TechSupport','StreamingTV','StreamingMovies']
df[changedtoCatCols] = df[changedtoCatCols].replace({'No internet service':0,'No':0,'Yes':1})
df['MultipleLines'] = df['MultipleLines'].replace({'No phone service':0,'No':0,'Yes':1})
YesNoCols = ['Partner','Dependents','PhoneService','PaperlessBilling','Churn']
df[YesNoCols] = df[YesNoCols].replace({"Yes":1,"No":0})
df['gender'] = df['gender'].replace({"Male":1,"Female":0})
categorical_cols = ['InternetService','Contract','PaymentMethod']
y = df['Churn']
X = df.drop(columns=['Churn'])

X_trainl,X_test,y_trainl,y_test = train_test_split(
    X,y,test_size = 0.1,random_state=33,stratify=y
)
X_train,X_val,y_train,y_val = train_test_split(
    X_trainl,y_trainl,test_size = 0.2,random_state=33,stratify=y_trainl
)

encoder = OneHotEncoder(handle_unknown='ignore',sparse_output=False)
encoder.fit(X_train[categorical_cols])
encoded_cols = encoder.get_feature_names_out(categorical_cols)
X_train[encoded_cols] = encoder.transform(X_train[categorical_cols])
X_val[encoded_cols] = encoder.transform(X_val[categorical_cols])
X_test[encoded_cols] = encoder.transform(X_test[categorical_cols])
numerical_cols = ['tenure','MonthlyCharges']
yesnoCols = ['gender','SeniorCitizen','Partner','Dependents','PhoneService','MultipleLines','OnlineSecurity','OnlineBackup'
            ,'DeviceProtection','TechSupport','StreamingTV','StreamingMovies','PaperlessBilling']
wantedCols = numerical_cols + yesnoCols + list(encoded_cols)
train_df = X_train[wantedCols].copy()
val_df = X_val[wantedCols].copy()
test_df = X_test[wantedCols].copy()

scaler = StandardScaler().fit(train_df[numerical_cols])
train_df[numerical_cols] = scaler.transform(train_df[numerical_cols])
val_df[numerical_cols] = scaler.transform(val_df[numerical_cols])
test_df[numerical_cols] = scaler.transform(test_df[numerical_cols])
train_df[yesnoCols] = train_df[yesnoCols].astype(int)
val_df[yesnoCols] = val_df[yesnoCols].astype(int)
test_df[yesnoCols] = test_df[yesnoCols].astype(int)

y_train = y_train.astype(int)
y_val = y_val.astype(int)
y_test = y_test.astype(int)

smote = SMOTE(random_state=42)
X_trainsm,Y_trainsm = smote.fit_resample(train_df,y_train)

model1 = XGBClassifier(
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=23,
    n_estimators=1000,
    max_depth=3,
    learning_rate=0.01
    
)
model2 = RandomForestClassifier(
    random_state=23,
    max_depth=4,
    n_estimators=800
)
model3 = CatBoostClassifier(
    iterations=1000,
    learning_rate=0.01,
    depth=3,
    verbose=0,
    random_seed=23
)
model4 = LGBMClassifier(
    n_estimators=1000,
    learning_rate=0.01,
    class_weight="balanced",
    force_row_wise=True,
    random_state=23,
    max_depth=3,
    verbose=-1
)
estimators = [
    ('xgb',model1),
    ('rf',model2),
    ('cat',model3),
    ('lgbm',model4)
]
stack = StackingClassifier(
    estimators=estimators,
    cv=5,
    final_estimator=LogisticRegression(),
    stack_method="predict_proba"
)

stack.fit(X_trainsm,Y_trainsm)
predict1 = stack.predict(X_trainsm)
predict2 = stack.predict(val_df)
predict3 = stack.predict_proba(val_df)[:,1]
predict4 = stack.predict_proba(test_df)[:,1]
predict5 = stack.predict(test_df)
print(classification_report(Y_trainsm,predict1))
print(classification_report(y_val,predict2))
print(classification_report(y_test,predict5))
roc_au1 = roc_auc_score(y_val,predict3)
roc_au2 = roc_auc_score(y_test,predict4)
print(roc_au1)
print(roc_au2)
joblib.dump(encoder, "encoder.joblib")
joblib.dump(scaler, "scaler.joblib")
joblib.dump(stack, "stack_model.joblib")
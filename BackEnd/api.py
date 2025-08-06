from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import xgboost as xgb
from sklearn.ensemble import RandomForestRegressor
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your dataset and train models (for demo, retrain on each start)
df = pd.read_csv(r"improved_sprint_planning_dataset.csv")

# Use only numeric features
numeric_features = [
    'StoryPoints',
    'BusinessValue',
    'DependencyCount',
    'TeamCapacity',
    'SprintVelocity',
    'PlannedPoints',
    'BlockedCount'
]
X = df[numeric_features]
y = df['ActualPointsCompleted']

# Train models
rf = RandomForestRegressor()
rf.fit(X, y)
xgb_model = xgb.XGBRegressor()
xgb_model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Expecting a dict of features
    input_df = pd.DataFrame([data])
    rf_pred = rf.predict(input_df)[0]
    xgb_pred = xgb_model.predict(input_df)[0]
    return jsonify({
        'random_forest_prediction': round(float(rf_pred), 2),
        'xgboost_prediction': round(float(xgb_pred), 2)
    })

if __name__ == '__main__':
    app.run(debug=True) 

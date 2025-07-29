import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import LabelEncoder

# Load your dataset (update path as needed)
df = pd.read_csv(r"C:/Sprint Planning Dataset/improved_sprint_planning_dataset.csv")

# Calculate SprintDurationDays
df['SprintStart'] = pd.to_datetime(df['SprintStart'])
df['SprintEnd'] = pd.to_datetime(df['SprintEnd'])
df['SprintDurationDays'] = (df['SprintEnd'] - df['SprintStart']).dt.days

# Encode RiskLevel to numeric
risk_map = {'Low': 1, 'Medium': 2, 'High': 3}
df['RiskLevelNumeric'] = df['RiskLevel'].map(risk_map)

# Aggregate to sprint level
sprint_df = df.groupby('SprintID').agg(
    TeamCapacity=('TeamCapacity', 'first'),
    SprintVelocity=('SprintVelocity', 'first'),
    PlannedPoints=('PlannedPoints', 'first'),
    ActualPointsCompleted=('ActualPointsCompleted', 'first'),
    SprintDurationDays=('SprintDurationDays', 'first'),
    AvgRiskLevel=('RiskLevelNumeric', 'mean'),
    AvgDependencyCount=('DependencyCount', 'mean'),
    TotalBlockedCount=('BlockedCount', 'sum'),
    HighPriorityCount=('Priority', lambda x: (x=='High').sum()),
    BugCount=('StoryType', lambda x: (x=='Bug').sum()),
    TechDebtCount=('StoryType', lambda x: (x=='Technical Debt').sum())
).reset_index()

# Features and target
X = sprint_df.drop(columns=['SprintID', 'SprintDurationDays'])
y = sprint_df['SprintDurationDays']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Regressor
rf = RandomForestRegressor(random_state=42)
rf.fit(X_train, y_train)
rf_preds = rf.predict(X_test)
print("Random Forest MAE:", mean_absolute_error(y_test, rf_preds))

# Train XGBoost Regressor
xgb = XGBRegressor(random_state=42, objective='reg:squarederror')
xgb.fit(X_train, y_train)
xgb_preds = xgb.predict(X_test)
print("XGBoost MAE:", mean_absolute_error(y_test, xgb_preds))

# Example: Predict sprint duration for a new sprint
new_sprint_features = {
    'TeamCapacity': 500,
    'SprintVelocity': 450,
    'PlannedPoints': 480,
    'ActualPointsCompleted': 460,
    'AvgRiskLevel': 2.0,
    'AvgDependencyCount': 1.5,
    'TotalBlockedCount': 5,
    'HighPriorityCount': 15,
    'BugCount': 8,
    'TechDebtCount': 4
}

new_sprint_df = pd.DataFrame([new_sprint_features])

predicted_duration_rf = rf.predict(new_sprint_df)[0]
predicted_duration_xgb = xgb.predict(new_sprint_df)[0]

print(f"Predicted Sprint Duration (Random Forest): {predicted_duration_rf:.2f} days")
print(f"Predicted Sprint Duration (XGBoost): {predicted_duration_xgb:.2f} days")

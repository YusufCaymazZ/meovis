# house_model_train.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import pickle
from joblib import dump

# 1️⃣ Sentetik dataset oluşturma
np.random.seed(42)
n_samples = 100

area = np.random.randint(50, 301, n_samples)  # m²
bedrooms = np.random.randint(1, 6, n_samples)  # oda sayısı
age = np.random.randint(0, 51, n_samples)  # ev yaşı
distance_to_city_center = np.random.uniform(0, 30, n_samples)  # km

# Basit fiyat formülü (bin TL)
price = 50 + 0.3*area + 10*bedrooms - 0.5*age - 0.2*distance_to_city_center + np.random.normal(0, 5, n_samples)

# DataFrame
df = pd.DataFrame({
    "area": area,
    "bedrooms": bedrooms,
    "age": age,
    "distance_to_city_center": distance_to_city_center,
    "price": price
})

# CSV olarak kaydet
df.to_csv("house_dataset.csv", index=False)
print("Dataset saved as house_dataset.csv")

# 2️⃣ Modeli eğit
X = df[["area", "bedrooms", "age", "distance_to_city_center"]]
y = df["price"]

model = LinearRegression()
model.fit(X, y)
print("Model trained")

# 3️⃣ Modeli kaydet
# a) Pickle
with open("house_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("Model saved as house_model.pkl")

# b) Joblib
dump(model, "house_model.joblib")
print("Model saved as house_model.joblib")

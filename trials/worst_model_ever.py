# bad_house_model.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import pickle
from joblib import dump

# 1️⃣ Dataset (features ve target neredeyse rastgele)
np.random.seed(42)
n_samples = 100

# Feature'lar
area = np.random.randint(50, 301, n_samples)
bedrooms = np.random.randint(1, 6, n_samples)
age = np.random.randint(0, 51, n_samples)
distance_to_city_center = np.random.uniform(0, 30, n_samples)

# Target tamamen random (feature'lara bağlı değil)
price = np.random.uniform(50, 300, n_samples)

df = pd.DataFrame({
    "area": area,
    "bedrooms": bedrooms,
    "age": age,
    "distance_to_city_center": distance_to_city_center,
    "price": price
})

# CSV olarak kaydet
df.to_csv("bad_house_dataset.csv", index=False)
print("Dataset saved as bad_house_dataset.csv")

# 2️⃣ Modeli eğit (LinearRegression)
X = df[["area", "bedrooms", "age", "distance_to_city_center"]]
y = df["price"]

bad_model = LinearRegression()
bad_model.fit(X, y)
print("Bad model trained")

# 3️⃣ Kaydet
with open("bad_house_model.pkl", "wb") as f:
    pickle.dump(bad_model, f)
print("Model saved as bad_house_model.pkl")

dump(bad_model, "bad_house_model.joblib")
print("Model saved as bad_house_model.joblib")

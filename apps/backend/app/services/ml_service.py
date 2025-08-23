"""
ML Service
Handles machine learning model analysis and SHAP calculations
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)
import shap
from typing import Dict, Any, List
import json

from app.models.ml_model import MLModel, Dataset, Prediction
from app.core.config import settings


class MLService:
    """Service for ML model analysis and visualization"""
    
    def __init__(self):
        self.explainer = None
    
    async def analyze_model(self, model: MLModel, dataset: Dataset) -> Dict[str, Any]:
        """
        Analyze a model with a dataset and generate insights
        """
        try:
            # Load model
            ml_model = joblib.load(model.file_path)
            
            # Load dataset
            df = pd.read_csv(dataset.file_path)
            
            # Prepare data
            if dataset.target_column:
                X = df.drop(columns=[dataset.target_column])
                y = df[dataset.target_column]
            else:
                # For MVP, assume last column is target
                X = df.iloc[:, :-1]
                y = df.iloc[:, -1]
            
            # Make predictions
            predictions = ml_model.predict(X)
            probabilities = ml_model.predict_proba(X) if hasattr(ml_model, 'predict_proba') else None
            
            # Calculate metrics
            metrics = self._calculate_metrics(y, predictions)
            
            # Generate SHAP values
            shap_values = await self._generate_shap_values(ml_model, X)
            
            # Create prediction record
            prediction_data = {
                "model": model,
                "dataset": dataset,
                "predictions": {
                    "predictions": predictions.tolist(),
                    "probabilities": probabilities.tolist() if probabilities is not None else None
                },
                "metrics": metrics,
                "shap_values": shap_values
            }
            
            prediction = await Prediction.create(**prediction_data)
            
            return {
                "prediction_id": prediction.id,
                "metrics": metrics,
                "shap_values": shap_values,
                "model_info": {
                    "name": model.name,
                    "type": model.model_type,
                    "algorithm": model.algorithm
                },
                "dataset_info": {
                    "name": dataset.name,
                    "rows": len(df),
                    "columns": len(df.columns)
                }
            }
            
        except Exception as e:
            raise Exception(f"Model analysis failed: {str(e)}")
    
    def _calculate_metrics(self, y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
        """
        Calculate performance metrics
        """
        metrics = {
            "accuracy": float(accuracy_score(y_true, y_pred)),
            "precision": float(precision_score(y_true, y_pred, average='weighted', zero_division=0)),
            "recall": float(recall_score(y_true, y_pred, average='weighted', zero_division=0)),
            "f1_score": float(f1_score(y_true, y_pred, average='weighted', zero_division=0))
        }
        
        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        metrics["confusion_matrix"] = cm.tolist()
        
        # Classification report
        report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
        metrics["classification_report"] = report
        
        return metrics
    
    async def _generate_shap_values(self, model: Any, X: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate SHAP values for model interpretability
        """
        try:
            # Sample data if too large
            if len(X) > settings.SHAP_SAMPLE_SIZE:
                X_sample = X.sample(n=settings.SHAP_SAMPLE_SIZE, random_state=42)
            else:
                X_sample = X
            
            # Limit features if too many
            if len(X_sample.columns) > settings.MAX_FEATURES_FOR_SHAP:
                # For MVP, take first N features
                X_sample = X_sample.iloc[:, :settings.MAX_FEATURES_FOR_SHAP]
            
            # Create SHAP explainer
            if hasattr(model, 'predict_proba'):
                # For classification models
                explainer = shap.TreeExplainer(model) if hasattr(model, 'feature_importances_') else shap.KernelExplainer(model.predict_proba, X_sample)
            else:
                # For regression models
                explainer = shap.TreeExplainer(model) if hasattr(model, 'feature_importances_') else shap.KernelExplainer(model.predict, X_sample)
            
            # Calculate SHAP values
            shap_values = explainer.shap_values(X_sample)
            
            # Prepare SHAP data for JSON serialization
            shap_data = {
                "feature_names": X_sample.columns.tolist(),
                "feature_values": X_sample.values.tolist(),
                "shap_values": shap_values.tolist() if isinstance(shap_values, np.ndarray) else [sv.tolist() for sv in shap_values],
                "expected_value": explainer.expected_value.tolist() if hasattr(explainer, 'expected_value') else None,
                "base_values": explainer.base_values.tolist() if hasattr(explainer, 'base_values') else None
            }
            
            return shap_data
            
        except Exception as e:
            # Return empty SHAP data if calculation fails
            print(f"SHAP calculation failed: {e}")
            return {
                "feature_names": [],
                "feature_values": [],
                "shap_values": [],
                "expected_value": None,
                "base_values": None,
                "error": str(e)
            }
    
    async def get_model_info(self, model: MLModel) -> Dict[str, Any]:
        """
        Get detailed information about a model
        """
        try:
            ml_model = joblib.load(model.file_path)
            
            info = {
                "name": model.name,
                "type": model.model_type,
                "algorithm": type(ml_model).__name__,
                "parameters": ml_model.get_params() if hasattr(ml_model, 'get_params') else {},
                "feature_names": None,
                "feature_importances": None
            }
            
            # Get feature names if available
            if hasattr(ml_model, 'feature_names_in_'):
                info["feature_names"] = ml_model.feature_names_in_.tolist()
            
            # Get feature importances if available
            if hasattr(ml_model, 'feature_importances_'):
                info["feature_importances"] = ml_model.feature_importances_.tolist()
            
            return info
            
        except Exception as e:
            raise Exception(f"Error getting model info: {str(e)}")
    
    async def compare_models(self, model_ids: List[int], dataset_id: int) -> Dict[str, Any]:
        """
        Compare multiple models on the same dataset
        """
        # TODO: Implement model comparison functionality
        return {"message": "Model comparison - to be implemented"}

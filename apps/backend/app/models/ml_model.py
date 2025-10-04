"""
ML Model database model
"""

from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from datetime import datetime


class MLModel(models.Model):
    """ML Model entity"""
    
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, description="Model name")
    description = fields.TextField(null=True, description="Model description")
    file_path = fields.CharField(max_length=500, description="Path to model file")
    model_type = fields.CharField(max_length=100, description="Type of model (classification, regression, etc.)")
    algorithm = fields.CharField(max_length=100, null=True, description="Algorithm used")
    accuracy = fields.FloatField(null=True, description="Model accuracy")
    created_at = fields.DatetimeField(auto_now_add=True, description="Creation timestamp")
    updated_at = fields.DatetimeField(auto_now=True, description="Last update timestamp")
    
    # Relationships
    predictions = fields.ReverseRelation["Prediction"]
    
    class Meta:
        table = "ml_models"
        table_description = "Machine learning models"
    
    def __str__(self):
        return f"{self.name} ({self.model_type})"


class Dataset(models.Model):
    """Dataset entity"""
    
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, description="Dataset name")
    description = fields.TextField(null=True, description="Dataset description")
    file_path = fields.CharField(max_length=500, description="Path to dataset file")
    row_count = fields.IntField(null=True, description="Number of rows")
    column_count = fields.IntField(null=True, description="Number of columns")
    target_column = fields.CharField(max_length=100, null=True, description="Target column name")
    created_at = fields.DatetimeField(auto_now_add=True, description="Creation timestamp")
    
    # Relationships
    predictions = fields.ReverseRelation["Prediction"]
    
    class Meta:
        table = "datasets"
        table_description = "Datasets for model analysis"
    
    def __str__(self):
        return f"{self.name} ({self.row_count} rows, {self.column_count} cols)"


class Prediction(models.Model):
    """Model prediction results"""
    
    id = fields.IntField(pk=True)
    model = fields.ForeignKeyField("models.MLModel", related_name="predictions", description="Associated model")
    dataset = fields.ForeignKeyField("models.Dataset", related_name="predictions", description="Associated dataset")
    predictions = fields.JSONField(description="Model predictions")
    metrics = fields.JSONField(description="Performance metrics")
    shap_values = fields.JSONField(null=True, description="SHAP values")
    created_at = fields.DatetimeField(auto_now_add=True, description="Creation timestamp")
    
    class Meta:
        table = "predictions"
        table_description = "Model prediction results"
    
    def __str__(self):
        return f"Prediction {self.id} - {self.model.name} on {self.dataset.name}"


# Note: Pydantic models are defined in schemas/ directory
# This avoids conflicts with Tortoise ORM model_config field

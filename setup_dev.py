#!/usr/bin/env python3
"""
Development setup script for Meovis MVP
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, cwd=None, description=""):
    """Run a command and handle errors"""
    print(f"[RUNNING] {description}")
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[ERROR] {result.stderr}")
            return False
        print(f"[SUCCESS] {description} completed")
        return True
    except Exception as e:
        print(f"[ERROR] Error running command: {e}")
        return False

def setup_backend():
    """Setup backend environment"""
    print("\n[SETUP] Setting up Backend...")
    print("=" * 40)
    
    backend_dir = Path("apps/backend")
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", cwd=backend_dir, description="Installing Python dependencies"):
        return False
    
    # Create upload directories
    os.makedirs("apps/backend/uploads/datasets", exist_ok=True)
    os.makedirs("apps/backend/uploads/models", exist_ok=True)
    print("[SUCCESS] Created upload directories")
    
    return True

def setup_frontend():
    """Setup frontend environment"""
    print("\n[SETUP] Setting up Frontend...")
    print("=" * 40)
    
    frontend_dir = Path("apps/frontend")
    
    # Install Node dependencies
    if not run_command("npm install", cwd=frontend_dir, description="Installing Node dependencies"):
        return False
    
    return True

def main():
    """Main setup function"""
    print("[SETUP] Setting up Meovis MVP Development Environment")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path("apps").exists():
        print("[ERROR] Please run this script from the project root directory")
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("[ERROR] Backend setup failed")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("[ERROR] Frontend setup failed")
        sys.exit(1)
    
    print("\n[SUCCESS] Setup completed successfully!")
    print("\n[INFO] Next steps:")
    print("1. Start backend: cd apps/backend && python -m uvicorn app.main:app --reload")
    print("2. Start frontend: cd apps/frontend && npm run dev")
    print("3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main()

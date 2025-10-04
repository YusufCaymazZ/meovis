#!/usr/bin/env python3
"""
Simple test runner for MVP backend tests
"""

import subprocess
import sys
import os

def run_tests():
    """Run backend tests"""
    print("Running Meovis Backend Tests...")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    try:
        # Run pytest
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "-v", 
            "--tb=short"
        ], capture_output=True, text=True)
         
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        if result.returncode == 0:
            print("\n[SUCCESS] All tests passed!")
        else:
            print(f"\n[ERROR] Tests failed with exit code {result.returncode}")
            
        return result.returncode == 0
        
    except Exception as e:
        print(f"[ERROR] Error running tests: {e}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

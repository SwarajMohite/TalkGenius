#!/usr/bin/env python3
import subprocess
import sys
import re
from pathlib import Path

def run_command(cmd):
    """Run shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {cmd}")
        return ""

def get_project_specific_deps():
    """Get ONLY the dependencies your project actually imports"""
    print("🔍 Scanning your project code for imports...")
    
    # Install pipreqs if not available
    run_command("pip install pipreqs")
    
    # Generate requirements from actual imports
    run_command("pipreqs . --force --encoding=utf-8 --savepath project_imports.txt")
    
    try:
        with open("project_imports.txt", "r") as f:
            deps = [line.strip() for line in f if line.strip()]
        
        # Clean up
        Path("project_imports.txt").unlink(missing_ok=True)
        
        print(f"✅ Found {len(deps)} packages imported in your code")
        return set(deps)
    except FileNotFoundError:
        print("⚠️  pipreqs didn't generate requirements")
        return set()

def get_versions_for_packages(package_names):
    """Get exact versions for specific packages"""
    print("📦 Getting exact versions for your packages...")
    
    all_packages = run_command("pip freeze")
    if not all_packages:
        return set()
    
    frozen_dict = {}
    for line in all_packages.split('\n'):
        if '==' in line:
            pkg, version = line.split('==', 1)
            frozen_dict[pkg.lower()] = line
    
    # Match packages with versions
    result = set()
    for pkg in package_names:
        pkg_clean = pkg.split('==')[0].split('>=')[0].strip().lower()
        if pkg_clean in frozen_dict:
            result.add(frozen_dict[pkg_clean])
        else:
            result.add(pkg)  # Keep without version if not found
    
    return result

def add_critical_dependencies(project_deps):
    """Add critical dependencies that might not be detected by pipreqs"""
    print("🎯 Adding critical platform dependencies...")
    
    # These are essential for your AI platform but might not be directly imported
    critical_deps = {
        # AI/ML Core
        "openai", "anthropic", "langchain",
        
        # Web Framework
        "fastapi", "uvicorn", "python-multipart",
        
        # Audio Processing
        "pydub",
        
        # Database
        "sqlalchemy", "psycopg2-binary",
        
        # Authentication
        "python-jose", "python-dotenv",
        
        # Utilities
        "requests", "pytz"
    }
    
    # Only add if not already detected
    current_pkg_names = {pkg.split('==')[0].lower() for pkg in project_deps}
    missing_critical = critical_deps - current_pkg_names
    
    if missing_critical:
        print(f"➕ Adding {len(missing_critical)} critical dependencies: {missing_critical}")
    
    return project_deps.union(missing_critical)

def create_perfect_requirements():
    """Create the perfect requirements.txt for your project"""
    print("🚀 Creating perfect requirements.txt for TalkGenius...")
    
    # Step 1: Get what your project actually uses
    project_deps = get_project_specific_deps()
    
    # Step 2: Add critical platform dependencies
    enhanced_deps = add_critical_dependencies(project_deps)
    
    # Step 3: Get exact versions
    final_deps = get_versions_for_packages(enhanced_deps)
    
    # Step 4: Sort and save
    sorted_deps = sorted(final_deps, key=lambda x: x.lower())
    
    with open("requirements.txt", "w") as f:
        f.write("# TalkGenius AI Roleplay Assessment Platform\n")
        f.write("# Generated using smart hybrid approach\n\n")
        f.write("\n".join(sorted_deps))
    
    print(f"✅ Perfect requirements.txt created with {len(sorted_deps)} packages!")
    print("📋 Generated packages:")
    for dep in sorted_deps:
        print(f"   📍 {dep}")

if __name__ == "__main__":
    create_perfect_requirements()
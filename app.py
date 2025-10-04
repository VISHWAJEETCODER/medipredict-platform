from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)

# Load colleges data from CSV
colleges_data = []

def load_colleges():
    global colleges_data
    try:
        with open('colleges_50_clean.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            colleges_data = list(reader)
        print(f"✅ Loaded {len(colleges_data)} colleges")
    except Exception as e:
        print(f"❌ Error loading colleges: {e}")

load_colleges()

# Home route
@app.route('/')
def home():
    return jsonify({
        "message": "MediPredict API is running!",
        "version": "1.0",
        "total_colleges": len(colleges_data)
    })

# Prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict_colleges():
    try:
        data = request.json
        rank = int(data.get('rank'))
        category = data.get('category', 'general').lower()
        
        # Map category to cutoff column
        category_map = {
            'general': 'cutoff_gen',
            'unreserved': 'cutoff_gen',
            'obc': 'cutoff_obc',
            'sc': 'cutoff_sc',
            'st': 'cutoff_st',
            'ews': 'cutoff_ews'
        }
        
        cutoff_column = category_map.get(category, 'cutoff_gen')
        
        # Filter and calculate chances
        results = []
        for college in colleges_data:
            try:
                cutoff = int(college.get(cutoff_column, 999999))
                
                # Calculate chance percentage
                if rank <= cutoff - 500:
                    chance = min(95, 85 + (cutoff - rank) // 100)
                    chance_level = "High"
                elif rank <= cutoff:
                    chance = min(85, 60 + (cutoff - rank) // 50)
                    chance_level = "High"
                elif rank <= cutoff + 500:
                    chance = max(40, 60 - (rank - cutoff) // 20)
                    chance_level = "Medium"
                elif rank <= cutoff + 2000:
                    chance = max(20, 40 - (rank - cutoff) // 100)
                    chance_level = "Medium"
                else:
                    chance = max(5, 20 - (rank - cutoff) // 500)
                    chance_level = "Low"
                
                results.append({
                    'college_name': college['college_name'],
                    'state': college['state'],
                    'type': college['type'],
                    'fees': college['fees'],
                    'seats': college['seats'],
                    'cutoff': cutoff,
                    'chance': chance,
                    'chance_level': chance_level
                })
            except:
                continue
        
        # Sort by chance (highest first)
        results.sort(key=lambda x: x['chance'], reverse=True)
        
        return jsonify({
            "status": "success",
            "total_matches": len(results),
            "your_rank": rank,
            "category": category,
            "colleges": results[:30]  # Return top 30
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# Get all colleges
@app.route('/api/colleges', methods=['GET'])
def get_colleges():
    return jsonify({
        "status": "success",
        "total": len(colleges_data),
        "colleges": colleges_data
    })

# Search college by name
@app.route('/api/college/<college_name>', methods=['GET'])
def search_college(college_name):
    results = [c for c in colleges_data if college_name.lower() in c['college_name'].lower()]
    return jsonify({
        "status": "success",
        "results": results
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

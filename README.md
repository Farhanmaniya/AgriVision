# 🌾 AgriSmart - AI-Powered Crop Yield Prediction Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)

## 📋 Project Overview

**AgriSmart** is a comprehensive agricultural intelligence platform that leverages artificial intelligence and machine learning to provide farmers with data-driven insights for optimal crop management. The platform combines real-time weather data, soil analysis, pest detection, and market analytics to deliver actionable recommendations for maximizing crop yield and profitability.

### 🎯 Mission Statement
Empowering farmers with cutting-edge AI technology to make informed decisions, increase productivity, and promote sustainable agriculture practices.

## ✨ Key Features

### 🌱 Core Agricultural Modules
- **🔮 AI-Powered Crop Yield Prediction** - Advanced ML algorithms predict yields with 94% accuracy
- **💰 Profitable Crops Predictor** - Smart crop recommendations based on soil nutrients and market profitability
- **🌿 Soil Health Monitor** - Real-time soil analysis with NPK levels, pH monitoring, and health scoring
- **🐛 Pest Detection System** - AI-based pest identification using computer vision technology
- **🌤️ Weather Intelligence** - Comprehensive weather monitoring and forecasting integration
- **💧 Smart Irrigation Management** - Optimize water usage with intelligent scheduling
- **📊 Advanced Analytics & Reports** - Comprehensive data visualization and insights dashboard

### 🤖 AI/ML Capabilities
- **Machine Learning Models** - Custom-trained models for yield forecasting and crop recommendations
- **Computer Vision** - Deep learning-based pest and disease identification
- **Predictive Analytics** - Weather pattern analysis and climate-based recommendations
- **Market Intelligence** - Profit optimization algorithms and price trend analysis
- **Risk Assessment** - Comprehensive analysis including weather risks and market volatility

### 🌍 Additional Features
- **Multi-language Support** - Available in English, Hindi, and Gujarati
- **Real-time Data Integration** - Live weather data and environmental monitoring
- **Mobile-Responsive Design** - Optimized for all devices and screen sizes
- **Secure Authentication** - JWT-based user authentication and data protection

## 🛠️ Technology Stack

### Frontend
```
React 18          - Modern UI framework with concurrent features
Vite             - Lightning-fast build tool and development server
TailwindCSS      - Utility-first CSS framework
Redux Toolkit    - Simplified state management
React Router v6  - Declarative routing
i18next          - Internationalization framework
Framer Motion    - Smooth animations and transitions
Lucide React     - Beautiful icon library
D3.js & Recharts - Advanced data visualization
```

### Backend
```
FastAPI          - High-performance Python web framework
Uvicorn          - Lightning-fast ASGI server
Pydantic         - Data validation and settings management
SQLAlchemy       - SQL toolkit and ORM
PostgreSQL       - Robust relational database
JWT              - Secure authentication tokens
CORS Middleware  - Cross-origin resource sharing
```

### AI/ML Stack
```
Scikit-learn     - Machine learning algorithms
TensorFlow       - Deep learning framework
Keras            - High-level neural networks API
NumPy            - Numerical computing
Pandas           - Data manipulation and analysis
OpenCV           - Computer vision library
Joblib           - Model serialization
```

### External APIs
```
OpenWeatherMap   - Real-time weather data
Geolocation APIs - Location-based services
Market Data APIs - Agricultural commodity prices
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.0 or higher)
- **Python** (3.8 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Crop-Yield-Prediction.git
   cd AI-Crop-Yield-Prediction/agrismart
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   # Server runs on http://localhost:3001
   ```

3. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd app
   
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Start FastAPI server
   python main.py
   # API runs on http://localhost:8000
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Weather API
   REACT_APP_WEATHER_API_KEY=your_openweather_api_key
   
   # Backend URL
   VITE_BACKEND_URL=http://localhost:8000
   
   # Database (if using external DB)
   DATABASE_URL=your_database_url
   
   # JWT Secret
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

## 💡 Usage Examples

### 1. Crop Yield Prediction
```python
# Example API request for crop prediction
POST /api/crop-prediction/recommend
{
  "nitrogen": 90.0,
  "phosphorus": 42.0,
  "potassium": 43.0,
  "temperature": 20.87,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.93
}

# Response
{
  "success": true,
  "recommendations": [
    {
      "crop_name": "Rice",
      "confidence": 0.94,
      "suitability_score": 94.2,
      "expected_yield": "4.5 tons/hectare"
    }
  ]
}
```

### 2. Soil Health Analysis
```javascript
// Frontend usage example
const soilData = {
  ph: 6.8,
  nitrogen: 45,
  phosphorus: 35,
  potassium: 42,
  organic_matter: 3.2,
  moisture: 28
};

const healthScore = await soilHealthService.analyzeSoil(soilData);
console.log(`Soil Health Score: ${healthScore.overall_score}/100`);
```

### 3. Pest Detection
```python
# Upload image for pest detection
POST /api/pest-detection/analyze
Content-Type: multipart/form-data

# Response
{
  "pest_detected": true,
  "pest_name": "Aphids",
  "confidence": 0.89,
  "treatment_recommendations": [
    "Apply neem oil spray",
    "Introduce beneficial insects"
  ]
}
```

## 📁 Project Structure

```
AI-Crop-Yield-Prediction/
├── agrismart/                    # Main application directory
│   ├── src/                      # Frontend source code
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── profitable-crops/ # Crop prediction
│   │   │   ├── soil-health-monitor/ # Soil analysis
│   │   │   ├── pest-detection/  # Pest identification
│   │   │   └── reports-analytics/ # Data insights
│   │   ├── lib/                 # Utility libraries
│   │   ├── services/            # API service layers
│   │   ├── i18n/               # Internationalization
│   │   └── styles/             # Global styles
│   ├── app/                     # Backend API
│   │   ├── routers/            # API endpoints
│   │   ├── models/             # Data schemas
│   │   ├── services/           # Business logic
│   │   ├── ml_models/          # Machine learning models
│   │   └── main.py             # FastAPI application
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── requirements.txt        # Backend dependencies
├── docs/                       # Documentation
└── README.md                   # This file
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/reset-password` - Reset password

### Core Features
- `POST /api/crop-prediction/recommend` - Get crop recommendations
- `POST /api/soil-health/analyze` - Analyze soil health
- `POST /api/pest-detection/analyze` - Detect pests in images
- `GET /api/weather/current` - Current weather data
- `GET /api/weather/forecast` - Weather forecast

### Data & Analytics
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/reports/generate` - Generate reports
- `GET /api/market/prices` - Market price data

For complete API documentation, visit: `http://localhost:8000/docs`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style Guidelines
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all tests pass before submitting

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed descriptions
- Include steps to reproduce
- Add screenshots if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AgriSmart Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data API
- **React Team** for the amazing frontend framework
- **FastAPI Team** for the high-performance backend framework
- **TailwindCSS** for the utility-first CSS framework
- **Agricultural Research Community** for domain expertise
- **Open Source Contributors** who made this project possible

## 📞 Support & Contact

- **Documentation**: [Project Wiki](https://github.com/yourusername/AI-Crop-Yield-Prediction/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/AI-Crop-Yield-Prediction/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/AI-Crop-Yield-Prediction/discussions)

## 🔮 Future Roadmap

- [ ] **Mobile Application** - Native iOS and Android apps
- [ ] **IoT Integration** - Real-time sensor data integration
- [ ] **Satellite Imagery** - Advanced crop monitoring from space
- [ ] **Blockchain Integration** - Supply chain transparency
- [ ] **Advanced ML Models** - Enhanced prediction accuracy
- [ ] **Community Features** - Farmer networking and knowledge sharing
- [ ] **Marketplace Integration** - Direct crop selling platform

---

**Built with ❤️ for sustainable agriculture and smart farming**

*Empowering farmers worldwide with AI-driven agricultural intelligence*
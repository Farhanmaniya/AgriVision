import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { TrendingUp, BarChart3, Leaf, AlertCircle, RefreshCw } from 'lucide-react';
import modelPredictionService from '../../../lib/modelPredictionService';
import YieldPredictionModal from '../../../components/yield-prediction-modal';
import YieldPredictionDialog from '../../../components/YieldPredictionDialog';

const CropYieldCard = ({ soilData, weatherData }) => {
  const [yieldData, setYieldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPredictDialog, setShowPredictDialog] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);

  // Enhanced fallback data with realistic agricultural insights
  const fallbackData = {
    crops: [
      {
        name: 'Wheat',
        current: '3.2 tons/ha',
        predicted: '4.1 tons/ha',
        efficiency: '78%',
        trend: 'positive',
        confidence: 85,
        factors: {
          soil: 'Good pH levels, adequate nitrogen',
          weather: 'Favorable rainfall pattern',
          pest: 'Low risk detected'
        }
      },
      {
        name: 'Rice',
        current: '2.8 tons/ha',
        predicted: '3.5 tons/ha',
        efficiency: '82%',
        trend: 'positive',
        confidence: 79,
        factors: {
          soil: 'Optimal moisture retention',
          weather: 'Consistent temperature',
          pest: 'Moderate monitoring needed'
        }
      },
      {
        name: 'Corn',
        current: '4.1 tons/ha',
        predicted: '4.8 tons/ha',
        efficiency: '88%',
        trend: 'positive',
        confidence: 91,
        factors: {
          soil: 'Rich organic content',
          weather: 'Ideal growing conditions',
          pest: 'Preventive measures effective'
        }
      }
    ],
    overallConfidence: 85,
    lastUpdated: new Date().toLocaleDateString(),
    insights: [
      'Soil conditions are 15% better than last season',
      'Weather patterns favor increased yields',
      'Pest management strategies showing effectiveness'
    ]
  };

  // Sample data for demonstration
  const sampleSoilData = {
    ph: 6.8,
    nitrogen: 45,
    phosphorus: 35,
    potassium: 42,
    organic_matter: 3.2,
    moisture: 28
  };

  const sampleWeatherData = {
    temperature: 24,
    humidity: 68,
    rainfall: 85,
    wind_speed: 12,
    pressure: 1015
  };

  const sampleCropData = {
    crop_type: 'wheat',
    area: 2.5,
    planting_date: '2024-03-15'
  }

  const generatePredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use provided data or fallback to sample data
      const inputData = {
        soilData: soilData || sampleSoilData,
        weatherData: weatherData || sampleWeatherData,
        location: 'Smart Farm Location',
        cropType: 'Mixed Crops'
      };

      const result = await modelPredictionService.generatePredictions(inputData);
      setYieldData(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Using fallback data due to prediction service unavailability');
      // Use enhanced fallback data when service fails
      setYieldData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate predictions on component mount
    generatePredictions();
  }, []);

  const handleRefreshAnalysis = () => {
    generatePredictions();
  };

  const handleYieldPrediction = async (formData) => {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch('http://localhost:8000/api/dashboard/yield-prediction', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          state: formData.state,
          district: formData.district,
          crop: formData.crop,
          year: formData.year.toString(),
          season: formData.season,
          area: parseFloat(formData.area)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Store the prediction results to display in the card
      // The backend returns data nested under 'data' key
      setPredictionResults(result.data || result);
      
      // Close the dialog
      setShowPredictDialog(false);
      
      // No need to call generatePredictions() again since we already have the prediction results
      
    } catch (error) {
      console.error('Error making yield prediction:', error);
      // You might want to show an error message to the user here
      alert('Failed to make yield prediction. Please try again.');
    }
  };

  if (showAnalysis && yieldData) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setShowAnalysis(false)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <EnhancedYieldAnalysis 
          predictionData={yieldData}
          onRefresh={handleRefreshAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-agricultural h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Leaf size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Crop Yield Prediction</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-success">
            Confidence
          </div>
          <div className="text-lg font-bold text-success">
            {predictionResults?.confidence || yieldData?.overallConfidence || 'NaN'}%
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Generating predictions...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-error">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {yieldData?.crops?.map((crop, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Leaf size={16} color="var(--color-success)" />
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">{crop?.name || 'Unknown Crop'}</div>
                    <div className="text-xs text-muted-foreground">
                      Current: {crop?.current || 'N/A'} • {crop?.efficiency || 'N/A'} efficiency
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-card-foreground">
                    Predicted: {crop?.predicted || 'N/A'} ({crop?.confidence || 0}% confidence)
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} color="var(--color-success)" />
                    <span className="text-xs font-medium text-success">
                      +{crop?.trend === 'positive' ? 'Improving' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Display Latest Prediction Results */}
            {predictionResults && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                  <TrendingUp size={16} className="mr-2" />
                  Latest Yield Prediction
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-green-600 font-medium">Predicted Yield</div>
                    <div className="text-lg font-bold text-green-800">
                      {predictionResults.predicted_yield_tons_per_hectare} tons/ha
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600 font-medium">Total Production</div>
                    <div className="text-lg font-bold text-green-800">
                      {predictionResults.total_production_tons} tons
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600 font-medium">Confidence</div>
                    <div className="text-lg font-bold text-green-800">
                      {predictionResults.confidence}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600 font-medium">Category</div>
                    <div className="text-lg font-bold text-green-800">
                      {predictionResults.yield_category}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-700">
                  <strong>Crop:</strong> {predictionResults?.input_parameters?.crop || 'N/A'} • 
                  <strong> State:</strong> {predictionResults?.input_parameters?.state || 'N/A'} • 
                  <strong> Season:</strong> {predictionResults?.input_parameters?.season || 'N/A'}
                </div>
                {predictionResults.recommendations && predictionResults.recommendations.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-green-800 mb-1">Recommendations:</div>
                    <ul className="text-xs text-green-700 space-y-1">
                      {predictionResults.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {yieldData?.insights && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <h4 className="text-sm font-medium text-card-foreground mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {yieldData.insights.map((insight, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => setShowPredictDialog(true)}
                className="flex-1"
                size="sm"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Predict Yield
              </Button>
              <Button 
                onClick={() => setShowModal(true)}
                className="flex-1"
                size="sm"
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
              <Button
                onClick={generatePredictions}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
       
      {/* Yield Prediction Modal */}
      <YieldPredictionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        soilData={soilData}
        weatherData={weatherData}
      />
      
      {/* Yield Prediction Dialog */}
      <YieldPredictionDialog
        isOpen={showPredictDialog}
        onClose={() => setShowPredictDialog(false)}
        onPredict={handleYieldPrediction}
      />
    </div>
  );
};

export default CropYieldCard;
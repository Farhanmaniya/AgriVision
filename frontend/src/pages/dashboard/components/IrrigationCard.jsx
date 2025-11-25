import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const IrrigationCard = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [logLoading, setLogLoading] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    crop_type: 'wheat',
    soil_moisture: 25,
    field_size: 1.0,
    crop_stage: '',
    soil_type: 'loamy',
    latitude: 28.6139,
    longitude: 77.2090
  });

  const cropTypes = [
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'maize', label: 'Maize' },
    { value: 'paddy', label: 'Paddy' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' }
  ];

  const cropStages = {
    wheat: ['germination', 'tillering', 'flowering', 'grain_filling'],
    rice: ['transplanting', 'tillering', 'flowering', 'grain_filling'],
    maize: ['germination', 'vegetative', 'flowering', 'grain_filling'],
    paddy: ['transplanting', 'tillering', 'flowering', 'grain_filling'],
    tomato: ['seedling', 'vegetative', 'flowering', 'fruiting'],
    cotton: ['germination', 'squaring', 'flowering', 'boll_development'],
    sugarcane: ['germination', 'tillering', 'grand_growth', 'maturity']
  };

  const soilTypes = [
    { value: 'clay', label: 'Clay' },
    { value: 'sandy', label: 'Sandy' },
    { value: 'loamy', label: 'Loamy' },
    { value: 'silt', label: 'Silt' }
  ];

  // Fetch weather data including rainfall
  const fetchWeatherData = async (lat = formData.latitude, lon = formData.longitude) => {
    setLocationLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/weather/current?lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLocationLoading(false);
    }
    return null;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lon
          }));
          await fetchWeatherData(lat, lon);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
          fetchWeatherData();
        }
      );
    } else {
      fetchWeatherData();
    }
  };

  const fetchIrrigationRecommendation = async () => {
    setLoading(true);
    setError(null);
    setLogSuccess(false);
    
    try {
      const params = new URLSearchParams({
        crop_type: formData.crop_type,
        soil_moisture: formData.soil_moisture.toString(),
        field_size: formData.field_size.toString(),
        soil_type: formData.soil_type,
        latitude: formData.latitude.toString(),
        longitude: formData.longitude.toString()
      });

      if (formData.crop_stage) {
        params.append('crop_stage', formData.crop_stage);
      }

      const response = await fetch(`http://localhost:8000/api/irrigation/recommendation?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecommendation(data);
        setShowRecommendation(true); // Show recommendation view
      } else {
        throw new Error(data.message || 'Failed to get recommendation');
      }
    } catch (err) {
      console.error('Error fetching irrigation recommendation:', err);
      setError(err.message || 'Failed to fetch irrigation recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowRecommendation(false);
    setError(null);
    setLogSuccess(false);
  };

  const logIrrigationSchedule = async () => {
    if (!recommendation) return;
    
    setLogLoading(true);
    
    try {
      const logData = {
        user_id: "user_123", // This should come from authentication context
        crop_type: formData.crop_type,
        field_name: "Main Field", // This could be made configurable
        recommendation_data: {
          should_irrigate: recommendation.recommendation.should_irrigate,
          irrigation_time: recommendation.recommendation.irrigation_time,
          irrigation_amount: recommendation.recommendation.irrigation_amount_mm,
          next_check_interval: recommendation.recommendation.next_check_interval_days,
          reason: recommendation.recommendation.reason,
          weather_data: recommendation.weather_data,
          soil_moisture_status: recommendation.recommendation.soil_moisture_status
        }
      };

      const response = await fetch('http://localhost:8000/api/irrigation/log-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setLogSuccess(true);
        setTimeout(() => setLogSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to log schedule');
      }
    } catch (err) {
      console.error('Error logging irrigation schedule:', err);
      setError(err.message || 'Failed to log irrigation schedule');
    } finally {
      setLogLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMoistureStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatWeatherCondition = (condition) => {
    return condition?.charAt(0).toUpperCase() + condition?.slice(1) || 'Unknown';
  };

  useEffect(() => {
    // Auto-fetch weather data and recommendation when component mounts
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Fetch recommendation when weather data is available
    if (weatherData) {
      fetchIrrigationRecommendation();
    }
  }, [weatherData]);

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Droplets" size={20} color="var(--color-primary)" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">Smart Irrigation</h3>
        </div>
        {showRecommendation && (
          <Button
            onClick={handleBackToForm}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Back to Form</span>
          </Button>
        )}
      </div>

      {/* Content Area with Flex Growth */}
      <div className="flex-1 overflow-y-auto">
        {!showRecommendation ? (
          /* Form View */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Crop Type
                </label>
                <Select
                  value={formData.crop_type}
                  onChange={(value) => handleInputChange('crop_type', value)}
                  options={cropTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Growth Stage
                </label>
                <Select
                  value={formData.crop_stage}
                  onChange={(value) => handleInputChange('crop_stage', value)}
                  options={[
                    { value: "", label: "Select stage" },
                    ...(cropStages[formData.crop_type]?.map(stage => ({
                      value: stage,
                      label: stage.charAt(0).toUpperCase() + stage.slice(1).replace('_', ' ')
                    })) || [])
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Soil Moisture (%)
                </label>
                <Input
                  type="number"
                  value={formData.soil_moisture}
                  onChange={(e) => handleInputChange('soil_moisture', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Field Size (ha)
                </label>
                <Input
                  type="number"
                  value={formData.field_size}
                  onChange={(e) => handleInputChange('field_size', parseFloat(e.target.value) || 1)}
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Soil Type
                </label>
                <Select
                  value={formData.soil_type}
                  onChange={(value) => handleInputChange('soil_type', value)}
                  options={soilTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Rainfall Data
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                    {locationLoading ? (
                      <div className="flex items-center space-x-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        <span className="text-sm text-gray-600">Loading...</span>
                      </div>
                    ) : weatherData ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Icon name="CloudRain" size={16} color="var(--color-primary)" />
                          <span className="text-sm font-medium">
                            {weatherData.rainfall || weatherData.rain?.['1h'] || 0} mm/h
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {weatherData.weather?.[0]?.description || 'Current conditions'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No data available</div>
                    )}
                  </div>
                  <Button
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="MapPin" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} color="var(--color-destructive)" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Recommendation View */
          <div className="space-y-4">
            {/* Success Message */}
            {logSuccess && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <p className="text-sm text-success">Irrigation schedule logged successfully!</p>
                </div>
              </div>
            )}

            {/* Recommendation Display */}
            {recommendation && (
              <div className="space-y-4">
                {/* Main Recommendation Status */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        recommendation.recommendation.should_irrigate 
                          ? 'bg-primary/10' 
                          : 'bg-muted-foreground/10'
                      }`}>
                        <Icon 
                          name="Droplets" 
                          size={20} 
                          color={recommendation.recommendation.should_irrigate ? "var(--color-primary)" : "var(--color-muted-foreground)"} 
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">
                          {recommendation.recommendation.should_irrigate ? 'Irrigation Recommended' : 'No Irrigation Needed'}
                        </h4>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          getMoistureStatusColor(recommendation.recommendation.soil_moisture_status)
                        }`}>
                          {recommendation.recommendation.soil_moisture_status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Irrigation Details Grid */}
                  {recommendation.recommendation.should_irrigate && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name="Clock" size={16} color="var(--color-primary)" />
                          <span className="text-sm font-medium">Time</span>
                        </div>
                        <p className="text-sm font-semibold">{recommendation.recommendation.irrigation_time}</p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name="Droplets" size={16} color="var(--color-primary)" />
                          <span className="text-sm font-medium">Amount</span>
                        </div>
                        <p className="text-sm font-semibold">{recommendation.recommendation.irrigation_amount_mm}mm</p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name="Calendar" size={16} color="var(--color-primary)" />
                          <span className="text-sm font-medium">Next Check</span>
                        </div>
                        <p className="text-sm font-semibold">{recommendation.recommendation.next_check_interval_days} days</p>
                      </div>
                    </div>
                  )}

                  {/* Weather Info */}
                  {recommendation.weather_data && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Icon name="Cloud" size={16} />
                        <p className="text-sm font-medium text-card-foreground">Current Weather</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="Thermometer" size={14} />
                          <span className="text-sm">{Math.round(recommendation.weather_data.temperature)}°C</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Eye" size={14} />
                          <span className="text-sm">{recommendation.weather_data.humidity}% humidity</span>
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">
                          {formatWeatherCondition(recommendation.weather_data.weather_condition)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="bg-primary/5 p-3 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Recommendation Reason</p>
                        <p className="text-sm text-card-foreground">{recommendation.recommendation.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {recommendation.recommendation.should_irrigate && (
                    <Button
                      onClick={logIrrigationSchedule}
                      disabled={logLoading}
                      variant="success"
                      className="w-full"
                      loading={logLoading}
                    >
                      {logLoading ? "Logging..." : "Accept & Log Schedule"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {!showRecommendation && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            onClick={fetchIrrigationRecommendation}
            disabled={loading}
            className="w-full"
            loading={loading}
          >
            {loading ? "Analyzing..." : "Get Irrigation Recommendation"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default IrrigationCard;
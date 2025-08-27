// client/src/pages/admin/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  BsGear,
  BsSave,
  BsArrowClockwise,
  BsShop,
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
  BsCurrencyDollar,
  BsTruck,
  BsShield,
  BsEye,
  BsEyeSlash,
  BsCloudUpload,
  BsTrash,
  BsBell,
  BsToggleOff,
  BsToggleOn,
  BsKey,
  BsPalette,
  BsGlobe,
  BsClock,
  BsDatabase,
  BsExclamationTriangle,
  BsCheckCircle,
} from "react-icons/bs";

export default function Settings() {
  // State for different settings sections
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "GHHomegoods",
    storeDescription: "Premium home goods and lifestyle products for modern living",
    storeEmail: "info@ghhomegoods.com",
    storePhone: "+233 30 123 4567",
    storeAddress: "123 Independence Avenue, Accra, Ghana",
    currency: "GHS",
    timezone: "GMT",
    language: "en",
  });

  const [deliverySettings, setDeliverySettings] = useState({
    freeDeliveryThreshold: 200,
    standardDeliveryFee: 15,
    expressDeliveryFee: 30,
    deliveryRadius: 50,
    estimatedDeliveryTime: "1-3 business days",
    pickupAvailable: true,
    deliveryInstructions: "Please call customer before delivery",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    lowStockAlerts: true,
    customerSignupNotifications: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordComplexity: true,
    loginAttempts: 5,
    autoLogout: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cachingEnabled: true,
    analyticsEnabled: true,
    backupFrequency: "daily",
    dataRetention: 365,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Handle input changes
  const handleGeneralChange = (field, value) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleDeliveryChange = (field, value) => {
    setDeliverySettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSystemChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API calls
      const settings = {
        general: generalSettings,
        delivery: deliverySettings,
        notifications: notificationSettings,
        security: securitySettings,
        system: systemSettings,
      };

      console.log('Saving settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUnsavedChanges(false);
      // Show success message
      alert('Settings saved successfully!');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset settings to default
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      setGeneralSettings({
        storeName: "GHHomegoods",
        storeDescription: "Premium home goods and lifestyle products for modern living",
        storeEmail: "info@ghhomegoods.com",
        storePhone: "+233 30 123 4567",
        storeAddress: "123 Independence Avenue, Accra, Ghana",
        currency: "GHS",
        timezone: "GMT",
        language: "en",
      });
      setUnsavedChanges(true);
    }
  };

  const TabButton = ({ tabKey, label, icon: Icon, isActive, onClick }) => (
    <button
      className={`nav-link ${isActive ? 'active' : ''} d-flex align-items-center`}
      onClick={onClick}
      style={{
        border: 'none',
        background: isActive ? '#0d6efd' : 'transparent',
        color: isActive ? 'white' : '#6c757d',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '0.5rem',
      }}
    >
      <Icon className="me-2" size={16} />
      {label}
    </button>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="d-flex justify-content-between align-items-center py-2">
      <div>
        <div className="fw-semibold">{label}</div>
        {description && <small className="text-muted">{description}</small>}
      </div>
      <button
        className="btn p-0 border-0"
        onClick={() => onChange(!checked)}
        style={{ background: 'none' }}
      >
        {checked ? (
          <BsToggleOn size={24} className="text-primary" />
        ) : (
          <BsToggleOff size={24} className="text-secondary" />
        )}
      </button>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Settings</h1>
          <p className="text-muted mb-0">Manage system configuration and preferences</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary" 
            onClick={resetToDefaults}
            disabled={loading}
          >
            <BsArrowClockwise className="me-1" />
            Reset to Defaults
          </button>
          <button 
            className={`btn ${unsavedChanges ? 'btn-warning' : 'btn-outline-primary'}`}
            onClick={saveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <BsSave className="me-1" />
                {unsavedChanges ? 'Save Changes' : 'All Saved'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <BsExclamationTriangle className="me-2" />
          You have unsaved changes. Don't forget to save your settings.
        </div>
      )}

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title fw-semibold mb-3">Settings Categories</h6>
              <div className="nav flex-column">
                <TabButton
                  tabKey="general"
                  label="General"
                  icon={BsShop}
                  isActive={activeTab === "general"}
                  onClick={() => setActiveTab("general")}
                />
                <TabButton
                  tabKey="delivery"
                  label="Delivery & Shipping"
                  icon={BsTruck}
                  isActive={activeTab === "delivery"}
                  onClick={() => setActiveTab("delivery")}
                />
                <TabButton
                  tabKey="notifications"
                  label="Notifications"
                  icon={BsBell}
                  isActive={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                />
                <TabButton
                  tabKey="security"
                  label="Security"
                  icon={BsShield}
                  isActive={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                />
                <TabButton
                  tabKey="system"
                  label="System"
                  icon={BsDatabase}
                  isActive={activeTab === "system"}
                  onClick={() => setActiveTab("system")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-8">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                  <BsShop className="me-2" />
                  General Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Store Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={generalSettings.storeName}
                        onChange={(e) => handleGeneralChange('storeName', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Store Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={generalSettings.storeEmail}
                        onChange={(e) => handleGeneralChange('storeEmail', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={generalSettings.storePhone}
                        onChange={(e) => handleGeneralChange('storePhone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Currency</label>
                      <select
                        className="form-select"
                        value={generalSettings.currency}
                        onChange={(e) => handleGeneralChange('currency', e.target.value)}
                      >
                        <option value="GHS">Ghana Cedi (GH₵)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Timezone</label>
                      <select
                        className="form-select"
                        value={generalSettings.timezone}
                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                      >
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                        <option value="WAT">WAT (West Africa Time)</option>
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Language</label>
                      <select
                        className="form-select"
                        value={generalSettings.language}
                        onChange={(e) => handleGeneralChange('language', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="tw">Twi</option>
                        <option value="ga">Ga</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Store Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={generalSettings.storeDescription}
                    onChange={(e) => handleGeneralChange('storeDescription', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Store Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={generalSettings.storeAddress}
                    onChange={(e) => handleGeneralChange('storeAddress', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delivery Settings */}
          {activeTab === "delivery" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                  <BsTruck className="me-2" />
                  Delivery & Shipping Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Free Delivery Threshold (GH₵)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={deliverySettings.freeDeliveryThreshold}
                        onChange={(e) => handleDeliveryChange('freeDeliveryThreshold', parseFloat(e.target.value))}
                      />
                      <small className="text-muted">Orders above this amount get free delivery</small>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Standard Delivery Fee (GH₵)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={deliverySettings.standardDeliveryFee}
                        onChange={(e) => handleDeliveryChange('standardDeliveryFee', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Express Delivery Fee (GH₵)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={deliverySettings.expressDeliveryFee}
                        onChange={(e) => handleDeliveryChange('expressDeliveryFee', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Delivery Radius (km)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={deliverySettings.deliveryRadius}
                        onChange={(e) => handleDeliveryChange('deliveryRadius', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Estimated Delivery Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliverySettings.estimatedDeliveryTime}
                        onChange={(e) => handleDeliveryChange('estimatedDeliveryTime', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <ToggleSwitch
                        checked={deliverySettings.pickupAvailable}
                        onChange={(value) => handleDeliveryChange('pickupAvailable', value)}
                        label="Store Pickup Available"
                        description="Allow customers to pick up orders from store"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Delivery Instructions</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={deliverySettings.deliveryInstructions}
                    onChange={(e) => handleDeliveryChange('deliveryInstructions', e.target.value)}
                    placeholder="Default instructions for delivery personnel"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                  <BsBell className="me-2" />
                  Notification Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">Communication Channels</h6>
                    <ToggleSwitch
                      checked={notificationSettings.emailNotifications}
                      onChange={(value) => handleNotificationChange('emailNotifications', value)}
                      label="Email Notifications"
                      description="Receive notifications via email"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.smsNotifications}
                      onChange={(value) => handleNotificationChange('smsNotifications', value)}
                      label="SMS Notifications"
                      description="Receive notifications via SMS"
                    />
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">Notification Types</h6>
                    <ToggleSwitch
                      checked={notificationSettings.orderNotifications}
                      onChange={(value) => handleNotificationChange('orderNotifications', value)}
                      label="New Order Alerts"
                      description="Get notified when new orders are placed"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.lowStockAlerts}
                      onChange={(value) => handleNotificationChange('lowStockAlerts', value)}
                      label="Low Stock Alerts"
                      description="Alert when product stock is running low"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.customerSignupNotifications}
                      onChange={(value) => handleNotificationChange('customerSignupNotifications', value)}
                      label="New Customer Signups"
                      description="Notify when new customers register"
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">Reports</h6>
                    <ToggleSwitch
                      checked={notificationSettings.dailyReports}
                      onChange={(value) => handleNotificationChange('dailyReports', value)}
                      label="Daily Sales Reports"
                      description="Receive daily sales summary"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.weeklyReports}
                      onChange={(value) => handleNotificationChange('weeklyReports', value)}
                      label="Weekly Performance Reports"
                      description="Receive weekly business analytics"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                  <BsShield className="me-2" />
                  Security Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">Authentication</h6>
                    <ToggleSwitch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(value) => handleSecurityChange('twoFactorAuth', value)}
                      label="Two-Factor Authentication"
                      description="Add extra security to admin login"
                    />
                    <ToggleSwitch
                      checked={securitySettings.passwordComplexity}
                      onChange={(value) => handleSecurityChange('passwordComplexity', value)}
                      label="Password Complexity Requirements"
                      description="Require strong passwords"
                    />
                    <ToggleSwitch
                      checked={securitySettings.autoLogout}
                      onChange={(value) => handleSecurityChange('autoLogout', value)}
                      label="Auto Logout"
                      description="Automatically log out after inactivity"
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                        min="5"
                        max="120"
                      />
                      <small className="text-muted">Auto logout after this period of inactivity</small>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Max Login Attempts</label>
                      <input
                        type="number"
                        className="form-control"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                      <small className="text-muted">Lock account after this many failed attempts</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                  <BsDatabase className="me-2" />
                  System Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">System Status</h6>
                    <ToggleSwitch
                      checked={systemSettings.maintenanceMode}
                      onChange={(value) => handleSystemChange('maintenanceMode', value)}
                      label="Maintenance Mode"
                      description="Put the system in maintenance mode"
                    />
                    <ToggleSwitch
                      checked={systemSettings.debugMode}
                      onChange={(value) => handleSystemChange('debugMode', value)}
                      label="Debug Mode"
                      description="Enable detailed error logging"
                    />
                    <ToggleSwitch
                      checked={systemSettings.cachingEnabled}
                      onChange={(value) => handleSystemChange('cachingEnabled', value)}
                      label="Caching Enabled"
                      description="Enable system caching for better performance"
                    />
                    <ToggleSwitch
                      checked={systemSettings.analyticsEnabled}
                      onChange={(value) => handleSystemChange('analyticsEnabled', value)}
                      label="Analytics Tracking"
                      description="Enable data analytics and tracking"
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Backup Frequency</label>
                      <select
                        className="form-select"
                        value={systemSettings.backupFrequency}
                        onChange={(e) => handleSystemChange('backupFrequency', e.target.value)}
                      >
                        <option value="hourly">Every Hour</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Data Retention (days)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={systemSettings.dataRetention}
                        onChange={(e) => handleSystemChange('dataRetention', parseInt(e.target.value))}
                        min="30"
                        max="3650"
                      />
                      <small className="text-muted">How long to keep system logs and data</small>
                    </div>
                  </div>
                </div>
                
                {systemSettings.maintenanceMode && (
                  <div className="alert alert-warning mt-3" role="alert">
                    <BsExclamationTriangle className="me-2" />
                    <strong>Warning:</strong> Maintenance mode is enabled. Your store is currently offline to customers.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
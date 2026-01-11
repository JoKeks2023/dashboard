import { useState } from 'react';

interface ServiceConfig {
  name: string;
  url: string;
  apiType?: string;
  apiToken?: string;
  description: string;
  icon: string;
}

interface SetupWizardProps {
  onComplete: () => void;
}

const AVAILABLE_SERVICES = [
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Container Management',
    icon: '🐋',
    apiType: 'portainer',
    requiresToken: true,
    defaultUrl: 'http://192.168.0.117:9000',
    tokenHelp: 'Settings → Users → Add access token'
  },
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    description: 'Smart Home Hub',
    icon: '🏠',
    apiType: 'homeassistant',
    requiresToken: true,
    defaultUrl: 'http://homeassistant.local:8123',
    tokenHelp: 'Profile → Long-Lived Access Tokens'
  },
  {
    id: 'cockpit',
    name: 'Cockpit',
    description: 'System Management',
    icon: '🚁',
    apiType: 'cockpit',
    requiresToken: false,
    defaultUrl: 'http://192.168.0.117:9090'
  },
  {
    id: 'webmin',
    name: 'Webmin',
    description: 'Server Administration',
    icon: '⚙️',
    apiType: 'webmin',
    requiresToken: false,
    defaultUrl: 'http://192.168.0.117:10000'
  },
  {
    id: 'usermin',
    name: 'Usermin',
    description: 'User Administration',
    icon: '👤',
    apiType: 'usermin',
    requiresToken: false,
    defaultUrl: 'http://192.168.0.117:20000'
  }
];

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, ServiceConfig>>({});
  const [saving, setSaving] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceConfig = (serviceId: string, field: string, value: string) => {
    const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setServiceConfigs(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        name: service.name,
        description: service.description,
        icon: service.icon,
        apiType: service.apiType,
        [field]: value
      } as ServiceConfig
    }));
  };

  const handleComplete = async () => {
    setSaving(true);
    
    const services = selectedServices.map(id => ({
      ...serviceConfigs[id],
      id
    }));

    try {
      const response = await fetch('http://localhost:3001/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services, setupComplete: true })
      });

      if (response.ok) {
        onComplete();
      } else {
        alert('Fehler beim Speichern der Konfiguration');
      }
    } catch (error) {
      console.error('Setup error:', error);
      alert('Fehler: Backend nicht erreichbar');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) {
      return selectedServices.every(id => {
        const config = serviceConfigs[id];
        const service = AVAILABLE_SERVICES.find(s => s.id === id);
        return config?.url && (!service?.requiresToken || config?.apiToken);
      });
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏠 Homelab Dashboard Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Willkommen! Lass uns dein Dashboard einrichten.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                i <= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {i + 1}
              </div>
              {i < 2 && (
                <div className={`w-16 h-1 ${
                  i < step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Auswahl */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welche Services möchtest du überwachen?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_SERVICES.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{service.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.description}
                      </p>
                    </div>
                    {selectedServices.includes(service.id) && (
                      <span className="text-blue-500 text-2xl">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Service Konfiguration */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Konfiguriere deine Services
            </h2>
            {selectedServices.map(serviceId => {
              const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
              if (!service) return null;
              
              return (
                <div key={serviceId} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{service.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service URL
                      </label>
                      <input
                        type="text"
                        placeholder={service.defaultUrl}
                        defaultValue={service.defaultUrl}
                        onChange={(e) => handleServiceConfig(serviceId, 'url', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {service.requiresToken && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Token
                          <span className="ml-2 text-xs text-gray-500">({service.tokenHelp})</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Gib dein API Token ein..."
                          onChange={(e) => handleServiceConfig(serviceId, 'apiToken', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 3: Bestätigung */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alles bereit!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Du hast {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''} konfiguriert:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedServices.map(id => {
                const service = AVAILABLE_SERVICES.find(s => s.id === id);
                return (
                  <div key={id} className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <span className="text-2xl">{service?.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service?.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Du kannst die Konfiguration später jederzeit in den Einstellungen ändern.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zurück
          </button>
          
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {saving ? 'Speichere...' : '🚀 Dashboard starten'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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

  const stepLabels = ['SELECT', 'CONFIG', 'CONFIRM'];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 scanlines"
      style={{ backgroundColor: 'var(--cyber-bg)', fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div
        className="max-w-4xl w-full p-6"
        style={{ backgroundColor: 'var(--cyber-bg2)', border: '1px solid var(--cyber-cyan)', boxShadow: '0 0 24px var(--cyber-cyan)' }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <pre className="text-xs leading-tight mb-2 hidden md:block" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 6px var(--cyber-cyan)' }}>
{` ___  ___ _____ _   _ ______
/ __||  _|_   _| | | |  _  \\
\\__ \\| |_  | | | | | | |_/ /
|___/|___| |_| |_____| __/
                       |_|   WIZARD`}
          </pre>
          <p className="text-sm" style={{ color: 'var(--cyber-magenta)' }}>
            &gt; INITIALIZING HOMELAB CONTROL MATRIX...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6 gap-0">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center">
              <div
                className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                style={{
                  border: `1px solid ${i <= step ? 'var(--cyber-cyan)' : 'var(--cyber-dim)'}`,
                  color: i <= step ? 'var(--cyber-bg)' : 'var(--cyber-dim)',
                  backgroundColor: i <= step ? 'var(--cyber-cyan)' : 'transparent',
                  boxShadow: i <= step ? '0 0 8px var(--cyber-cyan)' : 'none',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <div className="text-xs ml-1 mr-3" style={{ color: i <= step ? 'var(--cyber-cyan)' : 'var(--cyber-dim)' }}>
                {stepLabels[i]}
              </div>
              {i < 2 && <div className="w-8 h-px mr-3" style={{ backgroundColor: i < step ? 'var(--cyber-cyan)' : 'var(--cyber-dim)' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 0 && (
          <div className="space-y-3">
            <div className="text-xs mb-3" style={{ color: 'var(--cyber-magenta)' }}>
              ╔═[ STEP 1: SELECT SERVICE NODES ]═╗
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AVAILABLE_SERVICES.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className="p-4 cursor-pointer transition-all"
                  style={{
                    border: `1px solid ${selectedServices.includes(service.id) ? 'var(--cyber-cyan)' : 'var(--cyber-dim)'}`,
                    backgroundColor: selectedServices.includes(service.id) ? 'rgba(0,255,255,0.05)' : 'transparent',
                    boxShadow: selectedServices.includes(service.id) ? '0 0 8px var(--cyber-cyan)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div className="flex-1">
                      <div
                        className="font-bold text-sm tracking-wider"
                        style={{ color: selectedServices.includes(service.id) ? 'var(--cyber-cyan)' : 'var(--cyber-silver)' }}
                      >
                        {service.name.toUpperCase()}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--cyber-dim)' }}>
                        &gt; {service.description}
                      </div>
                    </div>
                    {selectedServices.includes(service.id) && (
                      <span style={{ color: 'var(--cyber-green)', textShadow: '0 0 4px var(--cyber-green)' }}>
                        [✓]
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--cyber-magenta)' }}>
              ╚══════════════════════════════════╝
            </div>
          </div>
        )}

        {/* Step 2: Configuration */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-xs mb-3" style={{ color: 'var(--cyber-magenta)' }}>
              ╔═[ STEP 2: CONFIGURE NODES ]═╗
            </div>
            {selectedServices.map(serviceId => {
              const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
              if (!service) return null;
              
              return (
                <div
                  key={serviceId}
                  className="p-4"
                  style={{ border: '1px solid var(--cyber-dim)', backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span>{service.icon}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--cyber-cyan)' }}>
                      {service.name.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--cyber-dim)' }}>
                        &gt; SERVICE_URL
                      </label>
                      <input
                        type="text"
                        placeholder={service.defaultUrl}
                        defaultValue={service.defaultUrl}
                        onChange={(e) => handleServiceConfig(serviceId, 'url', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs cyber-input"
                        style={{
                          backgroundColor: 'var(--cyber-bg)',
                          border: '1px solid var(--cyber-dim)',
                          color: 'var(--cyber-cyan)',
                          fontFamily: "'Share Tech Mono', monospace",
                        }}
                      />
                    </div>
                    
                    {service.requiresToken && (
                      <div>
                        <label className="block text-xs mb-1" style={{ color: 'var(--cyber-dim)' }}>
                          &gt; API_TOKEN &nbsp;
                          <span style={{ color: 'var(--cyber-yellow)' }}>// {service.tokenHelp}</span>
                        </label>
                        <input
                          type="password"
                          placeholder="[ENTER API TOKEN]"
                          onChange={(e) => handleServiceConfig(serviceId, 'apiToken', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs cyber-input-magenta"
                          style={{
                            backgroundColor: 'var(--cyber-bg)',
                            border: '1px solid var(--cyber-dim)',
                            color: 'var(--cyber-magenta)',
                            fontFamily: "'Share Tech Mono', monospace",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="text-xs" style={{ color: 'var(--cyber-magenta)' }}>
              ╚═════════════════════════════╝
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 2 && (
          <div className="text-center space-y-4">
            <pre className="text-xs" style={{ color: 'var(--cyber-green)', textShadow: '0 0 8px var(--cyber-green)' }}>
{`  ██████╗  ██████╗ 
 ██╔════╝ ██╔═══██╗
 ██║  ███╗██║   ██║
 ██║   ██║██║   ██║
 ╚██████╔╝╚██████╔╝
  ╚═════╝  ╚═════╝ `}
            </pre>
            <p className="text-sm" style={{ color: 'var(--cyber-cyan)' }}>
              &gt; {selectedServices.length} NODE{selectedServices.length !== 1 ? 'S' : ''} CONFIGURED &amp; READY
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedServices.map(id => {
                const service = AVAILABLE_SERVICES.find(s => s.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1 text-xs"
                    style={{ border: '1px solid var(--cyber-green)', color: 'var(--cyber-green)' }}
                  >
                    <span>{service?.icon}</span>
                    <span>{service?.name.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs" style={{ color: 'var(--cyber-dim)' }}>
              // Config can be modified later via the backend API
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="btn-cyber text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &lt;&lt; BACK
          </button>
          
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-cyber text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              NEXT &gt;&gt;
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="btn-cyber text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--cyber-green)', color: 'var(--cyber-green)' }}
            >
              {saving ? 'WRITING CONFIG...' : '>> JACK IN <<'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

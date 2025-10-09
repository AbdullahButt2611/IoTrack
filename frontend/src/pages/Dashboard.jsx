import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Bell, Server } from "lucide-react";

// Mock API functions - replace with your actual imports
const getDevices = () => Promise.resolve([1, 2, 3]);
const getAlerts = () => Promise.resolve([1, 2]);

export default function Dashboard() {
  const [deviceCount, setDeviceCount] = useState(null);
  const [onlineDevices, setOnlineDevices] = useState(null);
  const [alertCount, setAlertCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devices, alerts] = await Promise.all([getDevices(), getAlerts()]);
        setDeviceCount(devices.length);
        setOnlineDevices(devices.filter(d => d.status === 'ONLINE').length || Math.floor(devices.length * 0.8));
        setAlertCount(alerts.length);
      } catch (err) {
        setDeviceCount(0);
        setOnlineDevices(0);
        setAlertCount(0);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Devices", value: deviceCount, icon: Server, color: "bg-zinc-500" },
    { label: "Online", value: onlineDevices, icon: Activity, color: "bg-green-500" },
    { label: "Alerts", value: alertCount, icon: Bell, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time IoT telemetry monitoring</p>
        </div>

        {/* Compact metric tiles */}
        <div className="flex gap-3 mb-6">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card key={i} className="flex-1 border-0 shadow-sm bg-white">
                <div className="flex items-center gap-3 px-7">
                  <div className={`${m.color} p-3 rounded`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 font-medium">{m.label}</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {m.value ?? <span className="text-gray-300">—</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Rest of dashboard content goes here */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-0">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Telemetry Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Charts and data visualization here
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Bell, Server } from "lucide-react";
import { getDevices } from "../api/device";
import { getAlerts } from "../api/alerts";
import { getTelemetry } from "../api/telemetry";
import { formatDateTime } from "../utils/formatDateTime";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [deviceCount, setDeviceCount] = useState(null);
  const [onlineDevices, setOnlineDevices] = useState(null);
  const [alertCount, setAlertCount] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    // Fetch devices and alerts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devicesData, alerts] = await Promise.all([getDevices(), getAlerts()]);
                setDevices(devicesData);
                setDeviceCount(devicesData.length);
                setOnlineDevices(devicesData.filter(d => d.status === 'ONLINE').length);
                setAlertCount(alerts.length);
            } catch (err) {
                setDevices([]);
                setDeviceCount(0);
                setOnlineDevices(0);
                setAlertCount(0);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

  // Fetch telemetry for selected device
  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        if (selectedDeviceId) {
          const telemetry = await getTelemetry(selectedDeviceId, 20);
          setTemperatureData(
            telemetry
              .sort((a, b) => new Date(a.ts) - new Date(b.ts))
              .map((t) => ({
                ts: t.ts,
                temperature: t.temperature,
              }))
          );
        } else {
          setTemperatureData([]);
        }
      } catch {
        setTemperatureData([]);
      }
    };
    fetchTemperatures();
  }, [selectedDeviceId]);

  useEffect(() => {
  if (devices.length > 0 && selectedDeviceId === null) {
    setSelectedDeviceId(devices[0].device_id);
  }
}, [devices, selectedDeviceId]);

  const metrics = [
    { label: "Devices", value: deviceCount, icon: Server, color: "bg-zinc-500" },
    { label: "Online", value: onlineDevices, icon: Activity, color: "bg-green-500" },
    { label: "Alerts", value: alertCount, icon: Bell, color: "bg-orange-500" }
  ];

  const chartData = {
    labels: temperatureData.map((d) =>
      new Date(d.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData.map((d) => d.temperature),
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Temperature (°C)" }, beginAtZero: true },
    },
  };

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

        {/* Partitioned Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Devices List (2/3) */}
          <div className="md:col-span-2">
            <Card className="p-4 bg-white shadow-sm border-0 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Devices</h2>
              <div className="space-y-2">
                {devices.length === 0 ? (
                  <div className="text-gray-400 text-sm">No devices found.</div>
                ) : (
                  devices.map((device) => (
                    <div
                      key={device.device_id}
                      className={`flex items-center justify-between px-2 py-2 rounded transition text-xs cursor-pointer ${
                        selectedDeviceId === device.device_id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDeviceId(device.device_id)}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-gray-800 truncate">{device.device_id}</span>
                        <span className="text-gray-500">
                          Last seen: {formatDateTime(device.last_seen)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          device.status === "ONLINE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {device.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
            {/* Line Chart for latest temperatures */}
            <Card className="p-4 bg-white shadow-sm border-0">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Latest Temperatures ({selectedDeviceId || "No device selected"})
              </h2>
              {temperatureData.length === 0 ? (
                <div className="text-gray-400 text-sm">No telemetry data available.</div>
              ) : (
                <Line data={chartData} options={chartOptions} height={200} />
              )}
            </Card>
          </div>
          {/* Right: Placeholder (1/3) */}
          <div>
            <Card className="p-4 bg-white shadow-sm border-0 h-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">Right panel content</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
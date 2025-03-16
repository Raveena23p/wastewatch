"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BinDetails from "./BinDetails";
import { Thermometer, Droplets, Wind, Battery } from "lucide-react";

export default function BinLocations() {
  interface Bin {
    id: string;
    name: string;
    location: string;
    fillLevel: number;
    temperature: number;
    humidity: number;
    gasProduction: number;
    batteryCharge: number;
    timestamp: string; // Added for filtering
  }

  const [binData, setBinData] = useState<Bin[]>([]);
  const [filteredData, setFilteredData] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>("day"); // Default: Day View

  useEffect(() => {
    const fetchData = () => {
      console.log("Fetching bin data...");

      fetch("/api/bindetails")
        .then((res) => res.json())
        .then((data) => {
          console.log("API Response:", data);

          if (data && Array.isArray(data.data)) {
            const formatted = formatBinData(data.data);
            console.log("Formatted Data:", formatted);
            setBinData([...formatted]); // Force update
            applyFilter(formatted, timeFilter); // Apply filter immediately
          } else {
            console.error("Unexpected response format:", data);
            setError("Invalid data format received.");
            setBinData([]);
          }
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setError("Failed to load bin data.");
          setBinData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilter(binData, timeFilter);
  }, [timeFilter, binData]);

  const formatBinData = (bins: any[]): Bin[] => {
    console.log("Formatting bin data:", bins);

    const expectedOrder = [
      "Quality Control",
      "Kitchen Area",
      "Cafeteria",
      "Production Line 1",
      "Production Line 2",
      "Office Area",
      "Packaging Area",
      "Storage Room",
    ];

    const formattedBins = bins.map((bin) => ({
      id: bin?.xata_id,
      name: bin.binname || "Unknown Bin",
      location: bin.address || "Unknown Location",
      fillLevel: Math.round((bin.fillcm / bin.binheight) * 100) || 0,
      temperature: bin.temperature || 0,
      humidity: bin.humidity || 0,
      gasProduction: bin.gasppm || 0,
      batteryCharge: bin.battery || 0,
      timestamp: bin.timestamp || new Date().toISOString(), // Ensure timestamp exists
    }));

    return formattedBins.sort((a, b) => {
      return expectedOrder.indexOf(a.name) - expectedOrder.indexOf(b.name);
    });
  };

  const applyFilter = (data: Bin[], filter: string) => {
    const now = new Date();
    let filtered: Bin[] = [];

    if (filter === "day") {
      filtered = data.filter(
        (bin) =>
          new Date(bin.timestamp).toDateString() === now.toDateString()
      );
    } else if (filter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = data.filter(
        (bin) => new Date(bin.timestamp) >= oneWeekAgo
      );
    } else if (filter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = data.filter(
        (bin) => new Date(bin.timestamp) >= oneMonthAgo
      );
    }

    setFilteredData(filtered);
    console.log("Filtered Data:", filtered);
  };

  return (
    <div className="container mx-auto mt-8">


      {selectedBin ? (
        <BinDetails bin={selectedBin} onBack={() => setSelectedBin(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            filteredData.map((bin, index) => (
              <Card
                key={bin.id || index}
                className="cursor-pointer hover:bg-accent transition-all duration-300"
                onClick={() => setSelectedBin(bin)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{bin.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Location: {bin.location}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fill Level:</span>
                      <span className="text-sm font-semibold">{bin.fillLevel}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${bin.fillLevel}%` }}
                        key={bin.id || index}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 mr-1" />
                      <span className="text-xs">{bin.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-1" />
                      <span className="text-xs">{bin.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-4 h-4 mr-1" />
                      <span className="text-xs">{bin.gasProduction} ppm</span>
                    </div>
                    <div className="flex items-center">
                      <Battery className="w-4 h-4 mr-1" />
                      <span className="text-xs">{bin.batteryCharge}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>{loading ? "Loading..." : error || "No data found"}</p>
          )}
        </div>
      )}
    </div>
  );
}

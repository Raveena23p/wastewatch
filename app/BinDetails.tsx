"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Droplets, Wind, Battery } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Aichatmodal from "@/app/Aichatmodal";
import { Bin } from "./BinLocations";

interface GraphEntry {
  time: string;
  level: number;
  temperature: number;
  humidity: number;
  gasProduction: number;
  batteryCharge: number;
}

interface BinDetailsProps {
  bin: Bin;
  onBack: () => void;
}

export default function BinDetails({ bin, onBack }: BinDetailsProps) {
  const [view, setView] = useState("day");
  const [selectedMetric, setSelectedMetric] = useState("level"); // New state for dropdown selection
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);



  useEffect(() => {
    setSelectedDate(new Date(bin?.timestamp))
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/graph?binId=${bin.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          setGraphData(result.data);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bin.id) fetchData();
  }, [bin.id]);

  const filteredGraphData = graphData.filter((entry) => {
    const entryDate = new Date(entry.time);
    if (!selectedDate) return false;

    if (view === "day") {
      return (
        entryDate.toDateString() === selectedDate.toDateString()
      );
    }
    if (view === "week") {
      return isWithinInterval(entryDate, {
        start: selectedDate, // ✅ Start from the selected date
        end: subDays(selectedDate, -6), // ✅ Show next 7 days including start date
      });
    }
    if (view === "month") {
      const maxEndDate = subDays(selectedDate, -29); // ✅ Max range: 30 days
      const lastAvailableDate = new Date(graphData[graphData.length - 1]?.time || maxEndDate);
      return isWithinInterval(entryDate, {
        start: selectedDate,
        end: lastAvailableDate > maxEndDate ? maxEndDate : lastAvailableDate, // ✅ Stop at 30 days or last available data
      });
    }
    return false;
  });



  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
        </Button>
        <CardTitle className="text-2xl">{bin.name}</CardTitle>
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Thermometer className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-xs text-gray-700">Temperature:</span>
              <span className="text-xs font-semibold text-gray-900">{(Math.round(bin.temperature))}°C</span>
            </div>
            <div className="flex items-center">
              <Droplets className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-xs text-gray-700">Humidity:</span>
              <span className="text-xs font-semibold text-gray-900">{(Math.round(bin.humidity))}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs text-gray-700">Gas Production:</span>
              <span className="text-xs font-semibold text-gray-900">{(Math.round(bin.gasProduction))} ppm</span>
            </div>
            <div className="flex items-center">
              <Battery className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-xs text-gray-700">Battery Charge:</span>
              <span className="text-xs font-semibold text-gray-900">{bin.batteryCharge}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <div className="flex justify-between items-center mt-2 text-xs font-medium text-gray-900">
        <span className="text-sm text-muted-foreground"></span>
        <span className="text-sm font-semibold text-gray-900 mr-2">
          Last Updated: {graphData.length > 0 ? format(new Date(graphData[graphData.length - 1].time), "dd/MM/yyyy HH:mm") : "No Data Available"}
        </span>
      </div>


      <CardContent>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Waste Collection Data</h3>

          {/* Drop-down selectors */}
          <div className="flex items-center gap-4 mt-4">
            {/* Select View (Day/Week/Month) */}
            <div>
              <h3 className="text-md font-semibold mb-2">Select View:</h3>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Metric (Fill Level, Gas, Temperature, Humidity) */}
            <div>
              <h3 className="text-md font-semibold mb-2">Select Metric:</h3>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level">Fill Level</SelectItem>
                  <SelectItem value="gasProduction">Gas</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div>
              <h3 className="text-md font-semibold mb-2">Select Date:</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-between">
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick a date"}
                    <CalendarIcon className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Graph Display */}
          {loading ? (
            <p className="mt-6 flex justify-center items-center text-lg font-semibold">
              Hold on... Making waste stats look pretty!
            </p>
          ) : filteredGraphData.length > 0 ? (
            <div className="h-[300px] cursor-pointer mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric} // ✅ Show only the selected metric
                    stroke={
                      selectedMetric === "level"
                        ? "#8884d8"
                        : selectedMetric === "gasProduction"
                          ? "#00C49F"
                          : selectedMetric === "temperature"
                            ? "#ff7300"
                            : "#0088FE"
                    }
                    name={
                      selectedMetric === "level"
                        ? "Fill Level"
                        : selectedMetric === "gasProduction"
                          ? "Gas PPM"
                          : selectedMetric === "temperature"
                            ? "Temperature (°C)"
                            : "Humidity (%)"
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 flex justify-center items-center text-lg font-semibold">
              No data available for the selected date range.
            </p>
          )}


          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Detailed Data</h3>
            {filteredGraphData.length > 0 ? (
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                <Table>
                  <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Fill Level (%)</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Gas PPM</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredGraphData.map((entry, index) => (
                    <TableRow key={index}>
                    <TableCell>{format(new Date(entry.time), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>{entry.level}</TableCell>
                    <TableCell>{entry.temperature}</TableCell>
                    <TableCell>{entry.humidity}</TableCell>
                    <TableCell>{entry.gasProduction}</TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
                </div>
            ) : (
              <p className="text-center text-lg font-semibold">
                No data available for the selected range.
              </p>
            )}
          </div>
        </div><div className="fixed bottom-6 right-6 z-50">
          <Aichatmodal />
        </div>
      </CardContent>


    </Card>


  );
}

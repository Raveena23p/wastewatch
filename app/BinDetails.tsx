"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Bin {
  id: string;
  name: string;
  location: string;
  fillLevel: number;
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
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<
    {
      time: string;
      level: number;
      temperature: number;
      humidity: number;
      gasProduction: number;
      batteryCharge: number;
    }[]
  >([]);


  // Fetch data from API
  useEffect(() => {
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
      }
      finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const formatXAxis = (tickItem: string | number | Date) => {
    const date = new Date(tickItem);
    switch (view) {
      case "hour":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "day":
        return date.toLocaleDateString();
      case "week":
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case "month":
        return date.toLocaleDateString([], { month: "short", year: "numeric" });
      default:
        return "";
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
        </Button>
        <CardTitle className="text-2xl">{bin.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">Location: {bin.location}</p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Current Fill Level:</span>
              <span className="text-lg font-bold">{bin.fillLevel}%</span>
            </div>
            <Progress value={bin.fillLevel} className="w-full h-4" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Thermometer className="w-6 h-6 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold">{bin.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center">
              <Droplets className="w-6 h-6 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">{bin.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wind className="w-6 h-6 mr-2 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Gas Production</p>
                <p className="text-lg font-semibold">{bin.gasProduction} ppm</p>
              </div>
            </div>
            <div className="flex items-center">
              <Battery className="w-6 h-6 mr-2 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Battery Charge</p>
                <p className="text-lg font-semibold">{bin.batteryCharge}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Waste Collection Data</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <DatePicker
              selected={startDate}
              onSelect={(d) => setStartDate(d ?? new Date())}
              label="Start Date"
            />
            <DatePicker
              selected={endDate}
              onSelect={(d) => setEndDate(d ?? new Date())}
              label="End Date"
            />
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hour View</SelectItem>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <p className="text-center text-lg font-semibold">Hold on...Making waste stats look pretty!</p>
          ) : (
            <div
              className="h-[300px] cursor-pointer"
              onClick={() => setShowTable(!showTable)}
              role="button"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickFormatter={formatXAxis} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="level"
                    name="Fill Level"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {showTable && (
          <div className="mt-8 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Fill Level (%)</TableHead>
                  <TableHead>Temperature (°C)</TableHead>
                  <TableHead>Humidity (%)</TableHead>
                  <TableHead>Gas Production (ppm)</TableHead>
                  <TableHead>Battery Charge (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graphData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(entry.time).toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.level}</TableCell>
                    <TableCell>{entry.temperature}</TableCell>
                    <TableCell>{entry.humidity}</TableCell>
                    <TableCell>{entry.gasProduction}</TableCell>
                    <TableCell>{entry.batteryCharge}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

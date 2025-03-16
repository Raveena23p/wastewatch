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
import { MessageSquare, X } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
const [input, setInput] = useState("");

const handleSend = () => {
  if (!input.trim()) return;

  setMessages([...messages, { text: input, sender: "user" }]);
  setInput("");

  // Simulated AI Response
  setTimeout(() => {
    setMessages((prev) => [...prev, { text: "This is an AI response.", sender: "ai" }]);
  }, 1000);
};



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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected view and date
  const filteredGraphData = graphData.filter((entry) => {
    const entryDate = new Date(entry.time);
    if (!selectedDate) return false;

    if (view === "day") {
      return entryDate.toDateString() === selectedDate.toDateString();
    }
    if (view === "week") {
      return isWithinInterval(entryDate, {
        start: subDays(selectedDate, 3), // 3 days before selected date
        end: subDays(selectedDate, -3), // 3 days after selected date
      });
    }
    if (view === "month") {
      return isWithinInterval(entryDate, {
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
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
      <span className="text-xs font-semibold text-gray-900">{bin.temperature}°C</span>
    </div>
    <div className="flex items-center">
      <Droplets className="w-4 h-4 text-blue-400 mr-1" />
      <span className="text-xs text-gray-700">Humidity:</span>
      <span className="text-xs font-semibold text-gray-900">{bin.humidity}%</span>
    </div>
    <div className="flex items-center">
      <Wind className="w-4 h-4 text-green-600 mr-1" />
      <span className="text-xs text-gray-700">Gas Production:</span>
      <span className="text-xs font-semibold text-gray-900">{bin.gasProduction} ppm</span>
    </div>
    <div className="flex items-center">
      <Battery className="w-4 h-4 text-orange-500 mr-1" />
      <span className="text-xs text-gray-700">Battery Charge:</span>
      <span className="text-xs font-semibold text-gray-900">{bin.batteryCharge}%</span>
    </div>
  </div>
</div>

      </CardHeader>
      <CardContent>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Waste Collection Data</h3>
          
          <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center justify-between mt-4">
  {/* Select View (Day/Week/Month) - Left Side */}
  <div className="flex justify-end">
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

  {/* Clickable Date Picker - Right Side */}
  <div>
    <h3 className="text-md font-semibold mb-2 text-right">Select Date:</h3>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick a date"}
          <CalendarIcon className="w-4 h-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
        />
      </PopoverContent>
    </Popover>
    </div>
  </div>
</div>
</div>
</div>


          {/* Graph Display */}
          {loading ? (
            <p className="text-center text-lg font-semibold">Hold on...Mking waste stats look pretty!</p>
          ) : filteredGraphData.length > 0 ? (
            <div className="h-[300px] cursor-pointer mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="level" stroke="#8884d8" name="Fill Level" />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#0088FE" name="Humidity (%)" />
                  <Line type="monotone" dataKey="gasProduction" stroke="#00C49F" name="Gas PPM" />
                  <Line type="monotone" dataKey="batteryCharge" stroke="#FFBB28" name="Battery Charge (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-lg font-semibold">No data available for the selected date range.</p>
          )}

          {/* Table Below Graph */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Detailed Data</h3>
            {filteredGraphData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Fill Level</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Gas PPM</TableHead>
                    <TableHead>Battery (%)</TableHead>
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
                      <TableCell>{entry.batteryCharge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-lg font-semibold">No data available for the selected range.</p>
            )}
          </div>
      </CardContent>
    </Card>
  );
}

"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import BinDetails from './BinDetails'
import { Thermometer, Droplets, Wind, Battery } from 'lucide-react'

const bins = [
  { 
    id: 1, 
    name: "Kitchen Area", 
    location: "Main Kitchen", 
    fillLevel: 75,
    temperature: 22,
    humidity: 45,
    gasProduction: 15,
    batteryCharge: 80
  },
  { 
    id: 2, 
    name: "Cafeteria", 
    location: "Employee Cafeteria", 
    fillLevel: 50,
    temperature: 24,
    humidity: 40,
    gasProduction: 10,
    batteryCharge: 90
  },
  { 
    id: 3, 
    name: "Production Line A", 
    location: "Factory Floor A", 
    fillLevel: 30,
    temperature: 26,
    humidity: 55,
    gasProduction: 20,
    batteryCharge: 70
  },
  { 
    id: 4, 
    name: "Production Line B", 
    location: "Factory Floor B", 
    fillLevel: 60,
    temperature: 25,
    humidity: 50,
    gasProduction: 18,
    batteryCharge: 75
  },
  { 
    id: 5, 
    name: "Office Area", 
    location: "Administrative Building", 
    fillLevel: 25,
    temperature: 23,
    humidity: 35,
    gasProduction: 5,
    batteryCharge: 95
  },
  { 
    id: 6, 
    name: "Packaging Area", 
    location: "Shipping Department", 
    fillLevel: 40,
    temperature: 24,
    humidity: 45,
    gasProduction: 12,
    batteryCharge: 85
  },
  { 
    id: 7, 
    name: "Quality Control", 
    location: "Lab Area", 
    fillLevel: 15,
    temperature: 21,
    humidity: 30,
    gasProduction: 8,
    batteryCharge: 100
  },
  { 
    id: 8, 
    name: "Storage Room", 
    location: "Warehouse", 
    fillLevel: 80,
    temperature: 20,
    humidity: 60,
    gasProduction: 25,
    batteryCharge: 65
  },
]

export default function BinLocations() {
  const [selectedBin, setSelectedBin] = useState(null)

  return (
    <div className="container mx-auto mt-8">
      {selectedBin ? (
        <BinDetails bin={selectedBin} onBack={() => setSelectedBin(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bins.map((bin) => (
            <Card 
              key={bin.id} 
              className="cursor-pointer hover:bg-accent transition-all duration-300"
              onClick={() => setSelectedBin(bin)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{bin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Location: {bin.location}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fill Level:</span>
                    <span className="text-sm font-semibold">{bin.fillLevel}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{width: `${bin.fillLevel}%`}}
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
          ))}
        </div>
      )}
    </div>
  )
}


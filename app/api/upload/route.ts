import { getXataClient } from "@/xata";
import bt from './milk_industry_waste_bins_corrected.json'
const xata = getXataClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const sensorData = body?.data;
        const record = await xata.db.sensordata.create({
            battery: sensorData?.batteryCharge,
            bin: sensorData?.binId,
            fillcm: sensorData?.fillLevel,
            gasppm: sensorData?.gasProduction,
            humidity: sensorData?.humidity,
            temperature: sensorData?.temperature,
            updatetime: new Date()
        })
        return Response.json({
            message: 'Sucess',
            data: record
        })

    } catch (error) {
        return Response.json({
            message: 'Error',
            error: error
        })

    }
}


export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const btData = bt?.map(row => row?.batteryCharge)
        const rows = body?.rows?.map((row: any, idx: number) => ({
            battery: Math.floor(row.batteryCharge ?? btData[idx]),
            bin: 'rec_cv8jkv5qrj65rff0ivmg',
            fillcm: row.fillLevel,
            gasppm: row.gasProduction,
            humidity: row.humidity,
            temperature: row.temperature,
            updatetime: new Date(row.time)?.toISOString()
        })) || []

        const data = await xata.db.sensordata.create(rows)

        return Response.json({
            message: 'Sucess',
            data
        })

    } catch (error) {
        return Response.json({
            message: 'Error',
            error: error
        })
    }
}

export async function GET(req: Request) {
    try {
        const data = bt?.map(row => row?.batteryCharge)
        return Response.json({
            message: 'Sucess',
            data: data
        })

    } catch (error) {
        return Response.json({
            message: 'Error',
            error: error
        })
    }
}
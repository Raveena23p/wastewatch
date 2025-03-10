import { getXataClient } from "@/xata";
// Generated with CLI
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

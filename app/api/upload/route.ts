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


export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const rows = body?.rows?.map((row: any) => ({
            battery: Math.floor(row.batteryCharge),
            bin: 'rec_cv3imudqrj63i4ut7f1g',
            fillcm: row.fillLevel,
            gasppm: row.gasProduction,
            humidity: row.humidity,
            temperature: row.temperature,
            updatetime: new Date(row.time)?.toISOString()
        })) || []

        const data = await xata.db.sensordata.create(rows)

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

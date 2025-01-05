import { getXataClient } from "@/xata";
// Generated with CLI
const xata = getXataClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const sensorData = body?.data;
        const record = await xata.db.sensordata.create({
            data: sensorData
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

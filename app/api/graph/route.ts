import { getXataClient } from "@/xata";
const xata = getXataClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const binId = url.searchParams.get('binId');
        const binGraphData = await xata.db.sensordata.select(['*', 'bin.binheight']).filter('bin', binId).getAll();

        if (!binGraphData?.length) {
            return Response.json({ error: "No data found", success: false });
        }

        // Process data for the graph
        const processedData = binGraphData.map((entry) => ({
            time: entry?.updatetime?.toISOString(),
            level: Math.floor(((entry?.fillcm ?? 1) / (entry?.bin?.binheight ?? 1)) * 100),
            temperature: Math.floor(entry?.temperature ?? 0),
            humidity: Math.floor(entry?.humidity ?? 0),
            gasProduction: Math.floor(entry?.gasppm ?? 0),
            batteryCharge: Math.floor(entry?.battery ?? 0),
        }));

        return Response.json({ message: 'Success', data: processedData, success: true });
    } catch (error) {
        console.error("Graph API Error:", error);
        return Response.json({ error: "Failed to fetch graph data", success: false });
    }
}

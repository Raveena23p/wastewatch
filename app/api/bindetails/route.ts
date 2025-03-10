import { getXataClient } from "@/xata";
const xata = getXataClient();

export async function GET() {
    try {
        const latestBinDetails = await xata.sql`
        SELECT sd.*, bd.*
        FROM sensordata sd
        INNER JOIN (
            SELECT bin, MAX(updatetime) as latest_date
            FROM sensordata
            GROUP BY bin
        ) latest ON sd.bin = latest.bin AND sd.updatetime = latest.latest_date 
        Inner JOIN binDetails bd ON sd.bin = bd.xata_id
    `;
        return Response.json({ message: 'Success', data: latestBinDetails?.records, success: true });
    } catch (error) {
        return Response.json({ message: "Failed to fetch bin data", success: false, error });
    }

}
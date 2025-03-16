import { Content, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(apiKey);



const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(request: Request) {
    try {
        const body = await request?.json();
        const history = body?.history as Content[];
        const message = body?.message as string;
        const data = body?.data;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are an friendly AI assistant in a Waste management app that contains data such as fill level, temperature, humidity, gas production, battery charge of a bin and the timestamp of the data inserted bu the sensors. You will be given the data of that 
            bin in a stringified JSON format within this delimitter ''', Based on those data you should analyse it and provide valuable insights for the users queries. Whenever the value of fillLevel is 0 it means that the bin is emptied. The data is as following

            '''${JSON.stringify(data)}'''`,
        });
        if (history.length > 0) {
            history.pop();
        }
        const chatSession = model.startChat({
            generationConfig,
            history,
        });

        const result = await chatSession.sendMessage(message);
        return Response.json({ message: 'Successfull', data: { reply: result.response.text() }, success: true });
    } catch (err) {
        console.log(err);
        return Response.json({ message: 'Error', success: false, error: err });
    }
}
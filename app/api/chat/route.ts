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
            model: "gemini-2.0-flash-lite",
            systemInstruction: `You are an friendly AI assistant in a Waste management app that contains data such as fillLevel as level in percentage filled, temperature in celsius, humidity in percentage, gas production in ppm, battery charge of a bin in percentage and the timestamp of the data inserted by the sensors.
            You will be given the data of that bin in a stringified JSON format within this delimitter ''',
            Based on those data you should analyse all of it and provide valuable insights for the users queries.
            Whenever the value of Level is 0 it means that the bin is emptied.
            The bin height is 200cms.
            Always give the answer in 200 words.
            Give importance to the numerical data.
            Whenever the fill level is 0, it means the bin has been emptied.
            Apart from waste management or details regarding bin or bin management, do not answer any questions.
            When the question is asked about scheduling the next collection trip, answer with the approximate date analysing the past trend on how often the bin was filled.
            While the user is asking for tips to manage odour, give them reply.
            

            The data is as following

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
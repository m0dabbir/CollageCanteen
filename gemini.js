const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAbqkLn2jrT4dEcBttmDP8rba3pFPW98IQ"); // Replace with your API key
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "Explain how AI works";

async function run() {
  //added async function wrapper
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

run(); //call the async function

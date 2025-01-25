import axios from "axios";

// 環境変数からAPIキーを取得
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateImage = async (prompt) => {
  const url = "https://api.openai.com/v1/images/generations";

  // 命令文形式で詳細なプロンプトを生成
  const detailedPrompt = 
  `
  A high-quality food photograph of a delicious ${prompt}. 
  The dish should prominently feature whole, clearly visible ingredients: 
  ${prompt.split('と')[0]} and ${prompt.split('と')[1].split('の')[0]}. 
  Ensure the ${prompt.split('の')[1]} is plated in a professional restaurant-style presentation. 
  Use vibrant colors and textures to make the dish look fresh and delicious.
  `;
  
  console.log("Sending prompt to DALLE:", detailedPrompt); // 詳細なプロンプトをログ出力

  try {
    const response = await axios.post(
      url,
      {
        prompt: detailedPrompt, // 詳細なプロンプト
        n: 1, // 1枚の画像を生成
        size: "1024x1024", // 解像度
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("Image generation successful. Prompt:", detailedPrompt);
    return response.data.data[0].url; // 生成された画像URL
  } catch (error) {
    console.error("Image generation failed. Error:", error);
    throw new Error("Failed to generate image");
  }
};

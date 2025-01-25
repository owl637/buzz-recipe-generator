import React, { useState } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import Button from "./ui/Button";
import { motion } from "framer-motion";
import { generateImage } from "../utils/dalleApi"; // Placeholder for DALLE API integration
import styles from "./BuzzRecipeGenerator.module.css"; // CSSモジュールをインポート

const ingredients = ["ザリガニ", "メダカ", "チョコレート", "バナナ", "トリュフ", "納豆", "寿司", "ウシガエル", "ハンバーガー", "ハムスター"];
const dishes = ["スープ", "パスタ", "タコス", "ケーキ", "ラーメン", "ステーキ", "シチュー", "燻製"];

const translations = {
  "ザリガニ": "crayfish",
  "メダカ": "medaka fish",
  "チョコレート": "chocolate",
  "バナナ": "banana",
  "トリュフ": "truffle",
  "納豆": "fermented soybeans",
  "寿司": "sushi",
  "ウシガエル": "bullfrog",
  "ハンバーガー": "hamburger",
  "ハムスター": "hamster",
  "スープ": "soup",
  "パスタ": "pasta",
  "タコス": "tacos",
  "ケーキ": "cake",
  "ラーメン": "ramen",
  "ステーキ": "steak",
  "シチュー": "stew",
  "燻製": "smoked dish"
};

function BuzzRecipeGenerator() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [rouletteSpin, setRouletteSpin] = useState(false);
  const [spinningItems, setSpinningItems] = useState({ ingredient1: "", ingredient2: "", dish: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const spinSlots = async () => {
    setRouletteSpin(true);
  
    // スロットを順番に回す
    const ingredient1 = await simulateSlot(ingredients, "ingredient1");
    const ingredient2 = await simulateSlot(ingredients.filter(i => i !== ingredient1), "ingredient2");
    const dish = await simulateSlot(dishes, "dish");
  
    setRouletteSpin(false);
  
    // プロンプトを正しく組み立て
    const prompt = `${ingredient1}と${ingredient2}の${dish}`;
    const englishPrompt = `${translations[ingredient1]} と ${translations[ingredient2]}の${translations[dish]}`;

    setRecipe({ ingredient1, ingredient2, dish, prompt, englishPrompt });

    // 非同期処理の順序を確保
    // await generateRecipeImage(prompt);
    await generateRecipeImage(englishPrompt);
  };  

  const simulateSlot = (array, type) => {
    return new Promise((resolve) => {
      const spinTime = 2000; // 2 seconds spin effect
      let currentIndex = 0;
  
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % array.length;
        setSpinningItems((prev) => ({ ...prev, [type]: array[currentIndex] }));
      }, 100);
  
      setTimeout(() => {
        clearInterval(interval);
        // 確実にランダムな要素を選択する
        const randomItem = array[Math.floor(Math.random() * array.length)];
        setSpinningItems((prev) => ({ ...prev, [type]: randomItem }));
        resolve(randomItem);
      }, spinTime);
    });
  };
  

  const generateRecipeImage = async (prompt) => {
    setLoading(true);
    setGeneratingImage(true);
  
    try {
      console.log("Sending prompt to DALLE API:", prompt); // プロンプトをログ出力
      const imageData = await generateImage(prompt);
      console.log("Image generation successful:", imageData);
  
      setImage(imageData); // 正しい画像URLをセット
      setShowPopup(true); // ポップアップを表示
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setLoading(false);
      setGeneratingImage(false);
    }
  };
  

  const postToX = () => {
    const postText = `完成しました。${recipe.prompt}\n\n#バズレシピ #AI料理`;
    const postUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(image)}`;
    window.open(postUrl, "_blank");
  };

  const downloadImage = () => {
    window.open(image, "_blank");
  };  


  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <h1 className={styles.title}>バズレシピ生成器</h1>
          <p className={styles.prompt}>ルーレットで食材を決めて、新しい料理を発明しよう！</p>
          <div className={styles.slotContainer}>
            <motion.div
              className={styles.slot}
              animate={{ y: rouletteSpin ? [0, -50, 0] : 0 }}
              transition={{ duration: 2, repeat: rouletteSpin ? Infinity : 0 }}
            >
              {spinningItems.ingredient1 || "?"}
            </motion.div>
            <span>と</span>
            <motion.div
              className={styles.slot}
              animate={{ y: rouletteSpin ? [0, -50, 0] : 0 }}
              transition={{ duration: 2, repeat: rouletteSpin ? Infinity : 0 }}
            >
              {spinningItems.ingredient2 || "?"}
            </motion.div>
            <span>の</span>
            <motion.div
              className={styles.slot}
              animate={{ y: rouletteSpin ? [0, -50, 0] : 0 }}
              transition={{ duration: 2, repeat: rouletteSpin ? Infinity : 0 }}
            >
              {spinningItems.dish || "?"}
            </motion.div>
          </div>
          <Button onClick={spinSlots} disabled={loading || rouletteSpin || generatingImage} className={styles.button}>
            {rouletteSpin ? "スロット回転中..." : generatingImage ? "画像生成中..." : "スロットを回す"}
          </Button>
        </CardContent>
      </Card>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2 className={styles.caption}>完成しました。<span style={{color: "red"}}>「{recipe.prompt}」</span><br></br>どうでしょう？バズりそうですかね…？</h2>
            {image ? (
              <div className={styles.imageContainer}>
                <img src={image} alt={recipe.prompt} className={styles.popupImage} />
              </div>
            ) : (
              <p>画像生成中...</p>
            )}
            {image && (
              <div className={styles.buttonGroup}>
                <Button onClick={postToX} className={styles.postButton}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <img 
                      src="https://image.itmedia.co.jp/news/articles/2307/24/cover_news139.jpg" 
                      alt="X logo" 
                      style={{ width: "20px", marginRight: "8px" }} 
                    />
                    Xにポストする
                  </span>
                </Button>
                <Button onClick={downloadImage} className={styles.downloadButton}>画像をダウンロード</Button>
                <Button onClick={() => setShowPopup(false)} className={styles.closeButton}>閉じる</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BuzzRecipeGenerator;
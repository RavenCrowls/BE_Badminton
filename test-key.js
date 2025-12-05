require('dotenv').config();

async function checkAvailableModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ Chưa có GOOGLE_API_KEY trong file .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log("📡 Đang hỏi Google xem bạn được dùng model nào...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ LỖI TỪ GOOGLE:", data.error.message);
      return;
    }

    if (!data.models) {
      console.log("⚠️ Danh sách model rỗng! Có thể API chưa được bật.");
      return;
    }

    console.log("\n✅ DANH SÁCH MODEL KHẢ DỤNG CHO BẠN:");
    console.log("------------------------------------------------");
    
    // Lọc ra các model chat (generateContent)
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(m => {
      console.log(`🔹 Tên: ${m.name}`); // Ví dụ: models/gemini-1.5-flash
      console.log(`   Mô tả: ${m.displayName}`);
    });

    console.log("------------------------------------------------");
    console.log("👉 Hãy chọn một cái tên bắt đầu bằng 'models/' ở trên để điền vào code.");

  } catch (error) {
    console.error("❌ Lỗi kết nối:", error.message);
  }
}

checkAvailableModels();
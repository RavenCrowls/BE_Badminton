require('dotenv').config();
const { supabase } = require('../supabase');
const { SupabaseVectorStore } = require('@langchain/community/vectorstores/supabase');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");
const { TaskType } = require("@google/generative-ai"); // Import trực tiếp

// 1. CẤU HÌNH EMBEDDING (QUERY)
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'text-embedding-004', 
  taskType: TaskType.RETRIEVAL_QUERY, // <--- BẮT BUỘC KHÁC VỚI INGEST
});

// 2. MODEL CHAT
const chatModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-2.0-flash', 
  temperature: 0.3,
});

async function handleChat(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Vui lòng nhập câu hỏi!' });

    console.log(`\n💬 Câu hỏi: "${question}"`);

    // 3. TÌM KIẾM
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents'
    });

    // Debug: In ra vector của câu hỏi để chắc chắn nó hoạt động
    // const qVector = await embeddings.embedQuery(question);
    // console.log("Vector câu hỏi (length):", qVector.length);

    const docs = await vectorStore.similaritySearch(question, 5);
    console.log(`🔎 Tìm thấy: ${docs.length} đoạn.`);

    // Log nội dung tìm thấy để debug
    if (docs.length > 0) {
        console.log("📝 Nội dung đoạn đầu tiên tìm thấy:", docs[0].pageContent.substring(0, 100) + "...");
    } else {
        console.log("⚠️ KHÔNG TÌM THẤY GÌ!");
        return res.json({ answer: "Xin lỗi, tôi không tìm thấy thông tin trong tài liệu." });
    }

    // 4. TRẢ LỜI
    const prompt = ChatPromptTemplate.fromTemplate(`
      Bạn là trợ lý Shop Cầu Lông. Dựa vào thông tin sau để trả lời:
      <context>{context}</context>
      Câu hỏi: {question}
    `);

    const chain = RunnableSequence.from([
      {
        context: () => docs.map(d => d.pageContent).join('\n\n'),
        question: () => question,
      },
      prompt,
      chatModel,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({ question });
    console.log("🤖 AI:", answer);
    
    return res.json({ answer });

  } catch (err) {
    console.error('❌ Lỗi:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { handleChat };
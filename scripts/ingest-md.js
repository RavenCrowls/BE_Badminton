require('dotenv').config();
const { supabase } = require('../supabase');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { Document } = require('@langchain/core/documents');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { SupabaseVectorStore } = require('@langchain/community/vectorstores/supabase');
const { TaskType } = require("@google/generative-ai"); // Import trực tiếp từ SDK gốc

async function downloadMarkdown(bucket, filePath) {
  const { data, error } = await supabase.storage.from(bucket).download(filePath);
  if (error) throw error;
  if (typeof data.text === 'function') return await data.text();
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('utf-8');
}

async function splitMarkdown(markdownText) {
  const headerRegex = /^(#{1,3})\s+(.*)$/gm;
  const docs = [];
  let lastIndex = 0;
  let match;
  const stack = [];
  while ((match = headerRegex.exec(markdownText)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const start = match.index;
    if (start > lastIndex) {
      const content = markdownText.slice(lastIndex, start).trim();
      if (content) {
        const meta = {};
        for (const h of stack) meta[`h${h.level}`] = h.text;
        docs.push(new Document({ pageContent: content, metadata: meta }));
      }
    }
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    stack.push({ level, text: title });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < markdownText.length) {
    const content = markdownText.slice(lastIndex).trim();
    if (content) docs.push(new Document({ pageContent: content, metadata: {} }));
  }
  const recursive = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  return await recursive.splitDocuments(docs);
}

async function main() {
  try {
    console.log("🚀 Bắt đầu nạp lại dữ liệu...");

    // 1. CẤU HÌNH CHUẨN GOOGLE (Dùng Enum TaskType)
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004", 
      taskType: TaskType.RETRIEVAL_DOCUMENT, // <--- BẮT BUỘC DÙNG CÁI NÀY
      title: "Badminton Guide", // Google yêu cầu title cho document
    });

    // 2. TẢI VÀ XỬ LÝ
    console.log("📥 Đang tải file...");
    const markdown = await downloadMarkdown('rag-docs', 'guide.md');
    const docs = await splitMarkdown(markdown);
    console.log(`🧩 Tìm thấy ${docs.length} đoạn.`);

    // 3. LƯU VECTOR
    console.log("💾 Đang lưu...");
    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    });

    console.log("🎉 XONG! Dữ liệu đã chuẩn hóa TaskType.");

  } catch (err) {
    console.error("❌ Lỗi:", err);
  }
}

main();
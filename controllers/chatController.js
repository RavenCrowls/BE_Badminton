require('dotenv').config();
const { supabase } = require('../supabase');
const { SupabaseVectorStore } = require('@langchain/community/vectorstores/supabase');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { TaskType } = require('@google/generative-ai');
const { findProductsByPriceRange, getProductStockByNameOrId, listRacketsForStyle } = require('../services/productSearch.service');

//CẤU HÌNH EMBEDDING (QUERY)
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'text-embedding-004',
  taskType: TaskType.RETRIEVAL_QUERY //BẮT BUỘC KHÁC VỚI INGEST
});

//MODEL CHAT
const chatModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-flash-latest',
  temperature: 0.3
});

//MODEL ROUTING
const routingModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-flash-latest',
  temperature: 0,
  modelKwargs: {
    response_mime_type: 'application/json'
  }
});

//PROMPT PHÂN LOẠI CÂU HỎI
const routingPrompt = ChatPromptTemplate.fromTemplate(`
Bạn là hệ thống phân loại câu hỏi cho shop cầu lông. Phân tích câu hỏi và trả về JSON với cấu trúc sau:

{{
  "route": "guide_only" | "product_db" | "hybrid",
  "intent": "policy_question" | "price_range_query" | "stock_query" | "style_recommendation" | "general_query",
  "languageCode": "vi" | "en",
  "minPrice": number | null,
  "maxPrice": number | null,
  "productName": string | null,
  "productId": number | null,
  "style": "tấn công" | "phản tạt" | "toàn diện" | null
}}

**Quy tắc phân loại route:**
- "guide_only": Câu hỏi về chính sách (bảo hành, đổi trả, giờ mở cửa, liên hệ, dịch vụ căng vợt), hướng dẫn chọn vợt theo kỹ thuật, khái niệm (head heavy, balance, flex...)
- "product_db": Câu hỏi cụ thể về giá, tồn kho, danh sách sản phẩm theo giá, tìm sản phẩm cụ thể
  • VD: "Có sản phẩm nào tầm 100k không?" → product_db, price_range_query
  • VD: "Sản phẩm X còn bao nhiêu cái?" → product_db, stock_query
- "hybrid": Câu hỏi kết hợp ý tưởng + sản phẩm cụ thể
  • VD: "Những vợt nào phù hợp tấn công?" → hybrid, style_recommendation
  • VD: "Giày cho người chân rộng có gì?" → hybrid, style_recommendation

**Quy tắc phân loại intent:**
- "policy_question": Bảo hành, đổi trả, giờ mở cửa, địa chỉ, dịch vụ
- "price_range_query": Tìm sản phẩm trong khoảng giá
  • "tầm 100k", "khoảng 100 nghìn", "100k có gì"
  • "500k đến 1 triệu", "dưới 2 triệu", "từ 500k"
- "stock_query": Hỏi số lượng còn, tồn kho của sản phẩm cụ thể
  • "còn bao nhiêu", "còn không", "hết hàng chưa", "tồn kho"
  • PHẢI trích xuất tên sản phẩm vào productName
- "style_recommendation": Tư vấn vợt/giày/đồ theo phong cách chơi, thể trạng
  • "vợt phù hợp tấn công", "giày cho người chân rộng", "quần áo thoáng mát"
  • PHẢI trích xuất style nếu có ("tấn công", "phản tạt", "toàn diện")
- "general_query": Câu hỏi chung hoặc không rõ ràng

**Xử lý giá (±20% cho các giá trị tròn):**
- "100k" hoặc "100 nghìn" → minPrice: 80000, maxPrice: 120000
- "200k" hoặc "200 nghìn" → minPrice: 160000, maxPrice: 240000
- "tầm 500k" hoặc "khoảng 500k" → minPrice: 400000, maxPrice: 600000
- "dưới 1 triệu" → minPrice: 0, maxPrice: 1000000
- "500k đến 1 triệu" → minPrice: 500000, maxPrice: 1000000
- "từ 2 triệu" hoặc "trên 2 triệu" → minPrice: 2000000, maxPrice: 999999999
- "200-300k" → minPrice: 200000, maxPrice: 300000

**Xử lý productName cho stock_query:**
- Trích xuất tên sản phẩm từ câu hỏi, loại bỏ từ "sản phẩm", "cái", "vợt", "giày"
- VD: "Astrox 99 còn bao nhiêu?" → productName: "Astrox 99"
- VD: "Sản phẩm Nanoflare 700 còn không?" → productName: "Nanoflare 700"
- VD: "Vợt Yonex có còn không?" → productName: "Yonex"

**Xử lý style cho style_recommendation:**
- Trích xuất từ khóa: "tấn công", "smash", "công phá", "đập cầu mạnh" → "tấn công"
- "phản tạt", "nhanh", "nhẹ", "speed", "phòng thủ", "chặn" → "phản tạt"
- "toàn diện", "balanced", "all-round", "đa năng", "công thủ toàn diện" → "toàn diện"

**Xử lý languageCode:**
- Tiếng Việt → "vi"
- English → "en"

Câu hỏi: {question}

Chỉ trả về JSON thuần, KHÔNG thêm giải thích.
`);
async function classifyQuestion(question) {
  try {
    const chain = routingPrompt.pipe(routingModel).pipe(new StringOutputParser());
    const result = await chain.invoke({ question });

    console.log('Routing result (raw):', result);

    const parsed = JSON.parse(result);
    console.log('Routing result (parsed):', parsed);

    return parsed;
  } catch (error) {
    console.error('Error in classifyQuestion:', error);
    return {
      route: 'guide_only',
      intent: 'general_query',
      languageCode: 'vi',
      minPrice: null,
      maxPrice: null,
      productName: null,
      productId: null,
      style: null
    };
  }
}
async function handleChat(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Vui lòng nhập câu hỏi!' });

    console.log(`\n========== NEW QUESTION ==========`);
    console.log(`Question: "${question}"`);

    //PHÂN LOẠI CÂU HỎI
    const routing = await classifyQuestion(question);
    console.log(`\nRoute: ${routing.route}`);
    console.log(`Intent: ${routing.intent}`);
    console.log(`Language: ${routing.languageCode}`);
    if (routing.minPrice || routing.maxPrice) {
      console.log(`Price range: ${routing.minPrice} - ${routing.maxPrice}`);
    }
    if (routing.productName) {
      console.log(`Product name: ${routing.productName}`);
    }
    if (routing.style) {
      console.log(`Style: ${routing.style}`);
    }

    //TÌM KIẾM THEO ROUTE
    let guide_context = '';
    let product_context = [];

    //TÌM KIẾM GUIDE
    if (routing.route === 'guide_only' || routing.route === 'hybrid') {
      console.log('\n[RAG] Searching guide.md...');
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents'
      });

      const docs = await vectorStore.similaritySearch(question, 5);
      console.log(`[RAG] Found: ${docs.length} chunks from guide.md`);

      if (docs.length > 0) {
        guide_context = docs.map((d) => d.pageContent).join('\n\n');
        console.log('[RAG] First chunk preview:', docs[0].pageContent.substring(0, 100) + '...');
      } else {
        console.log('[RAG] No matches found in guide.md');
      }
    }

    //TÌM KIẾM DATABASE (nếu route là product_db hoặc hybrid)
    if (routing.route === 'product_db' || routing.route === 'hybrid') {
      console.log('\n[DB] Searching MySQL database...');
      try {
        const options = {
          languageCode: routing.languageCode,
          limit: 10
        };

        switch (routing.intent) {
          case 'price_range_query':
            if (routing.minPrice !== null || routing.maxPrice !== null) {
              const min = routing.minPrice || 0;
              const max = routing.maxPrice || 999999999;
              console.log(`[DB] SCENARIO 1: Price Range Query (${min.toLocaleString()} - ${max.toLocaleString()}đ)`);
              console.log(`[DB] Calling findProductsByPriceRange(${min}, ${max})`);
              product_context = await findProductsByPriceRange(min, max, options);
              console.log(`[DB] Found ${product_context.length} products in range`);
            }
            break;

          case 'stock_query':
            if (routing.productName || routing.productId) {
              console.log(`[DB] SCENARIO 2: Stock Query for "${routing.productName || routing.productId}"`);
              console.log(`[DB] Calling getProductStockByNameOrId(${routing.productName || routing.productId})`);
              const stockInfo = await getProductStockByNameOrId({
                productName: routing.productName,
                productId: routing.productId,
                languageCode: routing.languageCode
              });
              if (stockInfo) {
                product_context = [stockInfo];
                console.log(`[DB] Found: ${stockInfo.name}, Stock: ${stockInfo.quantity} (${stockInfo.stockStatus})`);
              } else {
                console.log('[DB] Product not found');
              }
            }
            break;

          case 'style_recommendation':
            if (routing.style) {
              console.log(`[DB] SCENARIO 3: Style Recommendation for "${routing.style}"`);
              console.log(`[DB] Calling listRacketsForStyle(${routing.style})`);
              product_context = await listRacketsForStyle(routing.style, options);
              console.log(`[DB] Found ${product_context.length} rackets for ${routing.style} style`);
            }
            break;

          default:
            console.log(`[DB] Intent '${routing.intent}' does not require DB query`);
        }
      } catch (dbError) {
        console.error('[DB] Error querying database:', dbError);
      }
    }

    if (!guide_context && product_context.length === 0) {
      console.log('\n[RESULT] No context found from both sources');

      let answer = '';
      if (routing.intent === 'price_range_query') {
        const priceRange =
          routing.minPrice && routing.maxPrice
            ? `từ ${routing.minPrice.toLocaleString()}đ đến ${routing.maxPrice.toLocaleString()}đ`
            : 'này';
        answer = `Xin lỗi, hiện tại shop không có sản phẩm trong khoảng giá ${priceRange}. Bạn có thể:\n- Thử tìm kiếm với khoảng giá khác\n- Liên hệ shop để được tư vấn: Hotline 0909-xxx-xxx\n- Ghé thăm shop tại 123 ABC, Quận XYZ (8:00 - 22:00)`;
      } else if (routing.intent === 'stock_query') {
        answer = `Xin lỗi, tôi không tìm thấy sản phẩm "${
          routing.productName || 'này'
        }" trong kho. Bạn có thể:\n- Kiểm tra lại tên sản phẩm\n- Liên hệ shop để được tư vấn: Hotline 0909-xxx-xxx`;
      } else {
        answer =
          'Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi của bạn. Vui lòng liên hệ shop để được hỗ trợ tốt hơn: Hotline 0909-xxx-xxx';
      }

      return res.json({
        answer,
        source: routing.route,
        intent: routing.intent
      });
    }

    //TẠO CÂU TRẢ LỜI VỚI UNIFIED PROMPT
    console.log('\n[ANSWER] Generating response...');
    console.log(`[ANSWER] Guide context: ${guide_context ? guide_context.length + ' chars' : 'empty'}`);
    console.log(`[ANSWER] Product context: ${product_context.length} items`);

    const prompt = ChatPromptTemplate.fromTemplate(`
Bạn là trợ lý tư vấn thân thiện và chuyên nghiệp của Shop Cầu Lông.

=== THÔNG TIN CÓ SẴN ===

{guide_context_section}

{product_context_section}

=== HƯỚNG DẪN TRẢ LỜI ===

**1. Sử dụng guide_context (Thông tin từ hướng dẫn) cho:**
   - Chính sách bảo hành, đổi trả
   - Dịch vụ căng vợt (đan lưới)
   - Giờ mở cửa, địa chỉ, liên hệ
   - Hướng dẫn chọn vợt theo kỹ thuật (head heavy, balance, flex, lối đánh)
   - Giải thích khái niệm và thuật ngữ kỹ thuật

**2. Sử dụng product_context (Sản phẩm từ kho) cho:**
   - Danh sách sản phẩm cụ thể với tên, giá
   - Số lượng tồn kho (còn bao nhiêu cái)
   - Thông tin về giá cả trong khoảng nhất định
   - Gợi ý sản phẩm cụ thể dựa trên yêu cầu

**3. Khi có CẢ HAI (hybrid mode):**
   - Bước 1: Giải thích khái niệm/kỹ thuật từ guide_context
   - Bước 2: Đưa ra 3-5 gợi ý sản phẩm CỤ THỂ từ product_context
   - Ví dụ: "Vợt tấn công thường là vợt nặng đầu (head heavy), thân cứng... Một số gợi ý: Astrox 99 (2.5 triệu), Astrox 100ZZ (3 triệu)..."

**4. Quy tắc chung:**
   - LUÔN trả lời bằng ngôn ngữ của câu hỏi (Tiếng Việt hoặc English)
   - Ngắn gọn, thân thiện, dễ hiểu (tránh dài dòng)
   - Nếu hỏi về giá: Hiển thị giá cụ thể và đơn vị (đ hoặc VND)
   - Nếu hỏi về tồn kho: Nói rõ số lượng còn + trạng thái (còn hàng/sắp hết/hết hàng)
   - Nếu không có thông tin: Thừa nhận lịch sự và đề xuất liên hệ shop (Hotline: 0909-xxx-xxx)
   - Với câu hỏi về chính sách: Trích dẫn chính xác từ guide_context

**5. Mẫu trả lời cho các câu hỏi phổ biến:**

   "Có sản phẩm nào tầm 100k không?" (price_range_query)
   → Nếu CÓ sản phẩm: "Có, shop có một số sản phẩm tầm 100k: 1. [Tên] - [Giá]đ, 2. [Tên] - [Giá]đ..."
   → Nếu KHÔNG có: "Xin lỗi, hiện tại shop không có sản phẩm trong khoảng giá này. Bạn có thể liên hệ shop (Hotline: 0909-xxx-xxx) hoặc thử tìm kiếm với khoảng giá khác."
   
   "Sản phẩm X còn bao nhiêu cái?" (stock_query)
   → Trả lời trực tiếp: "[Tên sản phẩm] hiện còn [số lượng] cái ([trạng thái])"
   → Nếu sắp hết: Gợi ý đặt hàng sớm
   → Nếu hết: Đề xuất liên hệ để đặt trước
   → Nếu không tìm thấy: "Xin lỗi, shop không tìm thấy sản phẩm này. Bạn có thể kiểm tra lại tên hoặc liên hệ shop."
   
   "Những vợt nào phù hợp tấn công?" (style_recommendation, hybrid)
   → Phần 1: Giải thích ngắn (2-3 câu) về đặc điểm kỹ thuật
   → Phần 2: Gợi ý 3-5 sản phẩm cụ thể với giá và tồn kho
   → Format: "Vợt tấn công thường [đặc điểm]... Gợi ý cho bạn: 1. [Tên] ([Giá]) - [ghi chú ngắn], 2. ..."
   → Nếu không có sản phẩm phù hợp: Đề xuất liên hệ shop để tư vấn trực tiếp

=== CÂU HỎI ===
{question}

=== TRẢ LỜI ===
    `);

    // Chuẩn bị context sections với format rõ ràng
    const guide_context_section = guide_context
      ? `**THÔNG TIN TỪ HƯỚNG DẪN SHOP:**\n${guide_context}\n`
      : '(Không có thông tin từ hướng dẫn)';

    const product_context_section =
      product_context.length > 0
        ? `**SẢN PHẨM TỪ KHO (${product_context.length} sản phẩm):**\n${product_context
            .map((p, index) => {
              const parts = [
                `${index + 1}. ${p.name}`,
                p.brand ? `(${p.brand})` : '',
                p.price ? `- Giá: ${p.price.toLocaleString('vi-VN')}đ` : '',
                p.quantity !== undefined ? `- Tồn kho: ${p.quantity} cái` : '',
                p.stockStatus ? `(${p.stockStatus})` : '',
                p.category ? `[${p.category}]` : '',
                p.description ? `\n  Mô tả: ${p.description.substring(0, 100)}...` : ''
              ];
              return parts.filter((x) => x).join(' ');
            })
            .join('\n')}\n`
        : '(Không có sản phẩm từ kho)';

    const chain = RunnableSequence.from([
      {
        guide_context_section: () => guide_context_section,
        product_context_section: () => product_context_section,
        question: () => question
      },
      prompt,
      chatModel,
      new StringOutputParser()
    ]);

    const answer = await chain.invoke({ question });
    console.log('\n[ANSWER] Generated:', answer.substring(0, 200) + '...');

    //TẠO KẾT QUẢ VÀ LOGGING TÓM TẮT
    const executionSummary = {
      route: routing.route,
      intent: routing.intent,
      dataSourcesUsed: [],
      queriesExecuted: []
    };

    if (guide_context) {
      executionSummary.dataSourcesUsed.push('supabase_rag');
      executionSummary.queriesExecuted.push('vectorStore.similaritySearch');
    }
    if (product_context.length > 0) {
      executionSummary.dataSourcesUsed.push('mysql_db');
      switch (routing.intent) {
        case 'price_range_query':
          executionSummary.queriesExecuted.push('findProductsByPriceRange');
          break;
        case 'stock_query':
          executionSummary.queriesExecuted.push('getProductStockByNameOrId');
          break;
        case 'style_recommendation':
          executionSummary.queriesExecuted.push('listRacketsForStyle');
          break;
      }
    }

    console.log('\n========== EXECUTION SUMMARY ==========');
    console.log(`Route: ${executionSummary.route}`);
    console.log(`Intent: ${executionSummary.intent}`);
    console.log(`Data Sources: ${executionSummary.dataSourcesUsed.join(', ') || 'none'}`);
    console.log(`Queries Executed: ${executionSummary.queriesExecuted.join(', ') || 'none'}`);
    console.log(`Guide Context: ${guide_context ? 'Used' : 'Not used'}`);
    console.log(`Product Context: ${product_context.length > 0 ? `${product_context.length} items` : 'Empty'}`);
    console.log('=======================================\n');

    return res.json({
      answer,
      source: routing.route, // "guide_only" | "product_db" | "hybrid"
      intent: routing.intent,
      metadata: {
        hasGuideContext: !!guide_context,
        productCount: product_context.length,
        dataSourcesUsed: executionSummary.dataSourcesUsed,
        queriesExecuted: executionSummary.queriesExecuted,
        languageCode: routing.languageCode
      }
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { handleChat };

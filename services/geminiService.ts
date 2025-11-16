import { GoogleGenAI } from "@google/genai";

export const generateDescriptionFromImage = async (
  apiKey: string,
  base64Image: string,
  mimeType: string,
): Promise<string> => {
    if (!apiKey) {
        throw new Error("Vui lòng cung cấp API Key của Gemini.");
    }
    if (!base64Image || !mimeType) {
        throw new Error("Vui lòng tải lên hình ảnh để phân tích.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: `Phân tích hình ảnh nhân vật được cung cấp và viết một mô tả chi tiết bằng tiếng Việt.
Sử dụng văn phong tự nhiên, chia thành các đề mục rõ ràng như ví dụ dưới đây.

### VÍ DỤ VỀ CẤU TRÚC VÀ ĐẦU RA MONG MUỐN ###

Nhân vật này là một sinh vật hình người, được vẽ theo phong cách hoạt hình 2D đơn giản với đường viền đen đậm và nhất quán.

**Đặc điểm ngoại hình tổng thể:**
*   **Màu sắc chủ đạo:** Toàn bộ cơ thể, từ đầu đến chân, có màu cam sáng, đồng nhất.
*   **Hình dáng cơ thể:** Thân mình có dạng hình thang đơn giản, hơi loe ra ở phía dưới. Cánh tay và chân dài, gầy, có độ dày đồng đều.
*   **Tỷ lệ:** Đầu có kích thước lớn so với thân mình.

**Khuôn mặt:**
*   **Hình dạng đầu:** Đầu tròn.
*   **Mắt:** Đôi mắt to, lòng trắng và tròng đen hình tròn đơn giản, tạo vẻ gian xảo.
*   **Lông mày:** Lông mày đen, rậm, nhíu lại ở giữa.
*   **Miệng:** Một nụ cười toe toét rất rộng, để lộ nhiều răng.
*   **Mũi và Tai:** Không có mũi. Tai được thay thế bằng tai nghe.

**Quần áo và Phụ kiện:**
*   **Quần áo:** Nhân vật không mặc quần áo rõ ràng.
*   **Phụ kiện trên đầu:** Đội một cặp tai nghe kết hợp ăng-ten. Trên đỉnh mỗi ăng-ten là một quả cầu tròn.

**Phong cách và Biểu cảm:**
*   **Phong cách:** Tối giản, đồ họa phẳng.
*   **Tư thế:** Đứng thẳng, hai chân dang rộng, hai tay nắm hờ.
*   **Biểu cảm:** Tự tin, thách thức, và có phần tinh quái.

### QUY TẮC ###
1.  Mô tả chi tiết nhất có thể dựa vào hình ảnh.
2.  Sử dụng định dạng markdown với các đề mục in đậm (**...**) và gạch đầu dòng (*) để trình bày rõ ràng.
3.  Không trả về JSON. Chỉ trả về văn bản mô tả.

### KẾT THÚC VÍ DỤ ###

Bây giờ, hãy phân tích hình ảnh được cung cấp và tạo mô tả chi tiết.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] }
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API for description:", error);
        if (error instanceof Error) {
            return `Lỗi khi phân tích bằng AI: ${error.message}`;
        }
        return "Lỗi không xác định khi phân tích bằng AI.";
    }
};


export const generateJsonFromImage = async (
    apiKey: string,
    base64Image: string,
    mimeType: string,
): Promise<string> => {
    if (!apiKey) {
        throw new Error("Vui lòng cung cấp API Key của Gemini.");
    }
    if (!base64Image || !mimeType) {
        throw new Error("Vui lòng tải lên hình ảnh để phân tích.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: `Phân tích hình ảnh nhân vật được cung cấp và trả về một đối tượng JSON DUY NHẤT.
Đối tượng JSON này phải CỰC KỲ CHI TIẾT để sử dụng trong các mô hình tạo video như Veo 3.1, nhằm "khóa" đặc điểm nhân vật.
Mỗi giá trị phải là một chuỗi mô tả súc tích nhưng đầy đủ thông tin.

### VÍ DỤ VỀ ĐẦU RA MONG MUỐN (KHÔNG BAO GỒM "id" VÀ "name") ###
Ví dụ 1:
{
  "species": "Robot – Rabbit-shaped robot",
  "gender": "Female",
  "age": "Appears as a young adult robot",
  "voice_personality": "High-pitched; locale=en-US; accent=Robotic monotone",
  "body_build": "Petite, slender",
  "face_shape": "Rabbit-like, round",
  "hair": "None",
  "skin_or_fur_color": "White and pink metallic casing",
  "signature_feature": "Long rabbit ears, large black eyes with pink rims, heart symbol on body",
  "outfit_top": "Integrated pink dress-like torso",
  "outfit_bottom": "Integrated pink dress-like lower body",
  "helmet_or_hat": "Pink bow on head",
  "shoes_or_footwear": "Integrated robot feet",
  "props": "None",
  "body_metrics": "u=cm; abs.height=100; abs.head=20; abs.shoulder=25; abs.torso=50; abs.tail=0; abs.paw=10; anch.bottle500=20; cons=no-auto-rescale,lock-proportions"
}
Ví dụ 2:
{
  "species": "Robot – Humanoid robot",
  "gender": "Male",
  "age": "Appears as an adult robot",
  "voice_personality": "Male, clear; locale=en-US; accent=Robotic monotone",
  "body_build": "Standard humanoid robot build",
  "face_shape": "Rectangular screen for head",
  "hair": "None",
  "skin_or_fur_color": "Orange metallic casing",
  "signature_feature": "Rectangular screen head (displaying eyes), two antennae, heart symbol on torso",
  "outfit_top": "Integrated robot torso",
  "outfit_bottom": "Integrated robot lower body",
  "helmet_or_hat": "None",
  "shoes_or_footwear": "Integrated robot feet",
  "props": "None",
  "body_metrics": "u=cm; abs.height=180; abs.head=30; abs.shoulder=40; abs.torso=80; abs.tail=0; abs.paw=15; anch.bottle500=20; cons=no-auto-rescale,lock-proportions"
}

### CẤU TRÚC BẮT BUỘC ###
Sử dụng chính xác các khóa (keys) sau đây:
{
  "species": "Loài của nhân vật (ví dụ: Human, Robot, Alien, Elf). Có thể thêm chi tiết (ví dụ: Robot – Medical robot)",
  "gender": "Giới tính (ví dụ: Male, Female, Non-binary)",
  "age": "Tuổi hoặc mô tả độ tuổi (ví dụ: 25, Appears as a teenager)",
  "voice_personality": "Mô tả giọng nói và tính cách, tuân thủ định dạng: '[Pitch], [Clarity]; locale=[locale]; accent=[accent]'",
  "body_build": "Dáng người (ví dụ: Athletic, Slender, Muscular, Petite)",
  "face_shape": "Hình dáng khuôn mặt (ví dụ: Round, Oval, Square)",
  "hair": "Mô tả tóc (màu sắc, kiểu dáng, độ dài)",
  "skin_or_fur_color": "Màu da hoặc lông",
  "signature_feature": "Đặc điểm nhận dạng nổi bật nhất (ví dụ: A prominent scar over the left eye, glowing tattoos)",
  "outfit_top": "Trang phục phần trên",
  "outfit_bottom": "Trang phục phần dưới",
  "helmet_or_hat": "Mũ hoặc vật đội trên đầu",
  "shoes_or_footwear": "Giày hoặc vật mang ở chân",
  "props": "Đạo cụ nhân vật cầm hoặc mang theo",
  "body_metrics": "Thông số cơ thể, tuân thủ định dạng: 'u=cm; abs.height=...; abs.head=...; abs.shoulder=...; abs.torso=...; abs.tail=...; abs.paw=...; anch.bottle500=...; cons=no-auto-rescale,lock-proportions'"
}

### QUY TẮC TUYỆT ĐỐI ###
1.  **CỰC KỲ CHI TIẾT:** Các mô tả phải đủ rõ ràng để một AI khác có thể tái tạo lại nhân vật.
2.  **CHỈ TRẢ VỀ JSON:** KHÔNG thêm bất kỳ văn bản nào trước hoặc sau đối tượng JSON.
3.  **KHÔNG DÙNG MARKDOWN:** KHÔNG bao bọc JSON trong khối mã markdown (\`\`\`json ... \`\`\`).
4.  **KHÔNG CÓ TRƯỜNG 'id' và 'name':** Đối tượng JSON bạn tạo ra KHÔNG ĐƯỢC chứa trường "id" và "name". Các trường này sẽ được ứng dụng tự động thêm vào.

Bây giờ, hãy phân tích hình ảnh được cung cấp và tạo đối tượng JSON chi tiết theo các quy tắc trên.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] }
        });

        // Clean up potential markdown formatting from the response
        let jsonString = response.text.trim();
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.substring(7);
        }
        if (jsonString.endsWith("```")) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
        }
        
        return jsonString.trim();

    } catch (error) {
        console.error("Error calling Gemini API for JSON:", error);
        if (error instanceof Error) {
            throw new Error(`Lỗi khi tạo JSON bằng AI: ${error.message}`);
        }
        throw new Error("Lỗi không xác định khi tạo JSON bằng AI.");
    }
};
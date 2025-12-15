// Chatbot Q&A Database - Predefined questions and answers

interface QAPair {
  keywords: string[];
  question: string;
  answer: string;
}

export const chatbotQA: QAPair[] = [
  {
    keywords: ['marketing', 'cuộc thi', 'sinh viên', 'năm nhất', 'thi marketing', 'competition'],
    question: 'Tôi là sinh viên năm nhất chuyên ngành marketing, bạn có thể gợi ý những cuộc thi marketing phù hợp với tôi được không?',
    answer: `Tuyệt vời! Là sinh viên năm nhất ngành **Marketing**, việc tham gia cuộc thi học thuật hoặc thực chiến là cách rất hay để rèn kỹ năng, mở rộng mối quan hệ và "làm đẹp" CV từ sớm.

Dưới đây là danh sách các cuộc thi **Marketing phù hợp cho sinh viên năm nhất**, chia theo mức độ và mục tiêu nhé:

**Cuộc thi cho người mới bắt đầu (Phù hợp năm nhất)**

👉 *Mục tiêu:* Làm quen với tư duy marketing, teamwork, thuyết trình, sáng tạo nội dung.

📋 **Danh sách cuộc thi:**

**1. B-Marketer**
- *Tổ chức bởi:* CLB Kinh doanh – UEH
- *Nội dung:* Lên kế hoạch truyền thông cho doanh nghiệp thực tế
- *Thời gian:* Tháng 3–5

**2. Arena Multimedia – Creative Hunter**
- *Tổ chức bởi:* Arena Multimedia
- *Nội dung:* Cuộc thi sáng tạo nội dung, thiết kế quảng cáo, ý tưởng viral
- *Thời gian:* Tháng 6–8

**3. Young Marketers (Bản cơ bản)**
- *Tổ chức bởi:* Unilever Việt Nam & Brands Vietnam
- *Nội dung:* Đào tạo tư duy marketing nền tảng, có vòng tuyển cho sinh viên năm 1–2
- *Thời gian:* Tháng 9–11

**4. Marketers in Action (MIA)**
- *Tổ chức bởi:* Học viện Báo chí & Tuyên truyền
- *Nội dung:* Xây dựng chiến dịch IMC thực tế cho thương hiệu
- *Thời gian:* Tháng 10–12

**5. Brand Race**
- *Tổ chức bởi:* CLB Marketing NEU (ĐH Kinh tế Quốc dân)
- *Nội dung:* Thử thách tư duy chiến lược và sáng tạo trong Marketing
- *Thời gian:* Tháng 3–6

💡 **Lời khuyên:** Hãy bắt đầu với các cuộc thi có tính chất đào tạo và teamwork để tích lũy kinh nghiệm. Chúc bạn thành công! 🚀`
  }
];

// Function to find matching answer based on user input
export function findAnswer(userInput: string): string | null {
  const input = userInput.toLowerCase();

  for (const qa of chatbotQA) {
    // Check if any keyword matches the user input
    const hasMatch = qa.keywords.some(keyword =>
      input.includes(keyword.toLowerCase())
    );

    if (hasMatch) {
      return qa.answer;
    }
  }

  return null;
}

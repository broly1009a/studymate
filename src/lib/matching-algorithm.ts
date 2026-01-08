/**
 * Matching Algorithm for StudyMate
 * Tính toán độ phù hợp giữa current user và potential partners
 */

interface UserMatchData {
  university?: string;
  major?: string;
  learningNeeds?: string[];
  learningGoals?: string[];
  studyHabits?: string[];
  mbtiType?: string;
  age?: number;
}

interface PartnerMatchData {
  university: string;
  major: string;
  subjects: string[]; // learningNeeds
  goals: string[];    // learningGoals
  studyStyle: string[]; // studyHabits
  age: number;
}

/**
 * Calculate match score between user and partner
 * Returns a score from 0-100
 */
export function calculateMatchScore(
  user: UserMatchData,
  partner: PartnerMatchData
): number {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // 1. University Match (20 points)
  maxPossibleScore += 20;
  if (user.university && partner.university) {
    if (user.university.toLowerCase() === partner.university.toLowerCase()) {
      totalScore += 20;
    }
  }

  // 2. Major Match (20 points)
  maxPossibleScore += 20;
  if (user.major && partner.major) {
    if (user.major.toLowerCase() === partner.major.toLowerCase()) {
      totalScore += 20;
    } else if (areRelatedMajors(user.major, partner.major)) {
      totalScore += 10; // Partial score for related majors
    }
  }

  // 3. Learning Needs Overlap (20 points)
  maxPossibleScore += 20;
  if (user.learningNeeds && partner.subjects && user.learningNeeds.length > 0) {
    const overlapScore = calculateArrayOverlap(user.learningNeeds, partner.subjects);
    totalScore += Math.round(overlapScore * 20);
  }

  // 4. Learning Goals Overlap (15 points)
  maxPossibleScore += 15;
  if (user.learningGoals && partner.goals && user.learningGoals.length > 0) {
    const overlapScore = calculateArrayOverlap(user.learningGoals, partner.goals);
    totalScore += Math.round(overlapScore * 15);
  }

  // 5. Study Habits Compatibility (10 points)
  maxPossibleScore += 10;
  if (user.studyHabits && partner.studyStyle && user.studyHabits.length > 0) {
    const overlapScore = calculateArrayOverlap(user.studyHabits, partner.studyStyle);
    totalScore += Math.round(overlapScore * 10);
  }

  // 6. MBTI Compatibility (10 points) - Optional
  maxPossibleScore += 10;
  if (user.mbtiType) {
    // If partner doesn't have MBTI, give partial score
    totalScore += 5; // Neutral score when MBTI not available
  }

  // 7. Age Proximity (5 points)
  maxPossibleScore += 5;
  if (user.age && partner.age) {
    const ageDiff = Math.abs(user.age - partner.age);
    if (ageDiff === 0) {
      totalScore += 5;
    } else if (ageDiff <= 2) {
      totalScore += 4;
    } else if (ageDiff <= 5) {
      totalScore += 3;
    } else if (ageDiff <= 10) {
      totalScore += 1;
    }
  }

  // Calculate percentage (normalize to 0-100)
  const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  return Math.min(100, Math.max(0, matchPercentage)); // Ensure 0-100 range
}

/**
 * Calculate overlap percentage between two arrays
 * Returns 0-1 (0% to 100%)
 */
function calculateArrayOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1.length || !arr2.length) return 0;

  const set1 = new Set(arr1.map(item => item.toLowerCase().trim()));
  const set2 = new Set(arr2.map(item => item.toLowerCase().trim()));

  let matchCount = 0;
  set1.forEach(item => {
    if (set2.has(item)) {
      matchCount++;
    }
  });

  // Calculate overlap as percentage of smaller set
  const smallerSetSize = Math.min(set1.size, set2.size);
  return smallerSetSize > 0 ? matchCount / smallerSetSize : 0;
}

/**
 * Check if two majors are related
 */
function areRelatedMajors(major1: string, major2: string): boolean {
  const relatedGroups = [
    // Technology group
    ['kỹ thuật phần mềm', 'khoa học máy tính', 'công nghệ thông tin', 'hệ thống thông tin'],
    ['trí tuệ nhân tạo', 'khoa học dữ liệu', 'machine learning'],
    ['an toàn thông tin', 'mạng máy tính', 'bảo mật'],
    
    // Business group
    ['quản trị kinh doanh', 'kinh doanh quốc tế', 'marketing'],
    ['tài chính', 'ngân hàng', 'kế toán', 'kiểm toán'],
    
    // Design & Media
    ['thiết kế đồ họa', 'thiết kế đa phương tiện', 'truyền thông đa phương tiện'],
    
    // Language group
    ['ngôn ngữ anh', 'ngôn ngữ nhật', 'ngôn ngữ hàn'],
    
    // Science group
    ['toán học', 'toán - tin', 'toán ứng dụng'],
    ['vật lý', 'hóa học', 'sinh học'],
  ];

  const m1 = major1.toLowerCase().trim();
  const m2 = major2.toLowerCase().trim();

  return relatedGroups.some(group => 
    group.some(m => m1.includes(m)) && group.some(m => m2.includes(m))
  );
}

/**
 * MBTI Compatibility Matrix
 * Returns compatibility score 0-1
 */
function getMBTICompatibility(type1: string, type2: string): number {
  // Simplified MBTI compatibility
  // In reality, this would be more complex
  
  if (type1 === type2) return 1.0; // Same type = very compatible
  
  // Check for complementary types (simplified)
  const complementary = [
    ['INTJ', 'ENFP'], ['INTP', 'ENFJ'],
    ['INFJ', 'ENTP'], ['INFP', 'ENTJ'],
    ['ISTJ', 'ESFP'], ['ISFJ', 'ESTP'],
    ['ISTP', 'ESFJ'], ['ISFP', 'ESTJ'],
  ];

  const isComplementary = complementary.some(pair =>
    (pair[0] === type1 && pair[1] === type2) ||
    (pair[1] === type1 && pair[0] === type2)
  );

  if (isComplementary) return 0.9;
  
  // Default moderate compatibility
  return 0.5;
}

/**
 * Batch calculate match scores for multiple partners
 */
export function calculateMatchScores(
  user: UserMatchData,
  partners: PartnerMatchData[]
): Array<PartnerMatchData & { matchScore: number }> {
  return partners.map(partner => ({
    ...partner,
    matchScore: calculateMatchScore(user, partner),
  }));
}

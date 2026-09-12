export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
}

/**
 * Validate password strength
 * Requirements:
 * - At least 12 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 * - Not a common password
 */
export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 12) {
    feedback.push("Password must be at least 12 characters long");
  } else if (password.length >= 12 && password.length < 16) {
    score += 1;
  } else if (password.length >= 16) {
    score += 2;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  // Common password check
  const commonPasswords = [
    "password",
    "123456",
    "admin123",
    "Admin@123",
    "password123",
    "qwerty",
    "letmein",
    "welcome",
  ];

  const lowerPassword = password.toLowerCase();
  if (commonPasswords.some((common) => lowerPassword.includes(common.toLowerCase()))) {
    feedback.push("Password is too common. Please choose a more unique password");
    score = Math.max(0, score - 2);
  }

  // Sequential characters check
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    feedback.push("Avoid using sequential characters");
    score = Math.max(0, score - 1);
  }

  // Repeated characters check
  if (/(.)\1{2,}/.test(password)) {
    feedback.push("Avoid repeating the same character multiple times");
    score = Math.max(0, score - 1);
  }

  const isValid = feedback.length === 0 && score >= 4;

  if (isValid) {
    feedback.push("Strong password!");
  }

  return {
    isValid,
    score: Math.min(5, Math.max(0, score)),
    feedback,
  };
}

/**
 * Generate a strong random password
 */
export function generateStrongPassword(length: number = 16): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = uppercase + lowercase + numbers + special;

  let password = "";
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

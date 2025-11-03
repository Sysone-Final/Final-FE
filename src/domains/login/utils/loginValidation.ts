export const validateEmail = (email: string) => {
  if (!email.trim()) {
    return "아이디를 입력하세요.";
  }
  return "";
};

export const validatePassword = (password: string) => {
  if (!password.trim()) {
    return "비밀번호를 입력하세요.";
  }
  return "";
};

export const hasKorean = (text: string) => {
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
};

export const removeKorean = (text: string) => {
  return text.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "");
};

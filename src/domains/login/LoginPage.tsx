import { useState } from "react";
import AnimationBackground from "./components/AnimationBackground";
import Input from "./components/Input";
import Button from "./components/Button";
import EmailIcon from "../assets/email.svg";
import PasswordIcon from "../assets/password.svg";
import "./css/LoginPage.css";
import NetworkAnimation from "./components/NetworkAnimation";
import { motion } from "framer-motion";
import {
  validateEmail,
  validatePassword,
  hasKorean,
  removeKorean,
} from "./utils/loginValidation";
import { useLogin } from "./hooks/useLogin";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const mutation = useLogin();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (hasKorean(value)) {
      setEmailError("영문과 숫자만 입력 가능합니다.");
    } else {
      setEmailError("");
    }
    const filteredValue = removeKorean(value);
    setEmail(filteredValue);
  };

  const handleLogin = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setEmailError("");
    setPasswordError("");

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    mutation.mutate({
      userName: email,
      password: password,
    });
  };

  return (
    <div className="login-page">
      <AnimationBackground />
      <div className="login-container">
        <div className="login-form-container">
          <img src="/logo.svg" alt="logo" className="login-logo" />
          <div className="login-form">
            <Input
              label="아이디"
              id="email"
              placeholder="아이디를 입력하세요."
              type="email"
              value={email}
              onChange={handleEmailChange}
              icon={<img src={EmailIcon} alt="email" />}
              error={emailError}
              disabled={mutation.isPending}
            />
            <Input
              label="비밀번호"
              id="password"
              placeholder="비밀번호를 입력하세요."
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<img src={PasswordIcon} alt="password" />}
              error={passwordError}
              disabled={mutation.isPending}
            />
            {mutation.isError && (
              <div style={{ color: "red", marginTop: "10px" }}>
                로그인 실패: {mutation.error?.message || "다시 시도해주세요."}
              </div>
            )}
            <Button
              text="로그인"
              onClick={handleLogin}
              disabled={mutation.isPending}
            />
          </div>
        </div>
        <div className="rotating-logo-container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="hero-text-gradient">Serverway</span>
            </motion.div>

            <motion.div
              className="hero-subtext"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              언제 어디서나 서버실을 모니터링하고
              <br />
              제어할 수 있는 통합 관리 솔루션
            </motion.div>
          </div>
          <div className="network-animation-wrapper">
            <NetworkAnimation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

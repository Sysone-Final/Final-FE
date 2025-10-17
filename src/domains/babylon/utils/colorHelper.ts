import { Color3 } from '@babylonjs/core';

/**
 * RGB 문자열을 Babylon.js Color3로 변환
 * @param rgbString - "rgb(255 255 255)" 형식의 문자열
 * @returns Color3 객체
 */
export const rgbStringToColor3 = (rgbString: string): Color3 => {
  // "rgb(37 99 235)" -> [37, 99, 235]
  const match = rgbString.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/);
  
  if (!match) {
    console.warn(`Invalid RGB string: ${rgbString}, using default color`);
    return new Color3(1, 1, 1);
  }

  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;

  return new Color3(r, g, b);
};

/**
 * Hex 색상 문자열을 Babylon.js Color3로 변환
 * @param hexString - "#RRGGBB" 형식의 문자열
 * @returns Color3 객체
 */
export const hexToColor3 = (hexString: string): Color3 => {
  return Color3.FromHexString(hexString);
};

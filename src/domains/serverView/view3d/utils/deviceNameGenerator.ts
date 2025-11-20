import type { Equipment3D, EquipmentType } from '../../types';

/**
 * 장비 이름/코드 생성을 위한 다음 사용 가능한 번호 계산
 * 같은 타입의 기존 장비들 중 가장 큰 번호를 찾아 +1 반환
 * 
 * @param equipment 기존 장비 목록
 * @param type 장비 타입
 * @param serverRoomId 서버실 ID
 * @param pattern 번호를 추출할 정규식 패턴 (기본값: name 필드에서 추출)
 * @returns 다음 사용 가능한 번호 (1부터 시작)
 */
export function getNextDeviceNumber(
  equipment: Equipment3D[],
  type: EquipmentType,
  serverRoomId: string | number,
  pattern?: RegExp,
): number {
  const defaultPattern = new RegExp(`${type}-SR${serverRoomId}-(\\d+)`, 'i');
  const regex = pattern || defaultPattern;

  const maxNumber = Math.max(
    0,
    ...equipment
      .filter(e => e.type === type)
      .map(e => {
        const match = e.metadata?.name?.match(regex);
        return match ? parseInt(match[1], 10) : 0;
      })
  );

  return maxNumber + 1;
}

/**
 * 장비 이름 생성
 * 형식: {type}-SR{serverRoomId}-{number}
 * 
 * @param type 장비 타입
 * @param serverRoomId 서버실 ID
 * @param number 번호
 * @returns 생성된 장비 이름
 */
export function generateDeviceName(
  type: EquipmentType,
  serverRoomId: string | number,
  number: number,
): string {
  return `${type}-SR${serverRoomId}-${String(number).padStart(3, '0')}`;
}

/**
 * 장비 코드 생성
 * 형식: SR{serverRoomId}-{TYPE}-{number}
 * 
 * @param type 장비 타입
 * @param serverRoomId 서버실 ID
 * @param number 번호
 * @returns 생성된 장비 코드
 */
export function generateDeviceCode(
  type: EquipmentType,
  serverRoomId: string | number,
  number: number,
): string {
  return `SR${serverRoomId}-${type.toUpperCase()}-${String(number).padStart(3, '0')}`;
}

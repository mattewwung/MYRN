import BatteryLevel from './NativeBatteryLevel';

export async function getBatteryLevel(): Promise<number> {
  return BatteryLevel.getBatteryLevel();
}

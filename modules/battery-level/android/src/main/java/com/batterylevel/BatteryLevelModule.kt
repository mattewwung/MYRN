package com.batterylevel

import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.fbreact.specs.NativeBatteryLevelSpec
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise

class BatteryLevelModule(reactContext: ReactApplicationContext) :
  NativeBatteryLevelSpec(reactContext) {

  override fun getBatteryLevel(promise: Promise) {
    val batteryStatus =
      reactApplicationContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))

    if (batteryStatus == null) {
      promise.reject(
        "battery_unavailable",
        "Battery level is unavailable on this device."
      )
      return
    }

    val level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
    val scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1)

    if (level < 0 || scale <= 0) {
      promise.reject(
        "battery_unavailable",
        "Battery level is unavailable on this device."
      )
      return
    }

    promise.resolve(level.toDouble() * 100.0 / scale.toDouble())
  }

  companion object {
    const val NAME = NativeBatteryLevelSpec.NAME
  }
}

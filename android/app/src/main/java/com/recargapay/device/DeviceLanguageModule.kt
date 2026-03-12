package com.recargapay.device

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale

class DeviceLanguageModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "DeviceLanguageModule"

  @ReactMethod
  fun getCurrentLanguage(promise: Promise) {
    try {
      val locale = Locale.getDefault()
      promise.resolve(locale.toLanguageTag())
    } catch (error: Exception) {
      promise.reject("DEVICE_LANGUAGE_ERROR", error)
    }
  }
}

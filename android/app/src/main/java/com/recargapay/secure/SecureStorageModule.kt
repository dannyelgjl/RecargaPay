package com.recargapay.secure

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class SecureStorageModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SecureStorageModule"

  @ReactMethod
  fun setItem(key: String, value: String, promise: Promise) {
    try {
      val encryptedValue = encrypt(value)
      getPreferences().edit().putString(key, encryptedValue).apply()
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SECURE_STORAGE_SET_ERROR", error)
    }
  }

  @ReactMethod
  fun getItem(key: String, promise: Promise) {
    try {
      val storedValue = getPreferences().getString(key, null)

      if (storedValue == null) {
        promise.resolve(null)
        return
      }

      promise.resolve(decrypt(storedValue))
    } catch (error: Exception) {
      promise.reject("SECURE_STORAGE_GET_ERROR", error)
    }
  }

  @ReactMethod
  fun removeItem(key: String, promise: Promise) {
    try {
      getPreferences().edit().remove(key).apply()
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SECURE_STORAGE_REMOVE_ERROR", error)
    }
  }

  private fun getPreferences() =
    reactContext.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

  private fun getOrCreateSecretKey(): SecretKey {
    val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply {
      load(null)
    }

    val existingKey = keyStore.getKey(KEY_ALIAS, null) as? SecretKey
    if (existingKey != null) {
      return existingKey
    }

    val keyGenerator =
      KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
    val parameterSpec =
      KeyGenParameterSpec.Builder(
        KEY_ALIAS,
        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
      )
        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
        .setRandomizedEncryptionRequired(true)
        .setKeySize(256)
        .build()

    keyGenerator.init(parameterSpec)
    return keyGenerator.generateKey()
  }

  private fun encrypt(value: String): String {
    val cipher = Cipher.getInstance(TRANSFORMATION)
    cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())

    val encrypted = cipher.doFinal(value.toByteArray(StandardCharsets.UTF_8))
    val iv = Base64.encodeToString(cipher.iv, Base64.NO_WRAP)
    val payload = Base64.encodeToString(encrypted, Base64.NO_WRAP)

    return "$iv:$payload"
  }

  private fun decrypt(payload: String): String {
    val parts = payload.split(":", limit = 2)
    require(parts.size == 2) { "Invalid encrypted payload" }

    val iv = Base64.decode(parts[0], Base64.NO_WRAP)
    val encrypted = Base64.decode(parts[1], Base64.NO_WRAP)
    val cipher = Cipher.getInstance(TRANSFORMATION)
    val spec = GCMParameterSpec(128, iv)

    cipher.init(Cipher.DECRYPT_MODE, getOrCreateSecretKey(), spec)

    return String(cipher.doFinal(encrypted), StandardCharsets.UTF_8)
  }

  companion object {
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"
    private const val KEY_ALIAS = "recargapay_secure_storage_key"
    private const val PREFERENCES_NAME = "recargapay_secure_storage"
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
  }
}

import Foundation
import React
import Security

@objc(SecureStorageModule)
class SecureStorageModule: NSObject {
  @objc(setItem:value:resolver:rejecter:)
  func setItem(
    _ key: String,
    value: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let encodedValue = Data(value.utf8)
    var query = keychainQuery(for: key)

    SecItemDelete(query as CFDictionary)
    query[kSecValueData as String] = encodedValue

    let status = SecItemAdd(query as CFDictionary, nil)

    if status == errSecSuccess {
      resolve(nil)
      return
    }

    reject("SECURE_STORAGE_SET_ERROR", "Unable to save value", nil)
  }

  @objc(getItem:resolver:rejecter:)
  func getItem(
    _ key: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    var query = keychainQuery(for: key)
    query[kSecReturnData as String] = true
    query[kSecMatchLimit as String] = kSecMatchLimitOne

    var result: AnyObject?
    let status = SecItemCopyMatching(query as CFDictionary, &result)

    if status == errSecItemNotFound {
      resolve(nil)
      return
    }

    if status != errSecSuccess {
      reject("SECURE_STORAGE_GET_ERROR", "Unable to read value", nil)
      return
    }

    guard
      let data = result as? Data,
      let value = String(data: data, encoding: .utf8)
    else {
      reject("SECURE_STORAGE_GET_ERROR", "Unable to decode value", nil)
      return
    }

    resolve(value)
  }

  @objc(removeItem:resolver:rejecter:)
  func removeItem(
    _ key: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let status = SecItemDelete(keychainQuery(for: key) as CFDictionary)

    if status == errSecSuccess || status == errSecItemNotFound {
      resolve(nil)
      return
    }

    reject("SECURE_STORAGE_REMOVE_ERROR", "Unable to remove value", nil)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  private func keychainQuery(for key: String) -> [String: Any] {
    [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: "com.recargapay.secure-storage",
      kSecAttrAccount as String: key,
      kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    ]
  }
}

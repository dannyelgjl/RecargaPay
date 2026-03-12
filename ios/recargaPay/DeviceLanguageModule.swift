import Foundation
import React

@objc(DeviceLanguageModule)
class DeviceLanguageModule: NSObject {
  @objc(getCurrentLanguage:rejecter:)
  func getCurrentLanguage(
    resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let language = Locale.preferredLanguages.first ?? "unknown"
    resolve(language)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }
}

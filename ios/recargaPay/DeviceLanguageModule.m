#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceLanguageModule, NSObject)
RCT_EXTERN_METHOD(getCurrentLanguage:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end

#import "BatteryLevel.h"
#import <UIKit/UIKit.h>

@implementation BatteryLevel
- (void)getBatteryLevel:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    UIDevice *device = [UIDevice currentDevice];
    BOOL wasMonitoringEnabled = device.isBatteryMonitoringEnabled;
    if (!wasMonitoringEnabled) {
        device.batteryMonitoringEnabled = YES;
    }

    float level = device.batteryLevel;

    if (!wasMonitoringEnabled) {
        device.batteryMonitoringEnabled = NO;
    }

    // UIDevice batteryLevel is in [0.0, 1.0], or -1.0 when unavailable.
    if (level < 0.0f) {
        reject(@"battery_unavailable", @"Battery level is unavailable on this device.", nil);
        return;
    }

    resolve(@((double)level * 100.0));
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBatteryLevelSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"BatteryLevel";
}

@end

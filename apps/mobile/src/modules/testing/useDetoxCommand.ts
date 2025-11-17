import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, type NativeModule } from 'react-native';

type CommandPayload = Record<string, unknown> | undefined;

type DetoxAction = {
  type: string;
  params?: CommandPayload;
};

type CommandHandler = (params?: CommandPayload) => void;

function isDetoxAvailable(): boolean {
  const modules = NativeModules as unknown as { Detox?: object };
  return typeof modules.Detox !== 'undefined';
}

export function useDetoxCommand(type: string, handler: CommandHandler): void {
  useEffect(() => {
    if (!isDetoxAvailable()) {
      return;
    }
    const detoxModule = (NativeModules as unknown as { Detox: NativeModule }).Detox;
    const emitter = new NativeEventEmitter(detoxModule);
    const subscription = emitter.addListener('DetoxAction', (action: DetoxAction) => {
      if (action.type === type) {
        handler(action.params);
      }
    });
    return () => {
      subscription.remove();
    };
  }, [handler, type]);
}

export function useIsDetoxEnvironment(): boolean {
  return isDetoxAvailable();
}

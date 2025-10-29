module.exports = {
  testRunner: {
    args: {
      $0: 'node',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'android.emu.debug': {
      type: 'android.apk',
      binaryPath: 'bin/BmadMobile-debug.apk',
      build: 'expo run:android --variant debug --no-install --local'
    },
    'ios.sim.debug': {
      type: 'ios.app',
      binaryPath: 'bin/BmadMobile.app',
      build: 'expo run:ios --configuration Debug --no-install --local'
    }
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_6_API_34'
      }
    },
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    }
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.emu.debug'
    },
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.sim.debug'
    }
  }
};

import * as Segment from 'expo-analytics-segment';
import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from './useSettings';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';

const SegmentContext = createContext(undefined)

interface SegmentState {
  enable: () => void,
  disable: () => void,
  isEnabled: () => Promise<boolean>,
  initialize: () => void,
  track: (event: string, properties?: any) => void,
  screen: (screenName: string, properties?: any) => void,
}

function SegmentProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { settings } = useSettings()

  const [isIdentified, setIsIdentified] = useState(false)

  useEffect(() => {
    const traits = {
      userId: settings.deviceId,
      appVersion: Constants?.manifest?.version,
      deviceModel: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      locale: Localization.locale,
    }
    
    if(settings.deviceId !== null && !isIdentified) {
      if(__DEV__) {
        console.log('useSegment: identify', traits)
        return;
      }

      Segment.identifyWithTraits(settings.deviceId, traits)
      setIsIdentified(true)
    }
  }, [settings.deviceId])
  
  const value: SegmentState = {
    enable: () => Segment.setEnabledAsync(true),
    disable: () => Segment.setEnabledAsync(false),
    isEnabled: async () => {
      return await Segment.getEnabledAsync()
    },
    initialize: async () => {
      Segment.initialize({
        iosWriteKey: "Yo8UcPWNys6eIpRYVtWAvZ3enRxS8ALQ",
        androidWriteKey: "Yo8UcPWNys6eIpRYVtWAvZ3enRxS8ALQ",
      })
    },
    track: (eventName: string, properties?: any) => {
      if(__DEV__) {
        console.log('useSegment: track', eventName, properties)
        return;
      }

      Segment.trackWithProperties(eventName, {
        ...properties,
        userId: settings.deviceId
      })
    },
    screen: (screenName: string) => {
      if(__DEV__) {
        console.log('useSegment: screen', screenName)
        return;
      }

      Segment.screenWithProperties(screenName, {
        userId: settings.deviceId
      })
    }
  }
  
  return (
    <SegmentContext.Provider value={value}>
      {children}
    </SegmentContext.Provider>
  )
}


function useSegment(): SegmentState {
  const context = useContext(SegmentContext)
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider')
  }
  return context
}

export { SegmentProvider, useSegment };

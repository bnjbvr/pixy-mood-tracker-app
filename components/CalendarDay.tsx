import chroma from "chroma-js";
import dayjs from "dayjs";
import { memo } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { AlignLeft } from "react-native-feather";
import useColors from "../hooks/useColors";
import useHaptics from "../hooks/useHaptics";
import { LogItem } from "../hooks/useLogs";
import { Tag } from "../hooks/useSettings";

const TextIndicator = ({
  textColor,
}: {
  textColor: string;
}) => (
  <View style={{
    opacity: 0.5,
  }}><AlignLeft color={textColor} width={10} height={10} /></View>
)

const TagIndicator = ({
  tag,
  borderColor,
}) => {
  const colors = useColors();
  
  return (
    <View
      key={tag.id}
      style={{
        width: 7,
        height: 7,
        margin: 1,
        borderRadius: 100,
        backgroundColor: colors.tags[tag.color]?.dot,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    />
  )
}

export default memo(function CalendarDay({ 
  dateString,
  day,
  rating,
  tags,
  isToday,
  isFiltered,
  isDisabled,
  hasText,
  onPress,
}: {
  dateString: string,
  day: number,
  tags: LogItem['tags'],
  rating?: LogItem["rating"],
  isToday: boolean,
  isDisabled: boolean,
  isFiltered: boolean,
  hasText: boolean,
  onPress: any,
}) {
  const colors = useColors();
  const haptics = useHaptics();
  let colorScheme = useColorScheme();

  const backgroundColor = (
    isFiltered ? (
      colors.calendarBackground
    ) : (
      rating ? 
        colors.scales['ColorBrew-RdYlGn'][rating].background : 
        colors.calendarItemBackground
    )
  )
  const textColor = (
    isFiltered ? (
      colors.text
    ) : (
      rating ? 
        colors.scales['ColorBrew-RdYlGn'][rating].text : 
        colors.calendarItemTextColor
    )
  )
  
  return (
    <>
      <TouchableOpacity
        disabled={isDisabled || !onPress}
        onPress={async () => {
          if(!isDisabled) {
            await haptics.selection()
            onPress(dateString)
          }
        }}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          borderRadius: 6,
          backgroundColor: isDisabled || isFiltered ? colors.calendarItemBackgroundFuture : backgroundColor,
          width: '100%',
          aspectRatio: 1,
          borderWidth: 2,
          borderColor: colorScheme === 'light' ? 
            chroma(backgroundColor).darken(0.4).hex() : 
            isDisabled || isFiltered ? 
              chroma(backgroundColor).brighten(0.1).hex() :
              chroma(backgroundColor).brighten(0.8).hex(),
        }}
        testID={`calendar-day-${dateString}`}
        accessible={true}
        accessibilityLabel={`${dayjs(dateString).format('LL')}`}
        dataSet={{ 
          rating: rating ? rating : 'none',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: '50%',
            width: '100%',
          }}
        >
          {/* <View style={{
            flexDirection: 'row',
            width: '70%',
            flexWrap: 'wrap',
          }}>
            { tags?.length > 0 && tags.slice(0, 4).map((tag: Tag) => (
              <TagIndicator 
                key={tag.id} 
                tag={tag} 
                borderColor={chroma(backgroundColor).luminance() < 0.6 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)'}
              />
            ))}
          </View> */}
          <View
            style={{
              width: '30%',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            { hasText && <TextIndicator textColor={textColor} />}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '50%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 20,
              minWidth: 20,
              borderRadius: 100,
              backgroundColor: isToday ? 
                (chroma(backgroundColor).luminance() < 0.6 ? 
                  'rgba(255,255,255,0.5)' : 
                  'rgba(0,0,0,0.15)'
                ) : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                opacity: isDisabled || isFiltered ? 0.3 : 1,
                color: isToday ? '#000' : textColor,
              }}
            >{day}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </>
  );
})
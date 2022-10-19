import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../../components/Statistics/Card';
import { t } from '../../helpers/translation';
import { useAnonymizer } from '../../hooks/useAnonymizer';
import { useCalendarFilters } from '../../hooks/useCalendarFilters';
import useColors from '../../hooks/useColors';
import useHaptics from '../../hooks/useHaptics';
import { TagsDistributionData } from '../../hooks/useStatistics/TagsDistribution';
import { Tag } from '../../hooks/useTags';
import { CardFeedback } from './CardFeedback';

export const TagsDistributionCard = ({
  data,
}: {
  data: TagsDistributionData
}) => {
  const colors = useColors()
  const haptic = useHaptics()
  const { anonymizeTag } = useAnonymizer()
  const calendarFilters = useCalendarFilters()
  const navigation = useNavigation()
  
  const onPress = (tagId: Tag['id']) => {
    haptic.selection()
    calendarFilters.set({
      ...calendarFilters.data,
      tagIds: [tagId],
    })
    navigation.navigate('Calendar')
  }
  
  return (
    <Card
      subtitle={t('tags')}
      title={t('statistics_tags_distribution_title', {
        count: data.itemsCount,
      })}
    >
      <View
        style={{
          flexDirection: 'column',
          marginBottom: 8,
        }}
      >
        {data.tags.slice(0, 5).map(tag => {
          return (
            <Pressable
              key={tag?.details?.id}
              onPress={() => onPress(tag.id)}
              style={{
                position: 'relative',
                height: 32,
                marginBottom: 8,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.tags[tag?.details?.color]?.background,
                  height: 32,
                  width: tag.count / data.tags[0].count * 100 + '%',
                  borderRadius: 4,
                  position: 'absolute',
                }}
              >
              </View>
              <Text
                style={{
                  color: colors.tags[tag?.details?.color]?.text,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >{tag.count}x {tag?.details?.title}</Text>
            </Pressable>
          );
        })}
        {data.tags.length > 5 && (
          <View
            style={{
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >And {data.tags.length - 5} more</Text>
          </View>
        )}
      </View>
      <CardFeedback 
        type='tags_distribution' 
        details={{ 
          count: data.itemsCount, 
          tags: data.tags.map(tag => anonymizeTag(tag.details))
        }} />
    </Card>
  );
};

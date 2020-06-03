<template>
  <button
    :style="styles"
    class="time-table-event flex px-4 py-2 relative text-xs text-left z-10"
    :class="{
      'bg-darker-gray text-white': !isSelected && !event.isFeatured,
      'bg-blue text-white': !isSelected && event.isFeatured,
      'bg-white text-black': isSelected,
      selected: isSelected,
    }"
    type="button"
    v-bind="accessibilityProps"
    @click="handleClick"
  >
    <div class="flex-grow">
      <VClamp
        class="font-bold text-sm"
        :max-lines="showInlineDescription && isSelected ? 0 : 1"
        >{{ event.title }}</VClamp
      >
      <VClamp :max-lines="showInlineDescription && isSelected ? 0 : 1"
        >{{ startTime }} - {{ endTime }}</VClamp
      >
      <VClamp
        v-if="event.description"
        class="description"
        :max-lines="showInlineDescription && isSelected ? 0 : 2"
        >{{ event.description }}</VClamp
      >
      <EventLinks
        v-if="showInlineDescription && isSelected"
        class="mt-4"
        :event="event"
      />
    </div>
    <FeaturedIcon v-if="event.isFeatured" class="flex-shrink-0 ml-1" />
  </button>
</template>

<script>
import VClamp from 'vue-clamp';
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import EventLinks from '~/components/EventLinks';
import FeaturedIcon from '~/assets/icons/globeB.svg';
import TrackingEvents from '~/constants/TrackingEvents';
import formatDate from '~/util/formatDate';
import getNearestStartTime from '~/util/getNearestStartTime';
import getNearestEndTime from '~/util/getNearestEndTime';

export default {
  components: { EventLinks, FeaturedIcon, VClamp },
  props: {
    event: {
      type: Object,
      required: true,
    },
    isClone: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    showInlineDescription: {
      type: Boolean,
      default: false,
    },
    timeTableStart: {
      type: Date,
      required: true,
    },
  },
  computed: {
    accessibilityProps() {
      return this.isClone ? { 'aria-hidden': 'true', tabindex: -1 } : {};
    },
    endTime() {
      return formatDate(this.event.endTime);
    },
    startTime() {
      return formatDate(this.event.startTime);
    },
    styles() {
      const { channel, endTime, startTime } = this.event;
      const displayedStartTime =
        startTime < this.timeTableStart ? this.timeTableStart : startTime;
      const startStr = format(getNearestStartTime(displayedStartTime), 'HHmm', {
        timeZone: 'America/New_York',
      });
      const endStr = format(getNearestEndTime(endTime), 'HHmm');
      return {
        'grid-row': `channel-${kebabCase(channel) +
          (this.isClone ? '-clone' : '')}`,
        'grid-column': `time-${startStr} / time-${endStr}`,
      };
    },
  },
  methods: {
    handleClick() {
      const trackingPayload = {
        event: TrackingEvents.CLICKED_TIMETABLE_EVENT,
        title: this.event.title,
        date: this.event.startTime,
      };
      this.$gtm.push(trackingPayload);
      this.$emit('click', this.event);
    },
  },
};
</script>

<style lang="scss" scoped>
.time-table-event.selected::before {
  @apply absolute block bg-black inset-y-0 left-0 pl-2;
  content: '';
}

.description {
  max-width: 60vw;

  @media screen and (min-width: 768px) {
    max-width: 80ch;
  }
}
</style>

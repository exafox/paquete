<template>
  <button
    class="flex px-4 py-2 relative text-xs text-left"
    :class="{
      'md:bg-darker-gray md:text-white': !isSelected && !event.isFeatured,
      'bg-blue text-white': !isSelected && event.isFeatured,
      'bg-white text-black': isSelected,
      selected: isSelected,
    }"
    type="button"
    @click="handleClick"
  >
    <div
      v-if="isSelected"
      class="absolute block bg-blue md:bg-black inset-y-0 left-0 pl-2"
    />
    <div class="flex-grow">
      <VClamp class="font-bold text-sm" :max-lines="isSelected ? 0 : 1">{{
        event.title
      }}</VClamp>
      <VClamp :max-lines="isSelected ? 0 : 1"
        >{{ startTime }} - {{ endTime }}</VClamp
      >
      <VClamp
        v-if="description"
        class="description whitespace-pre-line"
        :max-lines="isSelected ? 0 : 2"
        >{{ description }}</VClamp
      >
      <EventLinks v-if="isSelected" class="mt-4" :event="event" />
    </div>
    <FeaturedIcon v-if="event.isFeatured" class="flex-shrink-0 ml-1" />
  </button>
</template>

<script>
import VClamp from 'vue-clamp';
import EventLinks from '~/components/EventLinks';
import FeaturedIcon from '~/assets/icons/globeB.svg';
import TrackingEvents from '~/constants/TrackingEvents';
import formatDate from '~/util/formatDate';

export default {
  components: { EventLinks, FeaturedIcon, VClamp },
  props: {
    event: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    description() {
      return this.event.description ? this.event.description.trim() : null;
    },
    endTime() {
      return formatDate(this.event.endTime);
    },
    startTime() {
      return formatDate(this.event.startTime);
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
.description {
  max-width: 80ch;
}
</style>

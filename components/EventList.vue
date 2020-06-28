<template>
  <div>
    <template v-for="item in items">
      <ChannelHeader :key="item.channel" class="mb-1">{{
        item.channel
      }}</ChannelHeader>
      <EventListing
        v-for="event in item.events"
        :key="event.id"
        class="mb-1 w-full"
        :event="event"
        :is-selected="event === selectedEvent"
        @click="$emit('eventClick', $event)"
      />
    </template>
  </div>
</template>

<script>
import uniq from 'lodash/uniq';
import ChannelHeader from '~/components/ChannelHeader';
import EventListing from '~/components/EventListing';

export default {
  components: { ChannelHeader, EventListing },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    selectedEvent: {
      type: Object,
      default: null,
    },
  },
  computed: {
    channels() {
      return uniq(this.events.map((item) => item.channel))
        .filter((item) => item)
        .sort();
    },
    items() {
      return this.channels.map((channel) => ({
        channel,
        events: this.events.filter((event) => event.channel === channel),
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>

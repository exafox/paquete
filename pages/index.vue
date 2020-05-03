<template>
  <div class="flex flex-wrap flex-row-reverse">
    <template v-if="$mq !== 'sm'">
      <div class="video bg-black w-1/2"></div>
      <div class="description flex flex-col overflow-auto p-12 w-1/2">
        <EventDescription :event="selectedEvent" />
      </div>
    </template>
    <TimeTable
      :auto-scroll="autoScroll"
      :channels="channels"
      :events="upcomingEvents"
      :current-time="currentTime"
      :start-time="startTime"
      :hours-to-display="hoursToDisplay"
      :selected-event="selectedEvent"
      :show-inline-descriptions="$mq === 'sm'"
      class="w-full"
      @eventClick="handleEventClick"
    />
    <transition name="slow-fade">
      <LoadingScreen v-if="isLoading" />
    </transition>
  </div>
</template>

<script>
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import uniq from 'lodash/uniq';
import EventDescription from '~/components/EventDescription';
import LoadingScreen from '~/components/LoadingScreen';
import TimeTable from '~/components/TimeTable';
import getNearestStartTime from '~/util/getNearestStartTime';
import wait from '~/util/wait';
import { fetchData } from '~/services/api';

export default {
  name: 'Homepage',
  components: { EventDescription, LoadingScreen, TimeTable },
  data() {
    return {
      autoScroll: false,
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
      hasTouchedAutoScroll: false,
      hasTouchedTimeTable: false,
      selectedEvent: null,
    };
  },
  computed: {
    channels() {
      return uniq(this.events.map((item) => item.channel))
        .filter((item) => item)
        .sort();
    },
    startTime() {
      return getNearestStartTime(this.currentTime);
    },
    upcomingEvents() {
      const tableEndTime = addHours(
        this.startTime,
        this.hoursToDisplay - 0.0167
      );
      return this.events.filter(
        (event) =>
          isAfter(event.endTime, this.startTime) &&
          isBefore(event.startTime, tableEndTime)
      );
    },
  },
  watch: {
    hasTouchedTimeTable(newVal) {
      if (newVal) {
        clearInterval(this.randomizerInterval);
      }
    },
    $mq: {
      handler(newVal) {
        if (newVal === 'sm') {
          this.autoScroll = false;
        } else {
          if (!this.hasTouchedAutoScroll) {
            this.autoScroll = true;
          }
          if (!this.selectedEvent) {
            this.pickRandomEvent();
          }
        }
      },
    },
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);

    // Wait for the data, or at least one second - whichever is longer - so that
    // folks can appreciate the loading screen. Might be a horrible idea.
    const [events] = await Promise.all([fetchData(), wait(1000)]);

    this.events = events;
    this.isLoading = false;
    this.randomizerInterval = setInterval(this.pickRandomEvent, 15000);
    if (this.$mq !== 'sm') {
      this.pickRandomEvent();
      this.autoScroll = true;
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.randomizerInterval);
  },
  methods: {
    handleEventClick(event) {
      this.selectedEvent = event;
      this.hasTouchedTimeTable = true;
    },
    pickRandomEvent() {
      if (!this.upcomingEvents.length || this.$mq === 'sm') return;
      const getNewEvent = () =>
        this.upcomingEvents[
          Math.floor(Math.random() * this.upcomingEvents.length)
        ];
      let newEvent;
      do {
        newEvent = getNewEvent();
      } while (newEvent === this.selectedEvent);
      this.selectedEvent = newEvent;
    },
  },
};
</script>

<style lang="scss">
.slow-fade-leave {
  opacity: 1;

  &-active {
    transition: opacity 0.5s ease;
  }

  &-to {
    opacity: 0;
  }
}
</style>

<style lang="scss" scoped>
.time-table {
  height: 100vh;
}

@media screen and (min-width: 768px) {
  .video,
  .description,
  .time-table {
    height: 50vh;
  }
}
</style>

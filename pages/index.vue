<template>
  <div class="flex flex-wrap flex-row-reverse">
    <div class="video bg-black w-1/2"></div>
    <div
      class="bg-blue-500 description flex flex-col overflow-auto p-4 md:p-8 text-white w-1/2"
    >
      <EventDescription :event="selectedEvent" />
    </div>
    <TimeTable
      :channels="channels"
      :events="upcomingEvents"
      :current-time="currentTime"
      :start-time="startTime"
      :hours-to-display="hoursToDisplay"
      :selected-event="selectedEvent"
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
import { fetchData } from '~/services/api';

export default {
  name: 'Homepage',
  components: { EventDescription, LoadingScreen, TimeTable },
  data() {
    return {
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
      hasTouchedTimeTable: false,
      selectedEvent: null,
    };
  },
  computed: {
    channels() {
      return uniq(this.events.map((item) => item.category))
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
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
    this.events = await fetchData();
    this.isLoading = false;
    await this.$nextTick();
    this.pickRandomEvent();
    this.randomizerInterval = setInterval(this.pickRandomEvent, 15000);
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
      if (!this.upcomingEvents.length) return;
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
.video,
.description,
.time-table {
  height: 50vh;
}
</style>

<template>
  <div class="flex flex-wrap flex-row-reverse">
    <template v-if="$mq !== 'sm'">
      <div class="video bg-black w-1/2 relative">
        <EventPreview v-if="selectedEvent" :event="selectedEvent" />
      </div>
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
    <div class="fixed bottom-0 flex items-center right-0 mb-4 mr-8 z-50">
      <FloatingButton
        :title="autoScroll ? 'Start auto-scrolling' : 'Stop auto-scrolling'"
        tag="button"
        type="button"
        class="mr-2"
        @click="
          autoScroll = !autoScroll;
          hasTouchedAutoScroll = true;
        "
      >
        <span class="sr-only">{{
          autoScroll ? 'Start auto-scrolling' : 'Stop auto-scrolling'
        }}</span>
        <div v-if="!autoScroll" class="play" />
        <div v-if="autoScroll" class="pause" />
      </FloatingButton>
      <FloatingButton
        title="Submit a stream"
        class="mr-2"
        tag="a"
        href="https://forms.gle/AJTqLsaVjimqLPsv6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="sr-only">Submit a stream</span>
        <span class="relative -mt-1 text-4xl">+</span>
      </FloatingButton>
      <FloatingButton
        title="Donate"
        tag="button"
        type="button"
        @click="handleDonateClick"
      >
        <span class="sr-only">Donate</span>
        <span class="relative text-2xl">$</span>
      </FloatingButton>
    </div>
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
import EventPreview from '~/components/EventPreview';
import FloatingButton from '~/components/FloatingButton';
import LoadingScreen from '~/components/LoadingScreen';
import TimeTable from '~/components/TimeTable';
import getNearestStartTime from '~/util/getNearestStartTime';
import wait from '~/util/wait';
import { fetchData } from '~/services/api';

const DEFAULT_EVENT = {
  title: "Boston's still running",
  description: `Our streets may be empty, but we're still running at full force.
The Boston Globe is partnering with local restaurants to serve those working on the front line in the fight against COVID-19.
For each $10 contributed, we are enabling local restaurants to provide fresh-made meals to one of the many Boston-area hospitals.`,
  link: 'https://www.youtube.com/watch?time_continue=2&v=eyBP2SlwW8U',
  donationLink: 'https://manage.bostonglobe.com/order/da2/contribute.html',
};

export default {
  name: 'Homepage',
  components: {
    EventDescription,
    EventPreview,
    FloatingButton,
    LoadingScreen,
    TimeTable,
  },
  data() {
    return {
      autoScroll: false,
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
      hasTouchedAutoScroll: false,
      hasTouchedTimeTable: false,
      selectedEvent: DEFAULT_EVENT,
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
        } else if (!this.hasTouchedAutoScroll) {
          this.autoScroll = true;
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
      this.autoScroll = true;
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.randomizerInterval);
  },
  methods: {
    handleDonateClick() {
      if (this.$mq === 'sm') {
        window.open(DEFAULT_EVENT.donationLink);
      } else {
        this.handleEventClick(DEFAULT_EVENT);
        this.autoScroll = true;
      }
    },
    handleEventClick(event) {
      this.selectedEvent = event;
      this.hasTouchedTimeTable = true;
      this.autoScroll = false;
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

.play {
  @apply relative -mr-1;
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  border-width: 0.5em 0 0.5em 0.7em;
}

.pause {
  @apply flex;

  &::before,
  &::after {
    @apply bg-white block;
    content: '';
    height: 1em;
    width: 0.25em;
  }

  &::before {
    @apply mr-1;
  }
}
</style>

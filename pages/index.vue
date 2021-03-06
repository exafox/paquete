<template>
  <div class="flex flex-col h-screen">
    <!-- Brand header, and event preview + description. -->
    <div class="header flex flex-col flex-shrink-0 sticky md:static top-0 z-10">
      <BrandHeader v-if="isDesktop" class="flex-shrink-0" />
      <div class="flex flex-grow flex-row-reverse overflow-hidden">
        <div class="video bg-black relative w-full md:w-1/2">
          <EventPreview
            v-if="!isLoading && selectedEvent"
            :event="selectedEvent"
            @iframe-clicked="handleIframeClicked"
          />
        </div>
        <EventDescription
          v-if="isDesktop"
          :event="selectedEvent"
          class="description  w-1/2"
        />
      </div>
    </div>

    <!-- Event listings -->
    <TimeTable
      v-if="isDesktop"
      :auto-scroll="autoScroll"
      :infinite-scroll="infiniteScroll"
      :channels="channels"
      :events="upcomingEvents"
      :current-time="currentTime"
      :start-time="startTime"
      :hours-to-display="hoursToDisplay"
      :selected-event="selectedEvent"
      class="flex-grow w-full"
      @eventClick="handleEventClick"
    />
    <EventList
      v-else
      :events="eventsHappeningNow"
      :selected-event="selectedEvent"
      @eventClick="handleEventClick"
    />

    <!-- Control buttons -->
    <div class="fixed bottom-0 flex items-center right-0 mb-4 mr-8 z-30">
      <FloatingButton
        v-if="infiniteScroll"
        :title="autoScroll ? 'Start auto-scrolling' : 'Stop auto-scrolling'"
        tag="button"
        type="button"
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
        class="ml-2"
        title="Submit a stream"
        tag="a"
        href="https://forms.gle/AJTqLsaVjimqLPsv6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="sr-only">Submit a stream</span>
        <span class="relative font-medium text-4xl">+</span>
      </FloatingButton>
      <FloatingButton
        class="ml-2 text-2xl"
        title="Share"
        type="button"
        @click="handleShare"
      >
        <span class="sr-only">Share</span>
        <ShareIcon class="share-icon" />
      </FloatingButton>
    </div>

    <transition name="slow-fade">
      <LoadingScreen v-if="isLoading" />
    </transition>
    <ShareModal v-if="isShareModalOpen" @close="isShareModalOpen = false" />
  </div>
</template>

<script>
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isWithinInterval from 'date-fns/isWithinInterval';
import uniq from 'lodash/uniq';
import BrandHeader from '~/components/BrandHeader';
import EventDescription from '~/components/EventDescription';
import EventPreview from '~/components/EventPreview';
import FloatingButton from '~/components/FloatingButton';
import LoadingScreen from '~/components/LoadingScreen';
import ShareIcon from '~/assets/icons/share.svg';
import TrackingEvents from '~/constants/TrackingEvents';
import getNearestStartTime from '~/util/getNearestStartTime';
import truncateDescription from '~/util/truncateDescription';
import { fetchData } from '~/services/api';
import { fetchLatestPlaylistVideos } from '~/services/youtubeApi';

const EventList = () => import('~/components/EventList');
const ShareModal = () => import('~/components/ShareModal');
const TimeTable = () => import('~/components/TimeTable');

const DEFAULT_EVENT = {
  id: '1',
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
    BrandHeader,
    EventDescription,
    EventList,
    EventPreview,
    FloatingButton,
    LoadingScreen,
    ShareIcon,
    ShareModal,
    TimeTable,
  },
  data() {
    return {
      autoScroll: false,
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
      isShareModalOpen: false,
      hasTouchedAutoScroll: false,
      hasTouchedTimeTable: false,
      selectedEvent: DEFAULT_EVENT,
    };
  },
  computed: {
    allChannels() {
      return uniq(this.events.map((item) => item.channel)).filter(
        (item) => item
      );
    },
    channels() {
      // If most channels are active, show only active channels. Otherwise, show
      // all channels so that the layout isn't empty
      const activeChannels = uniq(
        this.upcomingEvents.map((item) => item.channel)
      ).filter((item) => item);
      const channelsToShow = Math.round(
        activeChannels.length / this.allChannels.length
      )
        ? activeChannels
        : this.allChannels;
      return channelsToShow.sort();
    },
    eventsHappeningNow() {
      const now = new Date();
      return this.events.filter((event) =>
        isWithinInterval(now, { start: event.startTime, end: event.endTime })
      );
    },
    isDesktop() {
      return this.$mq !== 'sm';
    },
    infiniteScroll() {
      return this.isDesktop && !navigator.appVersion.includes('Edge');
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
    isLoading(newVal) {
      if (newVal) return;
      if (this.$route.query.id) {
        const newEvent = this.setActiveEvent(this.$route.query.id);
        if (newEvent) {
          this.hasTouchedTimeTable = true;
        }
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
    '$route.query.id': {
      handler(newVal) {
        if (!newVal) return;
        this.setActiveEvent(newVal);
      },
    },
  },
  async created() {
    this.events = await fetchData();
    await this.setInitialEvent();
    await this.$nextTick();
    this.isLoading = false;
  },
  mounted() {
    this.autoScroll = this.infiniteScroll;
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
    this.randomizerInterval = setInterval(this.pickRandomEvent, 15000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.randomizerInterval);
  },
  methods: {
    buildEventFromYoutubeVideoData({ videoId, title, description }) {
      const event = {
        title,
        description: truncateDescription(description),
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
      return event;
    },
    handleEventClick(event) {
      this.$router.push({ path: this.$route.path, query: { id: event.id } });
      this.hasTouchedTimeTable = true;
      this.autoScroll = false;
    },
    handleIframeClicked() {
      this.hasTouchedTimeTable = true;
    },
    async handleShare() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: process.env.SHARE_TITLE,
            url: process.env.SHARE_URL,
          });
        } finally {
          const trackingPayload = {
            event: TrackingEvents.CLICKED_NATIVE_SHARE_LINK,
            link: process.env.SHARE_URL,
          };
          this.$gtm.push(trackingPayload);
        }
      } else {
        this.isShareModalOpen = true;
      }
    },
    pickRandomEvent() {
      if (!this.upcomingEvents.length || this.$mq === 'sm') return;

      const getNewEvent = () => {
        // We want to prioritize picking an event that is happening now if
        // possible.
        const eventPool =
          this.eventsHappeningNow.length > 1
            ? this.eventsHappeningNow
            : this.upcomingEvents;
        return eventPool[Math.floor(Math.random() * eventPool.length)];
      };
      let newEvent;
      do {
        newEvent = getNewEvent();
      } while (newEvent === this.selectedEvent);
      this.$router.replace({
        path: this.$route.path,
        query: { id: newEvent.id },
      });
    },
    setActiveEvent(id) {
      const newEvent = this.upcomingEvents.find((event) => event.id === id);
      if (newEvent) {
        this.selectedEvent = newEvent;
      } else {
        this.$router.replace({ path: this.$route.path });
      }
      return newEvent;
    },
    async setInitialEvent() {
      try {
        const data = await fetchLatestPlaylistVideos();
        const latestUpload = data[0];
        if (!latestUpload) {
          this.selectedEvent = DEFAULT_EVENT;
          return;
        }

        const { videoId } = latestUpload.contentDetails;
        const { title, description } = latestUpload.snippet;
        this.selectedEvent = this.buildEventFromYoutubeVideoData({
          videoId,
          title,
          description,
        });
      } catch (err) {
        this.selectedEvent = DEFAULT_EVENT;
      }
    },
  },
  head() {
    return {
      link: [{ rel: 'canonical', href: `${process.env.BASE_URL}/` }],
    };
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
.video {
  padding-bottom: 56.25%;

  @media screen and (min-width: 768px) {
    padding-bottom: 0;
  }
}

.time-table {
  flex-grow: 1;
}

@media screen and (min-width: 768px) {
  .header {
    height: 60%;
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

.share-icon {
  height: 1em;
  width: 1em;
}
</style>

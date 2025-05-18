<template>
  <div 
    class="book"
    :style="{ 
      width: `${width}px`,
      height: `${height}px`,
      perspective: `${perspective}px`
    }"
  >
    <div 
      class="book-page page-left"
      :style="{ backgroundColor: color }"
    ></div>
    <div 
      class="book-page page-right"
      :style="{ backgroundColor: color }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BookLoader',
  props: {
    color: {
      type: String,
      default: '#3498db'
    },
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 100
    },
    duration: {
      type: Number,
      default: 2
    },
    perspective: {
      type: Number,
      default: 1000
    }
  }
}
</script>

<style scoped>
.book {
  position: relative;
}

.book-page {
  position: absolute;
  width: 50%;
  height: 100%;
  transform-origin: right;
  animation: flip v-bind(duration + 's') infinite;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.page-left {
  left: 0;
  border-radius: 5px 0 0 5px;
  animation-delay: v-bind(duration/2 + 's');
}

.page-right {
  right: 0;
  border-radius: 0 5px 5px 0;
  transform-origin: left;
}

@keyframes flip {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-180deg);
  }
}
</style>
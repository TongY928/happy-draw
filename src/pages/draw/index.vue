<template>
  <div class="home">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { $ref, $computed } from 'vue/macros'
interface Point {
  x: number
  y: number
}
interface State {
  mouseButtonDown: boolean
  lastPt: Point | null
}

interface PathInfo {
  beginPt: Point
  endPt: Point
  strokeStyle?: string
  lineWidth?: number
}
let drawState = reactive<State>({
  mouseButtonDown: false,
  lastPt: null
})

// 实例和上下文
const canvasRef = $ref<HTMLCanvasElement | null>(null)
const ctx = $computed(() => canvasRef!.getContext('2d')!)

// 按下
function handleMouseDown(event: any) {
  drawState.mouseButtonDown = true
  drawState.lastPt = {
    x: event.offsetX,
    y: event.offsetY
  }
}

// 抬起
function handleMouseUp(event: any) {
  drawState.mouseButtonDown = false
  drawState.lastPt = null
}

// 鼠标移动
function handleMouseMove(event: any) {
  if (drawState.mouseButtonDown) {
    const curentDrawInfo: PathInfo = {
      beginPt: {
        x: drawState.lastPt!.x,
        y: drawState.lastPt!.y
      },
      endPt: {
        x: event.offsetX,
        y: event.offsetY
      }
    }
    drawState.lastPt = {
      x: event.offsetX,
      y: event.offsetY
    }
    draw(curentDrawInfo, ctx)
  }
}

function draw(pathInfo: PathInfo, ctx: CanvasRenderingContext2D) {
  const { endPt, beginPt, strokeStyle, lineWidth } = pathInfo
  ctx.beginPath() // 开始绘图
  ctx.lineCap = 'round'
  ctx.moveTo(beginPt.x, beginPt.y)
  ctx.lineTo(endPt.x, endPt.y)
  ctx.strokeStyle = strokeStyle || 'blue'
  ctx.lineWidth = lineWidth || 3
  ctx.stroke() // 绘制路径
  ctx.closePath() // 结束绘制
}
// 清空绘画板
function clearCtx(el: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const rect = el.getBoundingClientRect()
  ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
}
function bindEvent(el: Element) {
  if (window.PointerEvent) {
    el.addEventListener('pointerdown', handleMouseDown, false)
    el.addEventListener('pointermove', handleMouseMove, false)
    el.addEventListener('pointerup', handleMouseUp, false)
  } else {
    el.addEventListener('mousedown', handleMouseDown, false)
    el.addEventListener('mousemove', handleMouseMove, false)
    el.addEventListener('mouseup', handleMouseUp, false)
  }
}
function formatDrawConfig(el: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1
  el.width = 500 * dpr
  el.height = 500 * dpr
  el.style.width = 500 + 'px'
  el.style.height = 500 + 'px'
  ctx.scale(dpr, dpr)
}
function init() {
  if (!canvasRef) return
  formatDrawConfig(canvasRef, ctx)
  bindEvent(canvasRef)
}
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  .canvas {
    border: 1px solid;
  }
}
</style>

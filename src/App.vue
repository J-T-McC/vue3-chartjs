<template>
  <header>
    <h1>vue3-chartjs playground</h1>
    <p>
      Edit any prop below and the chart follows — the component watches its props. The buttons call the
      exposed methods directly. Everything here is the published component —
      <a href="https://github.com/J-T-McC/vue3-chartjs">source on GitHub</a>.
    </p>
  </header>

  <main>
    <section class="controls">
      <fieldset>
        <legend>Preset</legend>
        <div class="row wrap">
          <button
            v-for="(_, name) in presets"
            :key="name"
            type="button"
            :class="{ active: activePreset === name }"
            @click="loadPreset(name)"
          >
            {{ name }}
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>type</legend>
        <div class="row">
          <select v-model="draft.type">
            <option v-for="name in Object.keys(presets)" :key="name" :value="name">{{ name }}</option>
          </select>
          <small v-if="draft.type !== applied.type">
            applied on update() — the component rebuilds itself
          </small>
        </div>
      </fieldset>

      <fieldset>
        <legend>height / width</legend>
        <div class="row">
          <label>height <input v-model.number="draft.height" type="number" min="0" placeholder="auto" /></label>
          <label>width <input v-model.number="draft.width" type="number" min="0" placeholder="auto" /></label>
        </div>
        <small v-if="sizeIgnored" class="warn">
          Ignored while <code>options.responsive</code> is not <code>false</code> — chart.js sizes the canvas
          from its container.
        </small>
        <small v-else>
          Only has an effect with <code>responsive: false</code>. The component remounts the canvas for you.
        </small>
      </fieldset>

      <fieldset>
        <legend>data</legend>
        <textarea v-model="draft.data" spellcheck="false" rows="14"></textarea>
      </fieldset>

      <fieldset>
        <legend>options</legend>
        <textarea v-model="draft.options" spellcheck="false" rows="8"></textarea>
      </fieldset>

      <fieldset>
        <legend>update mode</legend>
        <div class="row">
          <select v-model="mode">
            <option v-for="m in updateModes" :key="m" :value="m">{{ m }}</option>
          </select>
          <small>Passed to <code>update(mode)</code>.</small>
        </div>
      </fieldset>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="row wrap actions">
        <button type="button" class="primary" @click="applyUpdate">update()</button>
        <button type="button" @click="applyDestroyRender">destroy() + render()</button>
        <button type="button" @click="remount">re-mount</button>
        <button type="button" @click="resize">resize()</button>
        <button type="button" @click="exportPng">export PNG</button>
        <button type="button" class="ghost" @click="loadPreset(activePreset)">reset</button>
      </div>
    </section>

    <section class="preview">
      <div class="chart-frame" :style="frameStyle">
        <vue3-chart-js
          v-if="alive"
          ref="chartRef"
          :key="instanceKey"
          :type="applied.type"
          :data="applied.data"
          :options="applied.options"
          :height="applied.height"
          :width="applied.width"
          @before-render="log('beforeRender')"
          @after-render="log('afterRender')"
          @after-update="log('afterUpdate')"
          @before-destroy="log('beforeDestroy')"
        />
        <p v-else class="destroyed">chart destroyed — press <code>destroy() + render()</code></p>
      </div>

      <details open class="copy-panel">
        <summary>copy this chart</summary>
        <div class="row wrap">
          <button type="button" :class="{ active: snippet === 'config' }" @click="snippet = 'config'">
            config object
          </button>
          <button type="button" :class="{ active: snippet === 'component' }" @click="snippet = 'component'">
            Vue component
          </button>
          <button type="button" class="primary" @click="copySnippet">{{ copyLabel }}</button>
        </div>
        <textarea ref="snippetRef" class="snippet" readonly rows="16" :value="snippetText"></textarea>
      </details>

      <details open>
        <summary>emitted events <span class="count">{{ events.length }}</span></summary>
        <ol class="events">
          <li v-for="(e, i) in events" :key="i"><code>{{ e }}</code></li>
        </ol>
      </details>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, reactive, ref, shallowRef, watch } from 'vue'
import { presets } from './presets'

const updateModes = ['default', 'none', 'reset', 'resize', 'show', 'hide', 'active']

const chartRef = ref(null)
const alive = ref(true)
const instanceKey = ref(0)
const activePreset = ref('doughnut')
const mode = ref('default')
const error = ref('')
const events = ref([])

const draft = reactive({ type: '', height: null, width: null, data: '', options: '' })
// shallowRef rather than reactive: the whole config is swapped at once, and
// deep-proxying large datasets buys nothing here.
const applied = shallowRef({ type: '', height: undefined, width: undefined, data: {}, options: {} })

const sizeIgnored = computed(() => {
  if (!draft.height && !draft.width) return false
  try {
    return JSON.parse(draft.options).responsive !== false
  } catch {
    return false
  }
})

const frameStyle = computed(() =>
  applied.value.options && applied.value.options.responsive === false
    ? { display: 'inline-block', height: 'auto' }
    : {}
)

const log = (name) => {
  events.value.unshift(`${new Date().toLocaleTimeString()}  ${name}`)
  if (events.value.length > 40) events.value.pop()
}

/** Parses the two JSON fields, returning null and setting `error` if either is invalid. */
const readDraft = () => {
  try {
    return { data: JSON.parse(draft.data), options: JSON.parse(draft.options) }
  } catch (e) {
    error.value = `Invalid JSON — ${e.message}`
    return null
  }
}

const commit = (parsed) => {
  error.value = ''
  applied.value = {
    type: draft.type,
    data: parsed.data,
    options: parsed.options,
    height: draft.height || undefined,
    width: draft.width || undefined,
  }
}

const loadPreset = (name) => {
  const preset = presets[name]
  activePreset.value = name
  draft.type = preset.type
  draft.height = null
  draft.width = null
  draft.data = JSON.stringify(preset.data, null, 2)
  draft.options = JSON.stringify(preset.options, null, 2)
  commit({ data: preset.data, options: preset.options })
  remount()
}

/** Applies the editors to the chart. Returns false when the JSON is invalid. */
const applyDraft = () => {
  const parsed = readDraft()
  if (!parsed) return false
  commit(parsed)
  return true
}

// the component watches its props, so committing a valid draft is enough to
// move the chart; typing is debounced so half-written JSON is not applied
let applyTimer
watch(draft, () => {
  clearTimeout(applyTimer)
  applyTimer = setTimeout(() => applyDraft(), 400)
}, { deep: true })

const applyUpdate = async () => {
  if (!applyDraft()) return
  await nextTick()

  chartRef.value?.update(mode.value)
}

/** The two library calls, run explicitly rather than through the watcher. */
const applyDestroyRender = async () => {
  if (!applyDraft()) return
  await nextTick()
  chartRef.value?.destroy()
  chartRef.value?.render()
}

/** Mounts a fresh canvas, which is the only way height and width take effect. */
const remount = async () => {
  if (!applyDraft()) return
  chartRef.value?.destroy()
  alive.value = false
  instanceKey.value += 1
  await nextTick()
  alive.value = true
}


const snippet = ref('config')
const snippetRef = ref(null)
const copied = ref(false)
const copyLabel = computed(() => (copied.value ? 'copied' : 'copy'))

/** JSON reshaped to read like the JS object you would paste: bare keys and
 *  single-quoted strings, leaving anything containing a quote or escape alone. */
const toJs = (value, indent = 0) =>
  JSON.stringify(value, null, 2)
    .replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, '$1:')
    .replace(/"([^"\\']*)"/g, "'$1'")
    .split('\n')
    .join('\n' + ' '.repeat(indent))

const chartLiteral = computed(() => {
  const { type, data, options, height, width } = applied.value
  const parts = [`  type: '${type}',`]
  if (height) parts.push(`  height: ${height},`)
  if (width) parts.push(`  width: ${width},`)
  parts.push(`  data: ${toJs(data, 2)},`)
  parts.push(`  options: ${toJs(options, 2)}`)
  return `{\n${parts.join('\n')}\n}`
})

const snippetText = computed(() =>
  snippet.value === 'config'
    ? `const chart = ${chartLiteral.value}`
    : `<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js v-bind="chart" />
  </div>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const chart = ${chartLiteral.value}
<\/script>`
)

const copySnippet = async () => {
  try {
    await navigator.clipboard.writeText(snippetText.value)
  } catch {
    // clipboard is unavailable outside a secure context; select it instead
    snippetRef.value?.select()
    document.execCommand?.('copy')
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}

const resize = () => chartRef.value?.resize()

const exportPng = () => {
  const chart = chartRef.value?.chartJSState.chart
  if (!chart) return
  const a = document.createElement('a')
  a.href = chart.toBase64Image('image/png', 1)
  a.download = `${applied.value.type}-chart.png`
  a.click()
}

loadPreset('doughnut')
</script>

<style>
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --fg: #1b1f23;
  --muted: #5b6470;
  --line: #d8dee4;
  --accent: #41b883;
  --danger: #dd1b16;
  --panel: #f6f8fa;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --fg: #e6edf3;
    --muted: #9198a1;
    --line: #30363d;
    --panel: #161b22;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 1.5rem;
  background: var(--bg);
  color: var(--fg);
  font: 15px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

header { max-width: 1200px; margin: 0 auto 1.5rem; }
h1 { margin: 0 0 .25rem; font-size: 1.5rem; }
header p { margin: 0; color: var(--muted); }
a { color: var(--accent); }

main {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(320px, 420px) 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 860px) {
  main { grid-template-columns: 1fr; }
}

fieldset {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: .75rem;
  margin: 0 0 .75rem;
}

legend { padding: 0 .35rem; color: var(--muted); font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; }

.row { display: flex; gap: .5rem; align-items: center; }
.row.wrap { flex-wrap: wrap; }
label { display: flex; gap: .35rem; align-items: center; color: var(--muted); }

input, select, textarea {
  font: inherit;
  color: var(--fg);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: .35rem .5rem;
}

input[type='number'] { width: 7rem; }
textarea { width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; resize: vertical; }

button {
  font: inherit;
  cursor: pointer;
  padding: .4rem .7rem;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--panel);
  color: var(--fg);
}

button:hover { border-color: var(--accent); }
button.active, button.primary { background: var(--accent); border-color: var(--accent); color: #06231a; font-weight: 600; }
button.ghost { background: transparent; color: var(--muted); }
.actions {
  position: sticky;
  bottom: 0;
  margin-top: .25rem;
  padding: .6rem 0;
  background: var(--bg);
  border-top: 1px solid var(--line);
}

small { color: var(--muted); font-size: .8rem; }
small.warn { color: var(--danger); }
code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .85em; }

.error {
  margin: .5rem 0 0;
  padding: .5rem .6rem;
  border: 1px solid var(--danger);
  border-radius: 5px;
  color: var(--danger);
  font-size: .85rem;
}

.chart-frame {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 1rem;
  height: 60vh;
  min-height: 320px;
  background: var(--panel);
}

.destroyed { color: var(--muted); text-align: center; margin-top: 4rem; }

details { margin-top: 1rem; border: 1px solid var(--line); border-radius: 6px; padding: .5rem .75rem; }
summary { cursor: pointer; color: var(--muted); }
.count { color: var(--fg); font-weight: 600; }
.snippet { margin-top: .5rem; background: var(--panel); }
.copy-panel summary { color: var(--fg); font-weight: 600; }

.events { max-height: 200px; overflow: auto; margin: .5rem 0 0; padding-left: 1.5rem; font-size: .85rem; }
</style>

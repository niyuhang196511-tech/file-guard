// 由 scripts/compile-view.cjs 从中文模板生成。
window.FG_VIEW=(function(){const _Vue = Vue
const { createVNode: _createVNode, createElementVNode: _createElementVNode, createCommentVNode: _createCommentVNode, createTextVNode: _createTextVNode } = _Vue

const _hoisted_1 = { class: "brand" }
const _hoisted_2 = { class: "brand-mark" }
const _hoisted_3 = ["aria-label", "aria-current", "onClick"]
const _hoisted_4 = ["aria-label", "aria-current", "onClick"]
const _hoisted_5 = { class: "aside-bottom" }
const _hoisted_6 = { class: "local-icon" }
const _hoisted_7 = { class: "top" }
const _hoisted_8 = { class: "crumb" }
const _hoisted_9 = { class: "tools" }
const _hoisted_10 = ["onClick"]
const _hoisted_11 = ["onClick"]
const _hoisted_12 = {
  key: 0,
  class: "reddot"
}
const _hoisted_13 = ["title", "onClick"]
const _hoisted_14 = {
  key: 0,
  class: "notice"
}
const _hoisted_15 = { class: "card-head" }
const _hoisted_16 = ["onClick"]
const _hoisted_17 = { key: 0 }
const _hoisted_18 = ["onClick"]
const _hoisted_19 = {
  key: 1,
  class: "mini-notes"
}
const _hoisted_20 = ["onClick"]
const _hoisted_21 = { class: "workspace" }
const _hoisted_22 = {
  key: 0,
  class: "card engine-status",
  "aria-label": "监控引擎连接状态"
}
const _hoisted_23 = { role: "alert" }
const _hoisted_24 = { key: 0 }
const _hoisted_25 = ["onClick"]
const _hoisted_26 = { class: "hero" }
const _hoisted_27 = { class: "hero-state" }
const _hoisted_28 = ["disabled", "onClick"]
const _hoisted_29 = { class: "stats" }
const _hoisted_30 = ["onClick"]
const _hoisted_31 = { class: "stat-title" }
const _hoisted_32 = { class: "chart-row" }
const _hoisted_33 = { class: "card trend" }
const _hoisted_34 = { class: "card-head" }
const _hoisted_35 = ["onUpdate:modelValue", "onChange"]
const _hoisted_36 = ["value"]
const _hoisted_37 = {
  key: 0,
  class: "chart"
}
const _hoisted_38 = {
  viewBox: "0 0 640 146",
  role: "img",
  "aria-label": "每日内容修改、新增和其他变更趋势"
}
const _hoisted_39 = ["y1", "y2"]
const _hoisted_40 = ["y"]
const _hoisted_41 = ["d"]
const _hoisted_42 = ["points", "stroke", "stroke-width"]
const _hoisted_43 = ["x"]
const _hoisted_44 = ["x"]
const _hoisted_45 = { class: "card" }
const _hoisted_46 = { class: "distribution" }
const _hoisted_47 = { class: "dist-list" }
const _hoisted_48 = {
  key: 0,
  class: "quiet"
}
const _hoisted_49 = { class: "bottom-row" }
const _hoisted_50 = { class: "card" }
const _hoisted_51 = { class: "card-head" }
const _hoisted_52 = ["onClick"]
const _hoisted_53 = ["onClick", "onKeydown"]
const _hoisted_54 = { class: "activity-name" }
const _hoisted_55 = {
  key: 0,
  class: "empty"
}
const _hoisted_56 = { class: "card" }
const _hoisted_57 = { class: "card-head" }
const _hoisted_58 = ["onClick"]
const _hoisted_59 = { class: "root-mini" }
const _hoisted_60 = { class: "folder-icon" }
const _hoisted_61 = {
  key: 0,
  class: "empty"
}
const _hoisted_62 = ["onClick"]
const _hoisted_63 = { class: "page-title" }
const _hoisted_64 = { class: "actions" }
const _hoisted_65 = ["disabled", "onClick"]
const _hoisted_66 = ["onClick"]
const _hoisted_67 = ["onClick"]
const _hoisted_68 = ["onClick"]
const _hoisted_69 = ["onClick"]
const _hoisted_70 = ["onClick"]
const _hoisted_71 = ["onClick"]
const _hoisted_72 = ["onClick"]
const _hoisted_73 = ["disabled", "onClick"]
const _hoisted_74 = ["onClick"]
const _hoisted_75 = ["onClick"]
const _hoisted_76 = ["onClick"]
const _hoisted_77 = ["onClick"]
const _hoisted_78 = ["onClick"]
const _hoisted_79 = ["onClick"]
const _hoisted_80 = ["onClick"]
const _hoisted_81 = ["onClick"]
const _hoisted_82 = ["onClick"]
const _hoisted_83 = ["onClick"]
const _hoisted_84 = ["onClick"]
const _hoisted_85 = ["disabled", "onClick"]
const _hoisted_86 = {
  key: 0,
  class: "card empty"
}
const _hoisted_87 = ["onClick"]
const _hoisted_88 = {
  key: 1,
  class: "card root-toolbar"
}
const _hoisted_89 = { class: "search-input" }
const _hoisted_90 = ["onUpdate:modelValue"]
const _hoisted_91 = ["onUpdate:modelValue"]
const _hoisted_92 = { class: "root-tabs" }
const _hoisted_93 = ["aria-pressed", "onClick"]
const _hoisted_94 = ["onClick"]
const _hoisted_95 = { class: "folder-icon" }
const _hoisted_96 = { class: "grow" }
const _hoisted_97 = { class: "path" }
const _hoisted_98 = {
  key: 0,
  class: "wait-list"
}
const _hoisted_99 = { key: 0 }
const _hoisted_100 = {
  key: 1,
  class: "skip-details"
}
const _hoisted_101 = { key: 0 }
const _hoisted_102 = { key: 1 }
const _hoisted_103 = {
  key: 2,
  class: "error"
}
const _hoisted_104 = { class: "right" }
const _hoisted_105 = {
  key: 0,
  class: "queue-state"
}
const _hoisted_106 = { class: "actions" }
const _hoisted_107 = ["onClick"]
const _hoisted_108 = ["onClick"]
const _hoisted_109 = ["onClick"]
const _hoisted_110 = ["onClick"]
const _hoisted_111 = ["onClick"]
const _hoisted_112 = ["onClick"]
const _hoisted_113 = ["onClick"]
const _hoisted_114 = ["onClick"]
const _hoisted_115 = ["onClick"]
const _hoisted_116 = ["disabled", "onClick"]
const _hoisted_117 = ["onClick"]
const _hoisted_118 = ["onClick"]
const _hoisted_119 = ["onClick"]
const _hoisted_120 = {
  key: 2,
  class: "card empty"
}
const _hoisted_121 = ["onClick"]
const _hoisted_122 = {
  key: 1,
  class: "card listcard"
}
const _hoisted_123 = {
  key: 0,
  class: "tag blue"
}
const _hoisted_124 = { class: "filters" }
const _hoisted_125 = { class: "search-input" }
const _hoisted_126 = ["onUpdate:modelValue", "placeholder", "onInput"]
const _hoisted_127 = ["onUpdate:modelValue", "onChange"]
const _hoisted_128 = ["value"]
const _hoisted_129 = ["onUpdate:modelValue", "onInput"]
const _hoisted_130 = ["onUpdate:modelValue", "onChange"]
const _hoisted_131 = ["value"]
const _hoisted_132 = ["onUpdate:modelValue", "onChange"]
const _hoisted_133 = ["onUpdate:modelValue", "onChange"]
const _hoisted_134 = ["value"]
const _hoisted_135 = ["onClick"]
const _hoisted_136 = { class: "advanced" }
const _hoisted_137 = { class: "filter-grid" }
const _hoisted_138 = ["onUpdate:modelValue", "onChange"]
const _hoisted_139 = ["onUpdate:modelValue", "onChange"]
const _hoisted_140 = ["onUpdate:modelValue", "onInput"]
const _hoisted_141 = ["onUpdate:modelValue", "onChange"]
const _hoisted_142 = ["onUpdate:modelValue", "onInput"]
const _hoisted_143 = ["onUpdate:modelValue", "onInput"]
const _hoisted_144 = ["onUpdate:modelValue", "onChange"]
const _hoisted_145 = ["onClick"]
const _hoisted_146 = ["onUpdate:modelValue", "onInput"]
const _hoisted_147 = ["onUpdate:modelValue", "onInput"]
const _hoisted_148 = ["onUpdate:modelValue", "onChange"]
const _hoisted_149 = ["onUpdate:modelValue", "onChange"]
const _hoisted_150 = ["onUpdate:modelValue", "onChange"]
const _hoisted_151 = {
  key: 1,
  class: "range-tools"
}
const _hoisted_152 = { class: "date-field" }
const _hoisted_153 = ["onUpdate:modelValue", "max", "onChange"]
const _hoisted_154 = { class: "date-field" }
const _hoisted_155 = ["onUpdate:modelValue", "min", "onChange"]
const _hoisted_156 = ["onClick"]
const _hoisted_157 = ["onClick"]
const _hoisted_158 = { class: "activity-toggle" }
const _hoisted_159 = ["onUpdate:modelValue", "onChange"]
const _hoisted_160 = {
  key: 2,
  class: "error",
  role: "alert"
}
const _hoisted_161 = { class: "scroll" }
const _hoisted_162 = { key: 0 }
const _hoisted_163 = { class: "filecell" }
const _hoisted_164 = { class: "file-summary" }
const _hoisted_165 = { key: 0 }
const _hoisted_166 = { class: "file-folder" }
const _hoisted_167 = ["aria-pressed", "onClick"]
const _hoisted_168 = ["onClick"]
const _hoisted_169 = ["onClick"]
const _hoisted_170 = { key: 1 }
const _hoisted_171 = { key: 0 }
const _hoisted_172 = { key: 0 }
const _hoisted_173 = ["disabled", "onClick"]
const _hoisted_174 = ["onClick"]
const _hoisted_175 = ["onClick"]
const _hoisted_176 = { key: 2 }
const _hoisted_177 = { class: "wrap" }
const _hoisted_178 = {
  key: 3,
  class: "empty"
}
const _hoisted_179 = { class: "pager" }
const _hoisted_180 = ["onUpdate:modelValue", "onChange"]
const _hoisted_181 = ["value"]
const _hoisted_182 = ["disabled", "onClick"]
const _hoisted_183 = ["disabled", "onClick"]
const _hoisted_184 = { class: "card picker" }
const _hoisted_185 = { class: "folder-icon" }
const _hoisted_186 = { class: "grow" }
const _hoisted_187 = ["onClick"]
const _hoisted_188 = { class: "split-head" }
const _hoisted_189 = ["onClick"]
const _hoisted_190 = {
  key: 0,
  class: "card timeline"
}
const _hoisted_191 = { class: "timeline-filters" }
const _hoisted_192 = ["onUpdate:modelValue", "onChange"]
const _hoisted_193 = ["onUpdate:modelValue", "onInput"]
const _hoisted_194 = ["onUpdate:modelValue", "onChange"]
const _hoisted_195 = ["onUpdate:modelValue", "onChange"]
const _hoisted_196 = ["onClick"]
const _hoisted_197 = {
  key: 0,
  class: "empty"
}
const _hoisted_198 = { class: "grow" }
const _hoisted_199 = { class: "tag neutral" }
const _hoisted_200 = {
  key: 0,
  class: "review-note"
}
const _hoisted_201 = { class: "hash" }
const _hoisted_202 = {
  key: 1,
  class: "error"
}
const _hoisted_203 = { class: "actions" }
const _hoisted_204 = ["onClick"]
const _hoisted_205 = ["onClick"]
const _hoisted_206 = ["disabled", "onClick"]
const _hoisted_207 = ["onClick"]
const _hoisted_208 = ["onClick"]
const _hoisted_209 = ["onClick"]
const _hoisted_210 = ["onClick"]
const _hoisted_211 = ["onClick"]
const _hoisted_212 = ["onClick"]
const _hoisted_213 = ["onClick"]
const _hoisted_214 = {
  key: 1,
  class: "pager"
}
const _hoisted_215 = ["disabled", "onClick"]
const _hoisted_216 = ["disabled", "onClick"]
const _hoisted_217 = {
  key: 1,
  class: "card"
}
const _hoisted_218 = { class: "pair" }
const _hoisted_219 = ["onUpdate:modelValue", "onChange"]
const _hoisted_220 = ["value"]
const _hoisted_221 = ["disabled", "onClick"]
const _hoisted_222 = ["onUpdate:modelValue", "onChange"]
const _hoisted_223 = ["value"]
const _hoisted_224 = {
  key: 0,
  class: "diff-options"
}
const _hoisted_225 = {
  class: "mode-switch",
  "aria-label": "源文件比较方式"
}
const _hoisted_226 = ["aria-pressed", "onClick"]
const _hoisted_227 = ["aria-pressed", "onClick"]
const _hoisted_228 = {
  key: 1,
  class: "diff-options"
}
const _hoisted_229 = {
  class: "mode-switch",
  "aria-label": "比较方式"
}
const _hoisted_230 = ["aria-pressed", "onClick"]
const _hoisted_231 = { key: 0 }
const _hoisted_232 = { key: 1 }
const _hoisted_233 = { key: 2 }
const _hoisted_234 = ["onClick"]
const _hoisted_235 = {
  key: 3,
  class: "view-tabs"
}
const _hoisted_236 = ["aria-pressed", "onClick"]
const _hoisted_237 = ["aria-pressed", "onClick"]
const _hoisted_238 = {
  key: 4,
  class: "sheet-review"
}
const _hoisted_239 = {
  key: 0,
  class: "grid-toolbar"
}
const _hoisted_240 = ["onUpdate:modelValue", "onChange"]
const _hoisted_241 = ["onUpdate:modelValue", "onChange"]
const _hoisted_242 = { key: 0 }
const _hoisted_243 = ["disabled", "onUpdate:modelValue", "onChange"]
const _hoisted_244 = {
  key: 1,
  class: "cell-search111"
}
const _hoisted_245 = { class: "filters" }
const _hoisted_246 = ["onUpdate:modelValue", "onKeyup"]
const _hoisted_247 = ["onUpdate:modelValue"]
const _hoisted_248 = ["onUpdate:modelValue"]
const _hoisted_249 = ["onUpdate:modelValue"]
const _hoisted_250 = ["onUpdate:modelValue"]
const _hoisted_251 = ["onUpdate:modelValue"]
const _hoisted_252 = ["onUpdate:modelValue"]
const _hoisted_253 = ["disabled", "onClick"]
const _hoisted_254 = { key: 0 }
const _hoisted_255 = ["onClick"]
const _hoisted_256 = ["disabled", "onClick"]
const _hoisted_257 = ["disabled", "onClick"]
const _hoisted_258 = {
  key: 2,
  class: "grid-tools19"
}
const _hoisted_259 = ["onUpdate:modelValue"]
const _hoisted_260 = {
  key: 0,
  value: "key"
}
const _hoisted_261 = ["onUpdate:modelValue", "placeholder", "onKeyup"]
const _hoisted_262 = ["disabled", "onClick"]
const _hoisted_263 = {
  key: 3,
  role: "alert",
  class: "error"
}
const _hoisted_264 = {
  key: 4,
  class: "empty"
}
const _hoisted_265 = { class: "scroll sheet-scroll" }
const _hoisted_266 = { class: "sheet-table" }
const _hoisted_267 = ["colspan"]
const _hoisted_268 = ["onClick"]
const _hoisted_269 = { key: 0 }
const _hoisted_270 = { key: 0 }
const _hoisted_271 = { key: 1 }
const _hoisted_272 = { class: "pager" }
const _hoisted_273 = ["disabled", "onClick"]
const _hoisted_274 = ["disabled", "onClick"]
const _hoisted_275 = ["disabled", "onClick"]
const _hoisted_276 = ["disabled", "onClick"]
const _hoisted_277 = ["onClick"]
const _hoisted_278 = { class: "diff-meta" }
const _hoisted_279 = ["aria-pressed", "onClick"]
const _hoisted_280 = ["onClick"]
const _hoisted_281 = { class: "quiet" }
const _hoisted_282 = { class: "filters" }
const _hoisted_283 = ["onUpdate:modelValue", "onChange"]
const _hoisted_284 = ["onUpdate:modelValue", "onChange"]
const _hoisted_285 = { class: "search-input" }
const _hoisted_286 = ["onUpdate:modelValue", "placeholder", "onInput"]
const _hoisted_287 = ["onClick"]
const _hoisted_288 = ["disabled", "onClick"]
const _hoisted_289 = { class: "advanced" }
const _hoisted_290 = { class: "filter-grid" }
const _hoisted_291 = ["onUpdate:modelValue", "onChange"]
const _hoisted_292 = ["onUpdate:modelValue", "onChange"]
const _hoisted_293 = ["onUpdate:modelValue", "onChange"]
const _hoisted_294 = ["onUpdate:modelValue", "onChange"]
const _hoisted_295 = ["onUpdate:modelValue", "onInput"]
const _hoisted_296 = {
  key: 0,
  class: "revision-groups"
}
const _hoisted_297 = { class: "revision-group" }
const _hoisted_298 = { class: "scroll" }
const _hoisted_299 = { class: "compare" }
const _hoisted_300 = { class: "oldval" }
const _hoisted_301 = { class: "newval" }
const _hoisted_302 = {
  key: 1,
  class: "revision-groups"
}
const _hoisted_303 = { class: "revision-group" }
const _hoisted_304 = {
  key: 2,
  class: "scroll"
}
const _hoisted_305 = { class: "compare" }
const _hoisted_306 = { key: 0 }
const _hoisted_307 = {
  key: 1,
  class: "record-key"
}
const _hoisted_308 = { class: "oldval" }
const _hoisted_309 = {
  key: 0,
  class: "value-type"
}
const _hoisted_310 = { class: "newval" }
const _hoisted_311 = {
  key: 0,
  class: "value-type"
}
const _hoisted_312 = {
  key: 3,
  class: "empty"
}
const _hoisted_313 = { class: "pager" }
const _hoisted_314 = ["onUpdate:modelValue", "onChange"]
const _hoisted_315 = ["value"]
const _hoisted_316 = ["disabled", "onClick"]
const _hoisted_317 = ["disabled", "onClick"]
const _hoisted_318 = ["onClick"]
const _hoisted_319 = { class: "hash" }
const _hoisted_320 = {
  key: 1,
  class: "empty"
}
const _hoisted_321 = {
  key: 3,
  class: "card review-board"
}
const _hoisted_322 = { class: "review-statebar" }
const _hoisted_323 = ["aria-pressed", "onClick"]
const _hoisted_324 = { class: "filters" }
const _hoisted_325 = ["onUpdate:modelValue", "onInput", "onKeyup"]
const _hoisted_326 = ["onClick"]
const _hoisted_327 = ["onClick"]
const _hoisted_328 = ["disabled", "onClick"]
const _hoisted_329 = { class: "advanced" }
const _hoisted_330 = { class: "filter-grid" }
const _hoisted_331 = ["onUpdate:modelValue", "onChange"]
const _hoisted_332 = ["value"]
const _hoisted_333 = ["onUpdate:modelValue", "onChange"]
const _hoisted_334 = ["onUpdate:modelValue", "onChange"]
const _hoisted_335 = ["onUpdate:modelValue", "onChange"]
const _hoisted_336 = ["onUpdate:modelValue", "onChange"]
const _hoisted_337 = ["onUpdate:modelValue", "onChange"]
const _hoisted_338 = ["onUpdate:modelValue", "onChange"]
const _hoisted_339 = ["onUpdate:modelValue", "onChange"]
const _hoisted_340 = ["onUpdate:modelValue", "onChange"]
const _hoisted_341 = { class: "filters batch-toolbar" }
const _hoisted_342 = { role: "status" }
const _hoisted_343 = ["disabled", "onClick"]
const _hoisted_344 = ["disabled", "onClick"]
const _hoisted_345 = ["disabled", "onClick"]
const _hoisted_346 = ["disabled", "onClick"]
const _hoisted_347 = { class: "scroll" }
const _hoisted_348 = ["aria-label", "checked", "disabled", "onChange"]
const _hoisted_349 = { key: 0 }
const _hoisted_350 = {
  key: 1,
  class: "error"
}
const _hoisted_351 = { class: "review-note" }
const _hoisted_352 = { key: 0 }
const _hoisted_353 = ["onClick"]
const _hoisted_354 = ["onClick"]
const _hoisted_355 = ["disabled", "onClick"]
const _hoisted_356 = ["onClick"]
const _hoisted_357 = {
  key: 0,
  class: "empty"
}
const _hoisted_358 = { class: "pager" }
const _hoisted_359 = ["onUpdate:modelValue", "onChange"]
const _hoisted_360 = ["value"]
const _hoisted_361 = ["disabled", "onClick"]
const _hoisted_362 = ["disabled", "onClick"]
const _hoisted_363 = { class: "card listcard" }
const _hoisted_364 = ["onSubmit"]
const _hoisted_365 = { class: "filters" }
const _hoisted_366 = ["onUpdate:modelValue"]
const _hoisted_367 = ["onUpdate:modelValue"]
const _hoisted_368 = ["onUpdate:modelValue"]
const _hoisted_369 = ["value"]
const _hoisted_370 = ["onUpdate:modelValue"]
const _hoisted_371 = ["onUpdate:modelValue"]
const _hoisted_372 = ["onUpdate:modelValue"]
const _hoisted_373 = ["onUpdate:modelValue"]
const _hoisted_374 = { class: "filters" }
const _hoisted_375 = ["onUpdate:modelValue"]
const _hoisted_376 = ["onUpdate:modelValue"]
const _hoisted_377 = ["onUpdate:modelValue"]
const _hoisted_378 = ["onUpdate:modelValue"]
const _hoisted_379 = ["onUpdate:modelValue"]
const _hoisted_380 = ["onUpdate:modelValue"]
const _hoisted_381 = ["onUpdate:modelValue"]
const _hoisted_382 = ["onUpdate:modelValue"]
const _hoisted_383 = { class: "filters" }
const _hoisted_384 = ["onUpdate:modelValue"]
const _hoisted_385 = ["disabled"]
const _hoisted_386 = ["onClick"]
const _hoisted_387 = { class: "filters" }
const _hoisted_388 = ["onUpdate:modelValue"]
const _hoisted_389 = ["disabled", "onClick"]
const _hoisted_390 = ["onUpdate:modelValue", "onChange"]
const _hoisted_391 = ["value"]
const _hoisted_392 = ["value"]
const _hoisted_393 = ["disabled", "onClick"]
const _hoisted_394 = {
  class: "card listcard",
  "aria-live": "polite"
}
const _hoisted_395 = { key: 0 }
const _hoisted_396 = { class: "card-head" }
const _hoisted_397 = ["disabled", "onClick"]
const _hoisted_398 = { class: "scroll" }
const _hoisted_399 = { class: "snippet111" }
const _hoisted_400 = { class: "snippet111" }
const _hoisted_401 = ["onClick"]
const _hoisted_402 = { key: 0 }
const _hoisted_403 = { class: "pager" }
const _hoisted_404 = ["disabled", "onClick"]
const _hoisted_405 = ["disabled", "onClick"]
const _hoisted_406 = { class: "card listcard" }
const _hoisted_407 = ["onSubmit"]
const _hoisted_408 = { class: "filters" }
const _hoisted_409 = ["onUpdate:modelValue"]
const _hoisted_410 = ["onUpdate:modelValue"]
const _hoisted_411 = ["value"]
const _hoisted_412 = ["value"]
const _hoisted_413 = ["onUpdate:modelValue"]
const _hoisted_414 = ["onUpdate:modelValue"]
const _hoisted_415 = ["onUpdate:modelValue"]
const _hoisted_416 = ["value"]
const _hoisted_417 = ["value"]
const _hoisted_418 = { class: "filters" }
const _hoisted_419 = ["onUpdate:modelValue"]
const _hoisted_420 = ["onUpdate:modelValue", "max"]
const _hoisted_421 = ["onUpdate:modelValue", "min"]
const _hoisted_422 = ["onUpdate:modelValue"]
const _hoisted_423 = ["value"]
const _hoisted_424 = ["value"]
const _hoisted_425 = ["value"]
const _hoisted_426 = ["onUpdate:modelValue"]
const _hoisted_427 = ["onUpdate:modelValue"]
const _hoisted_428 = ["onUpdate:modelValue"]
const _hoisted_429 = ["onUpdate:modelValue"]
const _hoisted_430 = { class: "filters" }
const _hoisted_431 = ["disabled"]
const _hoisted_432 = ["onClick"]
const _hoisted_433 = ["disabled", "onClick"]
const _hoisted_434 = {
  key: 1,
  class: "tag blue"
}
const _hoisted_435 = ["onClick"]
const _hoisted_436 = ["aria-busy"]
const _hoisted_437 = {
  key: 0,
  role: "status"
}
const _hoisted_438 = {
  key: 1,
  class: "error",
  role: "alert"
}
const _hoisted_439 = { class: "card-head" }
const _hoisted_440 = ["disabled", "onClick"]
const _hoisted_441 = { role: "status" }
const _hoisted_442 = {
  key: 0,
  class: "quiet"
}
const _hoisted_443 = { key: 1 }
const _hoisted_444 = { class: "card-head" }
const _hoisted_445 = { class: "actions" }
const _hoisted_446 = ["onClick"]
const _hoisted_447 = ["disabled", "onClick"]
const _hoisted_448 = ["onClick"]
const _hoisted_449 = { open: "" }
const _hoisted_450 = { key: 0 }
const _hoisted_451 = ["onClick"]
const _hoisted_452 = ["onClick"]
const _hoisted_453 = ["title"]
const _hoisted_454 = { key: 0 }
const _hoisted_455 = { class: "pager" }
const _hoisted_456 = ["disabled", "onClick"]
const _hoisted_457 = ["disabled", "onClick"]
const _hoisted_458 = { class: "card listcard" }
const _hoisted_459 = ["onSubmit"]
const _hoisted_460 = { class: "filters" }
const _hoisted_461 = ["onUpdate:modelValue"]
const _hoisted_462 = ["onUpdate:modelValue"]
const _hoisted_463 = ["onUpdate:modelValue"]
const _hoisted_464 = ["onUpdate:modelValue"]
const _hoisted_465 = ["value"]
const _hoisted_466 = ["value"]
const _hoisted_467 = ["onUpdate:modelValue"]
const _hoisted_468 = { class: "filters" }
const _hoisted_469 = ["onUpdate:modelValue"]
const _hoisted_470 = ["onUpdate:modelValue", "max"]
const _hoisted_471 = ["onUpdate:modelValue", "min"]
const _hoisted_472 = ["onUpdate:modelValue"]
const _hoisted_473 = ["onUpdate:modelValue"]
const _hoisted_474 = ["onUpdate:modelValue"]
const _hoisted_475 = ["onUpdate:modelValue"]
const _hoisted_476 = ["onUpdate:modelValue"]
const _hoisted_477 = { class: "filters" }
const _hoisted_478 = ["onUpdate:modelValue"]
const _hoisted_479 = ["onUpdate:modelValue"]
const _hoisted_480 = ["value"]
const _hoisted_481 = ["disabled"]
const _hoisted_482 = ["onClick"]
const _hoisted_483 = ["disabled", "onClick"]
const _hoisted_484 = ["aria-busy"]
const _hoisted_485 = {
  key: 0,
  role: "status"
}
const _hoisted_486 = {
  key: 1,
  class: "error",
  role: "alert"
}
const _hoisted_487 = { class: "card-head" }
const _hoisted_488 = ["disabled", "onClick"]
const _hoisted_489 = {
  key: 0,
  class: "error"
}
const _hoisted_490 = {
  key: 1,
  class: "scroll"
}
const _hoisted_491 = { class: "catalog-table" }
const _hoisted_492 = { class: "hash" }
const _hoisted_493 = { key: 0 }
const _hoisted_494 = ["aria-pressed", "onClick"]
const _hoisted_495 = { key: 2 }
const _hoisted_496 = {
  key: 3,
  class: "pager"
}
const _hoisted_497 = ["disabled", "onClick"]
const _hoisted_498 = ["disabled", "onClick"]
const _hoisted_499 = ["aria-busy"]
const _hoisted_500 = { class: "card-head" }
const _hoisted_501 = ["onClick"]
const _hoisted_502 = { class: "hash" }
const _hoisted_503 = { class: "filters" }
const _hoisted_504 = ["onUpdate:modelValue", "onChange"]
const _hoisted_505 = ["onUpdate:modelValue", "onChange"]
const _hoisted_506 = ["onUpdate:modelValue", "onChange"]
const _hoisted_507 = ["value"]
const _hoisted_508 = ["disabled", "onClick"]
const _hoisted_509 = ["disabled", "onClick"]
const _hoisted_510 = {
  key: 1,
  class: "error",
  role: "alert"
}
const _hoisted_511 = {
  key: 2,
  role: "status"
}
const _hoisted_512 = {
  key: 3,
  class: "error",
  role: "alert"
}
const _hoisted_513 = {
  key: 0,
  class: "scroll"
}
const _hoisted_514 = { class: "catalog-table" }
const _hoisted_515 = ["onClick"]
const _hoisted_516 = ["onClick"]
const _hoisted_517 = { key: 1 }
const _hoisted_518 = {
  key: 2,
  class: "pager"
}
const _hoisted_519 = ["disabled", "onClick"]
const _hoisted_520 = ["disabled", "onClick"]
const _hoisted_521 = { class: "card listcard" }
const _hoisted_522 = { class: "card-head" }
const _hoisted_523 = { class: "actions" }
const _hoisted_524 = ["onClick"]
const _hoisted_525 = ["onClick"]
const _hoisted_526 = ["onClick"]
const _hoisted_527 = {
  key: 0,
  class: "quiet"
}
const _hoisted_528 = { key: 1 }
const _hoisted_529 = ["onSubmit"]
const _hoisted_530 = { class: "filters" }
const _hoisted_531 = ["onUpdate:modelValue", "onChange", "disabled"]
const _hoisted_532 = ["value"]
const _hoisted_533 = ["onUpdate:modelValue"]
const _hoisted_534 = ["value"]
const _hoisted_535 = ["onUpdate:modelValue"]
const _hoisted_536 = ["onUpdate:modelValue"]
const _hoisted_537 = ["onUpdate:modelValue"]
const _hoisted_538 = { class: "filters" }
const _hoisted_539 = ["onUpdate:modelValue"]
const _hoisted_540 = ["onUpdate:modelValue"]
const _hoisted_541 = ["onUpdate:modelValue"]
const _hoisted_542 = ["onUpdate:modelValue"]
const _hoisted_543 = ["onUpdate:modelValue"]
const _hoisted_544 = ["value"]
const _hoisted_545 = ["value"]
const _hoisted_546 = ["onUpdate:modelValue"]
const _hoisted_547 = ["value"]
const _hoisted_548 = { class: "filters" }
const _hoisted_549 = ["disabled"]
const _hoisted_550 = ["disabled", "onClick"]
const _hoisted_551 = ["aria-busy"]
const _hoisted_552 = {
  key: 0,
  role: "status"
}
const _hoisted_553 = {
  key: 1,
  class: "error",
  role: "alert"
}
const _hoisted_554 = { class: "card-head" }
const _hoisted_555 = ["disabled", "onClick"]
const _hoisted_556 = { key: 0 }
const _hoisted_557 = { key: 0 }
const _hoisted_558 = { class: "filters" }
const _hoisted_559 = ["disabled", "aria-pressed", "onClick"]
const _hoisted_560 = { key: 0 }
const _hoisted_561 = { key: 1 }
const _hoisted_562 = {
  key: 2,
  class: "scroll"
}
const _hoisted_563 = { class: "lineage-table" }
const _hoisted_564 = { key: 0 }
const _hoisted_565 = { key: 0 }
const _hoisted_566 = {
  key: 1,
  class: "quiet"
}
const _hoisted_567 = ["onClick"]
const _hoisted_568 = ["onClick"]
const _hoisted_569 = { class: "pager" }
const _hoisted_570 = ["disabled", "onClick"]
const _hoisted_571 = ["disabled", "onClick"]
const _hoisted_572 = { class: "card listcard" }
const _hoisted_573 = { class: "card-head" }
const _hoisted_574 = { class: "actions" }
const _hoisted_575 = ["onClick"]
const _hoisted_576 = ["onClick"]
const _hoisted_577 = ["disabled", "onClick"]
const _hoisted_578 = { key: 0 }
const _hoisted_579 = { class: "filters" }
const _hoisted_580 = ["onUpdate:modelValue", "onInput"]
const _hoisted_581 = ["onUpdate:modelValue", "onChange"]
const _hoisted_582 = ["disabled", "onClick"]
const _hoisted_583 = { open: "" }
const _hoisted_584 = { class: "scroll" }
const _hoisted_585 = { class: "bundle-table" }
const _hoisted_586 = ["onClick"]
const _hoisted_587 = ["aria-busy"]
const _hoisted_588 = {
  key: 0,
  role: "status"
}
const _hoisted_589 = {
  key: 1,
  class: "error",
  role: "alert"
}
const _hoisted_590 = { class: "card-head" }
const _hoisted_591 = { class: "actions" }
const _hoisted_592 = ["disabled", "onClick"]
const _hoisted_593 = ["disabled", "onClick"]
const _hoisted_594 = ["disabled", "onClick"]
const _hoisted_595 = { role: "status" }
const _hoisted_596 = { key: 0 }
const _hoisted_597 = { key: 1 }
const _hoisted_598 = { class: "scroll" }
const _hoisted_599 = { class: "bundle-table" }
const _hoisted_600 = { key: 0 }
const _hoisted_601 = { class: "hash" }
const _hoisted_602 = { class: "card listcard" }
const _hoisted_603 = ["onSubmit"]
const _hoisted_604 = { class: "filters" }
const _hoisted_605 = ["onUpdate:modelValue", "onChange"]
const _hoisted_606 = ["onUpdate:modelValue"]
const _hoisted_607 = ["value"]
const _hoisted_608 = ["value"]
const _hoisted_609 = ["value"]
const _hoisted_610 = { key: 0 }
const _hoisted_611 = ["onUpdate:modelValue"]
const _hoisted_612 = { key: 1 }
const _hoisted_613 = ["onUpdate:modelValue"]
const _hoisted_614 = { key: 2 }
const _hoisted_615 = ["onUpdate:modelValue"]
const _hoisted_616 = ["onUpdate:modelValue"]
const _hoisted_617 = { class: "filters" }
const _hoisted_618 = ["onUpdate:modelValue", "max"]
const _hoisted_619 = ["onUpdate:modelValue", "min"]
const _hoisted_620 = ["onUpdate:modelValue"]
const _hoisted_621 = ["onUpdate:modelValue"]
const _hoisted_622 = ["onUpdate:modelValue"]
const _hoisted_623 = ["onUpdate:modelValue"]
const _hoisted_624 = ["onUpdate:modelValue"]
const _hoisted_625 = ["value"]
const _hoisted_626 = { class: "filters" }
const _hoisted_627 = ["disabled"]
const _hoisted_628 = ["onClick"]
const _hoisted_629 = ["onClick"]
const _hoisted_630 = ["onClick"]
const _hoisted_631 = ["aria-busy"]
const _hoisted_632 = {
  key: 0,
  role: "status"
}
const _hoisted_633 = {
  key: 1,
  role: "alert",
  class: "error"
}
const _hoisted_634 = { class: "card-head" }
const _hoisted_635 = ["disabled", "onClick"]
const _hoisted_636 = { role: "status" }
const _hoisted_637 = {
  key: 0,
  class: "filters"
}
const _hoisted_638 = ["aria-pressed", "disabled", "onClick"]
const _hoisted_639 = ["disabled", "onClick"]
const _hoisted_640 = { key: 1 }
const _hoisted_641 = { class: "scroll" }
const _hoisted_642 = ["onClick"]
const _hoisted_643 = {
  key: 0,
  class: "pager"
}
const _hoisted_644 = ["disabled", "onClick"]
const _hoisted_645 = ["disabled", "onClick"]
const _hoisted_646 = { key: 2 }
const _hoisted_647 = {
  key: 3,
  class: "scroll"
}
const _hoisted_648 = { class: "path-history-table" }
const _hoisted_649 = { key: 0 }
const _hoisted_650 = ["onClick"]
const _hoisted_651 = ["onClick"]
const _hoisted_652 = {
  key: 4,
  class: "pager"
}
const _hoisted_653 = ["disabled", "onClick"]
const _hoisted_654 = ["disabled", "onClick"]
const _hoisted_655 = { class: "card listcard" }
const _hoisted_656 = { class: "filters" }
const _hoisted_657 = ["onUpdate:modelValue", "onChange"]
const _hoisted_658 = ["value"]
const _hoisted_659 = ["value"]
const _hoisted_660 = ["disabled", "onClick"]
const _hoisted_661 = ["onClick"]
const _hoisted_662 = { key: 0 }
const _hoisted_663 = ["onSubmit"]
const _hoisted_664 = { class: "filters" }
const _hoisted_665 = ["onUpdate:modelValue"]
const _hoisted_666 = ["value"]
const _hoisted_667 = ["onUpdate:modelValue"]
const _hoisted_668 = ["value"]
const _hoisted_669 = ["onUpdate:modelValue"]
const _hoisted_670 = ["value"]
const _hoisted_671 = ["disabled", "onClick"]
const _hoisted_672 = { class: "filters" }
const _hoisted_673 = ["onUpdate:modelValue"]
const _hoisted_674 = ["onUpdate:modelValue"]
const _hoisted_675 = ["onUpdate:modelValue"]
const _hoisted_676 = ["onUpdate:modelValue"]
const _hoisted_677 = ["onUpdate:modelValue"]
const _hoisted_678 = ["onUpdate:modelValue"]
const _hoisted_679 = ["onUpdate:modelValue"]
const _hoisted_680 = ["onUpdate:modelValue"]
const _hoisted_681 = ["value"]
const _hoisted_682 = { class: "filters" }
const _hoisted_683 = ["disabled"]
const _hoisted_684 = ["disabled", "onClick"]
const _hoisted_685 = ["aria-busy"]
const _hoisted_686 = {
  key: 0,
  role: "status"
}
const _hoisted_687 = {
  key: 1,
  role: "alert",
  class: "error"
}
const _hoisted_688 = { class: "card-head" }
const _hoisted_689 = ["disabled", "onClick"]
const _hoisted_690 = { class: "filters tri-snapshot-labels" }
const _hoisted_691 = { role: "status" }
const _hoisted_692 = {
  key: 0,
  class: "quiet"
}
const _hoisted_693 = { key: 1 }
const _hoisted_694 = {
  key: 2,
  class: "scroll"
}
const _hoisted_695 = { class: "tri-table" }
const _hoisted_696 = {
  key: 0,
  class: "tag amber"
}
const _hoisted_697 = ["onClick"]
const _hoisted_698 = { class: "hash" }
const _hoisted_699 = {
  key: 1,
  class: "quiet"
}
const _hoisted_700 = { key: 2 }
const _hoisted_701 = { class: "hash" }
const _hoisted_702 = {
  key: 2,
  class: "quiet"
}
const _hoisted_703 = { class: "actions" }
const _hoisted_704 = ["onClick"]
const _hoisted_705 = ["onClick"]
const _hoisted_706 = ["onClick"]
const _hoisted_707 = {
  key: 3,
  class: "pager"
}
const _hoisted_708 = ["disabled", "onClick"]
const _hoisted_709 = ["disabled", "onClick"]
const _hoisted_710 = { class: "card listcard" }
const _hoisted_711 = { class: "card-head" }
const _hoisted_712 = { class: "actions" }
const _hoisted_713 = ["onClick"]
const _hoisted_714 = ["onClick"]
const _hoisted_715 = ["onClick"]
const _hoisted_716 = ["onClick"]
const _hoisted_717 = {
  key: 0,
  class: "quiet"
}
const _hoisted_718 = { key: 1 }
const _hoisted_719 = ["onSubmit"]
const _hoisted_720 = { class: "filters" }
const _hoisted_721 = ["onUpdate:modelValue", "onChange", "disabled"]
const _hoisted_722 = ["value"]
const _hoisted_723 = ["onUpdate:modelValue", "onChange", "disabled"]
const _hoisted_724 = { key: 0 }
const _hoisted_725 = ["onUpdate:modelValue"]
const _hoisted_726 = ["value"]
const _hoisted_727 = ["value"]
const _hoisted_728 = ["onUpdate:modelValue"]
const _hoisted_729 = ["value"]
const _hoisted_730 = ["onUpdate:modelValue", "placeholder"]
const _hoisted_731 = { class: "filters" }
const _hoisted_732 = ["min", "onUpdate:modelValue"]
const _hoisted_733 = ["min", "onUpdate:modelValue"]
const _hoisted_734 = ["min", "onUpdate:modelValue"]
const _hoisted_735 = { key: 0 }
const _hoisted_736 = ["onUpdate:modelValue"]
const _hoisted_737 = { key: 1 }
const _hoisted_738 = ["onUpdate:modelValue"]
const _hoisted_739 = { class: "filters" }
const _hoisted_740 = ["disabled"]
const _hoisted_741 = ["disabled", "onClick"]
const _hoisted_742 = ["disabled", "onClick"]
const _hoisted_743 = { key: 0 }
const _hoisted_744 = ["aria-busy"]
const _hoisted_745 = {
  key: 0,
  role: "status"
}
const _hoisted_746 = {
  key: 1,
  role: "alert",
  class: "error"
}
const _hoisted_747 = { class: "card-head" }
const _hoisted_748 = ["disabled", "onClick"]
const _hoisted_749 = { class: "hash" }
const _hoisted_750 = {
  key: 0,
  class: "quiet"
}
const _hoisted_751 = { key: 1 }
const _hoisted_752 = { key: 0 }
const _hoisted_753 = { role: "status" }
const _hoisted_754 = {
  key: 2,
  class: "quiet"
}
const _hoisted_755 = {
  key: 3,
  class: "scroll"
}
const _hoisted_756 = {
  key: 0,
  class: "snapshot-table"
}
const _hoisted_757 = { key: 0 }
const _hoisted_758 = { key: 0 }
const _hoisted_759 = { key: 0 }
const _hoisted_760 = {
  key: 1,
  class: "quiet"
}
const _hoisted_761 = ["onClick"]
const _hoisted_762 = {
  key: 1,
  class: "snapshot-table"
}
const _hoisted_763 = { key: 0 }
const _hoisted_764 = { class: "snapshot-bytes" }
const _hoisted_765 = { class: "pager" }
const _hoisted_766 = ["disabled", "onClick"]
const _hoisted_767 = ["disabled", "onClick"]
const _hoisted_768 = { class: "card settings" }
const _hoisted_769 = ["onClick"]
const _hoisted_770 = ["disabled", "onClick"]
const _hoisted_771 = ["onUpdate:modelValue", "onChange"]
const _hoisted_772 = ["value"]
const _hoisted_773 = { key: 0 }
const _hoisted_774 = ["onUpdate:modelValue"]
const _hoisted_775 = ["onClick", "disabled"]
const _hoisted_776 = { key: 1 }
const _hoisted_777 = { class: "pair" }
const _hoisted_778 = ["onUpdate:modelValue", "onChange"]
const _hoisted_779 = ["value"]
const _hoisted_780 = ["disabled", "onClick"]
const _hoisted_781 = ["onUpdate:modelValue", "onChange"]
const _hoisted_782 = ["value"]
const _hoisted_783 = { key: 2 }
const _hoisted_784 = {
  key: 0,
  class: "card listcard"
}
const _hoisted_785 = { class: "filters" }
const _hoisted_786 = ["onUpdate:modelValue", "onInput"]
const _hoisted_787 = ["onUpdate:modelValue", "onChange"]
const _hoisted_788 = ["onUpdate:modelValue", "onChange"]
const _hoisted_789 = ["onUpdate:modelValue", "onChange"]
const _hoisted_790 = ["disabled", "onClick"]
const _hoisted_791 = {
  key: 0,
  role: "status"
}
const _hoisted_792 = { class: "scroll" }
const _hoisted_793 = ["onClick"]
const _hoisted_794 = { key: 0 }
const _hoisted_795 = { class: "pager" }
const _hoisted_796 = ["disabled", "onClick"]
const _hoisted_797 = ["disabled", "onClick"]
const _hoisted_798 = { class: "card settings" }
const _hoisted_799 = ["onClick"]
const _hoisted_800 = { key: 0 }
const _hoisted_801 = { class: "error" }
const _hoisted_802 = { class: "card settings" }
const _hoisted_803 = ["onUpdate:modelValue"]
const _hoisted_804 = ["value"]
const _hoisted_805 = ["onUpdate:modelValue"]
const _hoisted_806 = { key: 0 }
const _hoisted_807 = ["onUpdate:modelValue"]
const _hoisted_808 = ["onClick"]
const _hoisted_809 = { class: "card settings" }
const _hoisted_810 = { class: "actions" }
const _hoisted_811 = ["onClick"]
const _hoisted_812 = ["onClick"]
const _hoisted_813 = ["onClick"]
const _hoisted_814 = { class: "actions" }
const _hoisted_815 = ["onClick"]
const _hoisted_816 = ["onClick"]
const _hoisted_817 = {
  key: 0,
  class: "storage19"
}
const _hoisted_818 = ["onClick"]
const _hoisted_819 = { key: 1 }
const _hoisted_820 = { key: 2 }
const _hoisted_821 = ["onClick"]
const _hoisted_822 = ["onClick"]
const _hoisted_823 = { key: 1 }
const _hoisted_824 = { key: 3 }
const _hoisted_825 = { class: "actions" }
const _hoisted_826 = ["onClick"]
const _hoisted_827 = ["onClick"]
const _hoisted_828 = ["onClick"]
const _hoisted_829 = { class: "foot" }
const _hoisted_830 = ["onClick"]
const _hoisted_831 = ["aria-label"]
const _hoisted_832 = { class: "card-head" }
const _hoisted_833 = ["disabled", "onClick"]
const _hoisted_834 = ["onSubmit"]
const _hoisted_835 = ["onUpdate:modelValue"]
const _hoisted_836 = ["onUpdate:modelValue", "required"]
const _hoisted_837 = { key: 0 }
const _hoisted_838 = { role: "status" }
const _hoisted_839 = { class: "form-actions" }
const _hoisted_840 = ["onClick"]
const _hoisted_841 = ["onClick"]
const _hoisted_842 = { class: "batch-selection" }
const _hoisted_843 = ["disabled", "onClick"]
const _hoisted_844 = ["disabled", "onInput"]
const _hoisted_845 = { class: "filters" }
const _hoisted_846 = ["onUpdate:modelValue"]
const _hoisted_847 = ["onUpdate:modelValue"]
const _hoisted_848 = { key: 0 }
const _hoisted_849 = ["onUpdate:modelValue"]
const _hoisted_850 = { key: 1 }
const _hoisted_851 = ["onUpdate:modelValue"]
const _hoisted_852 = {
  key: 0,
  role: "status"
}
const _hoisted_853 = { role: "status" }
const _hoisted_854 = { class: "filters" }
const _hoisted_855 = ["onUpdate:modelValue"]
const _hoisted_856 = ["disabled", "onClick"]
const _hoisted_857 = { class: "scroll" }
const _hoisted_858 = { class: "batch-preview" }
const _hoisted_859 = { key: 0 }
const _hoisted_860 = { key: 1 }
const _hoisted_861 = { class: "review-note" }
const _hoisted_862 = { class: "review-note" }
const _hoisted_863 = { key: 0 }
const _hoisted_864 = ["disabled", "onClick"]
const _hoisted_865 = {
  key: 0,
  class: "quiet"
}
const _hoisted_866 = { class: "form-actions" }
const _hoisted_867 = ["disabled", "onClick"]
const _hoisted_868 = ["disabled"]
const _hoisted_869 = ["disabled", "onClick"]
const _hoisted_870 = { key: 0 }
const _hoisted_871 = ["onUpdate:modelValue", "onKeydown"]
const _hoisted_872 = ["onClick"]
const _hoisted_873 = { key: 1 }
const _hoisted_874 = ["onClick"]
const _hoisted_875 = ["onClick"]
const _hoisted_876 = {
  key: 0,
  class: "quiet"
}
const _hoisted_877 = { key: 1 }
const _hoisted_878 = ["onUpdate:modelValue"]
const _hoisted_879 = ["onClick"]
const _hoisted_880 = {
  key: 2,
  class: "admin-history"
}
const _hoisted_881 = { key: 0 }
const _hoisted_882 = ["onUpdate:modelValue"]
const _hoisted_883 = { key: 3 }
const _hoisted_884 = ["onUpdate:modelValue"]
const _hoisted_885 = ["onUpdate:modelValue"]
const _hoisted_886 = { key: 4 }
const _hoisted_887 = { class: "actions" }
const _hoisted_888 = ["onUpdate:modelValue", "onChange"]
const _hoisted_889 = ["onUpdate:modelValue", "onChange"]
const _hoisted_890 = { key: 0 }
const _hoisted_891 = ["onUpdate:modelValue", "onChange"]
const _hoisted_892 = ["disabled", "onClick"]
const _hoisted_893 = {
  key: 0,
  role: "status"
}
const _hoisted_894 = { key: 0 }
const _hoisted_895 = { class: "hash" }
const _hoisted_896 = { class: "hash" }
const _hoisted_897 = { key: 0 }
const _hoisted_898 = { key: 0 }
const _hoisted_899 = { key: 0 }
const _hoisted_900 = { key: 1 }
const _hoisted_901 = { key: 2 }
const _hoisted_902 = ["disabled", "onClick"]
const _hoisted_903 = { class: "ledger-sides" }
const _hoisted_904 = ["onUpdate:modelValue", "onChange"]
const _hoisted_905 = ["value"]
const _hoisted_906 = { key: 0 }
const _hoisted_907 = ["onUpdate:modelValue", "onChange"]
const _hoisted_908 = { key: 1 }
const _hoisted_909 = ["onUpdate:modelValue", "onChange"]
const _hoisted_910 = ["onUpdate:modelValue", "onChange"]
const _hoisted_911 = ["value"]
const _hoisted_912 = { key: 0 }
const _hoisted_913 = ["onUpdate:modelValue", "onChange"]
const _hoisted_914 = { key: 1 }
const _hoisted_915 = ["onUpdate:modelValue", "onChange"]
const _hoisted_916 = { class: "actions" }
const _hoisted_917 = ["onUpdate:modelValue", "onKeydown"]
const _hoisted_918 = ["onClick"]
const _hoisted_919 = ["onClick"]
const _hoisted_920 = { key: 0 }
const _hoisted_921 = ["disabled", "onClick"]
const _hoisted_922 = ["disabled", "onClick"]
const _hoisted_923 = {
  key: 0,
  role: "status"
}
const _hoisted_924 = ["onClick"]
const _hoisted_925 = { class: "actions" }
const _hoisted_926 = ["onUpdate:modelValue"]
const _hoisted_927 = ["disabled", "onClick"]
const _hoisted_928 = ["onUpdate:modelValue", "onChange"]
const _hoisted_929 = ["value"]
const _hoisted_930 = ["value"]
const _hoisted_931 = ["disabled", "onClick"]
const _hoisted_932 = ["disabled", "onClick"]
const _hoisted_933 = { class: "actions" }
const _hoisted_934 = ["onUpdate:modelValue", "onChange"]
const _hoisted_935 = ["value"]
const _hoisted_936 = ["value"]
const _hoisted_937 = ["onUpdate:modelValue", "onChange"]
const _hoisted_938 = ["value"]
const _hoisted_939 = ["value"]
const _hoisted_940 = ["onClick"]
const _hoisted_941 = ["disabled", "onClick"]
const _hoisted_942 = { class: "actions" }
const _hoisted_943 = ["onClick"]
const _hoisted_944 = ["onClick"]
const _hoisted_945 = { class: "ledger-map" }
const _hoisted_946 = { class: "actions" }
const _hoisted_947 = ["onUpdate:modelValue", "onChange"]
const _hoisted_948 = ["onUpdate:modelValue", "onChange"]
const _hoisted_949 = ["value"]
const _hoisted_950 = ["value"]
const _hoisted_951 = ["onUpdate:modelValue", "onChange"]
const _hoisted_952 = ["value"]
const _hoisted_953 = ["value"]
const _hoisted_954 = { class: "report-controls" }
const _hoisted_955 = ["onUpdate:modelValue", "onChange"]
const _hoisted_956 = { key: 0 }
const _hoisted_957 = ["onUpdate:modelValue", "onInput"]
const _hoisted_958 = { class: "actions" }
const _hoisted_959 = ["onClick"]
const _hoisted_960 = ["disabled", "onClick"]
const _hoisted_961 = ["disabled", "onClick"]
const _hoisted_962 = ["disabled", "onClick"]
const _hoisted_963 = ["onUpdate:modelValue", "onChange"]
const _hoisted_964 = ["onClick"]
const _hoisted_965 = ["onInput", "onChange"]
const _hoisted_966 = ["onUpdate:modelValue"]
const _hoisted_967 = ["onUpdate:modelValue"]
const _hoisted_968 = ["onUpdate:modelValue"]
const _hoisted_969 = ["onUpdate:modelValue"]
const _hoisted_970 = ["onUpdate:modelValue"]
const _hoisted_971 = ["onUpdate:modelValue"]
const _hoisted_972 = ["onUpdate:modelValue"]
const _hoisted_973 = ["onUpdate:modelValue"]
const _hoisted_974 = ["onUpdate:modelValue"]
const _hoisted_975 = { key: 0 }
const _hoisted_976 = ["onClick"]
const _hoisted_977 = { class: "scroll" }
const _hoisted_978 = ["onClick"]
const _hoisted_979 = { key: 0 }
const _hoisted_980 = { colspan: "4" }
const _hoisted_981 = { key: 0 }
const _hoisted_982 = { key: 1 }
const _hoisted_983 = { class: "ledger-field" }
const _hoisted_984 = { key: 1 }
const _hoisted_985 = ["onClick"]
const _hoisted_986 = { class: "scroll" }
const _hoisted_987 = ["onClick"]
const _hoisted_988 = { class: "actions" }
const _hoisted_989 = ["onUpdate:modelValue", "onInput"]
const _hoisted_990 = ["onUpdate:modelValue", "onChange"]
const _hoisted_991 = ["onClick"]
const _hoisted_992 = { class: "trace-value" }
const _hoisted_993 = {
  key: 5,
  class: "actions"
}
const _hoisted_994 = ["disabled", "onClick"]
const _hoisted_995 = ["disabled", "onClick"]
const _hoisted_996 = ["disabled", "onClick"]
const _hoisted_997 = ["disabled", "onClick"]
const _hoisted_998 = {
  key: 0,
  role: "status"
}
const _hoisted_999 = { class: "path" }
const _hoisted_1000 = { class: "hash" }
const _hoisted_1001 = { class: "hash" }
const _hoisted_1002 = { key: 0 }
const _hoisted_1003 = { key: 0 }
const _hoisted_1004 = { key: 1 }
const _hoisted_1005 = { class: "filters" }
const _hoisted_1006 = ["onUpdate:modelValue"]
const _hoisted_1007 = ["onUpdate:modelValue"]
const _hoisted_1008 = ["onUpdate:modelValue"]
const _hoisted_1009 = ["onUpdate:modelValue"]
const _hoisted_1010 = ["onUpdate:modelValue"]
const _hoisted_1011 = ["onClick"]
const _hoisted_1012 = { class: "actions" }
const _hoisted_1013 = ["disabled", "onClick"]
const _hoisted_1014 = ["onClick"]
const _hoisted_1015 = ["onUpdate:modelValue", "onChange"]
const _hoisted_1016 = ["disabled", "onClick"]
const _hoisted_1017 = ["onClick"]
const _hoisted_1018 = {
  key: 0,
  open: ""
}
const _hoisted_1019 = { key: 0 }
const _hoisted_1020 = { key: 1 }
const _hoisted_1021 = { class: "scroll" }
const _hoisted_1022 = { class: "hash" }
const _hoisted_1023 = { class: "pager" }
const _hoisted_1024 = ["disabled", "onClick"]
const _hoisted_1025 = ["disabled", "onClick"]
const _hoisted_1026 = ["onUpdate:modelValue"]
const _hoisted_1027 = { key: 0 }
const _hoisted_1028 = { class: "actions" }
const _hoisted_1029 = ["disabled", "onClick"]
const _hoisted_1030 = ["onClick"]
const _hoisted_1031 = { role: "status" }
const _hoisted_1032 = { key: 0 }
const _hoisted_1033 = ["onUpdate:modelValue", "onChange"]
const _hoisted_1034 = ["value"]
const _hoisted_1035 = { class: "filters" }
const _hoisted_1036 = ["onUpdate:modelValue"]
const _hoisted_1037 = ["onUpdate:modelValue"]
const _hoisted_1038 = ["onUpdate:modelValue"]
const _hoisted_1039 = ["onClick"]
const _hoisted_1040 = ["onClick"]
const _hoisted_1041 = { class: "hash" }
const _hoisted_1042 = ["onClick"]
const _hoisted_1043 = { class: "pager" }
const _hoisted_1044 = ["disabled", "onClick"]
const _hoisted_1045 = ["disabled", "onClick"]
const _hoisted_1046 = {
  key: 0,
  open: ""
}
const _hoisted_1047 = ["disabled", "onClick"]
const _hoisted_1048 = ["disabled", "onClick"]
const _hoisted_1049 = { class: "filters" }
const _hoisted_1050 = ["onUpdate:modelValue"]
const _hoisted_1051 = ["onUpdate:modelValue"]
const _hoisted_1052 = ["onUpdate:modelValue"]
const _hoisted_1053 = ["onUpdate:modelValue"]
const _hoisted_1054 = ["onUpdate:modelValue"]
const _hoisted_1055 = ["onUpdate:modelValue"]
const _hoisted_1056 = ["onUpdate:modelValue"]
const _hoisted_1057 = ["onClick"]
const _hoisted_1058 = { class: "scroll" }
const _hoisted_1059 = ["onClick"]
const _hoisted_1060 = ["onClick"]
const _hoisted_1061 = { class: "pager" }
const _hoisted_1062 = ["disabled", "onClick"]
const _hoisted_1063 = ["disabled", "onClick"]
const _hoisted_1064 = ["disabled", "onClick"]
const _hoisted_1065 = {
  key: 0,
  class: "report-controls"
}
const _hoisted_1066 = ["onUpdate:modelValue"]
const _hoisted_1067 = ["onUpdate:modelValue"]
const _hoisted_1068 = ["onUpdate:modelValue"]
const _hoisted_1069 = ["value"]
const _hoisted_1070 = ["onUpdate:modelValue"]
const _hoisted_1071 = ["value"]
const _hoisted_1072 = ["onUpdate:modelValue"]
const _hoisted_1073 = ["onUpdate:modelValue"]
const _hoisted_1074 = ["onUpdate:modelValue"]
const _hoisted_1075 = ["onUpdate:modelValue"]
const _hoisted_1076 = ["onUpdate:modelValue"]
const _hoisted_1077 = ["value"]
const _hoisted_1078 = ["onUpdate:modelValue"]
const _hoisted_1079 = ["value"]
const _hoisted_1080 = ["onUpdate:modelValue"]
const _hoisted_1081 = { key: 1 }
const _hoisted_1082 = {
  key: 2,
  class: "report-controls"
}
const _hoisted_1083 = ["onUpdate:modelValue"]
const _hoisted_1084 = ["onUpdate:modelValue"]
const _hoisted_1085 = ["onUpdate:modelValue"]
const _hoisted_1086 = ["onUpdate:modelValue"]
const _hoisted_1087 = ["onUpdate:modelValue"]
const _hoisted_1088 = ["onUpdate:modelValue"]
const _hoisted_1089 = ["onUpdate:modelValue"]
const _hoisted_1090 = ["onUpdate:modelValue"]
const _hoisted_1091 = ["onUpdate:modelValue"]
const _hoisted_1092 = ["onUpdate:modelValue"]
const _hoisted_1093 = ["onUpdate:modelValue"]
const _hoisted_1094 = { class: "actions" }
const _hoisted_1095 = ["onClick"]
const _hoisted_1096 = ["disabled", "onClick"]
const _hoisted_1097 = {
  key: 3,
  role: "status"
}
const _hoisted_1098 = { class: "scroll" }
const _hoisted_1099 = ["onClick"]
const _hoisted_1100 = { class: "scroll" }
const _hoisted_1101 = ["onClick"]
const _hoisted_1102 = { class: "trace-value" }
const _hoisted_1103 = { class: "trace-value" }
const _hoisted_1104 = { key: 0 }
const _hoisted_1105 = { key: 2 }
const _hoisted_1106 = { class: "actions" }
const _hoisted_1107 = ["disabled", "onClick"]
const _hoisted_1108 = ["disabled", "onClick"]
const _hoisted_1109 = { class: "path" }
const _hoisted_1110 = ["onUpdate:modelValue"]
const _hoisted_1111 = ["value"]
const _hoisted_1112 = ["onUpdate:modelValue"]
const _hoisted_1113 = { class: "path" }
const _hoisted_1114 = { class: "filters scan-filters" }
const _hoisted_1115 = ["onUpdate:modelValue"]
const _hoisted_1116 = ["onUpdate:modelValue"]
const _hoisted_1117 = ["onUpdate:modelValue"]
const _hoisted_1118 = { class: "actions scan-actions" }
const _hoisted_1119 = ["onClick"]
const _hoisted_1120 = ["onClick"]
const _hoisted_1121 = {
  key: 0,
  role: "status"
}
const _hoisted_1122 = {
  key: 0,
  class: "quiet"
}
const _hoisted_1123 = { role: "status" }
const _hoisted_1124 = {
  key: 1,
  class: "actions scan-chips",
  role: "group",
  "aria-label": "按当前路径查询的等待原因筛选"
}
const _hoisted_1125 = ["aria-pressed", "onClick"]
const _hoisted_1126 = {
  key: 2,
  class: "scroll scan-scroll",
  tabindex: "0",
  role: "region",
  "aria-label": "等待文件表"
}
const _hoisted_1127 = { key: 3 }
const _hoisted_1128 = {
  key: 4,
  class: "pager scan-pager"
}
const _hoisted_1129 = ["disabled", "onClick"]
const _hoisted_1130 = ["disabled", "onClick"]
const _hoisted_1131 = { class: "path" }
const _hoisted_1132 = { class: "filters scan-filters" }
const _hoisted_1133 = ["onUpdate:modelValue"]
const _hoisted_1134 = ["onUpdate:modelValue"]
const _hoisted_1135 = ["onUpdate:modelValue"]
const _hoisted_1136 = ["onUpdate:modelValue"]
const _hoisted_1137 = { class: "scan-details" }
const _hoisted_1138 = { class: "filters scan-filters" }
const _hoisted_1139 = ["onUpdate:modelValue"]
const _hoisted_1140 = ["onUpdate:modelValue"]
const _hoisted_1141 = ["onUpdate:modelValue"]
const _hoisted_1142 = ["onUpdate:modelValue"]
const _hoisted_1143 = ["value"]
const _hoisted_1144 = { class: "filters" }
const _hoisted_1145 = ["onUpdate:modelValue"]
const _hoisted_1146 = ["onUpdate:modelValue"]
const _hoisted_1147 = { class: "actions scan-actions" }
const _hoisted_1148 = ["onClick"]
const _hoisted_1149 = ["disabled", "onClick"]
const _hoisted_1150 = ["onClick"]
const _hoisted_1151 = {
  key: 0,
  role: "status"
}
const _hoisted_1152 = {
  key: 0,
  class: "quiet"
}
const _hoisted_1153 = { role: "status" }
const _hoisted_1154 = {
  key: 0,
  class: "scan-summary",
  "aria-label": "匹配运行汇总"
}
const _hoisted_1155 = { class: "scan-metrics" }
const _hoisted_1156 = { key: 0 }
const _hoisted_1157 = { key: 1 }
const _hoisted_1158 = { class: "scan-details" }
const _hoisted_1159 = { key: 0 }
const _hoisted_1160 = {
  class: "actions scan-chips",
  role: "group",
  "aria-label": "按匹配记录的运行结果筛选"
}
const _hoisted_1161 = ["aria-pressed", "onClick"]
const _hoisted_1162 = {
  key: 1,
  class: "actions scan-chips",
  role: "group",
  "aria-label": "按匹配记录的跳过原因筛选"
}
const _hoisted_1163 = ["aria-pressed", "onClick"]
const _hoisted_1164 = {
  key: 2,
  class: "actions scan-chips",
  role: "group",
  "aria-label": "按匹配记录的异常类别筛选"
}
const _hoisted_1165 = ["aria-pressed", "onClick"]
const _hoisted_1166 = { key: 2 }
const _hoisted_1167 = {
  key: 2,
  class: "scan-selection",
  "aria-label": "两次扫描对照"
}
const _hoisted_1168 = { class: "actions scan-chips" }
const _hoisted_1169 = { role: "status" }
const _hoisted_1170 = ["onClick", "aria-label"]
const _hoisted_1171 = ["onClick"]
const _hoisted_1172 = {
  class: "scroll scan-scroll",
  tabindex: "0",
  role: "region",
  "aria-label": "扫描对照表"
}
const _hoisted_1173 = { scope: "col" }
const _hoisted_1174 = { scope: "col" }
const _hoisted_1175 = { scope: "row" }
const _hoisted_1176 = { key: 1 }
const _hoisted_1177 = {
  class: "scroll scan-scroll",
  tabindex: "0",
  role: "region",
  "aria-label": "扫描运行表"
}
const _hoisted_1178 = { key: 0 }
const _hoisted_1179 = { key: 0 }
const _hoisted_1180 = ["aria-label", "aria-pressed", "disabled", "onClick"]
const _hoisted_1181 = {
  key: 0,
  class: "pager scan-pager"
}
const _hoisted_1182 = ["disabled", "onClick"]
const _hoisted_1183 = ["disabled", "onClick"]
const _hoisted_1184 = { class: "path" }
const _hoisted_1185 = ["onUpdate:modelValue"]
const _hoisted_1186 = ["onUpdate:modelValue"]
const _hoisted_1187 = ["onUpdate:modelValue"]
const _hoisted_1188 = { class: "inline" }
const _hoisted_1189 = ["onUpdate:modelValue", "readonly"]
const _hoisted_1190 = ["onClick"]
const _hoisted_1191 = ["onUpdate:modelValue"]
const _hoisted_1192 = ["onUpdate:modelValue"]
const _hoisted_1193 = ["onUpdate:modelValue"]
const _hoisted_1194 = ["onUpdate:modelValue"]
const _hoisted_1195 = ["onClick"]
const _hoisted_1196 = { key: 0 }
const _hoisted_1197 = { key: 0 }
const _hoisted_1198 = { key: 21 }
const _hoisted_1199 = ["onUpdate:modelValue"]
const _hoisted_1200 = {
  key: 22,
  style: {"white-space":"pre-line"}
}
const _hoisted_1201 = { class: "search-input" }
const _hoisted_1202 = ["onUpdate:modelValue"]
const _hoisted_1203 = { class: "picklist" }
const _hoisted_1204 = ["onClick"]
const _hoisted_1205 = ["onClick"]
const _hoisted_1206 = { key: 0 }
const _hoisted_1207 = { key: 1 }
const _hoisted_1208 = { class: "picker-tools" }
const _hoisted_1209 = { class: "search-input" }
const _hoisted_1210 = ["onUpdate:modelValue", "onInput"]
const _hoisted_1211 = ["onUpdate:modelValue", "onChange"]
const _hoisted_1212 = ["value"]
const _hoisted_1213 = { class: "picklist" }
const _hoisted_1214 = ["disabled", "onClick"]
const _hoisted_1215 = { class: "file-summary" }
const _hoisted_1216 = { key: 0 }
const _hoisted_1217 = {
  key: 0,
  role: "status"
}
const _hoisted_1218 = { key: 1 }
const _hoisted_1219 = { class: "pager" }
const _hoisted_1220 = ["disabled", "onClick"]
const _hoisted_1221 = ["disabled", "onClick"]
const _hoisted_1222 = {
  key: 25,
  class: "error"
}
const _hoisted_1223 = {
  key: 26,
  class: "form-actions"
}
const _hoisted_1224 = ["disabled", "onClick"]
const _hoisted_1225 = ["disabled"]
const _hoisted_1226 = {
  key: 1,
  class: "toast",
  role: "status"
}

return function render(_ctx, _cache) {
  with (_ctx) {
    const { resolveComponent: _resolveComponent, createVNode: _createVNode, createElementVNode: _createElementVNode, renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock, toDisplayString: _toDisplayString, createTextVNode: _createTextVNode, normalizeClass: _normalizeClass, createCommentVNode: _createCommentVNode, vModelSelect: _vModelSelect, withDirectives: _withDirectives, normalizeStyle: _normalizeStyle, withKeys: _withKeys, vModelText: _vModelText, vModelCheckbox: _vModelCheckbox, withModifiers: _withModifiers } = _Vue

    const _component_ico = _resolveComponent("ico")

    return (_openBlock(), _createElementBlock("div", { class: _normalizeClass(["shell", {dark:theme==='深色'}]) }, [
      _createElementVNode("aside", null, [_createElementVNode("div", _hoisted_1, [_createElementVNode("div", _hoisted_2, [_createVNode(_component_ico, { n: "shield-check" })]), _cache[0] || (_cache[0] = _createElementVNode("div", null, [_createElementVNode("strong", null, "FileGuard"), _createElementVNode("small", null, "文件变更追溯")], -1))]), _createElementVNode("nav", null, [
        _cache[1] || (_cache[1] = _createElementVNode("div", { class: "nav-label" }, "工作空间", -1)),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(nav.slice(0,16), (x) => {
          return (_openBlock(), _createElementBlock("button", {
            "aria-label": x[0],
            "aria-current": page===x[0]?'page':undefined,
            class: _normalizeClass({active:page===x[0]}),
            onClick: $event => (go(x[0]))
          }, [_createVNode(_component_ico, { n: x[1] }, null, 8, ["n"]), _createTextVNode(_toDisplayString(x[0]), 1)], 10, _hoisted_3))
        }), 256)),
        _cache[2] || (_cache[2] = _createElementVNode("div", { class: "nav-label second" }, "系统管理", -1)),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(nav.slice(16), (x) => {
          return (_openBlock(), _createElementBlock("button", {
            "aria-label": x[0],
            "aria-current": page===x[0]?'page':undefined,
            class: _normalizeClass({active:page===x[0]}),
            onClick: $event => (go(x[0]))
          }, [_createVNode(_component_ico, { n: x[1] }, null, 8, ["n"]), _createTextVNode(_toDisplayString(x[0]), 1)], 10, _hoisted_4))
        }), 256))
      ]), _createElementVNode("div", _hoisted_5, [_createElementVNode("div", _hoisted_6, [_createVNode(_component_ico, { n: "monitor" })]), _createElementVNode("div", null, [_createElementVNode("b", null, _toDisplayString(demo?'示例工作区':'本地工作区'), 1), _cache[3] || (_cache[3] = _createElementVNode("small", null, "桌面版 · 1.23.0", -1))])])]),
      _createElementVNode("main", null, [
        _createElementVNode("header", _hoisted_7, [_createElementVNode("div", _hoisted_8, [
          _createVNode(_component_ico, { n: "panel-left" }),
          _cache[4] || (_cache[4] = _createElementVNode("i", null, null, -1)),
          _cache[5] || (_cache[5] = _createTextVNode("工作空间 ")),
          _cache[6] || (_cache[6] = _createElementVNode("span", null, "›", -1)),
          _createElementVNode("b", null, _toDisplayString(page), 1)
        ]), _createElementVNode("div", _hoisted_9, [_createElementVNode("button", {
          class: "global-search",
          onClick: openSearch
        }, [_createVNode(_component_ico, { n: "search" }), _cache[7] || (_cache[7] = _createTextVNode("搜索文件 ")), _cache[8] || (_cache[8] = _createElementVNode("kbd", null, "Ctrl K", -1))], 8, _hoisted_10), _createElementVNode("button", {
          class: "iconbtn",
          title: "通知中心",
          "aria-label": "通知中心",
          onClick: $event => (notifications=!notifications)
        }, [_createVNode(_component_ico, { n: "bell" }), (alerts.length)
          ? (_openBlock(), _createElementBlock("em", _hoisted_12))
          : _createCommentVNode("", true)], 8, _hoisted_11), _createElementVNode("button", {
          class: "iconbtn",
          title: theme==='浅色'?'切换深色':'切换浅色',
          "aria-label": "切换主题",
          onClick: toggleTheme
        }, [_createVNode(_component_ico, { n: theme==='浅色'?'moon':'sun' }, null, 8, ["n"])], 8, _hoisted_13)])]),
        notifications
          ? (_openBlock(), _createElementBlock("div", _hoisted_14, [
              _createElementVNode("div", _hoisted_15, [_cache[9] || (_cache[9] = _createElementVNode("b", null, "通知中心", -1)), _createElementVNode("button", {
                class: "iconbtn",
                onClick: $event => (notifications=false),
                "aria-label": "关闭通知"
              }, [_createVNode(_component_ico, { n: "x" })], 8, _hoisted_16)]),
              (!alerts.length)
                ? (_openBlock(), _createElementBlock("p", _hoisted_17, "暂无运行异常"))
                : _createCommentVNode("", true),
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(alerts, (a) => {
                return (_openBlock(), _createElementBlock("button", {
                  class: "alert-link",
                  onClick: $event => (openAlert(a))
                }, [_createElementVNode("span", null, _toDisplayString(a.label), 1), _createVNode(_component_ico, { n: "chevron-right" })], 8, _hoisted_18))
              }), 256)),
              (s.recent.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_19, [_cache[10] || (_cache[10] = _createElementVNode("b", null, "最近文件活动", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.recent.slice(0,3), (e) => {
                    return (_openBlock(), _createElementBlock("button", {
                      class: "textbtn",
                      onClick: $event => {notifications=false;fromEvent(e)}
                    }, _toDisplayString(base(e.rel)) + " · " + _toDisplayString(e.kind), 9, _hoisted_20))
                  }), 256))]))
                : _createCommentVNode("", true)
            ]))
          : _createCommentVNode("", true),
        _createElementVNode("div", _hoisted_21, [summaryError
          ? (_openBlock(), _createElementBlock("section", _hoisted_22, [_createElementVNode("div", null, [_createElementVNode("strong", _hoisted_23, _toDisplayString(summaryError), 1), (s.stamp)
              ? (_openBlock(), _createElementBlock("small", _hoisted_24, "当前显示上次载入的数据。"))
              : _createCommentVNode("", true)]), _createElementVNode("button", {
              type: "button",
              class: "btn",
              onClick: $event => (refreshWorkspace())
            }, "重试连接", 8, _hoisted_25)]))
          : _createCommentVNode("", true), (page==='系统总览')
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _createElementVNode("section", _hoisted_26, [_cache[15] || (_cache[15] = _createElementVNode("div", { class: "contours" }, null, -1)), _createElementVNode("div", null, [_createElementVNode("div", _hoisted_27, [_cache[11] || (_cache[11] = _createElementVNode("span", { class: "dot" }, null, -1)), _createTextVNode(_toDisplayString(statusText), 1)]), _cache[14] || (_cache[14] = _createElementVNode("h1", null, "监控工作台", -1)), _createElementVNode("p", null, [
                _createTextVNode(_toDisplayString(demo?'示例工作区':'本地工作区'), 1),
                _cache[12] || (_cache[12] = _createElementVNode("i", null, "·", -1)),
                _createTextVNode(_toDisplayString(activeRoots) + " 个目录正在监控", 1),
                _cache[13] || (_cache[13] = _createElementVNode("i", null, "·", -1)),
                _createTextVNode(_toDisplayString(dateText), 1)
              ])]), _createElementVNode("button", {
                class: "hero-btn",
                disabled: demo&&!s.recent.some(r=>r.rel.endsWith('库存台账.xlsx')&&r.kind==='内容修改'),
                onClick: $event => (demo?fromEvent(s.recent.find(r=>r.rel.endsWith('库存台账.xlsx')&&r.kind==='内容修改')):rootDialog())
              }, [_createVNode(_component_ico, { n: demo?'folder':'plus' }, null, 8, ["n"]), _createTextVNode(_toDisplayString(demo?'体验整行对比':'添加目录'), 1)], 8, _hoisted_28)]),
              _createElementVNode("div", _hoisted_29, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(metrics, (m) => {
                return (_openBlock(), _createElementBlock("button", {
                  class: "stat",
                  onClick: $event => (metricGo(m))
                }, [_createElementVNode("span", _hoisted_31, [_createTextVNode(_toDisplayString(m.label), 1), _createElementVNode("span", { class: _normalizeClass(["tile-icon", m.tone]) }, [_createVNode(_component_ico, { n: m.icon }, null, 8, ["n"])], 2)]), _createElementVNode("strong", null, _toDisplayString(num(m.value)), 1), _createElementVNode("small", null, _toDisplayString(m.hint), 1)], 8, _hoisted_30))
              }), 256))]),
              _createElementVNode("div", _hoisted_32, [_createElementVNode("section", _hoisted_33, [_createElementVNode("div", _hoisted_34, [_cache[16] || (_cache[16] = _createElementVNode("h2", null, "文件变更趋势", -1)), _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": $event => ((days) = $event),
                onChange: refresh
              }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([7,14,30], (v) => {
                return (_openBlock(), _createElementBlock("option", { value: v }, "近 " + _toDisplayString(v) + " 天", 9, _hoisted_36))
              }), 256))], 40, _hoisted_35), [[
                _vModelSelect,
                days,
                void 0,
                { number: true }
              ]])]), _cache[18] || (_cache[18] = _createElementVNode("div", { class: "legend" }, [_createElementVNode("span", null, [_createElementVNode("b", { class: "bl" }), _createTextVNode("内容修改")]), _createElementVNode("span", null, [_createElementVNode("b", { class: "te" }), _createTextVNode("新增文件")]), _createElementVNode("span", null, [_createElementVNode("b", { class: "sl" }), _createTextVNode("其他变更")])], -1)), (s.trend.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_37, [(_openBlock(), _createElementBlock("svg", _hoisted_38, [
                    _cache[17] || (_cache[17] = _createElementVNode("defs", null, [_createElementVNode("linearGradient", {
                      id: "fill",
                      x1: "0",
                      x2: "0",
                      y1: "0",
                      y2: "1"
                    }, [_createElementVNode("stop", {
                      "stop-color": "#537dce",
                      "stop-opacity": ".17"
                    }), _createElementVNode("stop", {
                      offset: "1",
                      "stop-color": "#537dce",
                      "stop-opacity": "0"
                    })])], -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList([0,1,2,3], (j) => {
                      return (_openBlock(), _createElementBlock("g", null, [_createElementVNode("line", {
                        x1: "34",
                        x2: "624",
                        y1: 15+j*34,
                        y2: 15+j*34,
                        class: "grid"
                      }, null, 8, _hoisted_39), _createElementVNode("text", {
                        x: "24",
                        y: 19+j*34,
                        "text-anchor": "end"
                      }, _toDisplayString(ceil*(3-j)/3), 9, _hoisted_40)]))
                    }), 256)),
                    _createElementVNode("path", {
                      d: area,
                      fill: "url(#fill)"
                    }, null, 8, _hoisted_41),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['edited','added','other'], (k, i) => {
                      return (_openBlock(), _createElementBlock("polyline", {
                        points: points(k),
                        fill: "none",
                        stroke: ['#426fbd','#36a99a','#99a9bf'][i],
                        "stroke-width": i===0?3:2,
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                      }, null, 8, _hoisted_42))
                    }), 256)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.trend, (d, i) => {
                      return (_openBlock(), _createElementBlock("g", null, [(xlabel(i))
                        ? (_openBlock(), _createElementBlock("text", {
                            key: 0,
                            x: px(i),
                            y: "141",
                            "text-anchor": "middle"
                          }, _toDisplayString(d.day.slice(5).replace('-','/')), 9, _hoisted_43))
                        : _createCommentVNode("", true), _createElementVNode("rect", {
                        x: px(i)-8,
                        y: "4",
                        width: "16",
                        height: "116",
                        fill: "transparent"
                      }, [_createElementVNode("title", null, _toDisplayString(d.day) + "　修改 " + _toDisplayString(d.edited) + "　新增 " + _toDisplayString(d.added) + "　其他 " + _toDisplayString(d.other), 1)], 8, _hoisted_44)]))
                    }), 256))
                  ]))]))
                : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_45, [_cache[20] || (_cache[20] = _createElementVNode("div", { class: "card-head" }, [_createElementVNode("h2", null, "文件类型分布"), _createElementVNode("span", { class: "quiet" }, "按文件数")], -1)), _createElementVNode("div", _hoisted_46, [_createElementVNode("div", {
                class: "donut",
                style: _normalizeStyle({background:donut})
              }, [_createElementVNode("div", null, [_createElementVNode("strong", null, _toDisplayString(num(s.files)), 1), _cache[19] || (_cache[19] = _createElementVNode("small", null, "文件总数", -1))])], 4), _createElementVNode("div", _hoisted_47, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.groups, (g, i) => {
                return (_openBlock(), _createElementBlock("div", null, [_createElementVNode("span", null, [_createElementVNode("b", { style: _normalizeStyle({background:palette[i%5]}) }, null, 4), _createTextVNode(_toDisplayString(g[0]), 1)]), _createElementVNode("strong", null, _toDisplayString(num(g[1])), 1)]))
              }), 256)), (!s.groups.length)
                ? (_openBlock(), _createElementBlock("span", _hoisted_48, "尚无已监控文件"))
                : _createCommentVNode("", true)])])])]),
              _createElementVNode("div", _hoisted_49, [_createElementVNode("section", _hoisted_50, [_createElementVNode("div", _hoisted_51, [_cache[22] || (_cache[22] = _createElementVNode("h2", null, "最近变更", -1)), _createElementVNode("button", {
                class: "textbtn",
                onClick: $event => (go('变更记录'))
              }, [_cache[21] || (_cache[21] = _createTextVNode("全部记录 ")), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_52)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.recent, (e) => {
                return (_openBlock(), _createElementBlock("div", {
                  class: "activity",
                  onClick: $event => (fromEvent(e)),
                  tabindex: "0",
                  onKeydown: _withKeys($event => (fromEvent(e)), ["enter"])
                }, [
                  _createElementVNode("div", { class: _normalizeClass(["file-icon", tone(e.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(e.ext) }, null, 8, ["n"])], 2),
                  _createElementVNode("div", _hoisted_54, [_createElementVNode("b", null, _toDisplayString(base(e.rel)), 1), _createElementVNode("small", null, _toDisplayString(parent(e.root,e.rel)), 1)]),
                  _createElementVNode("span", { class: _normalizeClass(["tag", kindTone(e.kind)]) }, _toDisplayString(e.kind), 3),
                  _createElementVNode("time", null, _toDisplayString(shortTime(e.stamp)), 1)
                ], 40, _hoisted_53))
              }), 256)), (!s.recent.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_55, [_createVNode(_component_ico, { n: "history" }), _cache[23] || (_cache[23] = _createElementVNode("b", null, "暂无变更记录", -1)), _cache[24] || (_cache[24] = _createElementVNode("small", null, "添加目录后，这里将显示最近的文件活动。", -1))]))
                : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_56, [_createElementVNode("div", _hoisted_57, [_cache[26] || (_cache[26] = _createElementVNode("h2", null, "监控目录", -1)), _createElementVNode("button", {
                class: "textbtn",
                onClick: $event => (go('目录监控'))
              }, [_cache[25] || (_cache[25] = _createTextVNode("管理 ")), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_58)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots.slice(0,4), (r) => {
                return (_openBlock(), _createElementBlock("div", _hoisted_59, [_createElementVNode("div", _hoisted_60, [_createVNode(_component_ico, { n: "folder" })]), _createElementVNode("div", null, [_createElementVNode("b", null, _toDisplayString(base(r.path)), 1), _createElementVNode("small", null, _toDisplayString(num(r.total)) + " 个文件", 1)]), _createElementVNode("span", { class: _normalizeClass(["light-state", {warn:!!r.error,off:!r.active}]) }, [_cache[27] || (_cache[27] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(rstate(r)), 1)], 2)]))
              }), 256)), (!s.roots.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_61, [_createVNode(_component_ico, { n: "folder-plus" }), _cache[28] || (_cache[28] = _createElementVNode("b", null, "还没有监控目录", -1)), _createElementVNode("button", {
                    class: "textbtn",
                    onClick: $event => (rootDialog())
                  }, "添加第一个目录", 8, _hoisted_62)]))
                : _createCommentVNode("", true)])])
            ], 64))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _createElementVNode("div", _hoisted_63, [_createElementVNode("div", null, [_createElementVNode("h1", null, _toDisplayString(page), 1), _createElementVNode("p", null, _toDisplayString(descs[page]), 1)]), _createElementVNode("div", _hoisted_64, [
                (page==='目录监控')
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 0,
                      class: "btn",
                      disabled: !activeRoots,
                      onClick: $event => (scanRoots())
                    }, [_createVNode(_component_ico, { n: "refresh-cw" }), _createTextVNode(_toDisplayString(demo?'模拟扫描全部':'扫描全部'), 1)], 8, _hoisted_65))
                  : _createCommentVNode("", true),
                (page==='目录监控'&&!demo)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 1,
                      class: "primary",
                      onClick: $event => (rootDialog())
                    }, [_createVNode(_component_ico, { n: "plus" }), _cache[29] || (_cache[29] = _createTextVNode("添加目录"))], 8, _hoisted_66))
                  : _createCommentVNode("", true),
                (page==='变更记录')
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 2,
                      class: "btn",
                      onClick: $event => (reportDialog('period'))
                    }, "变更期间对照", 8, _hoisted_67))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 3,
                      class: "btn",
                      onClick: $event => (reportDialog('trace'))
                    }, "字段变动轨迹", 8, _hoisted_68))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 4,
                      class: "btn",
                      onClick: receiptDialog
                    }, "保存核对", 8, _hoisted_69))
                  : _createCommentVNode("", true),
                (ledgerEnabled&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 5,
                      class: "btn",
                      onClick: ledgerDialog
                    }, "台账对账", 8, _hoisted_70))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page)&&!textReturn)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 6,
                      class: "btn",
                      onClick: searchThisFile
                    }, "检索本文件正文", 8, _hoisted_71))
                  : _createCommentVNode("", true),
                (page==='版本对比'&&activeContentVersion)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 7,
                      class: "btn",
                      onClick: $event => (openSnapshot(activeContentVersion))
                    }, "预览新版原件", 8, _hoisted_72))
                  : _createCommentVNode("", true),
                (page==='版本对比'&&activeContentVersion)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 8,
                      class: "btn",
                      disabled: hasBundleVersion(activeContentVersion.id),
                      onClick: $event => (addBundleVersion(activeContentVersion))
                    }, _toDisplayString(hasBundleVersion(activeContentVersion.id)?'新版已在交付篮':'新版加入交付篮'), 9, _hoisted_73))
                  : _createCommentVNode("", true),
                (bundleRows.length&&['历史版本','版本对比','历史正文检索','复核工作台'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 9,
                      class: "btn",
                      onClick: $event => (go('历史版本交付篮'))
                    }, "打开交付篮（" + _toDisplayString(bundleRows.length) + "）", 9, _hoisted_74))
                  : _createCommentVNode("", true),
                (page==='版本对比'&&canTraceLines(activeContentVersion))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 10,
                      class: "btn",
                      onClick: $event => (openLineage(activeContentVersion))
                    }, "追溯新版逐行来源", 8, _hoisted_75))
                  : _createCommentVNode("", true),
                (lineageReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 11,
                      class: "btn",
                      onClick: $event => (go('逐行来源'))
                    }, "返回逐行来源", 8, _hoisted_76))
                  : _createCommentVNode("", true),
                (page==='版本对比'&&activeContentVersion&&!contentReturn)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 12,
                      class: "btn",
                      onClick: $event => (go('相同内容追溯',{sha:activeContentVersion.sha}))
                    }, "追溯新版正文", 8, _hoisted_77))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page)&&!pathReturn)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 13,
                      class: "btn",
                      onClick: $event => (openPath(file,'identity'))
                    }, "查看此身份沿革", 8, _hoisted_78))
                  : _createCommentVNode("", true),
                (triReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 14,
                      class: "btn",
                      onClick: $event => (go('清单三方对照'))
                    }, "返回三方对照", 8, _hoisted_79))
                  : _createCommentVNode("", true),
                (pathReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 15,
                      class: "btn",
                      onClick: $event => (go('路径沿革'))
                    }, "返回路径沿革", 8, _hoisted_80))
                  : _createCommentVNode("", true),
                (contentReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 16,
                      class: "btn",
                      onClick: $event => (go('相同内容追溯'))
                    }, "返回相同内容追溯", 8, _hoisted_81))
                  : _createCommentVNode("", true),
                (textReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 17,
                      class: "btn",
                      onClick: $event => (go('历史正文检索'))
                    }, "返回正文检索", 8, _hoisted_82))
                  : _createCommentVNode("", true),
                (reviewReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 18,
                      class: "btn",
                      onClick: $event => (go('复核工作台'))
                    }, "返回复核工作台", 8, _hoisted_83))
                  : _createCommentVNode("", true),
                (eventReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 19,
                      class: "btn",
                      onClick: returnToEvents
                    }, "返回变更记录", 8, _hoisted_84))
                  : _createCommentVNode("", true),
                (['变更记录','文件管理','审计中心'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 20,
                      class: "btn",
                      disabled: listLoading||!!rangeError||!list.total,
                      onClick: exportEvents
                    }, [_createVNode(_component_ico, { n: "download" }), _createTextVNode(_toDisplayString(listLoading?'正在筛选…':'导出记录（'+num(list.total)+' 条）'), 1)], 8, _hoisted_85))
                  : _createCommentVNode("", true)
              ])]),
              (page==='目录监控')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                    (!s.roots.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_86, [
                          _createVNode(_component_ico, { n: "folder-plus" }),
                          _cache[30] || (_cache[30] = _createElementVNode("b", null, "添加第一个业务目录", -1)),
                          _cache[31] || (_cache[31] = _createElementVNode("small", null, "首次扫描会为已有文件建立初始版本。", -1)),
                          _createElementVNode("button", {
                            class: "primary",
                            onClick: $event => (rootDialog())
                          }, "添加目录", 8, _hoisted_87)
                        ]))
                      : _createCommentVNode("", true),
                    (s.roots.length)
                      ? (_openBlock(), _createElementBlock("section", _hoisted_88, [
                          _createElementVNode("label", _hoisted_89, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((rootQuery) = $event),
                            placeholder: "搜索目录名称或完整路径",
                            "aria-label": "搜索监控目录"
                          }, null, 8, _hoisted_90), [[_vModelText, rootQuery]])]),
                          _withDirectives(_createElementVNode("select", {
                            "aria-label": "目录排序",
                            "onUpdate:modelValue": $event => ((rootOrder) = $event)
                          }, _cache[32] || (_cache[32] = [_createElementVNode("option", { value: "" }, "添加顺序", -1), _createElementVNode("option", { value: "count" }, "在册文件最多", -1)]), 8, _hoisted_91), [[_vModelSelect, rootOrder]]),
                          _createElementVNode("div", _hoisted_92, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(rootTabs, (tab) => {
                            return (_openBlock(), _createElementBlock("button", {
                              "aria-pressed": rootScope===tab.label,
                              onClick: $event => {rootScope=tab.label;rootFocus=null}
                            }, [_createTextVNode(_toDisplayString(tab.label) + " ", 1), _createElementVNode("b", null, _toDisplayString(tab.count), 1)], 8, _hoisted_93))
                          }), 256))]),
                          (rootFocus||rootQuery||rootScope!=='全部')
                            ? (_openBlock(), _createElementBlock("button", {
                                key: 0,
                                class: "textbtn",
                                onClick: clearRootFilter
                              }, "清除筛选", 8, _hoisted_94))
                            : _createCommentVNode("", true)
                        ]))
                      : _createCommentVNode("", true),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleRoots, (r) => {
                      return (_openBlock(), _createElementBlock("section", {
                        class: "card root-card",
                        key: r.id
                      }, [_createElementVNode("div", _hoisted_95, [_createVNode(_component_ico, { n: "folder" })]), _createElementVNode("div", _hoisted_96, [
                        _createElementVNode("h2", null, _toDisplayString(base(r.path)), 1),
                        _createElementVNode("p", _hoisted_97, _toDisplayString(r.path), 1),
                        _createElementVNode("small", null, _toDisplayString(num(r.total)) + " 个在册文件　·　" + _toDisplayString(r.watch_mode) + "　·　最近扫描 " + _toDisplayString(fmt(r.last_scan)), 1),
                        (r.active&&r.waiting)
                          ? (_openBlock(), _createElementBlock("details", _hoisted_98, [
                              _createElementVNode("summary", null, "等待保存或读取 · " + _toDisplayString(r.waiting) + " 项", 1),
                              _createElementVNode("p", null, "引擎已安排复查，重试间隔约 " + _toDisplayString(r.retry_delay) + " 秒。", 1),
                              _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.wait_samples, (entry) => {
                                return (_openBlock(), _createElementBlock("li", null, _toDisplayString(entry[0]) + " · " + _toDisplayString(entry[1]), 1))
                              }), 256))]),
                              (r.waiting>10)
                                ? (_openBlock(), _createElementBlock("small", _hoisted_99, "显示前 10 项"))
                                : _createCommentVNode("", true)
                            ]))
                          : _createCommentVNode("", true),
                        (r.skipped)
                          ? (_openBlock(), _createElementBlock("details", _hoisted_100, [_createElementVNode("summary", null, "上次完成扫描跳过 " + _toDisplayString(r.skipped) + " 项", 1), (r.skip_counts)
                              ? (_openBlock(), _createElementBlock("ul", _hoisted_101, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.skip_counts, (count, reason) => {
                                  return (_openBlock(), _createElementBlock("li", null, _toDisplayString(reason) + " · " + _toDisplayString(count) + " 项", 1))
                                }), 256))]))
                              : (_openBlock(), _createElementBlock("small", _hoisted_102, "下次扫描后可查看原因。"))]))
                          : _createCommentVNode("", true),
                        (r.error)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_103, _toDisplayString(r.error), 1))
                          : _createCommentVNode("", true)
                      ]), _createElementVNode("div", _hoisted_104, [_createElementVNode("span", { class: _normalizeClass(["light-state", {off:!r.active,warn:!!r.error}]) }, [_cache[33] || (_cache[33] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(rstate(r)), 1)], 2), (r.progress||r.queued_source)
                        ? (_openBlock(), _createElementBlock("small", _hoisted_105, _toDisplayString(r.progress || r.queued_source), 1))
                        : _createCommentVNode("", true), _createElementVNode("div", _hoisted_106, [
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (policyDialog(r))
                        }, "监听采集策略", 8, _hoisted_107),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (waitingDialog(r))
                        }, "等待队列", 8, _hoisted_108),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (scanJournal(r))
                        }, "扫描运行记录", 8, _hoisted_109),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (showRuleHistory(r))
                        }, "规则沿革", 8, _hoisted_110),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (treeFor(r))
                        }, "子目录", 8, _hoisted_111),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (rootFiles(r))
                        }, "查看文件", 8, _hoisted_112),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (openPath({root_id:r.id}))
                        }, "查目录路径沿革", 8, _hoisted_113),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (searchRootText(r))
                        }, "检索目录正文", 8, _hoisted_114),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (rootEvents(r))
                        }, "变更记录", 8, _hoisted_115),
                        _createElementVNode("button", {
                          class: "textbtn",
                          disabled: !r.active||!!r.progress||!!r.queued_source,
                          onClick: $event => (scanRoots(r))
                        }, _toDisplayString(demo?'模拟扫描':'扫描此目录'), 9, _hoisted_116),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              class: "textbtn",
                              onClick: $event => (rootDialog(r))
                            }, "配置", 8, _hoisted_117))
                          : _createCommentVNode("", true),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 1,
                              class: "textbtn",
                              onClick: $event => (actRoot(r,r.active?'暂停':'继续'))
                            }, _toDisplayString(r.active?'暂停':'继续'), 9, _hoisted_118))
                          : _createCommentVNode("", true),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 2,
                              class: "textbtn danger",
                              onClick: $event => (actRoot(r,'移除'))
                            }, "移除", 8, _hoisted_119))
                          : _createCommentVNode("", true)
                      ])])]))
                    }), 128)),
                    (s.roots.length&&!visibleRoots.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_120, [_cache[34] || (_cache[34] = _createElementVNode("b", null, "没有匹配的监控目录", -1)), _createElementVNode("button", {
                          class: "textbtn",
                          onClick: clearRootFilter
                        }, "显示全部目录", 8, _hoisted_121)]))
                      : _createCommentVNode("", true)
                  ], 64))
                : _createCommentVNode("", true),
              (['文件管理','变更记录','审计中心'].includes(page))
                ? (_openBlock(), _createElementBlock("section", _hoisted_122, [
                    (f.prefix)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_123, "目录范围：" + _toDisplayString(f.prefix), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_124, [
                      _createElementVNode("label", _hoisted_125, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                        "aria-label": "搜索记录",
                        "onUpdate:modelValue": $event => ((f.q) = $event),
                        placeholder: page==='审计中心'?'搜索操作名称或内容':page==='变更记录'?'搜索文件名、现路径或原路径':'搜索现名、旧名或相对路径',
                        onInput: searchLater
                      }, null, 40, _hoisted_126), [[_vModelText, f.q]])]),
                      (page!=='审计中心')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_withDirectives(_createElementVNode("select", {
                            "aria-label": "监控目录",
                            "onUpdate:modelValue": $event => ((f.root) = $event),
                            onChange: queryFirst
                          }, [_cache[35] || (_cache[35] = _createElementVNode("option", { value: "" }, "全部目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                            return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(base(r.path)), 9, _hoisted_128))
                          }), 256))], 40, _hoisted_127), [[_vModelSelect, f.root]]), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((f.ext) = $event),
                            class: "extbox",
                            "aria-label": "扩展名",
                            placeholder: "xlsx, pdf",
                            onInput: searchLater
                          }, null, 40, _hoisted_129), [[_vModelText, f.ext]])], 64))
                        : _createCommentVNode("", true),
                      (page==='文件管理')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 1,
                            "aria-label": "文件范围",
                            "onUpdate:modelValue": $event => ((f.scope) = $event),
                            onChange: queryFirst
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(fileScopes, (entry) => {
                            return (_openBlock(), _createElementBlock("option", { value: entry[0] }, _toDisplayString(entry[1]), 9, _hoisted_131))
                          }), 256))], 40, _hoisted_130)), [[_vModelSelect, f.scope]])
                        : _createCommentVNode("", true),
                      (page==='变更记录')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 2,
                            "onUpdate:modelValue": $event => ((f.kind) = $event),
                            onChange: queryFirst
                          }, [_cache[36] || (_cache[36] = _createElementVNode("option", { value: "" }, "全部变化", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(kinds, (k) => {
                            return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                          }), 256))], 40, _hoisted_132)), [[_vModelSelect, f.kind]])
                        : _createCommentVNode("", true),
                      (page==='审计中心')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 3,
                            "aria-label": "管理操作",
                            "onUpdate:modelValue": $event => ((f.action) = $event),
                            onChange: queryFirst
                          }, [_cache[37] || (_cache[37] = _createElementVNode("option", { value: "" }, "全部操作", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.actions, (action) => {
                            return (_openBlock(), _createElementBlock("option", { value: action }, _toDisplayString(action), 9, _hoisted_134))
                          }), 256))], 40, _hoisted_133)), [[_vModelSelect, f.action]])
                        : _createCommentVNode("", true),
                      (Object.values(f).some(Boolean))
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 4,
                            class: "textbtn",
                            onClick: clearFilter
                          }, "重置", 8, _hoisted_135))
                        : _createCommentVNode("", true)
                    ]),
                    _createElementVNode("details", _hoisted_136, [_cache[57] || (_cache[57] = _createElementVNode("summary", null, "更多筛选与排序", -1)), _createElementVNode("div", _hoisted_137, [
                      _createElementVNode("label", null, [_cache[43] || (_cache[43] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((f.sort) = $event),
                        onChange: queryFirst
                      }, [_cache[41] || (_cache[41] = _createElementVNode("option", { value: "" }, "最近优先", -1)), _cache[42] || (_cache[42] = _createElementVNode("option", { value: "oldest" }, "最早优先", -1)), (page==='文件管理')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_cache[38] || (_cache[38] = _createElementVNode("option", { value: "size" }, "大小降序", -1)), _cache[39] || (_cache[39] = _createElementVNode("option", { value: "versions" }, "版本最多", -1)), _cache[40] || (_cache[40] = _createElementVNode("option", { value: "name" }, "路径升序", -1))], 64))
                        : _createCommentVNode("", true)], 40, _hoisted_138), [[_vModelSelect, f.sort]])]),
                      (page!=='审计中心')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[45] || (_cache[45] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((f.status) = $event),
                            onChange: queryFirst
                          }, [_cache[44] || (_cache[44] = _createElementVNode("option", { value: "" }, "全部状态", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (v) => {
                            return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                          }), 256))], 40, _hoisted_139), [[_vModelSelect, f.status]])]), _createElementVNode("label", null, [_cache[46] || (_cache[46] = _createTextVNode("SHA-256 前缀")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((f.sha) = $event),
                            maxlength: "64",
                            onInput: searchLater,
                            placeholder: "例如 43af"
                          }, null, 40, _hoisted_140), [[_vModelText, f.sha]])])], 64))
                        : _createCommentVNode("", true),
                      (page==='文件管理')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.starred) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_141), [[_vModelCheckbox, f.starred]]), _cache[47] || (_cache[47] = _createTextVNode("仅关注文件"))]),
                            _createElementVNode("label", null, [_cache[48] || (_cache[48] = _createTextVNode("最小字节数")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.min_bytes) = $event),
                              type: "number",
                              min: "0",
                              onInput: searchLater
                            }, null, 40, _hoisted_142), [[_vModelText, f.min_bytes]])]),
                            _createElementVNode("label", null, [_cache[49] || (_cache[49] = _createTextVNode("最大字节数")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.max_bytes) = $event),
                              type: "number",
                              min: "0",
                              onInput: searchLater
                            }, null, 40, _hoisted_143), [[_vModelText, f.max_bytes]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.multiple) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_144), [[_vModelCheckbox, f.multiple]]), _cache[50] || (_cache[50] = _createTextVNode("仅多版本文件"))])
                          ], 64))
                        : _createCommentVNode("", true),
                      (page==='变更记录')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createElementVNode("button", {
                              class: "btn",
                              onClick: privateDialog
                            }, "管理已移出记录", 8, _hoisted_145),
                            _createElementVNode("label", null, [_cache[51] || (_cache[51] = _createTextVNode("事件编号")), _withDirectives(_createElementVNode("input", {
                              type: "number",
                              min: "1",
                              "onUpdate:modelValue": $event => ((f.event_id) = $event),
                              onInput: searchLater
                            }, null, 40, _hoisted_146), [[_vModelText, f.event_id]])]),
                            _createElementVNode("label", null, [_cache[52] || (_cache[52] = _createTextVNode("公开更正说明")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.caption) = $event),
                              onInput: searchLater
                            }, null, 40, _hoisted_147), [[_vModelText, f.caption]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.amended) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_148), [[_vModelCheckbox, f.amended]]), _cache[53] || (_cache[53] = _createTextVNode("仅已处置"))]),
                            _createElementVNode("label", null, [_cache[55] || (_cache[55] = _createTextVNode("记录来源")), _withDirectives(_createElementVNode("select", {
                              "onUpdate:modelValue": $event => ((f.source) = $event),
                              onChange: queryFirst
                            }, [_cache[54] || (_cache[54] = _createElementVNode("option", { value: "" }, "全部来源", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.sources, (v) => {
                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                            }), 256))], 40, _hoisted_149), [[_vModelSelect, f.source]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.with_diff) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_150), [[_vModelCheckbox, f.with_diff]]), _cache[56] || (_cache[56] = _createTextVNode("仅有内容差异"))])
                          ], 64))
                        : _createCommentVNode("", true)
                    ])]),
                    (['文件管理','变更记录','审计中心'].includes(page))
                      ? (_openBlock(), _createElementBlock("div", _hoisted_151, [_createElementVNode("label", _hoisted_152, [_cache[58] || (_cache[58] = _createTextVNode("从 ")), _withDirectives(_createElementVNode("input", {
                          "aria-label": "开始日期",
                          type: "date",
                          "onUpdate:modelValue": $event => ((f.start) = $event),
                          max: f.end||undefined,
                          onChange: queryFirst
                        }, null, 40, _hoisted_153), [[_vModelText, f.start]])]), _createElementVNode("label", _hoisted_154, [_cache[59] || (_cache[59] = _createTextVNode("至 ")), _withDirectives(_createElementVNode("input", {
                          "aria-label": "结束日期",
                          type: "date",
                          "onUpdate:modelValue": $event => ((f.end) = $event),
                          min: f.start||undefined,
                          onChange: queryFirst
                        }, null, 40, _hoisted_155), [[_vModelText, f.end]])]), (page==='变更记录')
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("button", {
                              class: "range-preset",
                              onClick: $event => (recentDays(1))
                            }, "今天", 8, _hoisted_156), _createElementVNode("button", {
                              class: "range-preset",
                              onClick: $event => (recentDays(7))
                            }, "近七天", 8, _hoisted_157), _createElementVNode("label", _hoisted_158, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.activity) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_159), [[_vModelCheckbox, f.activity]]), _cache[60] || (_cache[60] = _createTextVNode("隐藏初始建档"))])], 64))
                          : _createCommentVNode("", true)]))
                      : _createCommentVNode("", true),
                    rangeError
                      ? (_openBlock(), _createElementBlock("p", _hoisted_160, _toDisplayString(rangeError), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_161, [(page==='文件管理')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_162, [_cache[61] || (_cache[61] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "文件名称"),
                          _createElementVNode("th", null, "所属目录"),
                          _createElementVNode("th", null, "大小"),
                          _createElementVNode("th", null, "最近版本"),
                          _createElementVNode("th", null, "最近变化"),
                          _createElementVNode("th")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [
                            _createElementVNode("td", null, [_createElementVNode("div", _hoisted_163, [_createElementVNode("span", { class: _normalizeClass(["file-icon", tone(x.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(x.ext) }, null, 8, ["n"])], 2), _createElementVNode("div", _hoisted_164, [_createElementVNode("strong", null, _toDisplayString(base(x.rel)), 1), (x.matched_path)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_165, "原路径：" + _toDisplayString(x.matched_path), 1))
                              : _createCommentVNode("", true), _createElementVNode("span", { class: _normalizeClass(["tag", stateTone(x.file_state)]) }, _toDisplayString(x.file_state), 3)])])]),
                            _createElementVNode("td", _hoisted_166, _toDisplayString(parent(x.root,x.rel)), 1),
                            _createElementVNode("td", null, _toDisplayString(bytes(x.size)), 1),
                            _createElementVNode("td", null, "V" + _toDisplayString(x.version), 1),
                            _createElementVNode("td", null, _toDisplayString(fmt(x.updated)), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              "aria-pressed": !!x.starred,
                              onClick: $event => (toggleStar(x))
                            }, _toDisplayString(x.starred?'取消关注':'关注'), 9, _hoisted_167), _createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (selectFile(x))
                            }, "历史版本", 8, _hoisted_168), (native&&x.live&&!x.root_removed)
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  class: "textbtn",
                                  onClick: $event => (perform('open_dir',{id:x.id}))
                                }, "打开位置", 8, _hoisted_169))
                              : _createCommentVNode("", true)])
                          ]))
                        }), 256))])]))
                      : _createCommentVNode("", true), (page==='变更记录')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_170, [_cache[62] || (_cache[62] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "文件与位置"),
                          _createElementVNode("th", null, "变更类型"),
                          _createElementVNode("th", null, "版本"),
                          _createElementVNode("th", null, "记录时间"),
                          _createElementVNode("th", null, "解析状态"),
                          _createElementVNode("th")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [
                            _createElementVNode("td", null, [_createElementVNode("strong", null, _toDisplayString(base(x.rel)), 1), _createElementVNode("small", null, _toDisplayString(parent(x.root,x.rel)), 1), (x.old_rel)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_171, "原路径：" + _toDisplayString(x.old_rel), 1))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass(["tag", kindTone(x.kind)]) }, _toDisplayString(x.kind), 3), (x.caption)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_172, "更正：" + _toDisplayString(x.caption), 1))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("td", null, _toDisplayString(x.prior?'V'+x.prior:'—') + " → " + _toDisplayString(x.version?'V'+x.version:'—'), 1),
                            _createElementVNode("td", null, _toDisplayString(fmt(x.stamp)), 1),
                            _createElementVNode("td", null, _toDisplayString(x.status||'已记录'), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              disabled: listLoading||x.kind==='已撤回',
                              onClick: $event => (fromEvent(x))
                            }, "查看详情", 8, _hoisted_173), (x.file_id)
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  class: "textbtn",
                                  onClick: $event => (openPath(x))
                                }, "追溯此路径", 8, _hoisted_174))
                              : _createCommentVNode("", true), _createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (recordDialog(x))
                            }, "管理记录", 8, _hoisted_175)])
                          ]))
                        }), 256))])]))
                      : _createCommentVNode("", true), (page==='审计中心')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_176, [_cache[63] || (_cache[63] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [_createElementVNode("th", null, "时间"), _createElementVNode("th", null, "管理操作"), _createElementVNode("th", null, "操作内容")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [_createElementVNode("td", null, _toDisplayString(fmt(x.stamp)), 1), _createElementVNode("td", null, _toDisplayString(x.action), 1), _createElementVNode("td", _hoisted_177, _toDisplayString(x.note), 1)]))
                        }), 256))])]))
                      : _createCommentVNode("", true)]),
                    (!list.items.length&&!listLoading&&!rangeError)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_178, [_createVNode(_component_ico, { n: "search" }), _cache[64] || (_cache[64] = _createElementVNode("b", null, "没有符合条件的记录", -1))]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_179, [_createElementVNode("span", null, [_createTextVNode("共 " + _toDisplayString(num(list.total)) + " 条　", 1), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((listSize) = $event),
                      "aria-label": "记录每页条数",
                      onChange: queryFirst
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50,100], (v) => {
                      return (_openBlock(), _createElementBlock("option", { value: v }, "每页 " + _toDisplayString(v) + " 条", 9, _hoisted_181))
                    }), 256))], 40, _hoisted_180), [[
                      _vModelSelect,
                      listSize,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("div", null, [_createElementVNode("button", {
                      class: "btn",
                      disabled: p<=1,
                      onClick: $event => {p--;loadList()}
                    }, "上一页", 8, _hoisted_182), _createTextVNode(" " + _toDisplayString(p) + " / " + _toDisplayString(Math.max(1,Math.ceil(list.total/list.size))) + " ", 1), _createElementVNode("button", {
                      class: "btn",
                      disabled: p*list.size>=list.total,
                      onClick: $event => {p++;loadList()}
                    }, "下一页", 8, _hoisted_183)])])
                  ]))
                : _createCommentVNode("", true),
              (['历史版本','版本对比'].includes(page))
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_createElementVNode("div", _hoisted_184, [_createElementVNode("div", _hoisted_185, [_createVNode(_component_ico, { n: "files" })]), _createElementVNode("div", _hoisted_186, [_createElementVNode("b", null, _toDisplayString(file?base(file.rel):'选择需要追溯的文件'), 1), _createElementVNode("small", null, _toDisplayString(file?parent(file.root,file.rel):'可以查找已删除文件的历史记录'), 1), (file&&file.file_state)
                    ? (_openBlock(), _createElementBlock("span", {
                        key: 0,
                        class: _normalizeClass(["tag", stateTone(file.file_state)])
                      }, _toDisplayString(file.file_state), 3))
                    : _createCommentVNode("", true)]), _createElementVNode("button", {
                    class: "btn",
                    onClick: fileDialog
                  }, "选择文件", 8, _hoisted_187)]), (file&&versions.length)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", _hoisted_188, [_createElementVNode("h2", null, _toDisplayString(page==='历史版本'?'版本时间线':'版本选择'), 1), _createElementVNode("button", {
                        class: "textbtn",
                        onClick: $event => (navVersion(page==='历史版本'?'版本对比':'历史版本'))
                      }, [_createTextVNode(_toDisplayString(page==='历史版本'?'比较版本':'查看时间线') + " ", 1), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_189)]), (page==='历史版本')
                        ? (_openBlock(), _createElementBlock("section", _hoisted_190, [
                            _createElementVNode("div", _hoisted_191, [
                              _createElementVNode("label", null, [_cache[66] || (_cache[66] = _createTextVNode("复核结论")), _withDirectives(_createElementVNode("select", {
                                "onUpdate:modelValue": $event => ((historyReview) = $event),
                                onChange: $event => (versionPage=1)
                              }, [_cache[65] || (_cache[65] = _createElementVNode("option", { value: "" }, "全部结论", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewStates, (v) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                              }), 256))], 40, _hoisted_192), [[_vModelSelect, historyReview]])]),
                              _createElementVNode("label", null, [_cache[67] || (_cache[67] = _createTextVNode("版本号或摘要")), _withDirectives(_createElementVNode("input", {
                                "onUpdate:modelValue": $event => ((versionQuery) = $event),
                                onInput: $event => (versionPage=1),
                                placeholder: "V2 或至少 6 位摘要",
                                "aria-label": "查找版本号"
                              }, null, 40, _hoisted_193), [[_vModelText, versionQuery]])]),
                              _createElementVNode("label", null, [_cache[68] || (_cache[68] = _createTextVNode("保存日期")), _withDirectives(_createElementVNode("input", {
                                type: "date",
                                "onUpdate:modelValue": $event => ((versionDay) = $event),
                                onChange: $event => (versionPage=1),
                                "aria-label": "版本保存日期"
                              }, null, 40, _hoisted_194), [[_vModelText, versionDay]])]),
                              _createElementVNode("label", null, [_cache[70] || (_cache[70] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                                "onUpdate:modelValue": $event => ((versionStatus) = $event),
                                onChange: $event => (versionPage=1)
                              }, [_cache[69] || (_cache[69] = _createElementVNode("option", { value: "" }, "全部状态", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (v) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                              }), 256))], 40, _hoisted_195), [[_vModelSelect, versionStatus]])]),
                              (versionQuery||versionDay||versionStatus||historyReview)
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 0,
                                    class: "textbtn",
                                    onClick: resetVersions
                                  }, "清除条件", 8, _hoisted_196))
                                : _createCommentVNode("", true),
                              _createElementVNode("small", null, "共 " + _toDisplayString(matchedVersions.length) + " 个版本", 1)
                            ]),
                            (!visibleVersions.length)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_197, _cache[71] || (_cache[71] = [_createElementVNode("b", null, "没有符合条件的版本", -1), _createElementVNode("small", null, "可清除条件查看完整时间线。", -1)])))
                              : _createCommentVNode("", true),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleVersions, (v) => {
                              return (_openBlock(), _createElementBlock("div", {
                                class: "version",
                                key: v.id
                              }, [_cache[72] || (_cache[72] = _createElementVNode("span", { class: "node" }, null, -1)), _createElementVNode("div", _hoisted_198, [
                                _createElementVNode("h3", null, [_createTextVNode("V" + _toDisplayString(v.num) + " ", 1), _createElementVNode("span", _hoisted_199, _toDisplayString(v.status), 1)]),
                                _createElementVNode("p", null, [_createTextVNode(_toDisplayString(fmt(v.stamp)) + "　·　" + _toDisplayString(bytes(v.size)), 1), (v.delta!=null)
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode("　·　" + _toDisplayString(v.delta>=0?'+':'−') + _toDisplayString(bytes(Math.abs(v.delta))), 1)], 64))
                                  : _createCommentVNode("", true), (v.status==='已解析')
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createTextVNode("　·　" + _toDisplayString(v.changes) + " 项差异", 1)], 64))
                                  : _createCommentVNode("", true)]),
                                (v.note)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_200, _toDisplayString(v.note), 1))
                                  : _createCommentVNode("", true),
                                _createElementVNode("small", _hoisted_201, "SHA-256　" + _toDisplayString(v.sha), 1),
                                (v.error)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_202, _toDisplayString(v.error), 1))
                                  : _createCommentVNode("", true)
                              ]), _createElementVNode("div", _hoisted_203, [
                                (canTraceLines(v))
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 0,
                                      class: "textbtn",
                                      onClick: $event => (openLineage(v))
                                    }, "逐行来源", 8, _hoisted_204))
                                  : _createCommentVNode("", true),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (openSnapshot(v))
                                }, "预览原件", 8, _hoisted_205),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  disabled: hasBundleVersion(v.id),
                                  onClick: $event => (addBundleVersion(v))
                                }, _toDisplayString(hasBundleVersion(v.id)?'已在交付篮':'加入交付篮'), 9, _hoisted_206),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (go('相同内容追溯',{sha:v.sha}))
                                }, "追溯相同内容", 8, _hoisted_207),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (editReview(v))
                                }, _toDisplayString(v.review||'待复核') + " · 登记", 9, _hoisted_208),
                                (v.num>2)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 1,
                                      class: "textbtn",
                                      onClick: $event => (pair(versions[versions.length-1].id,v.id))
                                    }, "与首版比较", 8, _hoisted_209))
                                  : _createCommentVNode("", true),
                                (v.id!==versions[0].id)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 2,
                                      class: "textbtn",
                                      onClick: $event => (pair(v.id,versions[0].id))
                                    }, "与最新版比较", 8, _hoisted_210))
                                  : _createCommentVNode("", true),
                                (v.parent_id)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 3,
                                      class: "textbtn",
                                      onClick: $event => (pair(v.parent_id,v.id))
                                    }, "比较", 8, _hoisted_211))
                                  : _createCommentVNode("", true),
                                (!demo)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 4,
                                      class: "textbtn",
                                      onClick: $event => (saveFile('copy',base(file.rel),v.id))
                                    }, "另存", 8, _hoisted_212))
                                  : _createCommentVNode("", true),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (restoreDialog(v))
                                }, _toDisplayString(demo?'恢复预览':'恢复'), 9, _hoisted_213)
                              ])]))
                            }), 128)),
                            (versionPages>1)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_214, [_createElementVNode("span", null, "第 " + _toDisplayString(versionPage) + " / " + _toDisplayString(versionPages) + " 页", 1), _createElementVNode("div", null, [_createElementVNode("button", {
                                  class: "btn",
                                  disabled: versionPage<=1,
                                  onClick: $event => (versionPage--)
                                }, "上一页", 8, _hoisted_215), _cache[73] || (_cache[73] = _createTextVNode()), _createElementVNode("button", {
                                  class: "btn",
                                  disabled: versionPage>=versionPages,
                                  onClick: $event => (versionPage++)
                                }, "下一页", 8, _hoisted_216)])]))
                              : _createCommentVNode("", true)
                          ]))
                        : (_openBlock(), _createElementBlock("section", _hoisted_217, [_createElementVNode("div", _hoisted_218, [_createElementVNode("label", null, [_cache[74] || (_cache[74] = _createTextVNode("旧版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((left) = $event),
                            onChange: changePair
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions, (v) => {
                            return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + "　" + _toDisplayString(fmt(v.stamp)), 9, _hoisted_220))
                          }), 256))], 40, _hoisted_219), [[
                            _vModelSelect,
                            left,
                            void 0,
                            { number: true }
                          ]])]), _createElementVNode("button", {
                            class: "btn swap-pair",
                            disabled: left===right||diffLoading,
                            onClick: swapPair
                          }, "交换版本", 8, _hoisted_221), _createElementVNode("label", null, [_cache[75] || (_cache[75] = _createTextVNode("新版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((right) = $event),
                            onChange: changePair
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions, (v) => {
                            return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + "　" + _toDisplayString(fmt(v.stamp)), 9, _hoisted_223))
                          }), 256))], 40, _hoisted_222), [[
                            _vModelSelect,
                            right,
                            void 0,
                            { number: true }
                          ]])])]), (left!==right&&diff)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                (diff.is_source)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_224, [_createElementVNode("div", _hoisted_225, [_createElementVNode("button", {
                                      "aria-pressed": diffMode==='aligned',
                                      onClick: $event => (setDiffMode('aligned'))
                                    }, "按结构比较", 8, _hoisted_226), _createElementVNode("button", {
                                      "aria-pressed": diffMode==='coordinate',
                                      onClick: $event => (setDiffMode('coordinate'))
                                    }, "按原文逐行比较", 8, _hoisted_227)])]))
                                  : _createCommentVNode("", true),
                                (diff.is_excel||diff.is_word||diff.is_tabular)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_228, [_createElementVNode("div", _hoisted_229, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([['aligned',diff.is_word?'按段落内容对齐':'按编号对齐'],['coordinate',diff.is_word?'按原始位置':'按原始坐标']], (m) => {
                                      return (_openBlock(), _createElementBlock("button", {
                                        "aria-pressed": diffMode===m[0],
                                        onClick: $event => (setDiffMode(m[0]))
                                      }, _toDisplayString(m[1]), 9, _hoisted_230))
                                    }), 256))]), (diff.is_word)
                                      ? (_openBlock(), _createElementBlock("small", _hoisted_231, _toDisplayString(diffMode==='aligned'?'按文档区域核对段落，突出显示修改文字':'逐个段号和表格位置核对'), 1))
                                      : (diffMode==='aligned' && Object.keys(diff.aligned).length)
                                        ? (_openBlock(), _createElementBlock("small", _hoisted_232, "按 " + _toDisplayString(Object.entries(diff.aligned).filter(([name])=>!sheet || sheet===name).map(([name,key])=>name+' · '+key).join('、') || '单元格坐标') + " 核对", 1))
                                        : (_openBlock(), _createElementBlock("small", _hoisted_233, "按单元格坐标核对"))]))
                                  : _createCommentVNode("", true),
                                (diff.is_excel||diff.is_tabular)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 2,
                                      class: "btn",
                                      onClick: varianceDialog
                                    }, "数值差异核对", 8, _hoisted_234))
                                  : _createCommentVNode("", true),
                                (formatView[0]!=='detail')
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_235, [_createElementVNode("button", {
                                      "aria-pressed": displayMode==='auto',
                                      onClick: $event => {displayMode='auto';changePair()}
                                    }, _toDisplayString(formatView[1]), 9, _hoisted_236), _createElementVNode("button", {
                                      "aria-pressed": displayMode==='detail',
                                      onClick: $event => (displayMode='detail')
                                    }, _toDisplayString(diff.is_excel?'单元格与属性明细':'明细表') + " · " + _toDisplayString(diff.is_excel?'筛选与导出':'并排查看'), 9, _hoisted_237)]))
                                  : _createCommentVNode("", true),
                                (presentation==='grid')
                                  ? (_openBlock(), _createElementBlock("section", _hoisted_238, [
                                      grid
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_239, [
                                            _createElementVNode("label", null, [_cache[76] || (_cache[76] = _createTextVNode("工作表 ")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((gridSheet) = $event),
                                              onChange: $event => {gridPage=1;gridCol=1;loadGrid()}
                                            }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.sheets, (g) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(g), 1))
                                            }), 256))], 40, _hoisted_240), [[_vModelSelect, gridSheet]])]),
                                            _createElementVNode("span", null, _toDisplayString(grid.key?'按「'+grid.key+'」配对':'按原始行号配对'), 1),
                                            _createElementVNode("label", null, [_cache[78] || (_cache[78] = _createTextVNode("整行筛选")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((gridFilter) = $event),
                                              onChange: $event => {gridPage=1;loadGrid()}
                                            }, [_cache[77] || (_cache[77] = _createElementVNode("option", { value: "" }, "全部行", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增行','删除行','修改行','调序行','内容','批注','格式','超链接'], (v) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                                            }), 256))], 40, _hoisted_241), [[_vModelSelect, gridFilter]])]),
                                            (grid.row_filter)
                                              ? (_openBlock(), _createElementBlock("span", _hoisted_242, "匹配 " + _toDisplayString(grid.matches) + " 行", 1))
                                              : _createCommentVNode("", true),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              disabled: !!gridFilter,
                                              "onUpdate:modelValue": $event => ((expandRows) = $event),
                                              onChange: $event => {gridPage=1;loadGrid()}
                                            }, null, 40, _hoisted_243), [[_vModelCheckbox, expandRows]]), _cache[79] || (_cache[79] = _createTextVNode("显示未变行"))])
                                          ]))
                                        : _createCommentVNode("", true),
                                      grid
                                        ? (_openBlock(), _createElementBlock("details", _hoisted_244, [_cache[89] || (_cache[89] = _createElementVNode("summary", null, "从整张工作表查找单元格", -1)), _createElementVNode("div", _hoisted_245, [
                                            _createElementVNode("label", null, [_cache[80] || (_cache[80] = _createTextVNode("单元格内容")), _withDirectives(_createElementVNode("input", {
                                              "onUpdate:modelValue": $event => ((cellSearch.q) = $event),
                                              maxlength: "512",
                                              onKeyup: _withKeys($event => (searchCells()), ["enter"])
                                            }, null, 40, _hoisted_246), [[_vModelText, cellSearch.q]])]),
                                            _createElementVNode("label", null, [_cache[82] || (_cache[82] = _createTextVNode("工作表一侧")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((cellSearch.side) = $event) }, _cache[81] || (_cache[81] = [_createElementVNode("option", { value: "" }, "两侧", -1), _createElementVNode("option", { value: "old" }, "旧表", -1), _createElementVNode("option", { value: "new" }, "新表", -1)]), 8, _hoisted_247), [[_vModelSelect, cellSearch.side]])]),
                                            _createElementVNode("label", null, [_cache[83] || (_cache[83] = _createTextVNode("字段名")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((cellSearch.field) = $event) }, null, 8, _hoisted_248), [[_vModelText, cellSearch.field]])]),
                                            _createElementVNode("label", null, [_cache[85] || (_cache[85] = _createTextVNode("数据类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((cellSearch.type) = $event) }, [_cache[84] || (_cache[84] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['文本','数字','公式','日期时间','布尔值','错误值'], (t) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(t), 1))
                                            }), 256))], 8, _hoisted_249), [[_vModelSelect, cellSearch.type]])]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.changed) = $event)
                                            }, null, 8, _hoisted_250), [[_vModelCheckbox, cellSearch.changed]]), _cache[86] || (_cache[86] = _createTextVNode("仅发生变化的单元格"))]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.exact) = $event)
                                            }, null, 8, _hoisted_251), [[_vModelCheckbox, cellSearch.exact]]), _cache[87] || (_cache[87] = _createTextVNode("整格匹配"))]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.sensitive) = $event)
                                            }, null, 8, _hoisted_252), [[_vModelCheckbox, cellSearch.sensitive]]), _cache[88] || (_cache[88] = _createTextVNode("区分大小写"))]),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: !cellSearch.q.trim()||cellBusy,
                                              onClick: $event => (searchCells())
                                            }, "查找单元格", 8, _hoisted_253)
                                          ]), (cellHits&&cellSig===JSON.stringify(cellOptions()))
                                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                                (!cellHits.items.length)
                                                  ? (_openBlock(), _createElementBlock("p", _hoisted_254, "没有匹配的单元格。"))
                                                  : _createCommentVNode("", true),
                                                _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cellHits.items, (h) => {
                                                  return (_openBlock(), _createElementBlock("li", null, [_createElementVNode("button", {
                                                    class: "textbtn",
                                                    onClick: $event => (jumpCell(h))
                                                  }, _toDisplayString(h.side==='old'?'旧表':'新表') + " " + _toDisplayString(h.address), 9, _hoisted_255), _createTextVNode(" · " + _toDisplayString(h.field) + " · " + _toDisplayString(h.value), 1)]))
                                                }), 256))]),
                                                _createElementVNode("button", {
                                                  class: "btn",
                                                  disabled: !cellHits.offset,
                                                  onClick: $event => (searchCells(cellHits.offset-20))
                                                }, "上一批", 8, _hoisted_256),
                                                _createElementVNode("button", {
                                                  class: "btn",
                                                  disabled: !cellHits.more,
                                                  onClick: $event => (searchCells(cellHits.offset+20))
                                                }, "下一批", 8, _hoisted_257)
                                              ], 64))
                                            : _createCommentVNode("", true)]))
                                        : _createCommentVNode("", true),
                                      grid
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_258, [_createElementVNode("div", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.summary, (n, label) => {
                                            return (_openBlock(), _createElementBlock("span", null, [_createTextVNode(_toDisplayString(label) + " ", 1), _createElementVNode("b", null, _toDisplayString(n), 1)]))
                                          }), 256))]), _createElementVNode("div", null, [_withDirectives(_createElementVNode("select", {
                                            "onUpdate:modelValue": $event => ((gridLocate) = $event),
                                            "aria-label": "整行定位方式"
                                          }, [_cache[90] || (_cache[90] = _createElementVNode("option", { value: "new" }, "新表地址", -1)), _cache[91] || (_cache[91] = _createElementVNode("option", { value: "old" }, "旧表地址", -1)), (grid.key)
                                            ? (_openBlock(), _createElementBlock("option", _hoisted_260, "业务编号"))
                                            : _createCommentVNode("", true)], 8, _hoisted_259), [[_vModelSelect, gridLocate]]), _withDirectives(_createElementVNode("input", {
                                            "onUpdate:modelValue": $event => ((gridTarget) = $event),
                                            placeholder: gridLocate==='key'?'输入完整编号':'例如 C24 或 24',
                                            onKeyup: _withKeys($event => (loadGrid(true)), ["enter"])
                                          }, null, 40, _hoisted_261), [[_vModelText, gridTarget]]), _createElementVNode("button", {
                                            class: "btn",
                                            disabled: !gridTarget.trim(),
                                            onClick: $event => (loadGrid(true))
                                          }, "定位", 8, _hoisted_262)])]))
                                        : _createCommentVNode("", true),
                                      (grid&&gridError)
                                        ? (_openBlock(), _createElementBlock("p", _hoisted_263, _toDisplayString(gridError), 1))
                                        : _createCommentVNode("", true),
                                      (!grid)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_264, _toDisplayString(gridError||diff.error||'正在读取工作表…'), 1))
                                        : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [_createElementVNode("div", _hoisted_265, [_createElementVNode("table", _hoisted_266, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                            _cache[92] || (_cache[92] = _createElementVNode("th", null, "旧行", -1)),
                                            _cache[93] || (_cache[93] = _createElementVNode("th", null, "新行", -1)),
                                            _cache[94] || (_cache[94] = _createElementVNode("th", null, "修订", -1)),
                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.columns, (c) => {
                                              return (_openBlock(), _createElementBlock("th", null, [_createTextVNode(_toDisplayString(c.title), 1), _createElementVNode("small", null, _toDisplayString(c.old||'—') + " → " + _toDisplayString(c.new||'—'), 1)]))
                                            }), 256))
                                          ])]), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.rows, (line) => {
                                            return (_openBlock(), _createElementBlock("tr", { class: _normalizeClass({'row-add':line.kind==='新增','row-del':line.kind==='删除','row-gap':line.kind==='gap','row-target':line.target}) }, [(line.kind==='gap')
                                              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("td", null, _toDisplayString(line.old), 1), _createElementVNode("td", null, _toDisplayString(line.new), 1), _createElementVNode("td", { colspan: 1+grid.columns.length }, [_createElementVNode("button", { onClick: $event => {expandRows=true;gridPage=line.expand_page;loadGrid()} }, "展开 " + _toDisplayString(line.count) + " 个未变行", 9, _hoisted_268)], 8, _hoisted_267)], 64))
                                              : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                                  _createElementVNode("td", null, _toDisplayString(line.old||''), 1),
                                                  _createElementVNode("td", null, _toDisplayString(line.new||''), 1),
                                                  _createElementVNode("td", null, [_createTextVNode(_toDisplayString(line.kind==='新增'?'＋':line.kind==='删除'?'−':'·'), 1), (line.moved)
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_269, "调序"))
                                                    : _createCommentVNode("", true)]),
                                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(line.cells, (cell) => {
                                                    return (_openBlock(), _createElementBlock("td", { class: _normalizeClass({'cell-changed':!!cell.note}) }, [_createElementVNode("span", null, _toDisplayString(cell.value??'—'), 1), (cell.note)
                                                      ? (_openBlock(), _createElementBlock("small", _hoisted_270, [_createTextVNode(_toDisplayString(cell.address) + " · " + _toDisplayString(cell.note), 1), (cell.type)
                                                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · " + _toDisplayString(cell.type), 1)], 64))
                                                          : _createCommentVNode("", true)]))
                                                      : _createCommentVNode("", true), (cell.detail)
                                                      ? (_openBlock(), _createElementBlock("details", _hoisted_271, [_cache[95] || (_cache[95] = _createElementVNode("summary", null, "具体变化", -1)), _createElementVNode("small", null, _toDisplayString(cell.detail), 1)]))
                                                      : _createCommentVNode("", true)], 2))
                                                  }), 256))
                                                ], 64))], 2))
                                          }), 256))])])]), _createElementVNode("div", _hoisted_272, [_createElementVNode("span", null, "整行视图 · " + _toDisplayString(grid.page) + " / " + _toDisplayString(grid.pages) + " 页 · 列组 " + _toDisplayString(grid.col_page) + " / " + _toDisplayString(grid.col_pages), 1), _createElementVNode("div", null, [
                                            (grid.col_pages>1)
                                              ? (_openBlock(), _createElementBlock("button", {
                                                  key: 0,
                                                  class: "btn",
                                                  disabled: gridCol===1,
                                                  onClick: $event => {gridCol--;loadGrid()}
                                                }, "上一组列", 8, _hoisted_273))
                                              : _createCommentVNode("", true),
                                            _cache[96] || (_cache[96] = _createTextVNode()),
                                            (grid.col_pages>1)
                                              ? (_openBlock(), _createElementBlock("button", {
                                                  key: 1,
                                                  class: "btn",
                                                  disabled: gridCol===grid.col_pages,
                                                  onClick: $event => {gridCol++;loadGrid()}
                                                }, "下一组列", 8, _hoisted_274))
                                              : _createCommentVNode("", true),
                                            _cache[97] || (_cache[97] = _createTextVNode()),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: gridPage===1,
                                              onClick: $event => {gridPage--;loadGrid()}
                                            }, "上一页", 8, _hoisted_275),
                                            _cache[98] || (_cache[98] = _createTextVNode()),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: gridPage===grid.pages,
                                              onClick: $event => {gridPage++;loadGrid()}
                                            }, "下一页", 8, _hoisted_276)
                                          ])])], 64)),
                                      _createElementVNode("button", {
                                        class: "textbtn",
                                        onClick: $event => (displayMode='detail')
                                      }, "查看单元格、打印设置及其他属性差异（" + _toDisplayString(diff.total) + " 项）", 9, _hoisted_277)
                                    ]))
                                  : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
                                      _createElementVNode("div", _hoisted_278, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (k) => {
                                        return (_openBlock(), _createElementBlock("button", {
                                          class: _normalizeClass(["kind-chip", kindTone(k)]),
                                          "aria-pressed": diffKind===k,
                                          onClick: $event => (filterDiff(k))
                                        }, [_createTextVNode(_toDisplayString(k) + " ", 1), _createElementVNode("b", null, _toDisplayString(diff.counts[k]), 1)], 10, _hoisted_279))
                                      }), 256)), diffKind
                                        ? (_openBlock(), _createElementBlock("button", {
                                            key: 0,
                                            class: "textbtn",
                                            onClick: $event => (filterDiff(diffKind))
                                          }, "显示全部", 8, _hoisted_280))
                                        : _createCommentVNode("", true), _createElementVNode("span", _hoisted_281, _toDisplayString(diff.status), 1)]),
                                      _createElementVNode("div", _hoisted_282, [
                                        _withDirectives(_createElementVNode("select", {
                                          "onUpdate:modelValue": $event => ((sheet) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, [_cache[99] || (_cache[99] = _createElementVNode("option", { value: "" }, "全部位置分组", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.sheets, (g) => {
                                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(g), 1))
                                        }), 256))], 40, _hoisted_283), [[_vModelSelect, sheet]]),
                                        (diff.is_excel||diff.is_tabular)
                                          ? _withDirectives((_openBlock(), _createElementBlock("select", {
                                              key: 0,
                                              "aria-label": "差异类别",
                                              "onUpdate:modelValue": $event => ((diffCategory) = $event),
                                              onChange: $event => {dp=1;loadDiff()}
                                            }, [_cache[100] || (_cache[100] = _createElementVNode("option", { value: "" }, "全部差异类别", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.categories, (c) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(c), 1))
                                            }), 256))], 40, _hoisted_284)), [[_vModelSelect, diffCategory]])
                                          : _createCommentVNode("", true),
                                        _createElementVNode("label", _hoisted_285, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                                          "onUpdate:modelValue": $event => ((loc) = $event),
                                          placeholder: diff.is_excel?'搜索字段、位置、编号或值':'搜索位置、旧值或新值',
                                          onInput: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_286), [[_vModelText, loc]])]),
                                        diffFiltered
                                          ? (_openBlock(), _createElementBlock("button", {
                                              key: 1,
                                              class: "textbtn",
                                              onClick: changePair
                                            }, "清除筛选", 8, _hoisted_287))
                                          : _createCommentVNode("", true),
                                        _createElementVNode("button", {
                                          class: "btn export-diff",
                                          disabled: diffLoading||!diff.total,
                                          onClick: exportDifference
                                        }, [_createVNode(_component_ico, { n: "download" }), _createTextVNode("导出筛选结果（" + _toDisplayString(diff.total) + " 项）", 1)], 8, _hoisted_288)
                                      ]),
                                      _createElementVNode("details", _hoisted_289, [_cache[108] || (_cache[108] = _createElementVNode("summary", null, "精确查找与匹配范围", -1)), _createElementVNode("div", _hoisted_290, [
                                        _createElementVNode("label", null, [_cache[102] || (_cache[102] = _createTextVNode("搜索范围")), _withDirectives(_createElementVNode("select", {
                                          "onUpdate:modelValue": $event => ((searchIn) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, _cache[101] || (_cache[101] = [
                                          _createElementVNode("option", { value: "" }, "全部内容", -1),
                                          _createElementVNode("option", { value: "old" }, "仅旧值", -1),
                                          _createElementVNode("option", { value: "new" }, "仅新值", -1),
                                          _createElementVNode("option", { value: "location" }, "仅位置", -1)
                                        ]), 40, _hoisted_291), [[_vModelSelect, searchIn]])]),
                                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                          type: "checkbox",
                                          "onUpdate:modelValue": $event => ((caseSensitive) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_292), [[_vModelCheckbox, caseSensitive]]), _cache[103] || (_cache[103] = _createTextVNode("区分大小写"))]),
                                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                          type: "checkbox",
                                          "onUpdate:modelValue": $event => ((exact) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_293), [[_vModelCheckbox, exact]]), _cache[104] || (_cache[104] = _createTextVNode("完全匹配"))]),
                                        (diff.is_excel||diff.is_tabular)
                                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[106] || (_cache[106] = _createTextVNode("业务字段")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((diffField) = $event),
                                              onChange: $event => {dp=1;loadDiff()}
                                            }, [_cache[105] || (_cache[105] = _createElementVNode("option", { value: "" }, "全部字段", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.fields, (v) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                                            }), 256))], 40, _hoisted_294), [[_vModelSelect, diffField]])]), _createElementVNode("label", null, [_cache[107] || (_cache[107] = _createTextVNode("完整记录编号")), _withDirectives(_createElementVNode("input", {
                                              "onUpdate:modelValue": $event => ((recordId) = $event),
                                              onInput: $event => {dp=1;loadDiff()}
                                            }, null, 40, _hoisted_295), [[_vModelText, recordId]])])], 64))
                                          : _createCommentVNode("", true)
                                      ])]),
                                      (['records','paths','assets'].includes(presentation))
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_296, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupedChanges, ([group,items]) => {
                                            return (_openBlock(), _createElementBlock("section", _hoisted_297, [_createElementVNode("h3", null, _toDisplayString(group), 1), _createElementVNode("div", _hoisted_298, [_createElementVNode("table", _hoisted_299, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                              _createElementVNode("th", null, _toDisplayString(presentation==='records'?'列':presentation==='paths'?'字段路径':'条目'), 1),
                                              _cache[109] || (_cache[109] = _createElementVNode("th", null, "旧版本", -1)),
                                              _cache[110] || (_cache[110] = _createElementVNode("th", null, "新版本", -1)),
                                              _cache[111] || (_cache[111] = _createElementVNode("th", null, "变化", -1))
                                            ])]), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (d) => {
                                              return (_openBlock(), _createElementBlock("tr", null, [
                                                _createElementVNode("td", null, _toDisplayString(presentation==='records'?d.location.split(' · ').pop():d.location), 1),
                                                _createElementVNode("td", _hoisted_300, _toDisplayString(d.old??'—'), 1),
                                                _createElementVNode("td", _hoisted_301, _toDisplayString(d.new??'—'), 1),
                                                _createElementVNode("td", null, _toDisplayString(d.kind), 1)
                                              ]))
                                            }), 256))])])])]))
                                          }), 256))]))
                                        : (presentation!=='detail')
                                          ? (_openBlock(), _createElementBlock("div", _hoisted_302, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupedChanges, ([group,items]) => {
                                              return (_openBlock(), _createElementBlock("section", _hoisted_303, [_createElementVNode("h3", null, _toDisplayString(group), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (d) => {
                                                return (_openBlock(), _createElementBlock("article", null, [_createElementVNode("h4", null, _toDisplayString(d.location) + " · " + _toDisplayString(d.kind), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['old','new'].filter(k=>d[k]!=null), (side) => {
                                                  return (_openBlock(), _createElementBlock("div", { class: _normalizeClass([side==='old'?'row-del':'row-add', "revision-line"]) }, [_createElementVNode("b", null, _toDisplayString(side==='old'?'−':'＋'), 1), _createElementVNode("span", null, [(d[side+'_parts'])
                                                    ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(d[side+'_parts'], (part) => {
                                                        return (_openBlock(), _createElementBlock("span", { class: _normalizeClass({'fragment-change':part[1]}) }, _toDisplayString(part[0]), 3))
                                                      }), 256))
                                                    : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createTextVNode(_toDisplayString(d[side]), 1)], 64))])], 2))
                                                }), 256))]))
                                              }), 256))]))
                                            }), 256))]))
                                          : (_openBlock(), _createElementBlock("div", _hoisted_304, [_createElementVNode("table", _hoisted_305, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                              _cache[112] || (_cache[112] = _createElementVNode("th", null, "位置", -1)),
                                              _createElementVNode("th", null, "旧值 · V" + _toDisplayString(diff.old_number), 1),
                                              _createElementVNode("th", null, "新值 · V" + _toDisplayString(diff.new_number), 1),
                                              _cache[113] || (_cache[113] = _createElementVNode("th", null, "变化", -1))
                                            ])]), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.items, (d) => {
                                              return (_openBlock(), _createElementBlock("tr", null, [
                                                _createElementVNode("td", null, [
                                                  _createElementVNode("small", null, _toDisplayString(d.sheet), 1),
                                                  _createElementVNode("b", null, _toDisplayString(d.location), 1),
                                                  (d.category)
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_306, [_createTextVNode(_toDisplayString(d.category), 1), (d.field)
                                                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · " + _toDisplayString(d.field), 1)], 64))
                                                        : _createCommentVNode("", true)]))
                                                    : _createCommentVNode("", true),
                                                  (d.record_key)
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_307, _toDisplayString(d.record_key), 1))
                                                    : _createCommentVNode("", true)
                                                ]),
                                                _createElementVNode("td", _hoisted_308, [(d.old_type&&d.new_type&&d.old_type!==d.new_type)
                                                  ? (_openBlock(), _createElementBlock("small", _hoisted_309, _toDisplayString(d.old_type), 1))
                                                  : _createCommentVNode("", true), (d.old_parts)
                                                  ? (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(d.old_parts, (part, index) => {
                                                      return (_openBlock(), _createElementBlock("span", {
                                                        key: index,
                                                        class: _normalizeClass({'text-change':part[1]})
                                                      }, _toDisplayString(part[0]), 3))
                                                    }), 128))
                                                  : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_createTextVNode(_toDisplayString(d.old===null?'—':d.old), 1)], 64))]),
                                                _createElementVNode("td", _hoisted_310, [(d.old_type&&d.new_type&&d.old_type!==d.new_type)
                                                  ? (_openBlock(), _createElementBlock("small", _hoisted_311, _toDisplayString(d.new_type), 1))
                                                  : _createCommentVNode("", true), (d.new_parts)
                                                  ? (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(d.new_parts, (part, index) => {
                                                      return (_openBlock(), _createElementBlock("span", {
                                                        key: index,
                                                        class: _normalizeClass({'text-change':part[1]})
                                                      }, _toDisplayString(part[0]), 3))
                                                    }), 128))
                                                  : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_createTextVNode(_toDisplayString(d.new===null?'—':d.new), 1)], 64))]),
                                                _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass(["tag", kindTone(d.kind)]) }, _toDisplayString(d.kind), 3)])
                                              ]))
                                            }), 256))])])])),
                                      (!diff.items.length)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_312, [_createElementVNode("b", null, _toDisplayString(diff.error||(diffFiltered?'当前筛选没有匹配项':'两个版本没有可列出的结构化差异')), 1), _cache[114] || (_cache[114] = _createElementVNode("small", null, "可在下方核对版本属性。", -1))]))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_313, [_createElementVNode("span", null, [_createTextVNode("共 " + _toDisplayString(diff.total) + " 项　", 1), _withDirectives(_createElementVNode("select", {
                                        "aria-label": "差异每页条数",
                                        "onUpdate:modelValue": $event => ((diffSize) = $event),
                                        onChange: $event => {dp=1;loadDiff()}
                                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([20,40,80,100], (n) => {
                                        return (_openBlock(), _createElementBlock("option", { value: n }, "每页 " + _toDisplayString(n) + " 项", 9, _hoisted_315))
                                      }), 256))], 40, _hoisted_314), [[
                                        _vModelSelect,
                                        diffSize,
                                        void 0,
                                        { number: true }
                                      ]])]), _createElementVNode("div", null, [_createElementVNode("button", {
                                        class: "btn",
                                        disabled: dp===1,
                                        onClick: $event => {dp--;loadDiff()}
                                      }, "上一页", 8, _hoisted_316), _createTextVNode(" " + _toDisplayString(dp) + " ", 1), _createElementVNode("button", {
                                        class: "btn",
                                        disabled: dp*diff.size>=diff.total,
                                        onClick: $event => {dp++;loadDiff()}
                                      }, "下一页", 8, _hoisted_317)])])
                                    ], 64)),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (editReview(versions.find(v=>v.id===right)))
                                }, "登记新侧版本 V" + _toDisplayString(diff.new_number) + " 的复核结论", 9, _hoisted_318),
                                _createElementVNode("details", null, [_cache[115] || (_cache[115] = _createElementVNode("summary", null, "文件大小与 SHA-256", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions.filter(v=>v.id===left||v.id===right), (v) => {
                                  return (_openBlock(), _createElementBlock("p", _hoisted_319, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(bytes(v.size)) + " · " + _toDisplayString(v.sha), 1))
                                }), 256))])
                              ], 64))
                            : (_openBlock(), _createElementBlock("p", _hoisted_320, _toDisplayString(diffLoading?'正在比较版本…':left===right?'请选择两个不同的历史版本进行对比。':'暂时无法显示对比结果。'), 1))]))], 64))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='复核工作台')
                ? (_openBlock(), _createElementBlock("section", _hoisted_321, [
                    _createElementVNode("div", _hoisted_322, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['',...reviewStates], (state) => {
                      return (_openBlock(), _createElementBlock("button", {
                        "aria-pressed": reviewFilter.state===state,
                        onClick: $event => {reviewFilter.state=state;loadReview(true)}
                      }, [_createTextVNode(_toDisplayString(state||'全部') + " ", 1), _createElementVNode("b", null, _toDisplayString(state?reviews.counts[state]||0:Object.values(reviews.counts).reduce((a,b)=>a+b,0)), 1)], 8, _hoisted_323))
                    }), 256))]),
                    _createElementVNode("div", _hoisted_324, [
                      _withDirectives(_createElementVNode("input", {
                        "onUpdate:modelValue": $event => ((reviewFilter.q) = $event),
                        "aria-label": "搜索复核记录",
                        onInput: scheduleReview,
                        onKeyup: _withKeys($event => (loadReview(true)), ["enter"]),
                        placeholder: "文件名、复核备注或失败原因"
                      }, null, 40, _hoisted_325), [[_vModelText, reviewFilter.q]]),
                      _createElementVNode("button", {
                        class: "btn",
                        onClick: $event => (loadReview(true))
                      }, "查询", 8, _hoisted_326),
                      _createElementVNode("button", {
                        class: "btn",
                        onClick: $event => {reviewFilter=freshReviewForm();loadReview(true)}
                      }, "清除条件", 8, _hoisted_327),
                      _createElementVNode("button", {
                        class: "btn",
                        disabled: reviewBusy||!reviews.total,
                        onClick: exportReviews
                      }, "导出复核清单", 8, _hoisted_328)
                    ]),
                    _createElementVNode("details", _hoisted_329, [_cache[128] || (_cache[128] = _createElementVNode("summary", null, "复核范围与排序", -1)), _createElementVNode("div", _hoisted_330, [
                      _createElementVNode("label", null, [_cache[117] || (_cache[117] = _createTextVNode("目录")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.root) = $event),
                        onChange: $event => (loadReview(true))
                      }, [_cache[116] || (_cache[116] = _createElementVNode("option", { value: "" }, "全部目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                        return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(base(r.path)), 9, _hoisted_332))
                      }), 256))], 40, _hoisted_331), [[_vModelSelect, reviewFilter.root]])]),
                      _createElementVNode("label", null, [_cache[118] || (_cache[118] = _createTextVNode("文件类型")), _withDirectives(_createElementVNode("input", {
                        "onUpdate:modelValue": $event => ((reviewFilter.ext) = $event),
                        onChange: $event => (loadReview(true)),
                        placeholder: "例如 xlsx"
                      }, null, 40, _hoisted_333), [[_vModelText, reviewFilter.ext]])]),
                      _createElementVNode("label", null, [_cache[120] || (_cache[120] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.status) = $event),
                        onChange: $event => (loadReview(true))
                      }, [_cache[119] || (_cache[119] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (n) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(n), 1))
                      }), 256))], 40, _hoisted_334), [[_vModelSelect, reviewFilter.status]])]),
                      _createElementVNode("label", null, [_cache[121] || (_cache[121] = _createTextVNode("起始日")), _withDirectives(_createElementVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": $event => ((reviewFilter.start) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_335), [[_vModelText, reviewFilter.start]])]),
                      _createElementVNode("label", null, [_cache[122] || (_cache[122] = _createTextVNode("结束日")), _withDirectives(_createElementVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": $event => ((reviewFilter.end) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_336), [[_vModelText, reviewFilter.end]])]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.baseline) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_337), [[_vModelCheckbox, reviewFilter.baseline]]), _cache[123] || (_cache[123] = _createTextVNode("包含初始快照"))]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.latest) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_338), [[_vModelCheckbox, reviewFilter.latest]]), _cache[124] || (_cache[124] = _createTextVNode("仅文件最新版"))]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.starred) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_339), [[_vModelCheckbox, reviewFilter.starred]]), _cache[125] || (_cache[125] = _createTextVNode("仅关注文件"))]),
                      _createElementVNode("label", null, [_cache[127] || (_cache[127] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.sort) = $event),
                        onChange: $event => (loadReview(true))
                      }, _cache[126] || (_cache[126] = [
                        _createElementVNode("option", { value: "" }, "最近保存", -1),
                        _createElementVNode("option", { value: "oldest" }, "最早保存", -1),
                        _createElementVNode("option", { value: "changes" }, "差异最多", -1),
                        _createElementVNode("option", { value: "reviewed" }, "最近复核", -1)
                      ]), 40, _hoisted_340), [[_vModelSelect, reviewFilter.sort]])])
                    ])]),
                    _createElementVNode("div", _hoisted_341, [
                      _createElementVNode("span", _hoisted_342, "已选 " + _toDisplayString(reviewSelected.length) + " / 100", 1),
                      _createElementVNode("button", {
                        class: "btn",
                        disabled: reviewBusy||!reviews.items.some(v=>!reviewIsSelected(v.id)),
                        onClick: selectReviewRows
                      }, "选择本页", 8, _hoisted_343),
                      _createElementVNode("button", {
                        class: "btn",
                        disabled: reviewBusy||!reviews.items.some(v=>reviewIsSelected(v.id)),
                        onClick: clearReviewPage
                      }, "取消本页", 8, _hoisted_344),
                      _createElementVNode("button", {
                        class: "textbtn",
                        disabled: !reviewSelected.length,
                        onClick: $event => (reviewSelected=[])
                      }, "清空选择", 8, _hoisted_345),
                      _createElementVNode("button", {
                        class: "primary",
                        disabled: !reviewSelected.length,
                        onClick: openReviewBatch
                      }, "批量复核", 8, _hoisted_346)
                    ]),
                    _createElementVNode("div", _hoisted_347, [_createElementVNode("table", null, [_cache[129] || (_cache[129] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                      _createElementVNode("th", null, "选择"),
                      _createElementVNode("th", null, "文件与版本"),
                      _createElementVNode("th", null, "保存时间"),
                      _createElementVNode("th", null, "解析结果"),
                      _createElementVNode("th", null, "复核结论"),
                      _createElementVNode("th", null, "操作")
                    ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviews.items, (v) => {
                      return (_openBlock(), _createElementBlock("tr", { key: v.id }, [
                        _createElementVNode("td", null, [_createElementVNode("input", {
                          type: "checkbox",
                          "aria-label": '选择 '+v.rel+' V'+v.num,
                          checked: reviewIsSelected(v.id),
                          disabled: reviewBusy||(!reviewIsSelected(v.id)&&reviewSelected.length===100),
                          onChange: $event => (toggleReviewSelection(v))
                        }, null, 40, _hoisted_348)]),
                        _createElementVNode("td", null, [_createElementVNode("b", null, _toDisplayString(base(v.rel)) + " · V" + _toDisplayString(v.num), 1), _createElementVNode("small", null, _toDisplayString(parent(v.root,v.rel)), 1)]),
                        _createElementVNode("td", null, _toDisplayString(fmt(v.stamp)), 1),
                        _createElementVNode("td", null, [_createTextVNode(_toDisplayString(v.status), 1), (v.status==='已解析')
                          ? (_openBlock(), _createElementBlock("small", _hoisted_349, _toDisplayString(v.changes) + " 项差异", 1))
                          : _createCommentVNode("", true), (v.error)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_350, _toDisplayString(v.error), 1))
                          : _createCommentVNode("", true)]),
                        _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass(["tag", v.review==='已复核'?'green':v.review==='需跟进'?'amber':'neutral']) }, _toDisplayString(v.review), 3), _createElementVNode("small", _hoisted_351, _toDisplayString(v.note), 1), (v.reviewed_at)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_352, _toDisplayString(fmt(v.reviewed_at)), 1))
                          : _createCommentVNode("", true)]),
                        _createElementVNode("td", null, [
                          _createElementVNode("button", {
                            class: "textbtn",
                            onClick: $event => (openReviewVersion(v))
                          }, _toDisplayString(v.parent_id?'查看差异':'查看初版'), 9, _hoisted_353),
                          _createElementVNode("button", {
                            class: "textbtn",
                            onClick: $event => (editReview(v))
                          }, "登记复核", 8, _hoisted_354),
                          _createElementVNode("button", {
                            class: "textbtn",
                            disabled: hasBundleVersion(v.id),
                            onClick: $event => (addBundleVersion(v))
                          }, "加入交付篮", 8, _hoisted_355),
                          (!demo&&v.status==='解析失败')
                            ? (_openBlock(), _createElementBlock("button", {
                                key: 0,
                                class: "textbtn",
                                onClick: $event => (perform('retry',{id:v.id}).then(()=>loadReview()))
                              }, "重试此版本", 8, _hoisted_356))
                            : _createCommentVNode("", true)
                        ])
                      ]))
                    }), 128))])])]),
                    (!reviews.items.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_357, _toDisplayString(reviewBusy?'正在读取…':'当前范围没有复核记录'), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_358, [_createElementVNode("span", null, [_createTextVNode("共 " + _toDisplayString(reviews.total) + " 个版本 · ", 1), _withDirectives(_createElementVNode("select", {
                      "aria-label": "每页复核版本",
                      "onUpdate:modelValue": $event => ((reviewFilter.size) = $event),
                      onChange: $event => (loadReview(true))
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50,100], (n) => {
                      return (_openBlock(), _createElementBlock("option", {
                        value: n,
                        key: n
                      }, "每页 " + _toDisplayString(n) + " 项", 9, _hoisted_360))
                    }), 128))], 40, _hoisted_359), [[
                      _vModelSelect,
                      reviewFilter.size,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("div", null, [_createElementVNode("button", {
                      class: "btn",
                      disabled: reviewBusy||reviews.page<=1,
                      onClick: $event => {reviewFilter.page--;loadReview()}
                    }, "上一页", 8, _hoisted_361), _createTextVNode(" " + _toDisplayString(reviews.page) + " / " + _toDisplayString(reviews.pages) + " ", 1), _createElementVNode("button", {
                      class: "btn",
                      disabled: reviewBusy||reviews.page>=reviews.pages,
                      onClick: $event => {reviewFilter.page++;loadReview()}
                    }, "下一页", 8, _hoisted_362)])])
                  ]))
                : _createCommentVNode("", true),
              (page==='差异检索')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("section", _hoisted_363, [_createElementVNode("form", { onSubmit: _withModifiers($event => (findChanges()), ["prevent"]) }, [_createElementVNode("div", _hoisted_365, [
                    _createElementVNode("label", null, [_cache[130] || (_cache[130] = _createTextVNode("检索内容")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.q) = $event),
                      maxlength: "512",
                      placeholder: "例如物料编号、库存或旧值"
                    }, null, 8, _hoisted_366), [[_vModelText, findForm.q]])]),
                    _createElementVNode("label", null, [_cache[132] || (_cache[132] = _createTextVNode("查找范围")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.side) = $event) }, _cache[131] || (_cache[131] = [
                      _createElementVNode("option", { value: "" }, "全部位置与值", -1),
                      _createElementVNode("option", { value: "old_value" }, "仅旧值", -1),
                      _createElementVNode("option", { value: "new_value" }, "仅新值", -1),
                      _createElementVNode("option", { value: "location" }, "仅位置", -1)
                    ]), 8, _hoisted_367), [[_vModelSelect, findForm.side]])]),
                    _createElementVNode("label", null, [_cache[134] || (_cache[134] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.root) = $event) }, [_cache[133] || (_cache[133] = _createElementVNode("option", { value: "" }, "所有目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_369))
                    }), 256))], 8, _hoisted_368), [[_vModelSelect, findForm.root]])]),
                    _createElementVNode("label", null, [_cache[135] || (_cache[135] = _createTextVNode("事件路径")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.filename) = $event),
                      placeholder: "文件名或路径片段"
                    }, null, 8, _hoisted_370), [[_vModelText, findForm.filename]])]),
                    _createElementVNode("label", null, [_cache[136] || (_cache[136] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.ext) = $event),
                      placeholder: "xlsx, csv"
                    }, null, 8, _hoisted_371), [[_vModelText, findForm.ext]])]),
                    _createElementVNode("label", null, [_cache[138] || (_cache[138] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.kind) = $event) }, [_cache[137] || (_cache[137] = _createElementVNode("option", { value: "" }, "全部类型", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (k) => {
                      return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                    }), 256))], 8, _hoisted_372), [[_vModelSelect, findForm.kind]])]),
                    _createElementVNode("label", null, [_cache[140] || (_cache[140] = _createTextVNode("数值方向")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.direction) = $event) }, _cache[139] || (_cache[139] = [
                      _createElementVNode("option", { value: "" }, "全部", -1),
                      _createElementVNode("option", { value: "up" }, "数值上升", -1),
                      _createElementVNode("option", { value: "down" }, "数值下降", -1),
                      _createElementVNode("option", { value: "same" }, "数值等值", -1)
                    ]), 8, _hoisted_373), [[_vModelSelect, findForm.direction]])])
                  ]), _createElementVNode("details", null, [_cache[149] || (_cache[149] = _createElementVNode("summary", null, "更多查询条件", -1)), _createElementVNode("div", _hoisted_374, [
                    _createElementVNode("label", null, [_cache[141] || (_cache[141] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.sheet) = $event) }, null, 8, _hoisted_375), [[_vModelText, findForm.sheet]])]),
                    _createElementVNode("label", null, [_cache[142] || (_cache[142] = _createTextVNode("字段名")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.field) = $event) }, null, 8, _hoisted_376), [[_vModelText, findForm.field]])]),
                    _createElementVNode("label", null, [_cache[143] || (_cache[143] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.record) = $event) }, null, 8, _hoisted_377), [[_vModelText, findForm.record]])]),
                    _createElementVNode("label", null, [_cache[144] || (_cache[144] = _createTextVNode("开始日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((findForm.start) = $event)
                    }, null, 8, _hoisted_378), [[_vModelText, findForm.start]])]),
                    _createElementVNode("label", null, [_cache[145] || (_cache[145] = _createTextVNode("结束日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((findForm.end) = $event)
                    }, null, 8, _hoisted_379), [[_vModelText, findForm.end]])]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.exact) = $event)
                    }, null, 8, _hoisted_380), [[_vModelCheckbox, findForm.exact]]), _cache[146] || (_cache[146] = _createTextVNode("整项匹配"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.sensitive) = $event)
                    }, null, 8, _hoisted_381), [[_vModelCheckbox, findForm.sensitive]]), _cache[147] || (_cache[147] = _createTextVNode("区分大小写"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.starred) = $event)
                    }, null, 8, _hoisted_382), [[_vModelCheckbox, findForm.starred]]), _cache[148] || (_cache[148] = _createTextVNode("仅关注文件"))])
                  ])]), _createElementVNode("div", _hoisted_383, [_createElementVNode("label", null, [_cache[151] || (_cache[151] = _createTextVNode("结果排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.sort) = $event) }, _cache[150] || (_cache[150] = [_createElementVNode("option", { value: "" }, "最近优先", -1), _createElementVNode("option", { value: "oldest" }, "最早优先", -1), _createElementVNode("option", { value: "path" }, "事件路径", -1)]), 8, _hoisted_384), [[_vModelSelect, findForm.sort]])]), _createElementVNode("button", {
                    class: "primary",
                    disabled: finderBusy
                  }, "查询差异", 8, _hoisted_385), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => {findForm=freshFind();presetId=0;findChanges()}
                  }, "清空条件", 8, _hoisted_386)])], 40, _hoisted_364), _createElementVNode("details", null, [_cache[154] || (_cache[154] = _createElementVNode("summary", null, "保存或使用查询条件", -1)), _createElementVNode("div", _hoisted_387, [
                    _createElementVNode("label", null, [_cache[152] || (_cache[152] = _createTextVNode("组合名称")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((presetName) = $event),
                      maxlength: "60"
                    }, null, 8, _hoisted_388), [[_vModelText, presetName]])]),
                    _createElementVNode("button", {
                      class: "btn",
                      disabled: !presetName.trim(),
                      onClick: savePreset
                    }, "保存条件", 8, _hoisted_389),
                    _createElementVNode("label", null, [_cache[153] || (_cache[153] = _createTextVNode("已保存组合")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((presetId) = $event),
                      onChange: applyPreset
                    }, [_createElementVNode("option", { value: 0 }, "自定义", 8, _hoisted_391), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(presets, (p) => {
                      return (_openBlock(), _createElementBlock("option", { value: p.id }, _toDisplayString(p.name), 9, _hoisted_392))
                    }), 256))], 40, _hoisted_390), [[
                      _vModelSelect,
                      presetId,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("button", {
                      class: "textbtn",
                      disabled: !presetId,
                      onClick: forgetPreset
                    }, "移除组合", 8, _hoisted_393)
                  ])])]), _createElementVNode("section", _hoisted_394, [finderBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_395, "正在查询已解析差异…"))
                    : _createCommentVNode("", true), found
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                        _createElementVNode("div", _hoisted_396, [_createElementVNode("h2", null, _toDisplayString(found.total) + " 项差异", 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: !found.total,
                          onClick: exportFinder
                        }, "导出查询结果", 8, _hoisted_397)]),
                        _createElementVNode("p", null, _toDisplayString(found.files) + " 个文件 · " + _toDisplayString(found.events) + " 条变更事件", 1),
                        _createElementVNode("div", _hoisted_398, [_createElementVNode("table", null, [_cache[155] || (_cache[155] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "文件与版本"),
                          _createElementVNode("th", null, "位置"),
                          _createElementVNode("th", null, "变化"),
                          _createElementVNode("th", null, "旧值"),
                          _createElementVNode("th", null, "新值"),
                          _createElementVNode("th")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(found.items, (r) => {
                          return (_openBlock(), _createElementBlock("tr", { key: r.eid+'-'+r.ordinal }, [
                            _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.rel), 1), _createElementVNode("small", null, "V" + _toDisplayString(r.prior) + " → V" + _toDisplayString(r.version) + " · " + _toDisplayString(fmt(r.stamp)), 1)]),
                            _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.sheet) + " · " + _toDisplayString(r.location), 1), _createElementVNode("small", null, _toDisplayString(r.field) + "　" + _toDisplayString(r.record_key), 1)]),
                            _createElementVNode("td", null, _toDisplayString(r.kind), 1),
                            _createElementVNode("td", _hoisted_399, _toDisplayString(r.old_value??'—') + _toDisplayString(r.old_value_truncated?'…':''), 1),
                            _createElementVNode("td", _hoisted_400, _toDisplayString(r.new_value??'—') + _toDisplayString(r.new_value_truncated?'…':''), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (openFound(r))
                            }, "核对原差异", 8, _hoisted_401)])
                          ]))
                        }), 128))])])]),
                        (!found.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_402, "没有匹配的可见差异。"))
                          : _createCommentVNode("", true),
                        _createElementVNode("div", _hoisted_403, [_createElementVNode("button", {
                          class: "btn",
                          disabled: found.page===1,
                          onClick: $event => (findChanges(found.page-1,findApplied))
                        }, "上一页", 8, _hoisted_404), _createElementVNode("span", null, _toDisplayString(found.page) + " / " + _toDisplayString(found.pages), 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: found.page===found.pages,
                          onClick: $event => (findChanges(found.page+1,findApplied))
                        }, "下一页", 8, _hoisted_405)])
                      ], 64))
                    : _createCommentVNode("", true)])], 64))
                : _createCommentVNode("", true),
              (page==='历史正文检索')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [_createElementVNode("section", _hoisted_406, [_createElementVNode("form", { onSubmit: _withModifiers($event => (searchText()), ["prevent"]) }, [_createElementVNode("div", _hoisted_408, [
                    _createElementVNode("label", null, [_cache[156] || (_cache[156] = _createTextVNode("正文关键词")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((textForm.q) = $event),
                      required: "",
                      maxlength: "160",
                      placeholder: "例如 RK-001"
                    }, null, 8, _hoisted_409), [[_vModelText, textForm.q]])]),
                    _createElementVNode("label", null, [_cache[157] || (_cache[157] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((textForm.root) = $event) }, [_createElementVNode("option", { value: 0 }, "全部目录", 8, _hoisted_411), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: r.id,
                        value: r.id
                      }, _toDisplayString(r.path), 9, _hoisted_412))
                    }), 128))], 8, _hoisted_410), [[_vModelSelect, textForm.root]])]),
                    _createElementVNode("label", null, [_cache[158] || (_cache[158] = _createTextVNode("最近登记路径")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((textForm.filename) = $event),
                      maxlength: "512",
                      placeholder: "文件名或相对路径片段"
                    }, null, 8, _hoisted_413), [[_vModelText, textForm.filename]])]),
                    _createElementVNode("label", null, [_cache[159] || (_cache[159] = _createTextVNode("历史后缀")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((textForm.ext) = $event),
                      maxlength: "512",
                      placeholder: "txt, md, csv"
                    }, null, 8, _hoisted_414), [[_vModelText, textForm.ext]])]),
                    _createElementVNode("label", null, [_cache[160] || (_cache[160] = _createTextVNode("版本范围")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((textForm.latest) = $event) }, [_createElementVNode("option", { value: true }, "每个文件最新保存", 8, _hoisted_416), _createElementVNode("option", { value: false }, "所有历史版本", 8, _hoisted_417)], 8, _hoisted_415), [[_vModelSelect, textForm.latest]])])
                  ]), _createElementVNode("details", null, [_cache[170] || (_cache[170] = _createElementVNode("summary", null, "更多检索条件", -1)), _createElementVNode("div", _hoisted_418, [
                    _createElementVNode("label", null, [_cache[162] || (_cache[162] = _createTextVNode("文件范围")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((textForm.scope) = $event) }, _cache[161] || (_cache[161] = [
                      _createElementVNode("option", { value: "" }, "全部文件", -1),
                      _createElementVNode("option", { value: "live" }, "当前在册", -1),
                      _createElementVNode("option", { value: "history" }, "全部历史文件", -1),
                      _createElementVNode("option", { value: "deleted" }, "已删除", -1),
                      _createElementVNode("option", { value: "excluded" }, "规则已排除", -1),
                      _createElementVNode("option", { value: "removed" }, "目录已移除", -1)
                    ]), 8, _hoisted_419), [[_vModelSelect, textForm.scope]])]),
                    _createElementVNode("label", null, [_cache[163] || (_cache[163] = _createTextVNode("保存日期从")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((textForm.start) = $event),
                      max: textForm.end||undefined
                    }, null, 8, _hoisted_420), [[_vModelText, textForm.start]])]),
                    _createElementVNode("label", null, [_cache[164] || (_cache[164] = _createTextVNode("保存日期至")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((textForm.end) = $event),
                      min: textForm.start||undefined
                    }, null, 8, _hoisted_421), [[_vModelText, textForm.end]])]),
                    _createElementVNode("label", null, [_cache[165] || (_cache[165] = _createTextVNode("上下文")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((textForm.context) = $event) }, [_createElementVNode("option", { value: 0 }, "只显示命中行", 8, _hoisted_423), _createElementVNode("option", { value: 1 }, "前后各 1 行", 8, _hoisted_424), _createElementVNode("option", { value: 2 }, "前后各 2 行", 8, _hoisted_425)], 8, _hoisted_422), [[_vModelSelect, textForm.context]])]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((textForm.starred) = $event)
                    }, null, 8, _hoisted_426), [[_vModelCheckbox, textForm.starred]]), _cache[166] || (_cache[166] = _createTextVNode("仅关注文件"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((textForm.skip_initial) = $event)
                    }, null, 8, _hoisted_427), [[_vModelCheckbox, textForm.skip_initial]]), _cache[167] || (_cache[167] = _createTextVNode("跳过首次建档"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((textForm.exact) = $event)
                    }, null, 8, _hoisted_428), [[_vModelCheckbox, textForm.exact]]), _cache[168] || (_cache[168] = _createTextVNode("整行匹配"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((textForm.sensitive) = $event)
                    }, null, 8, _hoisted_429), [[_vModelCheckbox, textForm.sensitive]]), _cache[169] || (_cache[169] = _createTextVNode("区分大小写"))])
                  ])]), _createElementVNode("div", _hoisted_430, [
                    _createElementVNode("button", {
                      class: "primary",
                      disabled: textBusy||!textForm.q.trim()
                    }, "检索正文", 8, _hoisted_431),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: resetTextSearch
                    }, "清空条件", 8, _hoisted_432),
                    demo
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          type: "button",
                          class: "textbtn",
                          disabled: textBusy,
                          onClick: $event => {resetTextSearch();textForm.q='RK-001';textForm.filename='退货轨迹.csv';textForm.latest=false;searchText()}
                        }, "查找示例 RK-001", 8, _hoisted_433))
                      : _createCommentVNode("", true),
                    (textForm.file)
                      ? (_openBlock(), _createElementBlock("span", _hoisted_434, [_createTextVNode("仅 " + _toDisplayString(textFileLabel) + " ", 1), _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: $event => {textForm.file=0;textFileLabel=''}
                        }, "取消限定", 8, _hoisted_435)]))
                      : _createCommentVNode("", true)
                  ])], 40, _hoisted_407), _cache[171] || (_cache[171] = _createElementVNode("details", null, [_createElementVNode("summary", null, "检索范围和限制"), _createElementVNode("p", null, "查找仓库快照中的纯文本，包含已保存的早期版本。支持 TXT、Markdown、CSV、TSV、日志及常见源码和配置文件。CSV 按原文的物理行定位。每个快照最多 2 MiB。"), _createElementVNode("p", null, "结果显示文件最近登记的路径。若要查找某个日期范围内的旧保存，请选择「所有历史版本」。")], -1))]), _createElementVNode("section", {
                    class: "card listcard",
                    "aria-busy": textBusy
                  }, [textBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_437, "正在读取历史正文…"))
                    : _createCommentVNode("", true), textError
                    ? (_openBlock(), _createElementBlock("p", _hoisted_438, _toDisplayString(textError), 1))
                    : _createCommentVNode("", true), textResult
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                        _createElementVNode("div", _hoisted_439, [_createElementVNode("h2", null, "第 " + _toDisplayString(textCursors.length) + " 批 · " + _toDisplayString(textResult.items.length) + " 个命中版本", 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: textBusy||!textResult.items.length,
                          onClick: exportTextSearch
                        }, "导出本批命中片段", 8, _hoisted_440)]),
                        _createElementVNode("p", _hoisted_441, "关键词「" + _toDisplayString(textApplied.q) + "」 · 检查 " + _toDisplayString(textResult.checked) + " 个快照 · 本批处理 " + _toDisplayString(textResult.scanned) + " 个候选", 1),
                        (Object.keys(textResult.skipped).length)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_442, [_cache[172] || (_cache[172] = _createTextVNode("跳过 ")), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(textResult.skipped, (count, reason) => {
                              return (_openBlock(), _createElementBlock("span", { key: reason }, _toDisplayString(reason) + " " + _toDisplayString(count) + " 项　", 1))
                            }), 128))]))
                          : _createCommentVNode("", true),
                        (!textResult.items.length)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_443, _toDisplayString(textResult.next?'本批没有命中，可继续检索较早的版本。':'本批没有命中的历史正文。'), 1))
                          : _createCommentVNode("", true),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(textResult.items, (item) => {
                          return (_openBlock(), _createElementBlock("article", {
                            key: item.id,
                            class: "text-hit"
                          }, [_createElementVNode("div", _hoisted_444, [_createElementVNode("div", null, [_createElementVNode("h3", null, _toDisplayString(item.rel) + " · V" + _toDisplayString(item.num), 1), _createElementVNode("small", null, _toDisplayString(item.root) + " · " + _toDisplayString(fmt(item.stamp)) + " · " + _toDisplayString(item.ext) + " · " + _toDisplayString(item.encoding) + " · " + _toDisplayString(bytes(item.size)) + " · " + _toDisplayString(item.state), 1)]), _createElementVNode("div", _hoisted_445, [_createElementVNode("button", {
                            class: "textbtn",
                            onClick: $event => (openTextVersion(item))
                          }, "打开命中版本", 8, _hoisted_446), _createElementVNode("button", {
                            class: "textbtn",
                            disabled: hasBundleVersion(item.id),
                            onClick: $event => (addBundleVersion(item))
                          }, "加入交付篮", 8, _hoisted_447), (item.parent_id)
                            ? (_openBlock(), _createElementBlock("button", {
                                key: 0,
                                class: "textbtn",
                                onClick: $event => (openTextVersion(item,true))
                              }, "与上版比较", 8, _hoisted_448))
                            : _createCommentVNode("", true)])]), _createElementVNode("details", _hoisted_449, [_createElementVNode("summary", null, [_createTextVNode(_toDisplayString(item.matches) + " 个匹配行", 1), (item.matches>item.previews.length)
                            ? (_openBlock(), _createElementBlock("span", _hoisted_450, " · 显示前 " + _toDisplayString(item.previews.length) + " 行", 1))
                            : _createCommentVNode("", true)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(item.previews, (hit) => {
                            return (_openBlock(), _createElementBlock("div", {
                              key: hit.line,
                              class: "text-context"
                            }, [_createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (openLineage(item,hit.line))
                            }, "追溯第 " + _toDisplayString(hit.line) + " 行来源", 9, _hoisted_451), _createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (openSnapshot(item,hit.line))
                            }, "查看原件第 " + _toDisplayString(hit.line) + " 行", 9, _hoisted_452), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(hit.rows, (row) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: row.line,
                                class: _normalizeClass({'text-hit-line':row.column!==null})
                              }, [_createElementVNode("span", { title: row.column===null?'上下文':'首个匹配的起始列 '+row.column }, [_createTextVNode(_toDisplayString(row.line), 1), (row.column!==null)
                                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(":" + _toDisplayString(row.column), 1)], 64))
                                : _createCommentVNode("", true)], 8, _hoisted_453), _createElementVNode("code", null, [_createTextVNode(_toDisplayString(row.head?'…':'') + _toDisplayString(row.prefix), 1), (row.match)
                                ? (_openBlock(), _createElementBlock("mark", _hoisted_454, _toDisplayString(row.match), 1))
                                : _createCommentVNode("", true), _createTextVNode(_toDisplayString(row.suffix) + _toDisplayString(row.tail?'…':''), 1)])], 2))
                            }), 128))]))
                          }), 128))])]))
                        }), 128)),
                        _createElementVNode("div", _hoisted_455, [_createElementVNode("button", {
                          class: "btn",
                          disabled: textBusy||textCursors.length<2,
                          onClick: $event => (searchText(-1))
                        }, "上一批", 8, _hoisted_456), _createElementVNode("span", null, _toDisplayString(textResult.next?'还有较早的候选版本':'已到本次检索范围末尾'), 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: textBusy||!textResult.next,
                          onClick: $event => (searchText(1))
                        }, "继续检索", 8, _hoisted_457)])
                      ], 64))
                    : _createCommentVNode("", true)], 8, _hoisted_436)], 64))
                : _createCommentVNode("", true),
              (page==='相同内容追溯')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 6 }, [_createElementVNode("section", _hoisted_458, [_createElementVNode("form", { onSubmit: _withModifiers($event => (loadContentGroups()), ["prevent"]) }, [_createElementVNode("div", _hoisted_460, [
                    _createElementVNode("label", null, [_cache[174] || (_cache[174] = _createTextVNode("分组方式")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((contentForm.mode) = $event) }, _cache[173] || (_cache[173] = [
                      _createElementVNode("option", { value: "cross" }, "跨文件相同正文", -1),
                      _createElementVNode("option", { value: "repeat" }, "同文件多次引用", -1),
                      _createElementVNode("option", { value: "shared" }, "所有重复引用", -1),
                      _createElementVNode("option", { value: "all" }, "所有正文", -1)
                    ]), 8, _hoisted_461), [[_vModelSelect, contentForm.mode]])]),
                    _createElementVNode("label", null, [_cache[175] || (_cache[175] = _createTextVNode("SHA-256 或前缀")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((contentForm.sha) = $event),
                      maxlength: "64",
                      placeholder: "至少 6 位十六进制字符",
                      spellcheck: "false"
                    }, null, 8, _hoisted_462), [[_vModelText, contentForm.sha]])]),
                    _createElementVNode("label", null, [_cache[176] || (_cache[176] = _createTextVNode("最近登记路径")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((contentForm.q) = $event),
                      maxlength: "512",
                      placeholder: "文件名或路径片段"
                    }, null, 8, _hoisted_463), [[_vModelText, contentForm.q]])]),
                    _createElementVNode("label", null, [_cache[177] || (_cache[177] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((contentForm.root) = $event) }, [_createElementVNode("option", { value: 0 }, "全部目录", 8, _hoisted_465), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: r.id,
                        value: r.id
                      }, _toDisplayString(r.path), 9, _hoisted_466))
                    }), 128))], 8, _hoisted_464), [[_vModelSelect, contentForm.root]])]),
                    _createElementVNode("label", null, [_cache[178] || (_cache[178] = _createTextVNode("历史后缀")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((contentForm.ext) = $event),
                      maxlength: "512",
                      placeholder: "例如 pdf, xlsx"
                    }, null, 8, _hoisted_467), [[_vModelText, contentForm.ext]])])
                  ]), _createElementVNode("details", null, [_cache[188] || (_cache[188] = _createElementVNode("summary", null, "更多筛选条件", -1)), _createElementVNode("div", _hoisted_468, [
                    _createElementVNode("label", null, [_cache[180] || (_cache[180] = _createTextVNode("文件当前状态")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((contentForm.state) = $event) }, [_cache[179] || (_cache[179] = _createElementVNode("option", { value: "" }, "全部状态", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['当前在册','目录已暂停','规则已排除','目录已移除','已删除'], (state) => {
                      return (_openBlock(), _createElementBlock("option", { key: state }, _toDisplayString(state), 1))
                    }), 128))], 8, _hoisted_469), [[_vModelSelect, contentForm.state]])]),
                    _createElementVNode("label", null, [_cache[181] || (_cache[181] = _createTextVNode("保存日期从")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((contentForm.start) = $event),
                      max: contentForm.end||undefined
                    }, null, 8, _hoisted_470), [[_vModelText, contentForm.start]])]),
                    _createElementVNode("label", null, [_cache[182] || (_cache[182] = _createTextVNode("保存日期至")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((contentForm.end) = $event),
                      min: contentForm.start||undefined
                    }, null, 8, _hoisted_471), [[_vModelText, contentForm.end]])]),
                    _createElementVNode("label", null, [_cache[183] || (_cache[183] = _createTextVNode("最小字节数")), _withDirectives(_createElementVNode("input", {
                      type: "number",
                      min: "0",
                      step: "1",
                      "onUpdate:modelValue": $event => ((contentForm.minimum) = $event)
                    }, null, 8, _hoisted_472), [[
                      _vModelText,
                      contentForm.minimum,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("label", null, [_cache[184] || (_cache[184] = _createTextVNode("最大字节数")), _withDirectives(_createElementVNode("input", {
                      type: "number",
                      min: "0",
                      step: "1",
                      "onUpdate:modelValue": $event => ((contentForm.maximum) = $event)
                    }, null, 8, _hoisted_473), [[
                      _vModelText,
                      contentForm.maximum,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((contentForm.latest) = $event)
                    }, null, 8, _hoisted_474), [[_vModelCheckbox, contentForm.latest]]), _cache[185] || (_cache[185] = _createTextVNode("仅每文件最新版"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((contentForm.starred) = $event)
                    }, null, 8, _hoisted_475), [[_vModelCheckbox, contentForm.starred]]), _cache[186] || (_cache[186] = _createTextVNode("仅关注文件"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((contentForm.empty) = $event)
                    }, null, 8, _hoisted_476), [[_vModelCheckbox, contentForm.empty]]), _cache[187] || (_cache[187] = _createTextVNode("包含空文件"))])
                  ])]), _createElementVNode("div", _hoisted_477, [
                    _createElementVNode("label", null, [_cache[190] || (_cache[190] = _createTextVNode("分组排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((contentForm.sort) = $event) }, _cache[189] || (_cache[189] = [
                      _createElementVNode("option", { value: "saved" }, "复用字节最多", -1),
                      _createElementVNode("option", { value: "versions" }, "版本引用最多", -1),
                      _createElementVNode("option", { value: "files" }, "文件身份最多", -1),
                      _createElementVNode("option", { value: "bytes" }, "单份正文最大", -1),
                      _createElementVNode("option", { value: "recent" }, "最近保存优先", -1)
                    ]), 8, _hoisted_478), [[_vModelSelect, contentForm.sort]])]),
                    _createElementVNode("label", null, [_cache[191] || (_cache[191] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((contentForm.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50], (n) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: n,
                        value: n
                      }, _toDisplayString(n) + " 项", 9, _hoisted_480))
                    }), 128))], 8, _hoisted_479), [[
                      _vModelSelect,
                      contentForm.size,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("button", {
                      class: "primary",
                      disabled: contentBusy
                    }, "查询相同正文", 8, _hoisted_481),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: $event => {resetContent();loadContentGroups()}
                    }, "重置并查询", 8, _hoisted_482),
                    demoContentSha
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          type: "button",
                          class: "textbtn",
                          disabled: contentBusy,
                          onClick: $event => (go('相同内容追溯',{sha:demoContentSha}))
                        }, "查看示例交接副本", 8, _hoisted_483))
                      : _createCommentVNode("", true)
                  ])], 40, _hoisted_459), _cache[192] || (_cache[192] = _createElementVNode("details", null, [_createElementVNode("summary", null, "如何理解用量和文件身份"), _createElementVNode("p", null, "按完整 SHA-256 分组。目录、路径、日期等条件先限定参与统计的版本。复用字节等于引用字节合计减去每组单份正文的大小，是当前范围内的去重用量，不能直接作为可释放的磁盘空间。同名文件在删除后重新建档可拥有独立身份。"), _createElementVNode("p", null, "原件校验只读取所选摘要的归档副本。需要回到正在编辑的文件确认时，可在历史版本使用「保存核对」。")], -1))]), _createElementVNode("section", {
                    class: "card listcard",
                    "aria-busy": contentBusy
                  }, [contentBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_485, "正在汇总版本引用…"))
                    : _createCommentVNode("", true), contentError
                    ? (_openBlock(), _createElementBlock("p", _hoisted_486, _toDisplayString(contentError), 1))
                    : _createCommentVNode("", true), contentGroups
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                        _createElementVNode("div", _hoisted_487, [_createElementVNode("h2", null, _toDisplayString(num(contentGroups.total)) + " 组正文", 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: contentBusy||!contentGroups.total,
                          onClick: $event => (exportContent())
                        }, "导出分组 CSV", 8, _hoisted_488)]),
                        _createElementVNode("p", null, _toDisplayString(num(contentGroups.summary.versions)) + " 次版本引用 · 引用字节 " + _toDisplayString(bytes(contentGroups.summary.logical)) + " · 单份正文合计 " + _toDisplayString(bytes(contentGroups.summary.unique_bytes)) + " · 复用 " + _toDisplayString(bytes(contentGroups.summary.saved)), 1),
                        (contentGroups.summary.conflicts)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_489, _toDisplayString(contentGroups.summary.conflicts) + " 组长度冲突，已从字节汇总排除。", 1))
                          : _createCommentVNode("", true),
                        (contentGroups.items.length)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_490, [_createElementVNode("table", _hoisted_491, [_cache[193] || (_cache[193] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "SHA-256"),
                              _createElementVNode("th", null, "单份正文"),
                              _createElementVNode("th", null, "版本 / 最新"),
                              _createElementVNode("th", null, "文件 / 目录 / 后缀"),
                              _createElementVNode("th", null, "保存范围"),
                              _createElementVNode("th", null, "复用字节"),
                              _createElementVNode("th", null, "操作")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(contentGroups.items, (group) => {
                              return (_openBlock(), _createElementBlock("tr", {
                                key: group.sha,
                                class: _normalizeClass({'catalog-selected':contentSelected?.sha===group.sha})
                              }, [
                                _createElementVNode("td", _hoisted_492, _toDisplayString(group.sha), 1),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(group.conflict?'长度冲突':bytes(group.size)), 1), (!group.conflict)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_493, "引用 " + _toDisplayString(bytes(group.logical)), 1))
                                  : _createCommentVNode("", true)]),
                                _createElementVNode("td", null, _toDisplayString(num(group.versions)) + " / " + _toDisplayString(num(group.latest)), 1),
                                _createElementVNode("td", null, _toDisplayString(num(group.files)) + " / " + _toDisplayString(num(group.roots)) + " / " + _toDisplayString(num(group.formats)), 1),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(group.first_stamp)), 1), _createElementVNode("small", null, "至 " + _toDisplayString(fmt(group.last_stamp)), 1)]),
                                _createElementVNode("td", null, _toDisplayString(group.conflict?'—':bytes(group.saved)), 1),
                                _createElementVNode("td", null, [_createElementVNode("button", {
                                  class: "textbtn",
                                  "aria-pressed": contentSelected?.sha===group.sha,
                                  onClick: $event => (selectContent(group))
                                }, "版本引用", 8, _hoisted_494)])
                              ], 2))
                            }), 128))])])]))
                          : (_openBlock(), _createElementBlock("p", _hoisted_495, "当前条件没有相同正文分组。")),
                        (contentGroups.pages>1)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_496, [_createElementVNode("button", {
                              class: "btn",
                              disabled: contentBusy||contentGroups.page<=1,
                              onClick: $event => (loadContentGroups(contentGroups.page-1,true))
                            }, "上一页", 8, _hoisted_497), _createElementVNode("span", null, _toDisplayString(contentGroups.page) + " / " + _toDisplayString(contentGroups.pages), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: contentBusy||contentGroups.page>=contentGroups.pages,
                              onClick: $event => (loadContentGroups(contentGroups.page+1,true))
                            }, "下一页", 8, _hoisted_498)]))
                          : _createCommentVNode("", true)
                      ], 64))
                    : _createCommentVNode("", true)], 8, _hoisted_484), contentSelected
                    ? (_openBlock(), _createElementBlock("section", {
                        key: 0,
                        class: "card listcard",
                        "aria-busy": contentRefsBusy
                      }, [
                        _createElementVNode("div", _hoisted_500, [_cache[194] || (_cache[194] = _createElementVNode("h2", null, "版本引用", -1)), _createElementVNode("button", {
                          class: "textbtn",
                          onClick: clearContentSelection
                        }, "收起明细", 8, _hoisted_501)]),
                        _createElementVNode("p", _hoisted_502, _toDisplayString(contentSelected.sha), 1),
                        _createElementVNode("div", _hoisted_503, [
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((contentScoped) = $event),
                            onChange: $event => (loadContentRefs())
                          }, null, 40, _hoisted_504), [[_vModelCheckbox, contentScoped]]), _cache[195] || (_cache[195] = _createTextVNode("仅显示符合分组筛选的引用"))]),
                          _createElementVNode("label", null, [_cache[197] || (_cache[197] = _createTextVNode("明细排序")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((contentRefSort) = $event),
                            onChange: $event => (loadContentRefs())
                          }, _cache[196] || (_cache[196] = [_createElementVNode("option", { value: "recent" }, "最近保存", -1), _createElementVNode("option", { value: "oldest" }, "最早保存", -1), _createElementVNode("option", { value: "path" }, "按文件路径", -1)]), 40, _hoisted_505), [[_vModelSelect, contentRefSort]])]),
                          _createElementVNode("label", null, [_cache[198] || (_cache[198] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((contentRefSize) = $event),
                            onChange: $event => (loadContentRefs())
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50], (n) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: n,
                              value: n
                            }, _toDisplayString(n) + " 项", 9, _hoisted_507))
                          }), 128))], 40, _hoisted_506), [[
                            _vModelSelect,
                            contentRefSize,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("button", {
                            class: "btn",
                            disabled: contentCheckBusy,
                            onClick: verifyContent
                          }, _toDisplayString(contentCheckBusy?'校验中…':'校验归档副本'), 9, _hoisted_508),
                          _createElementVNode("button", {
                            class: "btn",
                            disabled: contentRefsBusy||!contentRefs?.total,
                            onClick: $event => (exportContent(true))
                          }, "导出引用 CSV", 8, _hoisted_509)
                        ]),
                        contentCheck
                          ? (_openBlock(), _createElementBlock("p", {
                              key: 0,
                              role: "status",
                              class: _normalizeClass({error:contentCheck.status!=='通过'})
                            }, [_createElementVNode("strong", null, _toDisplayString(contentCheck.status==='通过'?'归档副本校验通过':contentCheck.status), 1), _createTextVNode(" · 索引 " + _toDisplayString(contentCheck.expected==null?'—':bytes(contentCheck.expected)) + " · 实际 " + _toDisplayString(contentCheck.actual==null?'—':bytes(contentCheck.actual)) + " · " + _toDisplayString(fmt(contentCheck.checked)), 1)], 2))
                          : _createCommentVNode("", true),
                        contentCheckError
                          ? (_openBlock(), _createElementBlock("p", _hoisted_510, _toDisplayString(contentCheckError), 1))
                          : _createCommentVNode("", true),
                        contentRefsBusy
                          ? (_openBlock(), _createElementBlock("p", _hoisted_511, "正在读取版本引用…"))
                          : _createCommentVNode("", true),
                        contentRefsError
                          ? (_openBlock(), _createElementBlock("p", _hoisted_512, _toDisplayString(contentRefsError), 1))
                          : _createCommentVNode("", true),
                        contentRefs
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("p", null, _toDisplayString(num(contentRefs.total)) + " 条" + _toDisplayString(contentScoped?'筛选后':'全部') + "版本引用", 1), (contentRefs.items.length)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_513, [_createElementVNode("table", _hoisted_514, [_cache[199] || (_cache[199] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                  _createElementVNode("th", null, "文件与目录"),
                                  _createElementVNode("th", null, "版本"),
                                  _createElementVNode("th", null, "保存时间"),
                                  _createElementVNode("th", null, "文件状态"),
                                  _createElementVNode("th", null, "版本大小及解析状态"),
                                  _createElementVNode("th", null, "操作")
                                ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(contentRefs.items, (v) => {
                                  return (_openBlock(), _createElementBlock("tr", { key: v.id }, [
                                    _createElementVNode("td", null, [_createTextVNode(_toDisplayString(v.rel), 1), _createElementVNode("small", null, _toDisplayString(v.root), 1)]),
                                    _createElementVNode("td", null, [_createTextVNode("V" + _toDisplayString(v.num), 1), _createElementVNode("small", null, [_createTextVNode(_toDisplayString(v.ext||'无后缀'), 1), (v.latest)
                                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · 最新保存")], 64))
                                      : _createCommentVNode("", true)])]),
                                    _createElementVNode("td", null, _toDisplayString(fmt(v.stamp)), 1),
                                    _createElementVNode("td", null, _toDisplayString(v.state), 1),
                                    _createElementVNode("td", null, [_createTextVNode(_toDisplayString(bytes(v.size)), 1), _createElementVNode("small", null, _toDisplayString(v.status), 1)]),
                                    _createElementVNode("td", null, [_createElementVNode("button", {
                                      class: "textbtn",
                                      onClick: $event => (openContentVersion(v))
                                    }, "打开版本", 8, _hoisted_515), (v.parent_id)
                                      ? (_openBlock(), _createElementBlock("button", {
                                          key: 0,
                                          class: "textbtn",
                                          onClick: $event => (openContentVersion(v,true))
                                        }, "与上版比较", 8, _hoisted_516))
                                      : _createCommentVNode("", true)])
                                  ]))
                                }), 128))])])]))
                              : (_openBlock(), _createElementBlock("p", _hoisted_517, "当前条件没有引用记录。")), (contentRefs.pages>1)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_518, [_createElementVNode("button", {
                                  class: "btn",
                                  disabled: contentRefsBusy||contentRefs.page<=1,
                                  onClick: $event => (loadContentRefs(contentRefs.page-1))
                                }, "上一页", 8, _hoisted_519), _createElementVNode("span", null, _toDisplayString(contentRefs.page) + " / " + _toDisplayString(contentRefs.pages), 1), _createElementVNode("button", {
                                  class: "btn",
                                  disabled: contentRefsBusy||contentRefs.page>=contentRefs.pages,
                                  onClick: $event => (loadContentRefs(contentRefs.page+1))
                                }, "下一页", 8, _hoisted_520)]))
                              : _createCommentVNode("", true)], 64))
                          : _createCommentVNode("", true)
                      ], 8, _hoisted_499))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='逐行来源')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 7 }, [_createElementVNode("section", _hoisted_521, [
                    _createElementVNode("div", _hoisted_522, [_createElementVNode("h2", null, _toDisplayString(lineageFile?.rel||'选择一个历史文本版本'), 1), _createElementVNode("div", _hoisted_523, [lineageBack
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          class: "btn",
                          onClick: $event => (go(lineageBack))
                        }, "返回" + _toDisplayString(lineageBack), 9, _hoisted_524))
                      : _createCommentVNode("", true), _createElementVNode("button", {
                      class: "btn",
                      onClick: $event => (go('文件管理'))
                    }, "查找文件", 8, _hoisted_525), demoLineage
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 1,
                          class: "btn",
                          onClick: $event => (openLineage(demoLineage))
                        }, "查看示例退货台账", 8, _hoisted_526))
                      : _createCommentVNode("", true)])]),
                    (lineageFile?.root)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_527, _toDisplayString(lineageFile.root), 1))
                      : _createCommentVNode("", true),
                    (!lineageFile)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_528, "打开文件的历史版本，选择「逐行来源」。支持 TXT、Markdown、CSV、TSV、日志和常见源码、配置文本。"))
                      : (_openBlock(), _createElementBlock("form", {
                          key: 2,
                          onSubmit: _withModifiers($event => (loadLineage()), ["prevent"])
                        }, [_createElementVNode("div", _hoisted_530, [
                          _createElementVNode("label", null, [_cache[200] || (_cache[200] = _createTextVNode("目标版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((lineageForm.id) = $event),
                            onChange: changeLineageTarget,
                            disabled: lineageBusy
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lineageVersions, (v) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: v.id,
                              value: v.id
                            }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)) + " · " + _toDisplayString(v.ext), 9, _hoisted_532))
                          }), 128))], 40, _hoisted_531), [[
                            _vModelSelect,
                            lineageForm.id,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[201] || (_cache[201] = _createTextVNode("最多追溯版本")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((lineageForm.depth) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,10,20,40], (n) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: n,
                              value: n
                            }, _toDisplayString(n) + " 版（含目标）", 9, _hoisted_534))
                          }), 128))], 8, _hoisted_533), [[
                            _vModelSelect,
                            lineageForm.depth,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((lineageForm.moves) = $event)
                          }, null, 8, _hoisted_535), [[_vModelCheckbox, lineageForm.moves]]), _cache[202] || (_cache[202] = _createTextVNode("识别唯一文本移位"))]),
                          _createElementVNode("label", null, [_cache[203] || (_cache[203] = _createTextVNode("正文关键词")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((lineageForm.q) = $event),
                            maxlength: "160"
                          }, null, 8, _hoisted_536), [[_vModelText, lineageForm.q]])]),
                          _createElementVNode("label", null, [_cache[205] || (_cache[205] = _createTextVNode("筛选来源")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((lineageForm.kind) = $event) }, _cache[204] || (_cache[204] = [
                            _createElementVNode("option", { value: "" }, "全部", -1),
                            _createElementVNode("option", { value: "target" }, "判为目标版出现", -1),
                            _createElementVNode("option", { value: "earlier" }, "已确认的较早来源", -1),
                            _createElementVNode("option", { value: "initial" }, "首次建档可见", -1),
                            _createElementVNode("option", { value: "unknown" }, "来源未确认", -1),
                            _createElementVNode("option", { value: "moved" }, "曾识别移位", -1)
                          ]), 8, _hoisted_537), [[_vModelSelect, lineageForm.kind]])])
                        ]), _createElementVNode("details", null, [_cache[212] || (_cache[212] = _createElementVNode("summary", null, "更多行筛选", -1)), _createElementVNode("div", _hoisted_538, [
                          _createElementVNode("label", null, [_cache[206] || (_cache[206] = _createTextVNode("从行号")), _withDirectives(_createElementVNode("input", {
                            type: "number",
                            min: "0",
                            step: "1",
                            "onUpdate:modelValue": $event => ((lineageForm.low) = $event),
                            placeholder: "0 为不限"
                          }, null, 8, _hoisted_539), [[
                            _vModelText,
                            lineageForm.low,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[207] || (_cache[207] = _createTextVNode("至行号")), _withDirectives(_createElementVNode("input", {
                            type: "number",
                            min: "0",
                            step: "1",
                            "onUpdate:modelValue": $event => ((lineageForm.high) = $event),
                            placeholder: "0 为不限"
                          }, null, 8, _hoisted_540), [[
                            _vModelText,
                            lineageForm.high,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((lineageForm.exact) = $event)
                          }, null, 8, _hoisted_541), [[_vModelCheckbox, lineageForm.exact]]), _cache[208] || (_cache[208] = _createTextVNode("整行匹配"))]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((lineageForm.sensitive) = $event)
                          }, null, 8, _hoisted_542), [[_vModelCheckbox, lineageForm.sensitive]]), _cache[209] || (_cache[209] = _createTextVNode("区分大小写"))]),
                          _createElementVNode("label", null, [_cache[210] || (_cache[210] = _createTextVNode("来源版本")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((lineageForm.origin) = $event) }, [_createElementVNode("option", { value: 0 }, "所有来源", 8, _hoisted_544), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lineageData?.sources||[], (v) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: v.id,
                              value: v.id
                            }, "V" + _toDisplayString(v.num), 9, _hoisted_545))
                          }), 128))], 8, _hoisted_543), [[
                            _vModelSelect,
                            lineageForm.origin,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[211] || (_cache[211] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((lineageForm.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([20,50,100], (n) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: n,
                              value: n
                            }, _toDisplayString(n) + " 行", 9, _hoisted_547))
                          }), 128))], 8, _hoisted_546), [[
                            _vModelSelect,
                            lineageForm.size,
                            void 0,
                            { number: true }
                          ]])])
                        ])]), _createElementVNode("div", _hoisted_548, [_createElementVNode("button", {
                          class: "primary",
                          disabled: lineageBusy||!lineageVersions.length
                        }, "追溯与筛选", 8, _hoisted_549), _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: lineageBusy||!lineageVersions.length,
                          onClick: resetLineageFilters
                        }, "清空行筛选", 8, _hoisted_550)])], 40, _hoisted_529)),
                    _cache[213] || (_cache[213] = _createElementVNode("details", null, [_createElementVNode("summary", null, "判断口径与限制"), _createElementVNode("p", null, "以快照物理行按相邻版本对齐。行内容改变会重新判定来源。唯一文本移位可辅助识别重排，重复行按顺序对齐，结果无法还原逐次键盘操作或作者。扫描间的未保存内容不在历史中。"), _createElementVNode("p", null, "每版最多 512 KiB、2500 行。遇到无法读取的旧版、比较预算或选定深度时，保留已确认结果，并对其余行显示最早可见版本。")], -1))
                  ]), lineageFile
                    ? (_openBlock(), _createElementBlock("section", {
                        key: 0,
                        class: "card listcard",
                        "aria-busy": lineageBusy
                      }, [lineageBusy
                        ? (_openBlock(), _createElementBlock("p", _hoisted_552, "正在追溯历史行…"))
                        : _createCommentVNode("", true), lineageError
                        ? (_openBlock(), _createElementBlock("p", _hoisted_553, _toDisplayString(lineageError), 1))
                        : _createCommentVNode("", true), lineageData
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createElementVNode("div", _hoisted_554, [_createElementVNode("h2", null, "V" + _toDisplayString(lineageData.target.num) + " · " + _toDisplayString(num(lineageData.lines)) + " 行", 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: lineageBusy||!lineageData.total,
                              onClick: exportLineage
                            }, "导出筛选行 CSV", 8, _hoisted_555)]),
                            _createElementVNode("p", null, _toDisplayString(fmt(lineageData.target.stamp)) + " · " + _toDisplayString(lineageData.target.encoding) + " · " + _toDisplayString(bytes(lineageData.target.size)) + " · 已读取 " + _toDisplayString(lineageData.chain.length) + " 个版本", 1),
                            _createElementVNode("p", null, [_createElementVNode("strong", null, _toDisplayString(lineageData.boundary.reason), 1), _createTextVNode(" · V" + _toDisplayString(lineageData.boundary.num), 1), (lineageData.counts.unknown)
                              ? (_openBlock(), _createElementBlock("span", _hoisted_556, " · " + _toDisplayString(lineageData.counts.unknown) + " 行来源未确认", 1))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("p", null, "首次建档可见 " + _toDisplayString(lineageData.counts.initial||0) + " 行 · 后续保存中出现 " + _toDisplayString(lineageData.counts.introduced||0) + " 行 · 已识别移位 " + _toDisplayString(lineageData.counts.moved||0) + " 行", 1),
                            (lineageData.sources.length)
                              ? (_openBlock(), _createElementBlock("details", _hoisted_557, [_cache[214] || (_cache[214] = _createElementVNode("summary", null, "按来源版本筛选", -1)), _createElementVNode("div", _hoisted_558, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lineageData.sources, (v) => {
                                  return (_openBlock(), _createElementBlock("button", {
                                    key: v.id,
                                    class: "btn",
                                    disabled: lineageBusy,
                                    "aria-pressed": lineageApplied.origin===v.id,
                                    onClick: $event => (filterLineageSource(v))
                                  }, [_createTextVNode("V" + _toDisplayString(v.num) + " · " + _toDisplayString(v.lines) + " 行", 1), (v.unknown)
                                    ? (_openBlock(), _createElementBlock("span", _hoisted_560, "（" + _toDisplayString(v.unknown) + " 行未确认）", 1))
                                    : _createCommentVNode("", true)], 8, _hoisted_559))
                                }), 128))])]))
                              : _createCommentVNode("", true),
                            _createElementVNode("details", null, [_cache[215] || (_cache[215] = _createElementVNode("summary", null, "已纳入的保存版本", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lineageData.chain, (v) => {
                              return (_openBlock(), _createElementBlock("p", { key: v.id }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)) + " · " + _toDisplayString(v.ext), 1))
                            }), 128))]),
                            (!lineageData.total)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_561, _toDisplayString(lineageData.lines?'当前条件没有匹配行。':'目标版本为空。'), 1))
                              : (_openBlock(), _createElementBlock("div", _hoisted_562, [_createElementVNode("table", _hoisted_563, [_cache[216] || (_cache[216] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                  _createElementVNode("th", null, "目标行"),
                                  _createElementVNode("th", null, "来源"),
                                  _createElementVNode("th", null, "目标版原文"),
                                  _createElementVNode("th", null, "核对")
                                ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lineageData.items, (row) => {
                                  return (_openBlock(), _createElementBlock("tr", { key: row.line }, [
                                    _createElementVNode("td", null, _toDisplayString(row.line), 1),
                                    _createElementVNode("td", null, [_createTextVNode("V" + _toDisplayString(row.origin.num) + " · 第 " + _toDisplayString(row.source_line) + " 行 ", 1), _createElementVNode("small", null, _toDisplayString(row.kind==='unknown'?'最早可见，来源未确认':row.kind==='initial'?'首次建档可见':'此保存中出现'), 1), (row.moves)
                                      ? (_openBlock(), _createElementBlock("small", _hoisted_564, "识别移位 " + _toDisplayString(row.moves) + " 次", 1))
                                      : _createCommentVNode("", true)]),
                                    _createElementVNode("td", null, [(row.text)
                                      ? (_openBlock(), _createElementBlock("code", _hoisted_565, _toDisplayString(row.text) + _toDisplayString(row.truncated?'…':''), 1))
                                      : (_openBlock(), _createElementBlock("span", _hoisted_566, "（空行）"))]),
                                    _createElementVNode("td", null, [_createElementVNode("button", {
                                      class: "textbtn",
                                      onClick: $event => (openLineageVersion(row.origin))
                                    }, _toDisplayString(row.kind==='unknown'?'打开最早可见版本':'打开来源版本'), 9, _hoisted_567), (row.origin.id!==lineageData.target.id)
                                      ? (_openBlock(), _createElementBlock("button", {
                                          key: 0,
                                          class: "textbtn",
                                          onClick: $event => (openLineageVersion(row.origin,true))
                                        }, "与目标版比较", 8, _hoisted_568))
                                      : _createCommentVNode("", true)])
                                  ]))
                                }), 128))])])])),
                            _createElementVNode("div", _hoisted_569, [_createElementVNode("button", {
                              class: "btn",
                              disabled: lineageBusy||lineageData.page===1,
                              onClick: $event => (loadLineage(lineageData.page-1,true))
                            }, "上一页", 8, _hoisted_570), _createElementVNode("span", null, _toDisplayString(num(lineageData.total)) + " 行 · " + _toDisplayString(lineageData.page) + " / " + _toDisplayString(lineageData.pages), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: lineageBusy||lineageData.page===lineageData.pages,
                              onClick: $event => (loadLineage(lineageData.page+1,true))
                            }, "下一页", 8, _hoisted_571)])
                          ], 64))
                        : _createCommentVNode("", true)], 8, _hoisted_551))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='历史版本交付篮')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 8 }, [_createElementVNode("section", _hoisted_572, [_createElementVNode("div", _hoisted_573, [_createElementVNode("h2", null, "已选 " + _toDisplayString(bundleRows.length) + " / 100 个版本", 1), _createElementVNode("div", _hoisted_574, [_createElementVNode("button", {
                    class: "btn",
                    onClick: $event => (go('文件管理'))
                  }, "查找文件", 8, _hoisted_575), (demoBundle.length)
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        class: "btn",
                        onClick: loadDemoBundle
                      }, "载入示例交付清单", 8, _hoisted_576))
                    : _createCommentVNode("", true), _createElementVNode("button", {
                    class: "textbtn",
                    disabled: !bundleRows.length,
                    onClick: clearBundle
                  }, "清空交付篮", 8, _hoisted_577)])]), (!bundleRows.length)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_578, "在文件的历史版本或版本对比中加入要交付的副本。同一文件可选多个版本。"))
                    : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createElementVNode("div", _hoisted_579, [_createElementVNode("label", null, [_cache[217] || (_cache[217] = _createTextVNode("交付名称")), _withDirectives(_createElementVNode("input", {
                        "onUpdate:modelValue": $event => ((bundleLabel) = $event),
                        maxlength: "80",
                        placeholder: "历史版本交付",
                        onInput: invalidateBundle
                      }, null, 40, _hoisted_580), [[_vModelText, bundleLabel]])]), _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((bundlePaths) = $event),
                        onChange: invalidateBundle
                      }, null, 40, _hoisted_581), [[_vModelCheckbox, bundlePaths]]), _cache[218] || (_cache[218] = _createTextVNode("在清单中附最近登记的相对路径"))]), _createElementVNode("button", {
                        type: "button",
                        class: "primary",
                        disabled: bundleBusy,
                        onClick: previewBundle
                      }, "检查交付篮", 8, _hoisted_582)]), _cache[221] || (_cache[221] = _createElementVNode("p", null, "ZIP 使用固定版本编号命名成员。默认清单记录文件名，勾选后附相对路径。监控目录的绝对路径仅在此页显示。", -1)), _createElementVNode("details", _hoisted_583, [_cache[220] || (_cache[220] = _createElementVNode("summary", null, "核对所选版本", -1)), _createElementVNode("div", _hoisted_584, [_createElementVNode("table", _hoisted_585, [_cache[219] || (_cache[219] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [_createElementVNode("th", null, "文件"), _createElementVNode("th", null, "版本"), _createElementVNode("th", null, "操作")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(bundleRows, (row) => {
                        return (_openBlock(), _createElementBlock("tr", { key: row.id }, [_createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.rel), 1), _createElementVNode("small", null, _toDisplayString(row.root), 1)]), _createElementVNode("td", null, "V" + _toDisplayString(row.num) + " · #" + _toDisplayString(row.id), 1), _createElementVNode("td", null, [_createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: $event => (removeBundleVersion(row.id))
                        }, "移除", 8, _hoisted_586)])]))
                      }), 128))])])])])], 64))]), (bundleRows.length)
                    ? (_openBlock(), _createElementBlock("section", {
                        key: 0,
                        class: "card listcard",
                        "aria-busy": bundleBusy
                      }, [bundleBusy
                        ? (_openBlock(), _createElementBlock("p", _hoisted_588, "正在检查已选历史副本…"))
                        : _createCommentVNode("", true), bundleError
                        ? (_openBlock(), _createElementBlock("p", _hoisted_589, _toDisplayString(bundleError), 1))
                        : _createCommentVNode("", true), bundleData
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createElementVNode("div", _hoisted_590, [_createElementVNode("h2", null, _toDisplayString(bundleData.label), 1), _createElementVNode("div", _hoisted_591, [_createElementVNode("button", {
                              class: "btn",
                              disabled: !bundleData.complete,
                              onClick: $event => (exportBundle())
                            }, "导出所选明细 CSV", 8, _hoisted_592), _createElementVNode("button", {
                              class: "primary",
                              disabled: !bundleData.ready||(demo&&!bundleData.sample_zip),
                              onClick: $event => (exportBundle(true))
                            }, _toDisplayString(demo?'下载示例 ZIP':'生成交付 ZIP'), 9, _hoisted_593), _createElementVNode("button", {
                              class: "btn",
                              disabled: !bundleData.complete,
                              onClick: $event => (deliveryDialog(bundleActive,true))
                            }, "按交付篮核查 ZIP", 8, _hoisted_594)])]),
                            _createElementVNode("p", _hoisted_595, _toDisplayString(bundleData.total) + " 个版本 · " + _toDisplayString(bundleData.roots) + " 个监控目录 · " + _toDisplayString(bundleData.objects) + " 份不同正文 · " + _toDisplayString(bytes(bundleData.bytes)), 1),
                            (bundleData.ready)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_596, "打包前检查通过。写入时会逐份校验正文 SHA-256。"))
                              : _createCommentVNode("", true),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(bundleData.reasons, (reason) => {
                              return (_openBlock(), _createElementBlock("p", {
                                key: reason,
                                class: "error"
                              }, _toDisplayString(reason), 1))
                            }), 128)),
                            (demo&&!bundleData.sample_zip)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_597, "当前选择可预览与导出明细。载入示例交付清单可下载完整演示 ZIP。"))
                              : _createCommentVNode("", true),
                            _createElementVNode("div", _hoisted_598, [_createElementVNode("table", _hoisted_599, [_cache[222] || (_cache[222] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "包内路径"),
                              _createElementVNode("th", null, "历史版本"),
                              _createElementVNode("th", null, "字节和摘要"),
                              _createElementVNode("th", null, "打包前检查")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(bundleData.items, (row) => {
                              return (_openBlock(), _createElementBlock("tr", { key: row.version_id }, [
                                _createElementVNode("td", null, _toDisplayString(row.rel?'files/'+row.rel:'版本 #'+row.version_id), 1),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.name||'—'), 1), (row.num)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_600, "V" + _toDisplayString(row.num) + " · " + _toDisplayString(fmt(row.stamp)), 1))
                                  : _createCommentVNode("", true)]),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.size==null?'—':bytes(row.size)), 1), _createElementVNode("small", _hoisted_601, _toDisplayString(row.sha), 1)]),
                                _createElementVNode("td", null, _toDisplayString(row.source_state), 1)
                              ]))
                            }), 128))])])])
                          ], 64))
                        : _createCommentVNode("", true)], 8, _hoisted_587))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='路径沿革')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 9 }, [_createElementVNode("section", _hoisted_602, [_createElementVNode("form", { onSubmit: _withModifiers($event => (loadPath()), ["prevent"]) }, [_createElementVNode("div", _hoisted_604, [
                    _createElementVNode("label", null, [_cache[224] || (_cache[224] = _createTextVNode("查询范围")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((pathForm.mode) = $event),
                      onChange: $event => (pathForm.direction='')
                    }, _cache[223] || (_cache[223] = [_createElementVNode("option", { value: "path" }, "完整相对路径", -1), _createElementVNode("option", { value: "folder" }, "子目录及后代", -1), _createElementVNode("option", { value: "identity" }, "单个文件身份", -1)]), 40, _hoisted_605), [[_vModelSelect, pathForm.mode]])]),
                    _createElementVNode("label", null, [_cache[225] || (_cache[225] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((pathForm.root) = $event) }, [_createElementVNode("option", { value: 0 }, "全部目录", 8, _hoisted_607), (pathForm.root&&!s.roots.some(r=>r.id===pathForm.root))
                      ? (_openBlock(), _createElementBlock("option", {
                          key: 0,
                          value: pathForm.root
                        }, "目录 #" + _toDisplayString(pathForm.root), 9, _hoisted_608))
                      : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: r.id,
                        value: r.id
                      }, _toDisplayString(r.path), 9, _hoisted_609))
                    }), 128))], 8, _hoisted_606), [[
                      _vModelSelect,
                      pathForm.root,
                      void 0,
                      { number: true }
                    ]])]),
                    (pathForm.mode==='identity')
                      ? (_openBlock(), _createElementBlock("label", _hoisted_610, [_cache[226] || (_cache[226] = _createTextVNode("文件身份编号")), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: "1",
                          step: "1",
                          "onUpdate:modelValue": $event => ((pathForm.file) = $event),
                          required: ""
                        }, null, 8, _hoisted_611), [[
                          _vModelText,
                          pathForm.file,
                          void 0,
                          { number: true }
                        ]])]))
                      : (_openBlock(), _createElementBlock("label", _hoisted_612, [_cache[227] || (_cache[227] = _createTextVNode("相对路径")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((pathForm.rel) = $event),
                          required: "",
                          maxlength: "512",
                          placeholder: "例如 归档/交接.md"
                        }, null, 8, _hoisted_613), [[_vModelText, pathForm.rel]])])),
                    (pathForm.mode!=='identity')
                      ? (_openBlock(), _createElementBlock("label", _hoisted_614, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((pathForm.fold) = $event)
                        }, null, 8, _hoisted_615), [[_vModelCheckbox, pathForm.fold]]), _cache[228] || (_cache[228] = _createTextVNode("忽略路径大小写"))]))
                      : _createCommentVNode("", true),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((pathForm.structural) = $event)
                    }, null, 8, _hoisted_616), [[_vModelCheckbox, pathForm.structural]]), _cache[229] || (_cache[229] = _createTextVNode("仅建档、增删与重命名或移动"))])
                  ]), _createElementVNode("details", null, [_cache[240] || (_cache[240] = _createElementVNode("summary", null, "日期、类型与排序", -1)), _createElementVNode("div", _hoisted_617, [
                    _createElementVNode("label", null, [_cache[230] || (_cache[230] = _createTextVNode("开始日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((pathForm.start) = $event),
                      max: pathForm.end||undefined
                    }, null, 8, _hoisted_618), [[_vModelText, pathForm.start]])]),
                    _createElementVNode("label", null, [_cache[231] || (_cache[231] = _createTextVNode("结束日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((pathForm.end) = $event),
                      min: pathForm.start||undefined
                    }, null, 8, _hoisted_619), [[_vModelText, pathForm.end]])]),
                    _createElementVNode("label", null, [_cache[233] || (_cache[233] = _createTextVNode("事件类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((pathForm.kind) = $event) }, [_cache[232] || (_cache[232] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(kinds.filter(k=>k!=='已撤回'), (k) => {
                      return (_openBlock(), _createElementBlock("option", { key: k }, _toDisplayString(k), 1))
                    }), 128))], 8, _hoisted_620), [[_vModelSelect, pathForm.kind]])]),
                    _createElementVNode("label", null, [_cache[235] || (_cache[235] = _createTextVNode("路径关系")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((pathForm.direction) = $event) }, [_cache[234] || (_cache[234] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pathRelations, (k) => {
                      return (_openBlock(), _createElementBlock("option", { key: k }, _toDisplayString(k), 1))
                    }), 128))], 8, _hoisted_621), [[_vModelSelect, pathForm.direction]])]),
                    _createElementVNode("label", null, [_cache[236] || (_cache[236] = _createTextVNode("扫描来源")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((pathForm.source) = $event),
                      maxlength: "512",
                      placeholder: "按原文匹配"
                    }, null, 8, _hoisted_622), [[_vModelText, pathForm.source]])]),
                    _createElementVNode("label", null, [_cache[238] || (_cache[238] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((pathForm.sort) = $event) }, _cache[237] || (_cache[237] = [_createElementVNode("option", { value: "newest" }, "最近记录在前", -1), _createElementVNode("option", { value: "oldest" }, "最早记录在前", -1)]), 8, _hoisted_623), [[_vModelSelect, pathForm.sort]])]),
                    _createElementVNode("label", null, [_cache[239] || (_cache[239] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((pathForm.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50,100], (n) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: n,
                        value: n
                      }, _toDisplayString(n) + " 项", 9, _hoisted_625))
                    }), 128))], 8, _hoisted_624), [[
                      _vModelSelect,
                      pathForm.size,
                      void 0,
                      { number: true }
                    ]])])
                  ])]), _createElementVNode("div", _hoisted_626, [
                    _createElementVNode("button", {
                      type: "submit",
                      class: "primary",
                      disabled: pathBusy||!(pathForm.mode==='identity'?pathForm.file:pathForm.rel)
                    }, "查询沿革", 8, _hoisted_627),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: resetPath
                    }, "重置条件", 8, _hoisted_628),
                    pathPrevious
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          type: "button",
                          class: "btn",
                          onClick: restorePathScope
                        }, "返回原路径查询", 8, _hoisted_629))
                      : _createCommentVNode("", true),
                    demo
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 1,
                          type: "button",
                          class: "textbtn",
                          onClick: $event => (openPath({rel:'业务明细/仓库交接.md'}))
                        }, "查示例旧文件名", 8, _hoisted_630))
                      : _createCommentVNode("", true)
                  ])], 40, _hoisted_603), _cache[241] || (_cache[241] = _createElementVNode("details", null, [_createElementVNode("summary", null, "如何阅读路径沿革"), _createElementVNode("p", null, "路径模式核对每条可见事件的原路径与事件路径。进入、移出和删除表示系统记录到的动作。扫描间隔和日志处置可能留下空档，沿革无法确认任意时点的现场状态。子目录模式以斜杠为边界，匹配目录内各级文件。")], -1))]), _createElementVNode("section", {
                    class: "card listcard",
                    "aria-busy": pathBusy
                  }, [pathBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_632, "正在查询可见路径事件…"))
                    : _createCommentVNode("", true), pathError
                    ? (_openBlock(), _createElementBlock("p", _hoisted_633, _toDisplayString(pathError), 1))
                    : _createCommentVNode("", true), pathResult
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                        _createElementVNode("div", _hoisted_634, [_createElementVNode("h2", null, _toDisplayString(pathResult.mode==='identity'?'文件身份 #'+pathApplied.file:pathResult.path), 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: pathBusy||!pathResult.total,
                          onClick: exportPath
                        }, "导出沿革 CSV", 8, _hoisted_635)]),
                        _createElementVNode("p", _hoisted_636, [_createTextVNode(_toDisplayString(num(pathResult.total)) + " 条事件 · " + _toDisplayString(num(pathResult.identities)) + " 个文件身份 · " + _toDisplayString(num(pathResult.roots)) + " 个监控目录", 1), (pathResult.total)
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · " + _toDisplayString(fmt(pathResult.first)) + " 至 " + _toDisplayString(fmt(pathResult.last)), 1)], 64))
                          : _createCommentVNode("", true)]),
                        (pathResult.total||pathApplied.direction)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_637, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pathResult.counts, (count, direction) => {
                              return (_openBlock(), _createElementBlock("button", {
                                key: direction,
                                class: "btn",
                                "aria-pressed": pathApplied.direction===direction,
                                disabled: pathBusy,
                                onClick: $event => (filterPathRelation(direction))
                              }, _toDisplayString(direction) + " " + _toDisplayString(count), 9, _hoisted_638))
                            }), 128)), (pathApplied.direction)
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  class: "textbtn",
                                  disabled: pathBusy,
                                  onClick: $event => (filterPathRelation(pathApplied.direction))
                                }, "清除关系筛选", 8, _hoisted_639))
                              : _createCommentVNode("", true)]))
                          : _createCommentVNode("", true),
                        (pathResult.groups.length&&pathResult.mode!=='identity')
                          ? (_openBlock(), _createElementBlock("details", _hoisted_640, [_cache[243] || (_cache[243] = _createElementVNode("summary", null, "按文件身份查看", -1)), _createElementVNode("div", _hoisted_641, [_createElementVNode("table", null, [_cache[242] || (_cache[242] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "文件身份"),
                              _createElementVNode("th", null, "监控目录"),
                              _createElementVNode("th", null, "事件及时间范围"),
                              _createElementVNode("th", null, "操作")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pathResult.groups, (g) => {
                              return (_openBlock(), _createElementBlock("tr", { key: g.file_id }, [
                                _createElementVNode("td", null, "#" + _toDisplayString(g.file_id), 1),
                                _createElementVNode("td", null, _toDisplayString(g.root), 1),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(g.total) + " 条", 1), _createElementVNode("small", null, _toDisplayString(fmt(g.first)) + " 至 " + _toDisplayString(fmt(g.last)), 1)]),
                                _createElementVNode("td", null, [_createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (openPath(g,'identity'))
                                }, "跟踪此身份", 8, _hoisted_642)])
                              ]))
                            }), 128))])])]), (pathResult.identity_pages>1)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_643, [_createElementVNode("button", {
                                  class: "btn",
                                  disabled: pathBusy||pathResult.identity_page===1,
                                  onClick: $event => (loadPath(pathResult.page,pathResult.identity_page-1,true))
                                }, "上一组", 8, _hoisted_644), _createElementVNode("span", null, _toDisplayString(pathResult.identity_page) + " / " + _toDisplayString(pathResult.identity_pages), 1), _createElementVNode("button", {
                                  class: "btn",
                                  disabled: pathBusy||pathResult.identity_page===pathResult.identity_pages,
                                  onClick: $event => (loadPath(pathResult.page,pathResult.identity_page+1,true))
                                }, "下一组", 8, _hoisted_645)]))
                              : _createCommentVNode("", true)]))
                          : _createCommentVNode("", true),
                        (!pathResult.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_646, "当前条件下没有可见路径记录。"))
                          : (_openBlock(), _createElementBlock("div", _hoisted_647, [_createElementVNode("table", _hoisted_648, [_cache[244] || (_cache[244] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "时间与身份"),
                              _createElementVNode("th", null, "原路径"),
                              _createElementVNode("th", null, "事件路径"),
                              _createElementVNode("th", null, "关系与事件"),
                              _createElementVNode("th", null, "版本与来源"),
                              _createElementVNode("th", null, "操作")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pathResult.items, (row) => {
                              return (_openBlock(), _createElementBlock("tr", { key: row.id }, [
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(row.stamp)), 1), _createElementVNode("small", null, "身份 #" + _toDisplayString(row.file_id) + " · 事件 #" + _toDisplayString(row.id), 1), _createElementVNode("small", null, _toDisplayString(row.root), 1)]),
                                _createElementVNode("td", { class: _normalizeClass({'path-hit':row.old_match}) }, _toDisplayString(row.old_rel||'—'), 3),
                                _createElementVNode("td", { class: _normalizeClass({'path-hit':row.new_match}) }, _toDisplayString(row.rel), 3),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.direction), 1), _createElementVNode("small", null, _toDisplayString(row.kind), 1), (row.caption)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_649, _toDisplayString(row.caption), 1))
                                  : _createCommentVNode("", true)]),
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.prior?'V'+row.prior:'—') + " → " + _toDisplayString(row.version?'V'+row.version:'—'), 1), _createElementVNode("small", null, _toDisplayString(row.source), 1)]),
                                _createElementVNode("td", null, [_createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (openPathEvent(row))
                                }, "查看事件", 8, _hoisted_650), (pathResult.mode!=='identity')
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 0,
                                      class: "textbtn",
                                      onClick: $event => (openPath(row,'identity'))
                                    }, "跟踪此身份", 8, _hoisted_651))
                                  : _createCommentVNode("", true)])
                              ]))
                            }), 128))])])])),
                        (pathResult.pages>1)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_652, [_createElementVNode("button", {
                              class: "btn",
                              disabled: pathBusy||pathResult.page===1,
                              onClick: $event => (loadPath(pathResult.page-1,pathResult.identity_page,true))
                            }, "上一页", 8, _hoisted_653), _createElementVNode("span", null, _toDisplayString(pathResult.page) + " / " + _toDisplayString(pathResult.pages), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: pathBusy||pathResult.page===pathResult.pages,
                              onClick: $event => (loadPath(pathResult.page+1,pathResult.identity_page,true))
                            }, "下一页", 8, _hoisted_654)]))
                          : _createCommentVNode("", true)
                      ], 64))
                    : _createCommentVNode("", true)], 8, _hoisted_631)], 64))
                : _createCommentVNode("", true),
              (page==='清单三方对照')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 10 }, [_createElementVNode("section", _hoisted_655, [
                    _createElementVNode("div", _hoisted_656, [_createElementVNode("label", null, [_cache[245] || (_cache[245] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((triRoot) = $event),
                      onChange: loadTriList
                    }, [_createElementVNode("option", { value: 0 }, "选择目录", 8, _hoisted_658), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: r.id,
                        value: r.id
                      }, _toDisplayString(r.path), 9, _hoisted_659))
                    }), 128))], 40, _hoisted_657), [[
                      _vModelSelect,
                      triRoot,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("button", {
                      class: "btn",
                      disabled: triBusy||!triRoot,
                      onClick: loadTriList
                    }, "刷新清单", 8, _hoisted_660), _createElementVNode("button", {
                      class: "textbtn",
                      onClick: $event => (go('目录清单'))
                    }, "返回目录清单", 8, _hoisted_661)]),
                    (!triBusy&&triList.length<3)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_662, "同一目录至少需要三份清单。可在「目录清单」保存缺少的清单。"))
                      : _createCommentVNode("", true),
                    (triList.length>=3)
                      ? (_openBlock(), _createElementBlock("form", {
                          key: 1,
                          onSubmit: _withModifiers($event => (loadTri()), ["prevent"])
                        }, [_createElementVNode("div", _hoisted_664, [
                          _createElementVNode("label", null, [_cache[246] || (_cache[246] = _createTextVNode("基准")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.base) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triList, (c) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: c.id,
                              value: c.id
                            }, _toDisplayString(c.label) + " · " + _toDisplayString(fmt(c.stamp)), 9, _hoisted_666))
                          }), 128))], 8, _hoisted_665), [[
                            _vModelSelect,
                            triForm.base,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[247] || (_cache[247] = _createTextVNode("左侧")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.left) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triList, (c) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: c.id,
                              value: c.id
                            }, _toDisplayString(c.label) + " · " + _toDisplayString(fmt(c.stamp)), 9, _hoisted_668))
                          }), 128))], 8, _hoisted_667), [[
                            _vModelSelect,
                            triForm.left,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[248] || (_cache[248] = _createTextVNode("右侧")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.right) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triList, (c) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: c.id,
                              value: c.id
                            }, _toDisplayString(c.label) + " · " + _toDisplayString(fmt(c.stamp)), 9, _hoisted_670))
                          }), 128))], 8, _hoisted_669), [[
                            _vModelSelect,
                            triForm.right,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: triBusy,
                            onClick: swapTri
                          }, "交换左右", 8, _hoisted_671)
                        ]), _createElementVNode("details", null, [_cache[259] || (_cache[259] = _createElementVNode("summary", null, "筛选项与排序", -1)), _createElementVNode("div", _hoisted_672, [
                          _createElementVNode("label", null, [_cache[249] || (_cache[249] = _createTextVNode("路径关键词")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((triForm.q) = $event),
                            maxlength: "512",
                            placeholder: "任一侧的路径片段"
                          }, null, 8, _hoisted_673), [[_vModelText, triForm.q]])]),
                          _createElementVNode("label", null, [_cache[250] || (_cache[250] = _createTextVNode("后缀")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((triForm.ext) = $event),
                            maxlength: "512",
                            placeholder: "例如 xlsx, csv"
                          }, null, 8, _hoisted_674), [[_vModelText, triForm.ext]])]),
                          _createElementVNode("label", null, [_cache[252] || (_cache[252] = _createTextVNode("三方结果")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.kind) = $event) }, [_cache[251] || (_cache[251] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triKinds, (k) => {
                            return (_openBlock(), _createElementBlock("option", { key: k }, _toDisplayString(k), 1))
                          }), 128))], 8, _hoisted_675), [[_vModelSelect, triForm.kind]])]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((triForm.unchanged) = $event)
                          }, null, 8, _hoisted_676), [[_vModelCheckbox, triForm.unchanged]]), _cache[253] || (_cache[253] = _createTextVNode("包含相同项"))]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((triForm.issues) = $event)
                          }, null, 8, _hoisted_677), [[_vModelCheckbox, triForm.issues]]), _cache[254] || (_cache[254] = _createTextVNode("仅需复核"))]),
                          _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((triForm.collision) = $event)
                          }, null, 8, _hoisted_678), [[_vModelCheckbox, triForm.collision]]), _cache[255] || (_cache[255] = _createTextVNode("仅路径争用"))]),
                          _createElementVNode("label", null, [_cache[257] || (_cache[257] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.sort) = $event) }, _cache[256] || (_cache[256] = [
                            _createElementVNode("option", { value: "review" }, "需复核优先", -1),
                            _createElementVNode("option", { value: "path" }, "按路径", -1),
                            _createElementVNode("option", { value: "left" }, "左侧字节变化幅度", -1),
                            _createElementVNode("option", { value: "right" }, "右侧字节变化幅度", -1),
                            _createElementVNode("option", { value: "impact" }, "任一侧最大字节变化", -1)
                          ]), 8, _hoisted_679), [[_vModelSelect, triForm.sort]])]),
                          _createElementVNode("label", null, [_cache[258] || (_cache[258] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((triForm.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50,100], (n) => {
                            return (_openBlock(), _createElementBlock("option", {
                              key: n,
                              value: n
                            }, _toDisplayString(n) + " 项", 9, _hoisted_681))
                          }), 128))], 8, _hoisted_680), [[
                            _vModelSelect,
                            triForm.size,
                            void 0,
                            { number: true }
                          ]])])
                        ])]), _createElementVNode("div", _hoisted_682, [_createElementVNode("button", {
                          class: "primary",
                          disabled: triBusy
                        }, "对照三份清单", 8, _hoisted_683), _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: triBusy,
                          onClick: resetTriFilters
                        }, "重置筛选", 8, _hoisted_684)])], 40, _hoisted_663))
                      : _createCommentVNode("", true),
                    _cache[260] || (_cache[260] = _createElementVNode("details", null, [_createElementVNode("summary", null, "结果如何判定"), _createElementVNode("p", null, "同一文件按仓库身份对齐，独立比较路径和正文摘要。两侧变更涉及不同维度时可得到互补候选；同一维度改为不同结果或一侧移出、另一侧变动时需要复核。"), _createElementVNode("p", null, "候选路径在忽略大小写和 Unicode 规范化后相同，或一条路径将另一条路径用作目录时，会标记路径争用。候选仅用于复核，现场文件保持原状。")], -1))
                  ]), _createElementVNode("section", {
                    class: "card listcard",
                    "aria-busy": triBusy
                  }, [triBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_686, "正在读取三份清单…"))
                    : _createCommentVNode("", true), triError
                    ? (_openBlock(), _createElementBlock("p", _hoisted_687, _toDisplayString(triError), 1))
                    : _createCommentVNode("", true), triData
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                        _createElementVNode("div", _hoisted_688, [_cache[261] || (_cache[261] = _createElementVNode("h2", null, "三方对照结果", -1)), _createElementVNode("button", {
                          class: "btn",
                          disabled: triBusy||!triData.total,
                          onClick: exportTri
                        }, "导出三方 CSV", 8, _hoisted_689)]),
                        _createElementVNode("div", _hoisted_690, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['基准','左侧','右侧'], (label, i) => {
                          return (_openBlock(), _createElementBlock("span", { key: label }, [_createElementVNode("b", null, _toDisplayString(label), 1), _createTextVNode(" " + _toDisplayString(triData.meta[['base','left','right'][i]].label), 1), _createElementVNode("small", null, "保存 " + _toDisplayString(fmt(triData.meta[['base','left','right'][i]].stamp)) + " · 扫描 " + _toDisplayString(fmt(triData.meta[['base','left','right'][i]].last_scan)), 1)]))
                        }), 128))]),
                        _createElementVNode("p", _hoisted_691, _toDisplayString(num(triData.total)) + " 项 · " + _toDisplayString(num(triData.review)) + " 项需复核 · " + _toDisplayString(num(triData.collisions)) + " 项路径争用 · 左侧净变化 " + _toDisplayString(num(triData.left_delta)) + " 字节 · 右侧净变化 " + _toDisplayString(num(triData.right_delta)) + " 字节", 1),
                        (triData.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_692, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triData.counts, (count, kind) => {
                              return (_openBlock(), _createElementBlock("span", { key: kind }, _toDisplayString(kind) + " " + _toDisplayString(count) + "　", 1))
                            }), 128))]))
                          : _createCommentVNode("", true),
                        (!triData.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_693, "当前筛选没有匹配项目。"))
                          : (_openBlock(), _createElementBlock("div", _hoisted_694, [_createElementVNode("table", _hoisted_695, [_cache[264] || (_cache[264] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "文件身份与结果"),
                              _createElementVNode("th", null, "基准"),
                              _createElementVNode("th", null, "左侧"),
                              _createElementVNode("th", null, "右侧"),
                              _createElementVNode("th", null, "候选与复核")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(triData.items, (row) => {
                              return (_openBlock(), _createElementBlock("tr", { key: row.file_id }, [_createElementVNode("td", null, [_createTextVNode("#" + _toDisplayString(row.file_id), 1), _createElementVNode("small", null, _toDisplayString(row.kind), 1), (row.review)
                                ? (_openBlock(), _createElementBlock("span", _hoisted_696, "需复核"))
                                : _createCommentVNode("", true)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['base','left','right'], (side) => {
                                return (_openBlock(), _createElementBlock("td", { key: side }, [(row[side])
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(_toDisplayString(row[side].rel), 1), _createElementVNode("small", null, [_createElementVNode("button", {
                                      class: "textbtn",
                                      onClick: $event => (openTriVersion(row,row[side]))
                                    }, "V" + _toDisplayString(row[side].num), 9, _hoisted_697), _createTextVNode(" · " + _toDisplayString(bytes(row[side].size)), 1)]), _createElementVNode("details", null, [_cache[262] || (_cache[262] = _createElementVNode("summary", null, "保存时间与摘要", -1)), _createElementVNode("small", null, _toDisplayString(fmt(row[side].stamp)), 1), _createElementVNode("small", _hoisted_698, _toDisplayString(row[side].sha), 1)])], 64))
                                  : (_openBlock(), _createElementBlock("span", _hoisted_699, "缺席")), (side!=='base')
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_700, _toDisplayString(row[side+'_kind']) + " · " + _toDisplayString(num(row[side+'_delta'])) + " 字节", 1))
                                  : _createCommentVNode("", true)]))
                              }), 128)), _createElementVNode("td", null, [(row.collision)
                                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_cache[263] || (_cache[263] = _createElementVNode("b", { class: "error" }, "路径争用", -1)), _createElementVNode("small", null, _toDisplayString(row.collision) + " · 另 " + _toDisplayString(row.other_count) + " 个身份", 1), _createElementVNode("small", null, "#" + _toDisplayString(row.others.join('、#')) + _toDisplayString(row.other_count>row.others.length?' 等':''), 1)], 64))
                                : (row.candidate_path)
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createTextVNode(_toDisplayString(row.candidate_path), 1), _createElementVNode("small", _hoisted_701, _toDisplayString(row.candidate_sha), 1)], 64))
                                  : (_openBlock(), _createElementBlock("span", _hoisted_702, _toDisplayString(row.review?'待核对':'结果缺席'), 1)), _createElementVNode("div", _hoisted_703, [(row.base&&row.left&&row.base.id!==row.left.id)
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 0,
                                    class: "textbtn",
                                    onClick: $event => (openTriVersion(row,row.base,row.left))
                                  }, "基准与左侧", 8, _hoisted_704))
                                : _createCommentVNode("", true), (row.base&&row.right&&row.base.id!==row.right.id)
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 1,
                                    class: "textbtn",
                                    onClick: $event => (openTriVersion(row,row.base,row.right))
                                  }, "基准与右侧", 8, _hoisted_705))
                                : _createCommentVNode("", true), (row.left&&row.right&&row.left.id!==row.right.id)
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 2,
                                    class: "textbtn",
                                    onClick: $event => (openTriVersion(row,row.left,row.right))
                                  }, "左侧与右侧", 8, _hoisted_706))
                                : _createCommentVNode("", true)])])]))
                            }), 128))])])])),
                        (triData.pages>1)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_707, [_createElementVNode("button", {
                              class: "btn",
                              disabled: triBusy||triData.page===1,
                              onClick: $event => (loadTri(triData.page-1,true))
                            }, "上一页", 8, _hoisted_708), _createElementVNode("span", null, _toDisplayString(triData.page) + " / " + _toDisplayString(triData.pages), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: triBusy||triData.page===triData.pages,
                              onClick: $event => (loadTri(triData.page+1,true))
                            }, "下一页", 8, _hoisted_709)]))
                          : _createCommentVNode("", true)
                      ], 64))
                    : _createCommentVNode("", true)], 8, _hoisted_685)], 64))
                : _createCommentVNode("", true),
              (page==='历史原件预览')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 11 }, [_createElementVNode("section", _hoisted_710, [
                    _createElementVNode("div", _hoisted_711, [_createElementVNode("h2", null, _toDisplayString(snapshotFile?.rel||'选择一个历史版本'), 1), _createElementVNode("div", _hoisted_712, [
                      snapshotBack
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 0,
                            class: "btn",
                            onClick: $event => (go(snapshotBack))
                          }, "返回" + _toDisplayString(snapshotBack), 9, _hoisted_713))
                        : _createCommentVNode("", true),
                      _createElementVNode("button", {
                        class: "btn",
                        onClick: $event => (go('文件管理'))
                      }, "查找文件", 8, _hoisted_714),
                      (demoSnapshots.text)
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 1,
                            class: "textbtn",
                            onClick: $event => (openSnapshot(demoSnapshots.text))
                          }, "查看示例文本", 8, _hoisted_715))
                        : _createCommentVNode("", true),
                      (demoSnapshots.hex)
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 2,
                            class: "textbtn",
                            onClick: $event => (openSnapshot(demoSnapshots.hex))
                          }, "查看示例字节", 8, _hoisted_716))
                        : _createCommentVNode("", true)
                    ])]),
                    (snapshotFile?.root)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_717, _toDisplayString(snapshotFile.root), 1))
                      : _createCommentVNode("", true),
                    (!snapshotFile)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_718, "在文件历史、版本对比或历史正文命中处打开所需版本。"))
                      : (_openBlock(), _createElementBlock("form", {
                          key: 2,
                          onSubmit: _withModifiers($event => (loadSnapshot()), ["prevent"])
                        }, [_createElementVNode("div", _hoisted_720, [
                          _createElementVNode("label", null, [_cache[265] || (_cache[265] = _createTextVNode("历史版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((snapshotForm.id) = $event),
                            onChange: $event => (resetSnapshotView()),
                            disabled: snapshotBusy
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(snapshotVersions, (v) => {
                            return (_openBlock(), _createElementBlock("option", {
                              value: v.id,
                              key: v.id
                            }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)) + " · " + _toDisplayString(bytes(v.size)), 9, _hoisted_722))
                          }), 128))], 40, _hoisted_721), [[
                            _vModelSelect,
                            snapshotForm.id,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_cache[267] || (_cache[267] = _createTextVNode("查看方式")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((snapshotForm.mode) = $event),
                            onChange: $event => (resetSnapshotView()),
                            disabled: snapshotBusy
                          }, _cache[266] || (_cache[266] = [_createElementVNode("option", { value: "auto" }, "自动", -1), _createElementVNode("option", { value: "text" }, "文本", -1), _createElementVNode("option", { value: "hex" }, "十六进制", -1)]), 40, _hoisted_723), [[_vModelSelect, snapshotForm.mode]])]),
                          snapshotShowsHex
                            ? (_openBlock(), _createElementBlock("label", _hoisted_724, [_cache[268] || (_cache[268] = _createTextVNode("每行字节")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((snapshotForm.width) = $event) }, [_createElementVNode("option", { value: 16 }, "16 字节", 8, _hoisted_726), _createElementVNode("option", { value: 32 }, "32 字节", 8, _hoisted_727)], 8, _hoisted_725), [[
                                _vModelSelect,
                                snapshotForm.width,
                                void 0,
                                { number: true }
                              ]])]))
                            : _createCommentVNode("", true),
                          _createElementVNode("label", null, [_cache[269] || (_cache[269] = _createTextVNode("每页")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((snapshotForm.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([20,50,100], (n) => {
                            return (_openBlock(), _createElementBlock("option", {
                              value: n,
                              key: n
                            }, _toDisplayString(n) + " 行", 9, _hoisted_729))
                          }), 128))], 8, _hoisted_728), [[
                            _vModelSelect,
                            snapshotForm.size,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_createTextVNode(_toDisplayString(snapshotShowsHex?'十六进制字节序列':'正文关键词'), 1), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((snapshotForm.q) = $event),
                            maxlength: "160",
                            placeholder: snapshotShowsHex?'例如 50 4B 03 04':'例如 RK-001'
                          }, null, 8, _hoisted_730), [[_vModelText, snapshotForm.q]])])
                        ]), _createElementVNode("details", null, [_cache[272] || (_cache[272] = _createElementVNode("summary", null, "位置与匹配", -1)), _createElementVNode("div", _hoisted_731, [
                          _createElementVNode("label", null, [_createTextVNode(_toDisplayString(snapshotShowsHex?'起始字节偏移':'起始行号'), 1), _withDirectives(_createElementVNode("input", {
                            type: "number",
                            step: "1",
                            min: snapshotShowsHex?0:1,
                            "onUpdate:modelValue": $event => ((snapshotForm.low) = $event)
                          }, null, 8, _hoisted_732), [[
                            _vModelText,
                            snapshotForm.low,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_createTextVNode(_toDisplayString(snapshotShowsHex?'结束字节偏移':'结束行号'), 1), _withDirectives(_createElementVNode("input", {
                            type: "number",
                            step: "1",
                            min: snapshotShowsHex?0:1,
                            "onUpdate:modelValue": $event => ((snapshotForm.high) = $event)
                          }, null, 8, _hoisted_733), [[
                            _vModelText,
                            snapshotForm.high,
                            void 0,
                            { number: true }
                          ]])]),
                          _createElementVNode("label", null, [_createTextVNode(_toDisplayString(snapshotShowsHex?'跳到十进制字节偏移':'跳到行号'), 1), _withDirectives(_createElementVNode("input", {
                            type: "number",
                            step: "1",
                            min: snapshotShowsHex?0:1,
                            "onUpdate:modelValue": $event => ((snapshotForm.at) = $event)
                          }, null, 8, _hoisted_734), [[
                            _vModelText,
                            snapshotForm.at,
                            void 0,
                            { number: true }
                          ]])]),
                          (!snapshotShowsHex)
                            ? (_openBlock(), _createElementBlock("label", _hoisted_735, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((snapshotForm.exact) = $event)
                              }, null, 8, _hoisted_736), [[_vModelCheckbox, snapshotForm.exact]]), _cache[270] || (_cache[270] = _createTextVNode("整行匹配"))]))
                            : _createCommentVNode("", true),
                          (!snapshotShowsHex)
                            ? (_openBlock(), _createElementBlock("label", _hoisted_737, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((snapshotForm.sensitive) = $event)
                              }, null, 8, _hoisted_738), [[_vModelCheckbox, snapshotForm.sensitive]]), _cache[271] || (_cache[271] = _createTextVNode("区分大小写"))]))
                            : _createCommentVNode("", true)
                        ])]), _createElementVNode("div", _hoisted_739, [_createElementVNode("button", {
                          class: "primary",
                          disabled: snapshotBusy||!snapshotVersions.length
                        }, "更新预览", 8, _hoisted_740), _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: snapshotBusy||!snapshotVersions.length,
                          onClick: resetSnapshotView
                        }, "清空范围与检索", 8, _hoisted_741), (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "btn",
                              disabled: !snapshotVersions.length,
                              onClick: saveSnapshotOriginal
                            }, "另存原件", 8, _hoisted_742))
                          : _createCommentVNode("", true)])], 40, _hoisted_719)),
                    _createElementVNode("details", null, [_cache[273] || (_cache[273] = _createElementVNode("summary", null, "预览范围和编码", -1)), _cache[274] || (_cache[274] = _createElementVNode("p", null, "预览校验历史副本大小与 SHA-256，每个快照最多 2 MiB。文本模式按物理行显示，十六进制模式的字节偏移从 0 开始，位置输入使用十进制。直接定位会显示指定位置所在页，筛选后可定位到下一条匹配记录。", -1)), demo
                      ? (_openBlock(), _createElementBlock("p", _hoisted_743, "离线样例提供文本版本和一个工作簿的原始字节。"))
                      : _createCommentVNode("", true)])
                  ]), snapshotFile
                    ? (_openBlock(), _createElementBlock("section", {
                        key: 0,
                        class: "card listcard",
                        "aria-busy": snapshotBusy
                      }, [snapshotBusy
                        ? (_openBlock(), _createElementBlock("p", _hoisted_745, "正在校验并读取历史原件…"))
                        : _createCommentVNode("", true), snapshotError
                        ? (_openBlock(), _createElementBlock("p", _hoisted_746, _toDisplayString(snapshotError), 1))
                        : _createCommentVNode("", true), snapshotData
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createElementVNode("div", _hoisted_747, [_createElementVNode("h2", null, "V" + _toDisplayString(snapshotData.meta.num) + " · " + _toDisplayString(snapshotData.mode==='text'?'文本':'十六进制'), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: snapshotBusy||!snapshotData.total,
                              onClick: exportSnapshot
                            }, "导出预览 CSV", 8, _hoisted_748)]),
                            _createElementVNode("p", null, _toDisplayString(fmt(snapshotData.meta.stamp)) + " · " + _toDisplayString(snapshotData.meta.ext||'无后缀') + " · " + _toDisplayString(bytes(snapshotData.meta.size)) + " · " + _toDisplayString(snapshotData.meta.status) + " · 归档校验通过", 1),
                            _createElementVNode("p", _hoisted_749, "SHA-256 " + _toDisplayString(snapshotData.meta.sha), 1),
                            (snapshotData.fallback)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_750, _toDisplayString(snapshotData.fallback), 1))
                              : _createCommentVNode("", true),
                            (snapshotData.encoding)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_751, [_createTextVNode(_toDisplayString(snapshotData.encoding), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(snapshotData.endings, (count, ending) => {
                                  return (_openBlock(), _createElementBlock(_Fragment, { key: ending }, [count
                                    ? (_openBlock(), _createElementBlock("span", _hoisted_752, " · " + _toDisplayString(ending==='无'?'无行尾换行':ending) + " " + _toDisplayString(count) + " 行", 1))
                                    : _createCommentVNode("", true)], 64))
                                }), 128))]))
                              : _createCommentVNode("", true),
                            _createElementVNode("p", _hoisted_753, _toDisplayString(num(snapshotData.units)) + " " + _toDisplayString(snapshotData.mode==='text'?'行原文':'个原始字节') + " · 当前范围 " + _toDisplayString(num(snapshotData.total)) + " 行", 1),
                            (!snapshotData.total)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_754, _toDisplayString(snapshotData.units?'当前范围没有匹配项。':'此历史原件为空。'), 1))
                              : (_openBlock(), _createElementBlock("div", _hoisted_755, [(snapshotData.mode==='text')
                                  ? (_openBlock(), _createElementBlock("table", _hoisted_756, [_cache[275] || (_cache[275] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [_createElementVNode("th", null, "行号"), _createElementVNode("th", null, "原文"), _createElementVNode("th", null, "行尾")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(snapshotData.items, (row) => {
                                      return (_openBlock(), _createElementBlock("tr", {
                                        key: row.pos,
                                        class: _normalizeClass({'snapshot-focus':snapshotData.at===row.pos})
                                      }, [_createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.pos), 1), (row.match)
                                        ? (_openBlock(), _createElementBlock("small", _hoisted_757, "第 " + _toDisplayString(row.match) + " 列", 1))
                                        : _createCommentVNode("", true)]), _createElementVNode("td", null, [(row.left||row.hit||row.right)
                                        ? (_openBlock(), _createElementBlock("code", _hoisted_758, [_createTextVNode(_toDisplayString(row.before?'…':'') + _toDisplayString(row.left), 1), (row.hit)
                                            ? (_openBlock(), _createElementBlock("mark", _hoisted_759, _toDisplayString(row.hit), 1))
                                            : _createCommentVNode("", true), _createTextVNode(_toDisplayString(row.right) + _toDisplayString(row.after?'…':''), 1)]))
                                        : (_openBlock(), _createElementBlock("span", _hoisted_760, "（空行）"))]), _createElementVNode("td", null, [_createTextVNode(_toDisplayString(row.ending), 1), (canTraceLines(snapshotData.meta))
                                        ? (_openBlock(), _createElementBlock("button", {
                                            key: 0,
                                            class: "textbtn",
                                            onClick: $event => (openLineage(snapshotData.meta,row.pos))
                                          }, "逐行来源", 8, _hoisted_761))
                                        : _createCommentVNode("", true)])], 2))
                                    }), 128))])]))
                                  : (_openBlock(), _createElementBlock("table", _hoisted_762, [_cache[276] || (_cache[276] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [_createElementVNode("th", null, "字节偏移"), _createElementVNode("th", null, "十六进制"), _createElementVNode("th", null, "ASCII")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(snapshotData.items, (row) => {
                                      return (_openBlock(), _createElementBlock("tr", {
                                        key: row.pos,
                                        class: _normalizeClass({'snapshot-focus':snapshotData.at!==null&&row.pos<=snapshotData.at&&row.end>=snapshotData.at})
                                      }, [_createElementVNode("td", null, [_createElementVNode("code", null, "0x" + _toDisplayString(row.pos.toString(16).toUpperCase().padStart(8,'0')), 1), _createElementVNode("small", null, _toDisplayString(row.pos) + "–" + _toDisplayString(row.end), 1), (row.match!==null)
                                        ? (_openBlock(), _createElementBlock("small", _hoisted_763, "匹配 " + _toDisplayString(row.match), 1))
                                        : _createCommentVNode("", true)]), _createElementVNode("td", _hoisted_764, [_createElementVNode("code", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(row.cells, (cell, i) => {
                                        return (_openBlock(), _createElementBlock("span", {
                                          key: i,
                                          class: _normalizeClass({'snapshot-byte-hit':row.match!==null&&row.pos+i>=row.match&&row.pos+i<row.match+row.match_size})
                                        }, _toDisplayString(cell), 3))
                                      }), 128))])]), _createElementVNode("td", null, [_createElementVNode("code", null, _toDisplayString(row.ascii), 1)])], 2))
                                    }), 128))])]))])),
                            _createElementVNode("div", _hoisted_765, [_createElementVNode("button", {
                              class: "btn",
                              disabled: snapshotBusy||snapshotData.page===1,
                              onClick: $event => (loadSnapshot(snapshotData.page-1,true))
                            }, "上一页", 8, _hoisted_766), _createElementVNode("span", null, _toDisplayString(snapshotData.page) + " / " + _toDisplayString(snapshotData.pages), 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: snapshotBusy||snapshotData.page===snapshotData.pages,
                              onClick: $event => (loadSnapshot(snapshotData.page+1,true))
                            }, "下一页", 8, _hoisted_767)])
                          ], 64))
                        : _createCommentVNode("", true)], 8, _hoisted_744))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='目录清单')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 12 }, [_createElementVNode("section", _hoisted_768, [
                    _cache[281] || (_cache[281] = _createElementVNode("h2", null, "保存与选择清单", -1)),
                    _createElementVNode("button", {
                      class: "btn",
                      onClick: fromCheckpointThree
                    }, "打开清单三方对照", 8, _hoisted_769),
                    _createElementVNode("button", {
                      class: "btn",
                      disabled: !cpNew,
                      onClick: inventoryDialog
                    }, "查看目标清单成员与交付", 8, _hoisted_770),
                    _createElementVNode("label", null, [_cache[277] || (_cache[277] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpRoot) = $event),
                      onChange: $event => {cpLabel='';loadCheckpoints()}
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_772))
                    }), 256))], 40, _hoisted_771), [[
                      _vModelSelect,
                      cpRoot,
                      void 0,
                      { number: true }
                    ]])]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_773, [_createElementVNode("label", null, [_cache[278] || (_cache[278] = _createTextVNode("新清单名称")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((cpLabel) = $event),
                          maxlength: "80",
                          placeholder: "例如 月末交接前"
                        }, null, 8, _hoisted_774), [[_vModelText, cpLabel]])]), _createElementVNode("button", {
                          class: "btn",
                          onClick: saveCheckpoint,
                          disabled: !cpRoot||!cpLabel.trim()||cpBusy
                        }, "保存当前在册清单", 8, _hoisted_775)]))
                      : _createCommentVNode("", true),
                    (checkpoints.length<2)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_776, "至少需要同一目录的两份清单才能对照。"))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_777, [_createElementVNode("label", null, [_cache[279] || (_cache[279] = _createTextVNode("原清单")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpOld) = $event),
                      onChange: $event => (loadCheckpointDiff())
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints, (c) => {
                      return (_openBlock(), _createElementBlock("option", { value: c.id }, _toDisplayString(c.label) + " · " + _toDisplayString(c.files) + " 个文件", 9, _hoisted_779))
                    }), 256))], 40, _hoisted_778), [[
                      _vModelSelect,
                      cpOld,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("button", {
                      class: "btn",
                      disabled: !cpOld||!cpNew||cpOld===cpNew,
                      onClick: $event => {[cpOld,cpNew]=[cpNew,cpOld];loadCheckpointDiff()}
                    }, "交换", 8, _hoisted_780), _createElementVNode("label", null, [_cache[280] || (_cache[280] = _createTextVNode("目标清单")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpNew) = $event),
                      onChange: $event => (loadCheckpointDiff())
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints, (c) => {
                      return (_openBlock(), _createElementBlock("option", { value: c.id }, _toDisplayString(c.label) + " · " + _toDisplayString(c.files) + " 个文件", 9, _hoisted_782))
                    }), 256))], 40, _hoisted_781), [[
                      _vModelSelect,
                      cpNew,
                      void 0,
                      { number: true }
                    ]])])]),
                    (cpOld&&cpOld===cpNew)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_783, "请选择两份不同清单。"))
                      : _createCommentVNode("", true),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints.filter(x=>x.id===cpOld||x.id===cpNew), (c) => {
                      return (_openBlock(), _createElementBlock("small", null, _toDisplayString(c.label) + " · 扫描 " + _toDisplayString(fmt(c.last_scan)) + " · " + _toDisplayString(bytes(c.bytes)) + "　", 1))
                    }), 256))
                  ]), (cpOld&&cpNew&&cpOld!==cpNew)
                    ? (_openBlock(), _createElementBlock("section", _hoisted_784, [_createElementVNode("div", _hoisted_785, [
                        _createElementVNode("label", null, [_cache[282] || (_cache[282] = _createTextVNode("路径关键词")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((cpQ) = $event),
                          onInput: $event => (loadCheckpointDiff()),
                          placeholder: "原路径或现路径"
                        }, null, 40, _hoisted_786), [[_vModelText, cpQ]])]),
                        _createElementVNode("label", null, [_cache[284] || (_cache[284] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((cpKind) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, [_cache[283] || (_cache[283] = _createElementVNode("option", { value: "" }, "全部变化", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','移出','内容修改','路径变更','路径与内容变更','相同'], (k) => {
                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                        }), 256))], 40, _hoisted_787), [[_vModelSelect, cpKind]])]),
                        _createElementVNode("label", null, [_cache[286] || (_cache[286] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((cpSort) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, _cache[285] || (_cache[285] = [
                          _createElementVNode("option", { value: "" }, "按路径", -1),
                          _createElementVNode("option", { value: "growth" }, "增长最多", -1),
                          _createElementVNode("option", { value: "shrink" }, "减少最多", -1),
                          _createElementVNode("option", { value: "change" }, "体积变化最大", -1)
                        ]), 40, _hoisted_788), [[_vModelSelect, cpSort]])]),
                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((cpSame) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, null, 40, _hoisted_789), [[_vModelCheckbox, cpSame]]), _cache[287] || (_cache[287] = _createTextVNode("包括相同项"))]),
                        _createElementVNode("button", {
                          class: "btn",
                          disabled: !cpData?.total,
                          onClick: exportCheckpoints
                        }, "导出对照 CSV", 8, _hoisted_790)
                      ]), cpBusy
                        ? (_openBlock(), _createElementBlock("p", _hoisted_791, "正在读取清单…"))
                        : _createCommentVNode("", true), cpData
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createElementVNode("p", null, "匹配 " + _toDisplayString(cpData.total) + " 项 · 净变化 " + _toDisplayString(cpData.delta) + " 字节", 1),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cpData.counts, (count, kind) => {
                              return (_openBlock(), _createElementBlock("small", null, _toDisplayString(kind) + " " + _toDisplayString(count) + "　", 1))
                            }), 256)),
                            _createElementVNode("div", _hoisted_792, [_createElementVNode("table", null, [_cache[288] || (_cache[288] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "变化"),
                              _createElementVNode("th", null, "原路径"),
                              _createElementVNode("th", null, "现路径"),
                              _createElementVNode("th", null, "版本"),
                              _createElementVNode("th", null, "字节变化"),
                              _createElementVNode("th", null, "查看")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cpData.items, (r) => {
                              return (_openBlock(), _createElementBlock("tr", { key: r.file_id }, [
                                _createElementVNode("td", null, _toDisplayString(r.kind), 1),
                                _createElementVNode("td", null, _toDisplayString(r.old_path||'—'), 1),
                                _createElementVNode("td", null, _toDisplayString(r.new_path||'—'), 1),
                                _createElementVNode("td", null, _toDisplayString(r.old_num||'—') + " → " + _toDisplayString(r.new_num||'—'), 1),
                                _createElementVNode("td", null, _toDisplayString(r.delta), 1),
                                _createElementVNode("td", null, [_createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (openCheckpointRow(r))
                                }, _toDisplayString(r.old&&r.new&&r.old!==r.new?'对比版本':'版本历史'), 9, _hoisted_793)])
                              ]))
                            }), 128))])])]),
                            (!cpData.total)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_794, "没有符合条件的文件。"))
                              : _createCommentVNode("", true),
                            _createElementVNode("div", _hoisted_795, [_createElementVNode("button", {
                              class: "btn",
                              disabled: cpPage<=1,
                              onClick: $event => (loadCheckpointDiff(cpPage-1))
                            }, "上一页", 8, _hoisted_796), _createElementVNode("span", null, "第 " + _toDisplayString(cpPage) + " 页", 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: cpPage*cpData.size>=cpData.total,
                              onClick: $event => (loadCheckpointDiff(cpPage+1))
                            }, "下一页", 8, _hoisted_797)])
                          ], 64))
                        : _createCommentVNode("", true)]))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='系统设置')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 13 }, [_createElementVNode("section", _hoisted_798, [_cache[289] || (_cache[289] = _createElementVNode("h2", null, "后台引擎状态", -1)), _createElementVNode("div", null, [_createElementVNode("label", null, _toDisplayString(demo?'示例进程':'当前进程') + " " + _toDisplayString(runtime?.pid||'—'), 1), _createElementVNode("button", {
                    class: "btn",
                    onClick: loadRuntime
                  }, "刷新状态", 8, _hoisted_799)]), runtime
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        _createElementVNode("p", null, "启动 " + _toDisplayString(fmt(runtime.started)) + " · 已运行 " + _toDisplayString(runtime.uptime) + " 秒 · " + _toDisplayString(runtime.watch), 1),
                        _createElementVNode("p", null, [_createTextVNode("待扫描目录 " + _toDisplayString(runtime.queued) + " · 待解析版本 " + _toDisplayString(runtime.parsing) + " · 等待文件 " + _toDisplayString(runtime.waiting), 1), (runtime.due_in!==null)
                          ? (_openBlock(), _createElementBlock("span", _hoisted_800, " · 最早任务约 " + _toDisplayString(runtime.due_in) + " 秒后到期", 1))
                          : _createCommentVNode("", true)]),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(runtime.beats, (stamp, name) => {
                          return (_openBlock(), _createElementBlock("p", null, _toDisplayString(name) + "最近活动 · " + _toDisplayString(fmt(stamp)), 1))
                        }), 256)),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(runtime.faults, (stamp, name) => {
                          return (_openBlock(), _createElementBlock("p", _hoisted_801, _toDisplayString(name) + " · " + _toDisplayString(fmt(stamp)), 1))
                        }), 256))
                      ], 64))
                    : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_802, [
                    _cache[295] || (_cache[295] = _createElementVNode("h2", null, "监控与外观", -1)),
                    _createElementVNode("div", null, [_cache[290] || (_cache[290] = _createElementVNode("label", null, [_createTextVNode("周期校对间隔"), _createElementVNode("small", null, "重新检查目录并核对文件内容")], -1)), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((prefs.interval) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,15,30,60,300,900,3600], (n) => {
                      return (_openBlock(), _createElementBlock("option", { value: n }, _toDisplayString(n<60?n+' 秒':n/60+' 分钟'), 9, _hoisted_804))
                    }), 256))], 8, _hoisted_803), [[
                      _vModelSelect,
                      prefs.interval,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("div", null, [_cache[292] || (_cache[292] = _createElementVNode("label", null, "界面主题", -1)), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((prefs.theme) = $event) }, _cache[291] || (_cache[291] = [_createElementVNode("option", null, "浅色", -1), _createElementVNode("option", null, "深色", -1)]), 8, _hoisted_805), [[_vModelSelect, prefs.theme]])]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_806, [_cache[293] || (_cache[293] = _createElementVNode("label", null, "登录 Windows 后后台启动", -1)), _withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((prefs.autostart) = $event)
                        }, null, 8, _hoisted_807), [[_vModelCheckbox, prefs.autostart]])]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_cache[294] || (_cache[294] = _createElementVNode("span", null, null, -1)), _createElementVNode("button", {
                      class: "primary",
                      onClick: savePrefs
                    }, "保存设置", 8, _hoisted_808)])
                  ]), _createElementVNode("section", _hoisted_809, [
                    _cache[304] || (_cache[304] = _createElementVNode("h2", null, "存储与维护", -1)),
                    _createElementVNode("div", _hoisted_810, [_createElementVNode("button", {
                      class: "btn",
                      onClick: healthDialog
                    }, "仓库体检报告", 8, _hoisted_811), _createElementVNode("button", {
                      class: "btn",
                      onClick: $event => (deliveryDialog())
                    }, "核查交付包", 8, _hoisted_812), demo
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          class: "btn",
                          onClick: inspectDialog
                        }, "示例备份覆盖情况", 8, _hoisted_813))
                      : _createCommentVNode("", true)]),
                    _createElementVNode("div", null, [_cache[296] || (_cache[296] = _createElementVNode("label", null, [_createTextVNode("仓库用量"), _createElementVNode("small", null, "按快照大小计算，重复内容只存一份。")], -1)), _createElementVNode("span", _hoisted_814, [_createElementVNode("button", {
                      class: "btn",
                      onClick: loadStorage
                    }, "计算用量", 8, _hoisted_815), _createElementVNode("button", {
                      class: "btn",
                      onClick: $event => (go('相同内容追溯'))
                    }, "查看正文复用", 8, _hoisted_816)])]),
                    storageData
                      ? (_openBlock(), _createElementBlock("section", _hoisted_817, [
                          _createElementVNode("p", null, "历史版本合计 " + _toDisplayString(bytes(storageData.logical)) + " · 唯一对象 " + _toDisplayString(bytes(storageData.unique)) + " · 去重节省 " + _toDisplayString(bytes(storageData.saved)), 1),
                          _createElementVNode("p", null, "数据库与日志 " + _toDisplayString(bytes(storageData.database)) + " · 所在磁盘可用 " + _toDisplayString(bytes(storageData.free)), 1),
                          _createElementVNode("details", null, [_cache[297] || (_cache[297] = _createElementVNode("summary", null, "各目录历史用量", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(storageData.by_root, (r) => {
                            return (_openBlock(), _createElementBlock("p", null, _toDisplayString(r.root) + " · " + _toDisplayString(r.versions) + " 版 · " + _toDisplayString(bytes(r.bytes)), 1))
                          }), 256))]),
                          _createElementVNode("details", null, [_cache[298] || (_cache[298] = _createElementVNode("summary", null, "历史体积最大的文件", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(storageData.largest, (r) => {
                            return (_openBlock(), _createElementBlock("p", null, [_createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (selectFile(r))
                            }, _toDisplayString(r.rel), 9, _hoisted_818), _createTextVNode(" · " + _toDisplayString(r.versions) + " 版 · " + _toDisplayString(bytes(r.bytes)), 1)]))
                          }), 256))])
                        ]))
                      : _createCommentVNode("", true),
                    native
                      ? (_openBlock(), _createElementBlock("div", _hoisted_819, _cache[299] || (_cache[299] = [_createElementVNode("label", null, [_createTextVNode("后台监控"), _createElementVNode("small", null, "点窗口 × 收到托盘。左键托盘图标打开工作台，右键「退出监控」停止引擎。")], -1)])))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_createElementVNode("label", null, [_cache[300] || (_cache[300] = _createTextVNode("版本仓库")), _createElementVNode("small", null, _toDisplayString(s.home), 1)]), _createElementVNode("span", null, _toDisplayString(num(s.objects)) + " 个对象", 1)]),
                    (s.recovery)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_820, [_cache[301] || (_cache[301] = _createElementVNode("label", null, [_createTextVNode("待核对的恢复任务"), _createElementVNode("small", null, "正在等待目录上线或文件可读")], -1)), (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              class: "btn",
                              onClick: $event => (perform('retry_recovery',{}))
                            }, "重新核对（" + _toDisplayString(s.recovery) + "）", 9, _hoisted_821))
                          : _createCommentVNode("", true)]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_cache[302] || (_cache[302] = _createElementVNode("label", null, [_createTextVNode("解析失败"), _createElementVNode("small", null, "失败文件的历史原件仍然保留")], -1)), (!demo&&s.failures)
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          class: "btn",
                          onClick: $event => (perform('retry',{},'已重新安排解析'))
                        }, "重新解析", 8, _hoisted_822))
                      : (_openBlock(), _createElementBlock("span", _hoisted_823, _toDisplayString(s.failures) + " 项", 1))]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_824, [_cache[303] || (_cache[303] = _createElementVNode("label", null, "备份与完整性", -1)), _createElementVNode("span", _hoisted_825, [_createElementVNode("button", {
                          class: "btn",
                          onClick: $event => (perform('verify',{}))
                        }, "校验仓库", 8, _hoisted_826), _createElementVNode("button", {
                          class: "btn",
                          onClick: inspectDialog
                        }, "核查已有备份", 8, _hoisted_827), _createElementVNode("button", {
                          class: "btn",
                          onClick: $event => (backupDialog())
                        }, "创建备份", 8, _hoisted_828)])]))
                      : _createCommentVNode("", true)
                  ])], 64))
                : _createCommentVNode("", true)
            ], 64))]),
        _createElementVNode("footer", _hoisted_829, [_createElementVNode("span", null, [_cache[305] || (_cache[305] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(demo?'示例数据':s.watch), 1)]), _cache[306] || (_cache[306] = _createElementVNode("span", null, "FileGuard · 1.23.0", -1))])
      ]),
      dialog
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "mask",
            onClick: _withModifiers($event => (!busy&&(dialog=null)), ["self"])
          }, [_createElementVNode("section", {
            ref: "dialogPanel",
            class: _normalizeClass(["modal", {'wide-review':['ledger','receipt','period','trace','variance','inventory','health','delivery_result','restore_preview','review_batch','scan_log','waiting_files'].includes(dialog.type)}]),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": dialog.title
          }, [_createElementVNode("div", _hoisted_832, [_createElementVNode("h2", null, _toDisplayString(dialog.title), 1), _createElementVNode("button", {
            ref: "dialogClose",
            class: "iconbtn",
            "aria-label": "关闭",
            disabled: busy,
            onClick: $event => (dialog=null)
          }, [_createVNode(_component_ico, { n: "x" })], 8, _hoisted_833)]), _createElementVNode("form", { onSubmit: _withModifiers(submitDialog, ["prevent"]) }, [
            (dialog.type==='review')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[307] || (_cache[307] = _createTextVNode("结论")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.state) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewStates, (v) => {
                  return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                }), 256))], 8, _hoisted_835), [[_vModelSelect, dialog.state]])]), _createElementVNode("label", null, [_cache[308] || (_cache[308] = _createTextVNode("复核备注")), _withDirectives(_createElementVNode("textarea", {
                  "onUpdate:modelValue": $event => ((dialog.note) = $event),
                  rows: "4",
                  maxlength: "2000",
                  required: dialog.state==='需跟进'
                }, null, 8, _hoisted_836), [[_vModelText, dialog.note]])]), _createElementVNode("small", null, _toDisplayString(dialog.note.length) + " / 2000", 1)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='review_batch')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [(dialog.result)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_837, [_createElementVNode("p", _hoisted_838, [_createElementVNode("strong", null, "批次 " + _toDisplayString(dialog.result.batch) + " 已保存", 1)]), _createElementVNode("p", null, "更新 " + _toDisplayString(dialog.result.changed) + " 个版本 · " + _toDisplayString(dialog.result.unchanged) + " 个版本无变化 · " + _toDisplayString(fmt(dialog.result.stamp)), 1), _createElementVNode("div", _hoisted_839, [_createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: $event => (go('审计中心',{q:dialog.result.batch}))
                    }, "查看这批审计", 8, _hoisted_840), _createElementVNode("button", {
                      type: "button",
                      class: "primary",
                      onClick: $event => (dialog=null)
                    }, "完成", 8, _hoisted_841)])]))
                  : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                      _createElementVNode("p", null, "已选 " + _toDisplayString(reviewSelected.length) + " / 100 个版本。跨页和筛选切换会保留所选版本。", 1),
                      _createElementVNode("details", null, [_cache[309] || (_cache[309] = _createElementVNode("summary", null, "核对或移除已选版本", -1)), _createElementVNode("ul", _hoisted_842, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewSelected, (v) => {
                        return (_openBlock(), _createElementBlock("li", { key: v.id }, [_createElementVNode("span", null, [_createTextVNode(_toDisplayString(v.rel) + " · V" + _toDisplayString(v.num), 1), _createElementVNode("small", null, _toDisplayString(v.root), 1)]), _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          disabled: dialog.loading||busy,
                          onClick: $event => (dropReviewBatchRow(v.id))
                        }, "移除", 8, _hoisted_843)]))
                      }), 128))])]),
                      _createElementVNode("fieldset", {
                        class: "batch-options",
                        disabled: dialog.loading||busy,
                        onInput: invalidateReviewBatch
                      }, [
                        _createElementVNode("div", _hoisted_845, [_createElementVNode("label", null, [_cache[311] || (_cache[311] = _createTextVNode("统一结论")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.state) = $event) }, [_cache[310] || (_cache[310] = _createElementVNode("option", { value: "" }, "保留各版本结论", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewStates, (s) => {
                          return (_openBlock(), _createElementBlock("option", { key: s }, _toDisplayString(s), 1))
                        }), 128))], 8, _hoisted_846), [[_vModelSelect, dialog.state]])]), _createElementVNode("label", null, [_cache[313] || (_cache[313] = _createTextVNode("处理备注")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.mode) = $event) }, _cache[312] || (_cache[312] = [_createElementVNode("option", { value: "keep" }, "保留原备注", -1), _createElementVNode("option", { value: "append" }, "在末尾追加", -1), _createElementVNode("option", { value: "replace" }, "替换原备注", -1)]), 8, _hoisted_847), [[_vModelSelect, dialog.mode]])])]),
                        (dialog.mode!=='keep')
                          ? (_openBlock(), _createElementBlock("label", _hoisted_848, [_createTextVNode(_toDisplayString(dialog.mode==='append'?'追加的备注':'替换为'), 1), _withDirectives(_createElementVNode("textarea", {
                              "onUpdate:modelValue": $event => ((dialog.note) = $event),
                              rows: "3",
                              maxlength: "2000"
                            }, null, 8, _hoisted_849), [[_vModelText, dialog.note]])]))
                          : _createCommentVNode("", true),
                        (dialog.mode==='replace'&&!dialog.note.trim())
                          ? (_openBlock(), _createElementBlock("small", _hoisted_850, "留空会清除原备注。结论为「需跟进」的版本必须保留备注。"))
                          : _createCommentVNode("", true),
                        _createElementVNode("label", null, [_cache[314] || (_cache[314] = _createTextVNode("批次说明（可选，记入审计）")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.reason) = $event),
                          maxlength: "300"
                        }, null, 8, _hoisted_851), [[_vModelText, dialog.reason]])])
                      ], 40, _hoisted_844),
                      (dialog.loading)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_852, "正在读取所选版本的最新复核记录…"))
                        : _createCommentVNode("", true),
                      (dialog.preview)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createElementVNode("p", _hoisted_853, "拟更新 " + _toDisplayString(dialog.preview.counts.change) + " 项 · 无变化 " + _toDisplayString(dialog.preview.counts.same) + " 项 · 冲突 " + _toDisplayString(dialog.preview.counts.conflict) + " 项 · 缺失 " + _toDisplayString(dialog.preview.counts.missing) + " 项 · 待调整 " + _toDisplayString(dialog.preview.counts.invalid) + " 项", 1),
                            _createElementVNode("div", _hoisted_854, [_createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((dialog.onlyIssues) = $event)
                            }, null, 8, _hoisted_855), [[_vModelCheckbox, dialog.onlyIssues]]), _cache[315] || (_cache[315] = _createTextVNode("只看需处理项"))]), (dialog.preview.counts.conflict)
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  type: "button",
                                  class: "btn",
                                  disabled: busy,
                                  onClick: $event => (previewReviewBatch(true))
                                }, "按最新修订重新预览", 8, _hoisted_856))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("div", _hoisted_857, [_createElementVNode("table", _hoisted_858, [_cache[316] || (_cache[316] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "所选版本"),
                              _createElementVNode("th", null, "当前结论与备注"),
                              _createElementVNode("th", null, "拟保存的结论与备注"),
                              _createElementVNode("th", null, "预览结果")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.preview.items.filter(v=>!dialog.onlyIssues||v.issue), (v) => {
                              return (_openBlock(), _createElementBlock("tr", { key: v.id }, [
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(v.rel||'版本 #'+v.id), 1), (v.num)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_859, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)), 1))
                                  : _createCommentVNode("", true), (v.root)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_860, _toDisplayString(v.root), 1))
                                  : _createCommentVNode("", true)]),
                                _createElementVNode("td", null, [_createElementVNode("span", null, _toDisplayString(v.review||'—'), 1), _createElementVNode("small", _hoisted_861, _toDisplayString(v.note||'（空）'), 1)]),
                                _createElementVNode("td", null, [_createElementVNode("span", null, _toDisplayString(v.new_state||'—'), 1), _createElementVNode("small", _hoisted_862, _toDisplayString(v.new_note||'（空）'), 1)]),
                                _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass({error:!!v.issue}) }, _toDisplayString(v.issue||(v.status==='same'?'无变化':'将更新')), 3), (v.status==='conflict')
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_863, "选择时修订 " + _toDisplayString(v.expected) + " · 当前 " + _toDisplayString(v.revision), 1))
                                  : _createCommentVNode("", true), (v.issue)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 1,
                                      type: "button",
                                      class: "textbtn",
                                      disabled: busy,
                                      onClick: $event => (dropReviewBatchRow(v.id))
                                    }, "从批次移除", 8, _hoisted_864))
                                  : _createCommentVNode("", true)])
                              ]))
                            }), 128))])])]),
                            (dialog.onlyIssues&&!dialog.preview.items.some(v=>v.issue))
                              ? (_openBlock(), _createElementBlock("p", _hoisted_865, "本批没有需处理项。"))
                              : _createCommentVNode("", true)
                          ], 64))
                        : _createCommentVNode("", true),
                      _createElementVNode("div", _hoisted_866, [_createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: busy,
                        onClick: $event => (dialog=null)
                      }, "取消", 8, _hoisted_867), _createElementVNode("button", {
                        type: "submit",
                        class: "btn",
                        disabled: busy||dialog.loading||!reviewSelected.length||(!dialog.state&&dialog.mode==='keep')
                      }, "预览变更", 8, _hoisted_868), _createElementVNode("button", {
                        type: "button",
                        class: "primary",
                        disabled: busy||dialog.loading||!dialog.preview?.token,
                        onClick: commitReviewBatch
                      }, _toDisplayString(busy?'正在保存…':'确认写入整批'), 9, _hoisted_869)])
                    ], 64))], 64))
              : _createCommentVNode("", true),
            (dialog.type==='private_records')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                  (!demo)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_870, [_cache[317] || (_cache[317] = _createTextVNode("记录管理口令")), _withDirectives(_createElementVNode("input", {
                        type: "password",
                        autocomplete: "off",
                        "onUpdate:modelValue": $event => ((dialog.password) = $event),
                        onKeydown: _withKeys(_withModifiers($event => (loadPrivate()), ["prevent"]), ["enter"])
                      }, null, 40, _hoisted_871), [[_vModelText, dialog.password]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadPrivate())
                  }, "查看已移出记录", 8, _hoisted_872),
                  (dialog.entries&&!dialog.entries.length)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_873, "没有已移出的记录。"))
                    : _createCommentVNode("", true),
                  _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.entries, (r) => {
                    return (_openBlock(), _createElementBlock("li", null, [_createElementVNode("button", {
                      type: "button",
                      class: "textbtn",
                      onClick: $event => (recordDialog(r))
                    }, "事件 #" + _toDisplayString(r.id) + " · " + _toDisplayString(fmt(r.stamp)) + " · 管理", 9, _hoisted_874)]))
                  }), 256))]),
                  (dialog.before)
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 2,
                        type: "button",
                        onClick: $event => (loadPrivate(true))
                      }, "验证并读取下一页", 8, _hoisted_875))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='admin')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
                  _cache[322] || (_cache[322] = _createElementVNode("p", null, "“撤回”保留公开标记。“移出普通日志”将此事件从普通列表、首页活动和事件导出中移除。管理员可恢复展示。文件版本和管理审计单独保留。", -1)),
                  demo
                    ? (_openBlock(), _createElementBlock("p", _hoisted_876, "此处使用虚构记录演示，关闭预览后复位。"))
                    : _createCommentVNode("", true),
                  (!demo)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_877, [_cache[318] || (_cache[318] = _createTextVNode("管理口令")), _withDirectives(_createElementVNode("input", {
                        type: "password",
                        "onUpdate:modelValue": $event => ((dialog.password) = $event),
                        autocomplete: "off",
                        required: ""
                      }, null, 8, _hoisted_878), [[_vModelText, dialog.password]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "textbtn",
                    onClick: seeOriginal
                  }, "核查原始记录与处置历史", 8, _hoisted_879),
                  (dialog.info)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_880, [_createElementVNode("p", null, _toDisplayString(dialog.info.original.rel) + " · " + _toDisplayString(dialog.info.original.kind) + " · " + _toDisplayString(fmt(dialog.info.original.stamp)), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.info.changes, (h) => {
                        return (_openBlock(), _createElementBlock("p", null, [_createTextVNode(_toDisplayString(fmt(h.stamp)) + " · " + _toDisplayString(h.action) + " · " + _toDisplayString(h.reason), 1), (h.caption)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_881, "更正说明：" + _toDisplayString(h.caption), 1))
                          : _createCommentVNode("", true)]))
                      }), 256))]))
                    : _createCommentVNode("", true),
                  _createElementVNode("label", null, [_cache[319] || (_cache[319] = _createTextVNode("操作")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.action) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.hidden?['恢复展示']:['更正','撤回','移出普通日志'], (a) => {
                    return (_openBlock(), _createElementBlock("option", null, _toDisplayString(a), 1))
                  }), 256))], 8, _hoisted_882), [[_vModelSelect, dialog.action]])]),
                  (dialog.action==='更正')
                    ? (_openBlock(), _createElementBlock("label", _hoisted_883, [_cache[320] || (_cache[320] = _createTextVNode("公开更正说明")), _withDirectives(_createElementVNode("textarea", {
                        "onUpdate:modelValue": $event => ((dialog.caption) = $event),
                        maxlength: "1000",
                        required: ""
                      }, null, 8, _hoisted_884), [[_vModelText, dialog.caption]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("label", null, [_cache[321] || (_cache[321] = _createTextVNode("操作原因（供管理员核查）")), _withDirectives(_createElementVNode("textarea", {
                    "onUpdate:modelValue": $event => ((dialog.reason) = $event),
                    maxlength: "1000",
                    required: ""
                  }, null, 8, _hoisted_885), [[_vModelText, dialog.reason]])]),
                  (!demo&&!s.record_admin_ready)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_886, "请仓库负责人先运行本机FileGuard-RecordAdmin.cmd 脚本。"))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='receipt')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("div", _hoisted_887, [
                  _createElementVNode("label", null, [_cache[324] || (_cache[324] = _createTextVNode("核对方式")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.mode) = $event),
                    onChange: $event => {dialog.auto=false;readReceipt()}
                  }, _cache[323] || (_cache[323] = [_createElementVNode("option", { value: "quick" }, "快速比大小", -1), _createElementVNode("option", { value: "full" }, "完整核对正文 SHA-256", -1)]), 40, _hoisted_888), [[_vModelSelect, dialog.mode]])]),
                  _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.verify) = $event),
                    onChange: $event => {dialog.auto=false;readReceipt()}
                  }, null, 40, _hoisted_889), [[_vModelCheckbox, dialog.verify]]), _cache[325] || (_cache[325] = _createTextVNode(" 同时校验在册历史副本"))]),
                  (!demo&&dialog.mode==='quick'&&!dialog.verify)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_890, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((dialog.auto) = $event),
                        onChange: $event => (readReceipt())
                      }, null, 40, _hoisted_891), [[_vModelCheckbox, dialog.auto]]), _cache[326] || (_cache[326] = _createTextVNode(" 每 5 秒刷新"))]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: dialog.loading,
                    onClick: $event => (readReceipt())
                  }, "重新核对", 8, _hoisted_892)
                ]), (dialog.loading)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_893, "正在核对…"))
                  : _createCommentVNode("", true), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                      _createElementVNode("h3", null, [_createTextVNode(_toDisplayString(dialog.data.result), 1), (dialog.data.object_state.includes('损坏'))
                        ? (_openBlock(), _createElementBlock("span", _hoisted_894, " · 历史副本校验失败"))
                        : _createCommentVNode("", true)]),
                      _createElementVNode("p", null, _toDisplayString(dialog.data.root) + " / " + _toDisplayString(dialog.data.rel) + " · " + _toDisplayString(fmt(dialog.data.checked)) + _toDisplayString(demo?' · 示例现场':''), 1),
                      _createElementVNode("table", null, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [_cache[327] || (_cache[327] = _createElementVNode("th", null, "核对项", -1)), _cache[328] || (_cache[328] = _createElementVNode("th", null, "磁盘现场", -1)), _createElementVNode("th", null, "最新在册 V" + _toDisplayString(dialog.data.version), 1)])]), _createElementVNode("tbody", null, [_createElementVNode("tr", null, [_cache[329] || (_cache[329] = _createElementVNode("th", null, "字节", -1)), _createElementVNode("td", null, _toDisplayString(dialog.data.disk_size??'—'), 1), _createElementVNode("td", null, _toDisplayString(dialog.data.size), 1)]), _createElementVNode("tr", null, [_cache[330] || (_cache[330] = _createElementVNode("th", null, "时间", -1)), _createElementVNode("td", null, _toDisplayString(dialog.data.mtime?fmt(dialog.data.mtime):'—'), 1), _createElementVNode("td", null, _toDisplayString(fmt(dialog.data.stamp)), 1)]), _createElementVNode("tr", null, [_cache[331] || (_cache[331] = _createElementVNode("th", null, "SHA-256", -1)), _createElementVNode("td", _hoisted_895, _toDisplayString(dialog.data.disk_sha||'—'), 1), _createElementVNode("td", _hoisted_896, _toDisplayString(dialog.data.sha), 1)])])]),
                      _createElementVNode("p", null, [_createTextVNode("现场字节差 " + _toDisplayString(dialog.data.delta??'—') + " · 版本解析：" + _toDisplayString(dialog.data.parse) + " ", 1), (dialog.data.object_state)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_897, " · " + _toDisplayString(dialog.data.object_state), 1))
                        : _createCommentVNode("", true)]),
                      (dialog.mode==='full'&&dialog.data.disk_sha)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_898, [_createTextVNode("同一文件有 " + _toDisplayString(dialog.data.matches) + " 个版本匹配现场内容", 1), (dialog.data.matched_version)
                            ? (_openBlock(), _createElementBlock("span", _hoisted_899, "，最近匹配 V" + _toDisplayString(dialog.data.matched_version), 1))
                            : _createCommentVNode("", true), _cache[332] || (_cache[332] = _createTextVNode("。"))]))
                        : _createCommentVNode("", true),
                      _createElementVNode("p", null, "目录" + _toDisplayString(dialog.data.active?'启用':'未启用') + " · 文件" + _toDisplayString(dialog.data.tracked?'在监控范围':'已排除') + " · " + _toDisplayString(dialog.data.rule||'未检查现场规则') + " · 监听稳定等待 " + _toDisplayString(dialog.data.settle_ms) + " ms（" + _toDisplayString(dialog.data.all_types?'全部文件':'指定格式') + "）", 1),
                      _createElementVNode("p", null, "最近目录扫描 " + _toDisplayString(dialog.data.last_scan?fmt(dialog.data.last_scan):'尚无') + " · " + _toDisplayString(dialog.data.queued?'待执行：'+dialog.data.queued:'暂无排队扫描'), 1),
                      (dialog.data.root_error)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_900, _toDisplayString(dialog.data.root_error), 1))
                        : _createCommentVNode("", true),
                      (dialog.data.waiting)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_901, _toDisplayString(dialog.data.waiting.reason) + " · 已尝试 " + _toDisplayString(dialog.data.waiting.attempts) + " 次 · " + _toDisplayString(fmt(dialog.data.waiting.first_seen)) + " 至 " + _toDisplayString(fmt(dialog.data.waiting.last_seen)), 1))
                        : _createCommentVNode("", true),
                      _cache[333] || (_cache[333] = _createElementVNode("p", null, "编辑器中的草稿保存到磁盘后才能核对。", -1)),
                      (!demo)
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 3,
                            type: "button",
                            class: "btn",
                            disabled: !dialog.data.active||dialog.loading,
                            onClick: receiptScan
                          }, "请求扫描这个目录", 8, _hoisted_902))
                        : _createCommentVNode("", true)
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='ledger')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [_createElementVNode("div", _hoisted_903, [_createElementVNode("section", null, [
                  _cache[337] || (_cache[337] = _createElementVNode("h3", null, "左侧版本", -1)),
                  _createElementVNode("p", null, _toDisplayString(dialog.fileA?.rel), 1),
                  _createElementVNode("label", null, [_cache[334] || (_cache[334] = _createTextVNode("版本")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.a) = $event),
                    onChange: $event => {dialog.sheetA='';dialog.ha=1;ledgerLoad()}
                  }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.versionsA, (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)), 9, _hoisted_905))
                  }), 256))], 40, _hoisted_904), [[
                    _vModelSelect,
                    dialog.a,
                    void 0,
                    { number: true }
                  ]])]),
                  (dialog.namesA.length)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_906, [_cache[335] || (_cache[335] = _createTextVNode("工作表")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.sheetA) = $event),
                        onChange: $event => {dialog.ha=1;ledgerLoad()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.namesA, (s) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(s), 1))
                      }), 256))], 40, _hoisted_907), [[_vModelSelect, dialog.sheetA]])]))
                    : _createCommentVNode("", true),
                  (dialog.oa)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_908, [_cache[336] || (_cache[336] = _createTextVNode("表头行")), _withDirectives(_createElementVNode("input", {
                        type: "number",
                        min: "1",
                        "onUpdate:modelValue": $event => ((dialog.ha) = $event),
                        onChange: $event => (ledgerMap())
                      }, null, 40, _hoisted_909), [[
                        _vModelText,
                        dialog.ha,
                        void 0,
                        { number: true }
                      ]])]))
                    : _createCommentVNode("", true)
                ]), _createElementVNode("section", null, [
                  _cache[342] || (_cache[342] = _createElementVNode("h3", null, "右侧版本", -1)),
                  _createElementVNode("p", null, _toDisplayString(dialog.fileB?.rel), 1),
                  _createElementVNode("label", null, [_cache[338] || (_cache[338] = _createTextVNode("版本")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.b) = $event),
                    onChange: $event => {dialog.sheetB='';dialog.hb=1;ledgerLoad()}
                  }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.versionsB, (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)), 9, _hoisted_911))
                  }), 256))], 40, _hoisted_910), [[
                    _vModelSelect,
                    dialog.b,
                    void 0,
                    { number: true }
                  ]])]),
                  (dialog.namesB.length)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_912, [_cache[339] || (_cache[339] = _createTextVNode("工作表")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.sheetB) = $event),
                        onChange: $event => {dialog.hb=1;ledgerLoad()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.namesB, (s) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(s), 1))
                      }), 256))], 40, _hoisted_913), [[_vModelSelect, dialog.sheetB]])]))
                    : _createCommentVNode("", true),
                  (dialog.ob)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_914, [_cache[340] || (_cache[340] = _createTextVNode("表头行")), _withDirectives(_createElementVNode("input", {
                        type: "number",
                        min: "1",
                        "onUpdate:modelValue": $event => ((dialog.hb) = $event),
                        onChange: $event => (ledgerMap())
                      }, null, 40, _hoisted_915), [[
                        _vModelText,
                        dialog.hb,
                        void 0,
                        { number: true }
                      ]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("details", null, [_cache[341] || (_cache[341] = _createElementVNode("summary", null, "更换右侧台账", -1)), _createElementVNode("div", _hoisted_916, [_withDirectives(_createElementVNode("input", {
                    "aria-label": "台账路径片段",
                    "onUpdate:modelValue": $event => ((dialog.find) = $event),
                    onKeydown: _withKeys(_withModifiers($event => (ledgerSearch()), ["prevent"]), ["enter"]),
                    placeholder: "文件名或路径"
                  }, null, 40, _hoisted_917), [[_vModelText, dialog.find]]), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (ledgerSearch())
                  }, "搜索历史文件", 8, _hoisted_918)]), (dialog.choices)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.choices.items, (f) => {
                          return (_openBlock(), _createElementBlock("button", {
                            type: "button",
                            class: "textbtn ledger-choice",
                            onClick: $event => (ledgerFile(f))
                          }, _toDisplayString(f.root) + " / " + _toDisplayString(f.rel), 9, _hoisted_919))
                        }), 256)),
                        (!dialog.choices.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_920, "没有匹配文件"))
                          : _createCommentVNode("", true),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.choices.page<=1,
                          onClick: $event => (ledgerSearch(dialog.choices.page-1))
                        }, "上一页", 8, _hoisted_921),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.choices.page*15>=dialog.choices.total,
                          onClick: $event => (ledgerSearch(dialog.choices.page+1))
                        }, "下一页", 8, _hoisted_922)
                      ], 64))
                    : _createCommentVNode("", true)])
                ])]), (dialog.loading)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_923, "正在读取历史版本…"))
                  : _createCommentVNode("", true), (dialog.oa&&dialog.ob)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                      _createElementVNode("button", {
                        class: "textbtn",
                        type: "button",
                        onClick: ledgerSwap
                      }, "交换左右台账与规则", 8, _hoisted_924),
                      _createElementVNode("details", null, [_cache[345] || (_cache[345] = _createElementVNode("summary", null, "保存或使用对账模板", -1)), _createElementVNode("div", _hoisted_925, [
                        _createElementVNode("label", null, [_cache[343] || (_cache[343] = _createTextVNode("新模板名称")), _withDirectives(_createElementVNode("input", {
                          maxlength: "60",
                          "onUpdate:modelValue": $event => ((dialog.tname) = $event)
                        }, null, 8, _hoisted_926), [[_vModelText, dialog.tname]])]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report||!dialog.tname.trim(),
                          onClick: ledgerTemplateSave
                        }, "保存当前规则", 8, _hoisted_927),
                        _createElementVNode("label", null, [_cache[344] || (_cache[344] = _createTextVNode("已有模板")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((dialog.tid) = $event),
                          onChange: $event => (dialog.confirmRemove=false)
                        }, [_createElementVNode("option", { value: 0 }, "请选择", 8, _hoisted_929), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.templates, (t) => {
                          return (_openBlock(), _createElementBlock("option", { value: t.id }, _toDisplayString(t.name), 9, _hoisted_930))
                        }), 256))], 40, _hoisted_928), [[
                          _vModelSelect,
                          dialog.tid,
                          void 0,
                          { number: true }
                        ]])]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.tid,
                          onClick: ledgerTemplateApply
                        }, "按表头应用", 8, _hoisted_931),
                        _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          disabled: !dialog.tid,
                          onClick: ledgerTemplateRemove
                        }, _toDisplayString(dialog.confirmRemove?'确认移除所选模板':'移除模板'), 9, _hoisted_932)
                      ])]),
                      _cache[373] || (_cache[373] = _createElementVNode("h3", null, "业务编号", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.keys, (k, i) => {
                        return (_openBlock(), _createElementBlock("div", _hoisted_933, [_createElementVNode("label", null, [_cache[346] || (_cache[346] = _createTextVNode("左侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((k.l) = $event),
                          onChange: ledgerReset
                        }, [_createElementVNode("option", { value: -1 }, "选择字段", 8, _hoisted_935), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsA, (c) => {
                          return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_936))
                        }), 256))], 40, _hoisted_934), [[
                          _vModelSelect,
                          k.l,
                          void 0,
                          { number: true }
                        ]])]), _createElementVNode("label", null, [_cache[347] || (_cache[347] = _createTextVNode("右侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((k.r) = $event),
                          onChange: ledgerReset
                        }, [_createElementVNode("option", { value: -1 }, "选择字段", 8, _hoisted_938), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsB, (c) => {
                          return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_939))
                        }), 256))], 40, _hoisted_937), [[
                          _vModelSelect,
                          k.r,
                          void 0,
                          { number: true }
                        ]])]), (dialog.keys.length>1)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "textbtn",
                              onClick: $event => {dialog.keys.splice(i,1);ledgerReset()}
                            }, "移除", 8, _hoisted_940))
                          : _createCommentVNode("", true)]))
                      }), 256)),
                      _createElementVNode("button", {
                        type: "button",
                        class: "textbtn",
                        disabled: dialog.keys.length>=3,
                        onClick: $event => {dialog.keys.push({l:-1,r:-1});ledgerReset()}
                      }, "添加组合编号列", 8, _hoisted_941),
                      _createElementVNode("details", null, [
                        _cache[350] || (_cache[350] = _createElementVNode("summary", null, "参与核对的字段与配对规则", -1)),
                        _createElementVNode("div", _hoisted_942, [_createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: ledgerMap
                        }, "重新按表头配对", 8, _hoisted_943), _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: $event => {dialog.pairs.forEach(p=>p.use=false);ledgerReset()}
                        }, "清除字段选择", 8, _hoisted_944)]),
                        _createElementVNode("div", _hoisted_945, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.pairs, (p, i) => {
                          return (_openBlock(), _createElementBlock("div", _hoisted_946, [
                            _withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "aria-label": "核对此字段",
                              "onUpdate:modelValue": $event => ((p.use) = $event),
                              onChange: ledgerReset
                            }, null, 40, _hoisted_947), [[_vModelCheckbox, p.use]]),
                            _withDirectives(_createElementVNode("select", {
                              "aria-label": "左字段",
                              "onUpdate:modelValue": $event => ((p.l) = $event),
                              onChange: ledgerReset
                            }, [_createElementVNode("option", { value: -1 }, "无左列", 8, _hoisted_949), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsA, (c) => {
                              return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_950))
                            }), 256))], 40, _hoisted_948), [[
                              _vModelSelect,
                              p.l,
                              void 0,
                              { number: true }
                            ]]),
                            _cache[348] || (_cache[348] = _createElementVNode("span", null, "→", -1)),
                            _withDirectives(_createElementVNode("select", {
                              "aria-label": "右字段",
                              "onUpdate:modelValue": $event => ((p.r) = $event),
                              onChange: ledgerReset
                            }, [_createElementVNode("option", { value: -1 }, "无右列", 8, _hoisted_952), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsB, (c) => {
                              return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_953))
                            }), 256))], 40, _hoisted_951), [[
                              _vModelSelect,
                              p.r,
                              void 0,
                              { number: true }
                            ]])
                          ]))
                        }), 256))]),
                        _createElementVNode("div", _hoisted_954, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({keyTrim:'编号去首尾空白',trim:'文本去首尾空白',fold:'文本忽略大小写',width:'文本 Unicode 兼容归一',typed:'区分文本与数值类型',numeric:'使用十进制数值比较',empty:'空文本与缺格等价'}, (name, k) => {
                          return (_openBlock(), _createElementBlock("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((dialog[k]) = $event),
                            onChange: ledgerReset
                          }, null, 40, _hoisted_955), [[_vModelCheckbox, dialog[k]]]), _createTextVNode(" " + _toDisplayString(name), 1)])]))
                        }), 256)), (dialog.numeric)
                          ? (_openBlock(), _createElementBlock("label", _hoisted_956, [_cache[349] || (_cache[349] = _createTextVNode("允许绝对差值")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((dialog.tolerance) = $event),
                              onInput: ledgerReset
                            }, null, 40, _hoisted_957), [[_vModelText, dialog.tolerance]])]))
                          : _createCommentVNode("", true)])
                      ]),
                      _createElementVNode("div", _hoisted_958, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "primary",
                          onClick: ledgerRun
                        }, "按当前规则对账", 8, _hoisted_959),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('records'))
                        }, "记录对照", 8, _hoisted_960),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('fields'))
                        }, "字段影响汇总", 8, _hoisted_961),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('issues'))
                        }, "编号问题 " + _toDisplayString(dialog.report?.issues.length||0), 9, _hoisted_962),
                        _createElementVNode("label", null, [_cache[352] || (_cache[352] = _createTextVNode("体检一侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((dialog.profileSide) = $event),
                          onChange: $event => (ledgerTab('profile'))
                        }, _cache[351] || (_cache[351] = [_createElementVNode("option", { value: "r" }, "右侧", -1), _createElementVNode("option", { value: "l" }, "左侧", -1)]), 40, _hoisted_963), [[_vModelSelect, dialog.profileSide]])]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (ledgerTab('profile'))
                        }, "字段体检", 8, _hoisted_964)
                      ]),
                      (dialog.tab==='records'&&dialog.report)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createElementVNode("p", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.report.counts, (n, k) => {
                              return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                            }), 256)), _createTextVNode(" · 跳过全空行：左 " + _toDisplayString(dialog.report.emptyLeft) + " / 右 " + _toDisplayString(dialog.report.emptyRight), 1)]),
                            _createElementVNode("div", {
                              class: "report-controls",
                              onInput: $event => {dialog.page=1;dialog.expand=null},
                              onChange: $event => {dialog.page=1;dialog.expand=null}
                            }, [
                              _createElementVNode("label", null, [_cache[353] || (_cache[353] = _createTextVNode("左表行号")), _withDirectives(_createElementVNode("input", {
                                type: "number",
                                min: "1",
                                "onUpdate:modelValue": $event => ((dialog.leftRow) = $event)
                              }, null, 8, _hoisted_966), [[
                                _vModelText,
                                dialog.leftRow,
                                void 0,
                                { number: true }
                              ]])]),
                              _createElementVNode("label", null, [_cache[354] || (_cache[354] = _createTextVNode("右表行号")), _withDirectives(_createElementVNode("input", {
                                type: "number",
                                min: "1",
                                "onUpdate:modelValue": $event => ((dialog.rightRow) = $event)
                              }, null, 8, _hoisted_967), [[
                                _vModelText,
                                dialog.rightRow,
                                void 0,
                                { number: true }
                              ]])]),
                              _createElementVNode("label", null, [_cache[356] || (_cache[356] = _createTextVNode("含变化的值类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.cellType) = $event) }, [_cache[355] || (_cache[355] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['文本','数值','公式','错误','布尔','日期时间','时长'], (k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_968), [[_vModelSelect, dialog.cellType]])]),
                              _createElementVNode("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((dialog.onlySuppressed) = $event)
                              }, null, 8, _hoisted_969), [[_vModelCheckbox, dialog.onlySuppressed]]), _cache[357] || (_cache[357] = _createTextVNode(" 只看按规则视为相同的原始差别"))])]),
                              _createElementVNode("label", null, [_cache[358] || (_cache[358] = _createTextVNode("编号含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_970), [[_vModelText, dialog.q]])]),
                              _createElementVNode("label", null, [_cache[359] || (_cache[359] = _createTextVNode("变化字段含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.field) = $event) }, null, 8, _hoisted_971), [[_vModelText, dialog.field]])]),
                              _createElementVNode("label", null, [_cache[361] || (_cache[361] = _createTextVNode("状态")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.status) = $event) }, [_cache[360] || (_cache[360] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.report.counts, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_972), [[_vModelSelect, dialog.status]])]),
                              _createElementVNode("label", null, [_cache[363] || (_cache[363] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[362] || (_cache[362] = [
                                _createElementVNode("option", { value: "" }, "右表原顺序", -1),
                                _createElementVNode("option", { value: "old" }, "左表原顺序", -1),
                                _createElementVNode("option", { value: "key" }, "按编号", -1),
                                _createElementVNode("option", { value: "count" }, "变动字段最多", -1)
                              ]), 8, _hoisted_973), [[_vModelSelect, dialog.sort]])]),
                              _createElementVNode("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((dialog.differences) = $event)
                              }, null, 8, _hoisted_974), [[_vModelCheckbox, dialog.differences]]), _cache[364] || (_cache[364] = _createTextVNode(" 隐藏一致行"))])])
                            ], 40, _hoisted_965),
                            (dialog.fieldMatch)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_975, [_createTextVNode("限定字段 " + _toDisplayString(dialog.fieldMatch.left) + " → " + _toDisplayString(dialog.fieldMatch.right) + " ", 1), _createElementVNode("button", {
                                  type: "button",
                                  class: "textbtn",
                                  onClick: $event => {dialog.fieldMatch=null;dialog.page=1}
                                }, "取消限定", 8, _hoisted_976)]))
                              : _createCommentVNode("", true),
                            _createElementVNode("div", _hoisted_977, [_createElementVNode("table", null, [_cache[365] || (_cache[365] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", null, "业务编号"),
                              _createElementVNode("th", null, "左行 → 右行"),
                              _createElementVNode("th", null, "结果"),
                              _createElementVNode("th", null, "字段数")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (r) => {
                              return (_openBlock(), _createElementBlock(_Fragment, null, [_createElementVNode("tr", null, [
                                _createElementVNode("td", null, [_createElementVNode("button", {
                                  class: "textbtn",
                                  type: "button",
                                  onClick: $event => (dialog.expand=dialog.expand===r.key?null:r.key)
                                }, _toDisplayString(r.key), 9, _hoisted_978)]),
                                _createElementVNode("td", null, _toDisplayString(r.old??'—') + " → " + _toDisplayString(r.new??'—'), 1),
                                _createElementVNode("td", null, _toDisplayString(r.status), 1),
                                _createElementVNode("td", null, _toDisplayString(r.changes.length), 1)
                              ]), (dialog.expand===r.key)
                                ? (_openBlock(), _createElementBlock("tr", _hoisted_979, [_createElementVNode("td", _hoisted_980, [(!r.changes.length)
                                    ? (_openBlock(), _createElementBlock("p", _hoisted_981, "没有字段值差异。"))
                                    : _createCommentVNode("", true), (r.suppressed.length)
                                    ? (_openBlock(), _createElementBlock("details", _hoisted_982, [_createElementVNode("summary", null, "按规则视为相同的原始差别 · " + _toDisplayString(r.suppressed.length), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.suppressed, (c) => {
                                        return (_openBlock(), _createElementBlock("p", null, _toDisplayString(c.left) + " " + _toDisplayString(c.oldAddress) + "［" + _toDisplayString(c.before?.[0]||'缺格') + "］" + _toDisplayString(c.before?.[1]??'—') + " → " + _toDisplayString(c.right) + " " + _toDisplayString(c.newAddress) + "［" + _toDisplayString(c.after?.[0]||'缺格') + "］" + _toDisplayString(c.after?.[1]??'—'), 1))
                                      }), 256))]))
                                    : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.changes, (c) => {
                                    return (_openBlock(), _createElementBlock("div", _hoisted_983, [_createElementVNode("b", null, _toDisplayString(c.left||'—') + " → " + _toDisplayString(c.right||'—'), 1), _createElementVNode("span", null, _toDisplayString(c.oldAddress||'—') + "　" + _toDisplayString(c.before?.[0]||'缺格') + "　" + _toDisplayString(c.before?.[1]??'—'), 1), _createElementVNode("span", null, _toDisplayString(c.newAddress||'—') + "　" + _toDisplayString(c.after?.[0]||'缺格') + "　" + _toDisplayString(c.after?.[1]??'—'), 1)]))
                                  }), 256))])]))
                                : _createCommentVNode("", true)], 64))
                            }), 256))])])])
                          ], 64))
                        : _createCommentVNode("", true),
                      (dialog.tab==='fields')
                        ? (_openBlock(), _createElementBlock("table", _hoisted_984, [_cache[366] || (_cache[366] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "字段配对"),
                            _createElementVNode("th", null, "影响记录"),
                            _createElementVNode("th", null, "新增值"),
                            _createElementVNode("th", null, "移除值"),
                            _createElementVNode("th", null, "双侧变化"),
                            _createElementVNode("th", null, "其中类型改变")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (v) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, [_createElementVNode("button", {
                                type: "button",
                                class: "textbtn",
                                onClick: $event => (ledgerFieldRows(v))
                              }, _toDisplayString(v.left||'—') + " → " + _toDisplayString(v.right||'—'), 9, _hoisted_985)]),
                              _createElementVNode("td", null, _toDisplayString(v.count), 1),
                              _createElementVNode("td", null, _toDisplayString(v.added), 1),
                              _createElementVNode("td", null, _toDisplayString(v.removed), 1),
                              _createElementVNode("td", null, _toDisplayString(v.changed), 1),
                              _createElementVNode("td", null, _toDisplayString(v.retyped), 1)
                            ]))
                          }), 256))])]))
                        : _createCommentVNode("", true),
                      (dialog.tab==='issues')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_cache[368] || (_cache[368] = _createElementVNode("p", null, "编号重复或不完整的行单列，避免配错业务记录。", -1)), _createElementVNode("table", null, [_cache[367] || (_cache[367] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "一侧"),
                            _createElementVNode("th", null, "原始行"),
                            _createElementVNode("th", null, "编号"),
                            _createElementVNode("th", null, "原因")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (r) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, _toDisplayString(r.side==='l'?'左':'右'), 1),
                              _createElementVNode("td", null, _toDisplayString(r.n), 1),
                              _createElementVNode("td", null, _toDisplayString(r.key), 1),
                              _createElementVNode("td", null, _toDisplayString(r.why), 1)
                            ]))
                          }), 256))])])], 64))
                        : _createCommentVNode("", true),
                      (dialog.tab==='profile'&&dialog.profile)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [_createElementVNode("p", null, "基于" + _toDisplayString(dialog.profileSide==='l'?'左':'右') + "表表头以下的非空数据行。点击字段查看各取值出现次数。", 1), _createElementVNode("div", _hoisted_986, [_createElementVNode("table", null, [_cache[369] || (_cache[369] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "字段"),
                            _createElementVNode("th", null, "非空 / 空"),
                            _createElementVNode("th", null, "不同值 / 多余重复"),
                            _createElementVNode("th", null, "含首尾空白"),
                            _createElementVNode("th", null, "数值数 / 零"),
                            _createElementVNode("th", null, "最小 → 最大"),
                            _createElementVNode("th", null, "最长字符 / 行"),
                            _createElementVNode("th", null, "类型")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (p) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, [_createElementVNode("button", {
                                type: "button",
                                class: "textbtn",
                                onClick: $event => (ledgerFrequency(p))
                              }, _toDisplayString(p.field), 9, _hoisted_987)]),
                              _createElementVNode("td", null, _toDisplayString(p.filled) + " / " + _toDisplayString(p.missing), 1),
                              _createElementVNode("td", null, _toDisplayString(p.unique) + " / " + _toDisplayString(p.duplicates), 1),
                              _createElementVNode("td", null, _toDisplayString(p.spaces), 1),
                              _createElementVNode("td", null, _toDisplayString(p.numeric) + " / " + _toDisplayString(p.zeros), 1),
                              _createElementVNode("td", null, _toDisplayString(p.min||'—') + " → " + _toDisplayString(p.max||'—'), 1),
                              _createElementVNode("td", null, _toDisplayString(p.longest) + " / " + _toDisplayString(p.longRow??'—'), 1),
                              _createElementVNode("td", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(p.types, (n, k) => {
                                return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                              }), 256))])
                            ]))
                          }), 256))])])])], 64))
                        : _createCommentVNode("", true),
                      (dialog.tab==='freq'&&dialog.frequency)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("h3", null, _toDisplayString(dialog.frequency.field) + " · 取值频次", 1), _createElementVNode("div", _hoisted_988, [_createElementVNode("label", null, [_cache[370] || (_cache[370] = _createTextVNode("取值片段")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((dialog.freqTerm) = $event),
                            onInput: $event => (dialog.page=1)
                          }, null, 40, _hoisted_989), [[_vModelText, dialog.freqTerm]])]), _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((dialog.repeatOnly) = $event),
                            onChange: $event => (dialog.page=1)
                          }, null, 40, _hoisted_990), [[_vModelCheckbox, dialog.repeatOnly]]), _cache[371] || (_cache[371] = _createTextVNode(" 只看重复值"))]), _createElementVNode("button", {
                            type: "button",
                            class: "textbtn",
                            onClick: $event => (ledgerTab('profile'))
                          }, "返回字段体检", 8, _hoisted_991)]), _createElementVNode("table", null, [_cache[372] || (_cache[372] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "取值"),
                            _createElementVNode("th", null, "类型"),
                            _createElementVNode("th", null, "次数"),
                            _createElementVNode("th", null, "首次 / 末次行")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (v) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", _hoisted_992, _toDisplayString(v.value), 1),
                              _createElementVNode("td", null, _toDisplayString(v.type), 1),
                              _createElementVNode("td", null, _toDisplayString(v.count), 1),
                              _createElementVNode("td", null, _toDisplayString(v.first) + " / " + _toDisplayString(v.last), 1)
                            ]))
                          }), 256))])])], 64))
                        : _createCommentVNode("", true),
                      (dialog.report||dialog.profile)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_993, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: ledgerSlice.page<=1,
                              onClick: $event => (dialog.page=ledgerSlice.page-1)
                            }, "上一页", 8, _hoisted_994),
                            _createElementVNode("span", null, _toDisplayString(ledgerSlice.page) + " / " + _toDisplayString(ledgerSlice.pages) + " 页 · " + _toDisplayString(ledgerSlice.total) + " 项", 1),
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: ledgerSlice.page>=ledgerSlice.pages,
                              onClick: $event => (dialog.page=ledgerSlice.page+1)
                            }, "下一页", 8, _hoisted_995),
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: !ledgerSlice.total,
                              onClick: $event => (ledgerExport())
                            }, "导出当前结果 CSV", 8, _hoisted_996),
                            (dialog.tab==='records')
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  type: "button",
                                  class: "btn",
                                  disabled: !ledgerSlice.total,
                                  onClick: $event => (ledgerExport(true))
                                }, "导出字段明细 CSV", 8, _hoisted_997))
                              : _createCommentVNode("", true)
                          ]))
                        : _createCommentVNode("", true)
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='restore_preview')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 6 }, [(dialog.loading)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_998, "正在核对恢复目标与历史原件…"))
                  : (dialog.info)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                        _createElementVNode("p", _hoisted_999, _toDisplayString(dialog.info.path), 1),
                        _createElementVNode("table", null, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [_cache[374] || (_cache[374] = _createElementVNode("th", null, null, -1)), _cache[375] || (_cache[375] = _createElementVNode("th", null, "当前磁盘文件", -1)), _createElementVNode("th", null, "所选 V" + _toDisplayString(dialog.info.version), 1)])]), _createElementVNode("tbody", null, [_createElementVNode("tr", null, [_cache[376] || (_cache[376] = _createElementVNode("th", null, "大小", -1)), _createElementVNode("td", null, _toDisplayString(dialog.info.exists?bytes(dialog.info.current_size):'路径不存在'), 1), _createElementVNode("td", null, _toDisplayString(bytes(dialog.info.size)), 1)]), _createElementVNode("tr", null, [_cache[377] || (_cache[377] = _createElementVNode("th", null, "SHA-256", -1)), _createElementVNode("td", _hoisted_1000, _toDisplayString(dialog.info.current_sha||'—'), 1), _createElementVNode("td", _hoisted_1001, _toDisplayString(dialog.info.sha), 1)])])]),
                        _createElementVNode("p", null, "最新在册 V" + _toDisplayString(dialog.info.latest) + " · 写回字节差 " + _toDisplayString(dialog.info.delta), 1),
                        _createElementVNode("p", null, _toDisplayString(dialog.info.identical?'磁盘内容与所选版本一致。':dialog.info.unrecorded?'当前磁盘内容尚未记录，写回前会先留存版本。':dialog.info.exists?'确认后替换此路径的磁盘内容。':'确认后在原路径重建文件。'), 1),
                        demo
                          ? (_openBlock(), _createElementBlock("small", _hoisted_1002, "此预览使用示例文件。"))
                          : _createCommentVNode("", true)
                      ], 64))
                    : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='backup_result')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 7 }, [
                  _createElementVNode("p", null, "数据库版本 " + _toDisplayString(dialog.result.schema) + " · " + _toDisplayString(dialog.result.roots) + " 个目录 · " + _toDisplayString(dialog.result.files) + " 个文件条目 · " + _toDisplayString(dialog.result.versions) + " 个版本", 1),
                  _createElementVNode("p", null, "创建时间 " + _toDisplayString(dialog.result.created?fmt(dialog.result.created):'旧版备份无创建清单') + " · 保存时间范围 " + _toDisplayString(fmt(dialog.result.oldest)) + " 至 " + _toDisplayString(fmt(dialog.result.latest)), 1),
                  _createElementVNode("p", null, "版本合计 " + _toDisplayString(bytes(dialog.result.logical)) + " · 去重后 " + _toDisplayString(bytes(dialog.result.bytes)) + " · 节省 " + _toDisplayString(bytes(dialog.result.saved)) + " · 待核对恢复 " + _toDisplayString(dialog.result.pending_restores) + " 项", 1),
                  (dialog.result.extra_entries)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1003, "另有 " + _toDisplayString(dialog.result.extra_entries) + " 个未列入备份索引的条目。", 1))
                    : _createCommentVNode("", true),
                  (dialog.result.coverage)
                    ? (_openBlock(), _createElementBlock("section", _hoisted_1004, [_cache[378] || (_cache[378] = _createElementVNode("h3", null, "按内容摘要核对当前仓库", -1)), _createElementVNode("p", null, "两边都有 " + _toDisplayString(dialog.result.coverage.shared) + " 个对象。当前仓库独有 " + _toDisplayString(dialog.result.coverage.missing) + " 个，共 " + _toDisplayString(bytes(dialog.result.coverage.missing_bytes)) + "，涉及 " + _toDisplayString(dialog.result.coverage.affected_versions) + " 个当前版本。备份独有 " + _toDisplayString(dialog.result.coverage.only_backup) + " 个，共 " + _toDisplayString(bytes(dialog.result.coverage.only_backup_bytes)) + "。", 1), _cache[379] || (_cache[379] = _createElementVNode("small", null, "相同内容可以被多个历史版本引用。", -1))]))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='inventory')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 8 }, [_createElementVNode("div", _hoisted_1005, [
                  _createElementVNode("label", null, [_cache[380] || (_cache[380] = _createTextVNode("路径片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_1006), [[_vModelText, dialog.q]])]),
                  _createElementVNode("label", null, [_cache[381] || (_cache[381] = _createTextVNode("子目录及下级")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.folder) = $event),
                    placeholder: "业务明细"
                  }, null, 8, _hoisted_1007), [[_vModelText, dialog.folder]])]),
                  _createElementVNode("label", null, [_cache[382] || (_cache[382] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.ext) = $event),
                    placeholder: "xlsx, csv"
                  }, null, 8, _hoisted_1008), [[_vModelText, dialog.ext]])]),
                  _createElementVNode("label", null, [_cache[383] || (_cache[383] = _createTextVNode("摘要前缀")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.sha) = $event) }, null, 8, _hoisted_1009), [[_vModelText, dialog.sha]])]),
                  _createElementVNode("label", null, [_cache[385] || (_cache[385] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[384] || (_cache[384] = [
                    _createElementVNode("option", { value: "" }, "按路径", -1),
                    _createElementVNode("option", { value: "size" }, "体积最大", -1),
                    _createElementVNode("option", { value: "updated" }, "最近保存", -1),
                    _createElementVNode("option", { value: "version" }, "版本号最高", -1)
                  ]), 8, _hoisted_1010), [[_vModelSelect, dialog.sort]])]),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadInventory())
                  }, "查询成员", 8, _hoisted_1011)
                ]), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _createElementVNode("p", null, _toDisplayString(dialog.data.meta.label) + " · " + _toDisplayString(dialog.data.total) + " 个文件 · " + _toDisplayString(bytes(dialog.data.bytes)) + " · " + _toDisplayString(dialog.data.objects) + " 个唯一内容", 1),
                      _createElementVNode("div", _hoisted_1012, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total,
                          onClick: $event => (exportInventory())
                        }, "导出成员 CSV", 8, _hoisted_1013),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (checkDisk(dialog.data.page))
                        }, "核对本页原路径", 8, _hoisted_1014),
                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.quick) = $event),
                          onChange: $event => (dialog.disk=null)
                        }, null, 40, _hoisted_1015), [[_vModelCheckbox, dialog.quick]]), _cache[386] || (_cache[386] = _createTextVNode("只核对大小"))]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total||(demo&&(dialog.active.q||dialog.active.ext||dialog.active.folder||dialog.active.sha)),
                          onClick: $event => (exportInventory(true))
                        }, _toDisplayString(demo?'下载完整示例包':'导出所选历史文件 ZIP'), 9, _hoisted_1016),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (deliveryDialog(dialog.active))
                        }, "对照此范围核查交付包", 8, _hoisted_1017)
                      ]),
                      (dialog.disk)
                        ? (_openBlock(), _createElementBlock("details", _hoisted_1018, [_createElementVNode("summary", null, "原路径核对 · " + _toDisplayString(fmt(dialog.disk.checked)), 1), _createElementVNode("p", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.disk.counts, (n, k) => {
                            return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                          }), 256))]), _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.disk.items, (r) => {
                            return (_openBlock(), _createElementBlock("li", null, [_createTextVNode(_toDisplayString(r.rel) + " · " + _toDisplayString(r.state), 1), (r.current_rel&&r.current_rel!==r.rel)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_1019, "当前在册位置 " + _toDisplayString(r.current_rel), 1))
                              : _createCommentVNode("", true), (r.replaced)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_1020, "此路径当前对应另一文件编号"))
                              : _createCommentVNode("", true)]))
                          }), 256))])]))
                        : _createCommentVNode("", true),
                      _createElementVNode("div", _hoisted_1021, [_createElementVNode("table", null, [_cache[387] || (_cache[387] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                        _createElementVNode("th", null, "清单路径"),
                        _createElementVNode("th", null, "版本"),
                        _createElementVNode("th", null, "大小"),
                        _createElementVNode("th", null, "摘要")
                      ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                        return (_openBlock(), _createElementBlock("tr", null, [
                          _createElementVNode("td", null, _toDisplayString(r.rel), 1),
                          _createElementVNode("td", null, "V" + _toDisplayString(r.num), 1),
                          _createElementVNode("td", null, _toDisplayString(bytes(r.size)), 1),
                          _createElementVNode("td", null, [_createElementVNode("details", null, [_createElementVNode("summary", null, _toDisplayString(r.sha.slice(0,10)), 1), _createElementVNode("span", _hoisted_1022, _toDisplayString(r.sha), 1)])])
                        ]))
                      }), 256))])])]),
                      _createElementVNode("div", _hoisted_1023, [_createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page<=1,
                        onClick: $event => (loadInventory(dialog.data.page-1,dialog.active))
                      }, "上一页", 8, _hoisted_1024), _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1), _createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page>=dialog.data.pages,
                        onClick: $event => (loadInventory(dialog.data.page+1,dialog.active))
                      }, "下一页", 8, _hoisted_1025)])
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='delivery_check')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 9 }, [_createElementVNode("label", null, [_cache[388] || (_cache[388] = _createTextVNode("文件交付 ZIP 路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_1026), [[_vModelText, dialog.path]])]), _createElementVNode("small", null, _toDisplayString(dialog.scope?'同时核对此范围的路径、版本、长度和摘要。':'依据包内清单校验每份副本。'), 1)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='delivery_result')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 10 }, [
                  _createElementVNode("p", null, [_createTextVNode(_toDisplayString(dialog.result.label) + " · 打包 " + _toDisplayString(fmt(dialog.result.created)), 1), (dialog.result.scanned)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · 来源扫描 " + _toDisplayString(fmt(dialog.result.scanned)), 1)], 64))
                    : _createCommentVNode("", true)]),
                  _createElementVNode("p", null, "清单 " + _toDisplayString(dialog.result.total) + " 项 · 内容通过 " + _toDisplayString(dialog.result.verified) + " 项 · 已核对 " + _toDisplayString(bytes(dialog.result.bytes)) + " · " + _toDisplayString(dialog.result.compared?'已对照所选清单':'依据包内清单'), 1),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.result.counts, (n, k) => {
                    return (_openBlock(), _createElementBlock("p", null, _toDisplayString(k) + " " + _toDisplayString(n), 1))
                  }), 256)),
                  _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.result.issues, (r) => {
                    return (_openBlock(), _createElementBlock("li", null, _toDisplayString(r.kind) + " · " + _toDisplayString(r.rel), 1))
                  }), 256))]),
                  (dialog.result.issue_count>100)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_1027, "共 " + _toDisplayString(dialog.result.issue_count) + " 项问题，显示前 100 项。", 1))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='health')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 11 }, [
                  _cache[395] || (_cache[395] = _createElementVNode("p", null, "保留最近五份完整报告。检查读取历史对象，后台采集继续运行。", -1)),
                  _createElementVNode("div", _hoisted_1028, [_createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: dialog.job.state==='检查中',
                    onClick: $event => (refreshHealth('health_start'))
                  }, _toDisplayString(demo?'查看示例检查':'开始检查'), 9, _hoisted_1029), (dialog.job.state==='检查中')
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn",
                        onClick: $event => (refreshHealth('health_cancel'))
                      }, "取消检查", 8, _hoisted_1030))
                    : _createCommentVNode("", true)]),
                  _createElementVNode("p", _hoisted_1031, [_createTextVNode(_toDisplayString(dialog.job.state) + " ", 1), (dialog.job.state==='检查中')
                    ? (_openBlock(), _createElementBlock("span", _hoisted_1032, _toDisplayString(dialog.job.done) + " / " + _toDisplayString(dialog.job.total), 1))
                    : _createCommentVNode("", true), _createTextVNode(" " + _toDisplayString(dialog.job.error), 1)]),
                  (dialog.reports.length)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[389] || (_cache[389] = _createTextVNode("检查报告")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.id) = $event),
                        onChange: $event => {dialog.status='';dialog.change='';loadHealth()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.reports, (r) => {
                        return (_openBlock(), _createElementBlock("option", { value: r.id }, "#" + _toDisplayString(r.id) + " · " + _toDisplayString(fmt(r.ended)), 9, _hoisted_1034))
                      }), 256))], 40, _hoisted_1033), [[
                        _vModelSelect,
                        dialog.id,
                        void 0,
                        { number: true }
                      ]])]), (dialog.data)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createElementVNode("p", null, "核验通过 " + _toDisplayString(dialog.data.report.verified) + " / " + _toDisplayString(dialog.data.report.objects) + " 个对象，" + _toDisplayString(bytes(dialog.data.report.verified_bytes)) + "。异常 " + _toDisplayString(dialog.data.report.issues) + "，涉及 " + _toDisplayString(dialog.data.report.affected) + " 个版本。另有未引用对象 " + _toDisplayString(dialog.data.report.unreferenced) + " 个。", 1),
                            _createElementVNode("div", _hoisted_1035, [
                              _createElementVNode("label", null, [_cache[390] || (_cache[390] = _createTextVNode("对象摘要片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_1036), [[_vModelText, dialog.q]])]),
                              _createElementVNode("label", null, [_cache[392] || (_cache[392] = _createTextVNode("结果类别")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.status) = $event) }, [_cache[391] || (_cache[391] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.counts, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_1037), [[_vModelSelect, dialog.status]])]),
                              _createElementVNode("label", null, [_cache[394] || (_cache[394] = _createTextVNode("与前一份报告相比")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.change) = $event) }, [_cache[393] || (_cache[393] = _createElementVNode("option", { value: "" }, "本轮发现", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.changes, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_1038), [[_vModelSelect, dialog.change]])]),
                              _createElementVNode("button", {
                                type: "button",
                                class: "btn",
                                onClick: $event => (loadHealth())
                              }, "筛选", 8, _hoisted_1039),
                              _createElementVNode("button", {
                                type: "button",
                                class: "btn",
                                onClick: healthExport
                              }, "导出明细", 8, _hoisted_1040)
                            ]),
                            _createElementVNode("p", null, _toDisplayString(dialog.data.total) + " 条匹配", 1),
                            _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                              return (_openBlock(), _createElementBlock("li", null, [
                                _createElementVNode("span", _hoisted_1041, _toDisplayString(r.object_key), 1),
                                _createTextVNode(" · " + _toDisplayString(r.status) + " · " + _toDisplayString(r.change), 1),
                                _createElementVNode("small", null, "索引 " + _toDisplayString(r.expected??'—') + " / 实际 " + _toDisplayString(r.actual??'—') + " 字节 · " + _toDisplayString(r.versions) + " 版 / " + _toDisplayString(r.files) + " 个文件", 1),
                                (r.versions)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 0,
                                      class: "textbtn",
                                      type: "button",
                                      onClick: $event => (affectedVersions(r))
                                    }, "查看引用", 8, _hoisted_1042))
                                  : _createCommentVNode("", true)
                              ]))
                            }), 256))]),
                            _createElementVNode("div", _hoisted_1043, [_createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: dialog.data.page<=1,
                              onClick: $event => (loadHealth(dialog.data.page-1))
                            }, "上一页", 8, _hoisted_1044), _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1), _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: dialog.data.page>=dialog.data.pages,
                              onClick: $event => (loadHealth(dialog.data.page+1))
                            }, "下一页", 8, _hoisted_1045)]),
                            (dialog.refs)
                              ? (_openBlock(), _createElementBlock("details", _hoisted_1046, [
                                  _createElementVNode("summary", null, "当前引用版本 · " + _toDisplayString(dialog.refs.total), 1),
                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.refs.items, (r) => {
                                    return (_openBlock(), _createElementBlock("p", null, _toDisplayString(r.root) + " / " + _toDisplayString(r.rel) + " · V" + _toDisplayString(r.num) + " · " + _toDisplayString(fmt(r.stamp)), 1))
                                  }), 256)),
                                  _createElementVNode("button", {
                                    type: "button",
                                    class: "btn",
                                    disabled: dialog.refs.page<=1,
                                    onClick: $event => (affectedVersions(dialog.refs.row,dialog.refs.page-1))
                                  }, "上一页", 8, _hoisted_1047),
                                  _createElementVNode("button", {
                                    type: "button",
                                    class: "btn",
                                    disabled: dialog.refs.page>=dialog.refs.pages,
                                    onClick: $event => (affectedVersions(dialog.refs.row,dialog.refs.page+1))
                                  }, "下一页", 8, _hoisted_1048)
                                ]))
                              : _createCommentVNode("", true)
                          ], 64))
                        : _createCommentVNode("", true)], 64))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='variance')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 12 }, [_createElementVNode("div", _hoisted_1049, [
                  _createElementVNode("label", null, [_cache[396] || (_cache[396] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.sheet) = $event) }, null, 8, _hoisted_1050), [[_vModelText, dialog.sheet]])]),
                  _createElementVNode("label", null, [_cache[397] || (_cache[397] = _createTextVNode("字段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.field) = $event) }, null, 8, _hoisted_1051), [[_vModelText, dialog.field]])]),
                  _createElementVNode("label", null, [_cache[398] || (_cache[398] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.record) = $event) }, null, 8, _hoisted_1052), [[_vModelText, dialog.record]])]),
                  _createElementVNode("label", null, [_cache[399] || (_cache[399] = _createTextVNode("绝对差额至少")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.minimum) = $event),
                    placeholder: "例如 5"
                  }, null, 8, _hoisted_1053), [[_vModelText, dialog.minimum]])]),
                  _createElementVNode("label", null, [_cache[400] || (_cache[400] = _createTextVNode("绝对变化率至少（%）")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.rate) = $event),
                    placeholder: "例如 10"
                  }, null, 8, _hoisted_1054), [[_vModelText, dialog.rate]])]),
                  _createElementVNode("label", null, [_cache[402] || (_cache[402] = _createTextVNode("变化方向")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.direction) = $event) }, [_cache[401] || (_cache[401] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['上升','下降','等值'], (k) => {
                    return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                  }), 256))], 8, _hoisted_1055), [[_vModelSelect, dialog.direction]])]),
                  _createElementVNode("label", null, [_cache[404] || (_cache[404] = _createTextVNode("顺序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[403] || (_cache[403] = [
                    _createElementVNode("option", { value: "magnitude" }, "差额绝对值最大", -1),
                    _createElementVNode("option", { value: "rate" }, "变化率绝对值最大", -1),
                    _createElementVNode("option", { value: "up" }, "差额降序", -1),
                    _createElementVNode("option", { value: "down" }, "差额升序", -1),
                    _createElementVNode("option", { value: "position" }, "原始差异顺序", -1)
                  ]), 8, _hoisted_1056), [[_vModelSelect, dialog.sort]])]),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadVariance())
                  }, "核对", 8, _hoisted_1057)
                ]), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _createElementVNode("p", null, _toDisplayString(dialog.data.total) + " 项符合条件 · 上升 " + _toDisplayString(dialog.data.counts['上升']||0) + " · 下降 " + _toDisplayString(dialog.data.counts['下降']||0) + " · 等值 " + _toDisplayString(dialog.data.counts['等值']||0), 1),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.skips, (n, k) => {
                        return (_openBlock(), _createElementBlock("small", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                      }), 256)),
                      _createElementVNode("details", null, [_cache[405] || (_cache[405] = _createElementVNode("summary", null, "按分组与字段汇总匹配项", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.groups, (g) => {
                        return (_openBlock(), _createElementBlock("p", null, _toDisplayString(g.sheet) + " / " + _toDisplayString(g.field) + " · " + _toDisplayString(g.count) + " 项 · " + _toDisplayString(g.old) + " → " + _toDisplayString(g.new) + " · 净差 " + _toDisplayString(g.delta), 1))
                      }), 256))]),
                      _createElementVNode("div", _hoisted_1058, [_createElementVNode("table", null, [_cache[407] || (_cache[407] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                        _createElementVNode("th", null, "位置"),
                        _createElementVNode("th", null, "旧值"),
                        _createElementVNode("th", null, "新值"),
                        _createElementVNode("th", null, "差额"),
                        _createElementVNode("th", null, "变化率")
                      ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                        return (_openBlock(), _createElementBlock("tr", null, [
                          _createElementVNode("td", null, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "textbtn",
                              onClick: $event => (varianceSource(r))
                            }, _toDisplayString(r.sheet) + " · " + _toDisplayString(r.location), 9, _hoisted_1059),
                            _cache[406] || (_cache[406] = _createTextVNode()),
                            _createElementVNode("button", {
                              type: "button",
                              class: "textbtn",
                              onClick: $event => (reportDialog('trace',r))
                            }, "追踪此项", 8, _hoisted_1060),
                            _createElementVNode("small", null, _toDisplayString(r.record) + "　" + _toDisplayString(r.field), 1)
                          ]),
                          _createElementVNode("td", null, _toDisplayString(r.old), 1),
                          _createElementVNode("td", null, _toDisplayString(r.new), 1),
                          _createElementVNode("td", null, _toDisplayString(r.delta), 1),
                          _createElementVNode("td", null, _toDisplayString(r.percent===null?'原值为零':r.percent+'%'), 1)
                        ]))
                      }), 256))])])]),
                      _createElementVNode("div", _hoisted_1061, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.data.page<=1,
                          onClick: $event => (loadVariance(dialog.data.page-1,dialog.applied))
                        }, "上一页", 8, _hoisted_1062),
                        _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.data.page>=dialog.data.pages,
                          onClick: $event => (loadVariance(dialog.data.page+1,dialog.applied))
                        }, "下一页", 8, _hoisted_1063),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total,
                          onClick: varianceExport
                        }, "导出数值 CSV", 8, _hoisted_1064)
                      ]),
                      _cache[408] || (_cache[408] = _createElementVNode("small", null, "变化率 = 差额 ÷ 旧值绝对值。此处仅统计差异中的可比数值。", -1))
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='period'||dialog.type==='trace')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 13 }, [
                  (dialog.type==='period')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_1065, [
                        _createElementVNode("label", null, [_cache[409] || (_cache[409] = _createTextVNode("本期开始")), _withDirectives(_createElementVNode("input", {
                          type: "date",
                          "onUpdate:modelValue": $event => ((dialog.form.start) = $event)
                        }, null, 8, _hoisted_1066), [[_vModelText, dialog.form.start]])]),
                        _createElementVNode("label", null, [_cache[410] || (_cache[410] = _createTextVNode("本期结束")), _withDirectives(_createElementVNode("input", {
                          type: "date",
                          "onUpdate:modelValue": $event => ((dialog.form.end) = $event)
                        }, null, 8, _hoisted_1067), [[_vModelText, dialog.form.end]])]),
                        _createElementVNode("label", null, [_cache[411] || (_cache[411] = _createTextVNode("统计分组")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.group) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({file:'文件',root:'监控目录',folder:'所在文件夹',ext:'扩展名',kind:'变更类型',source:'采集来源',weekday:'星期',hour:'小时'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_1069))
                        }), 256))], 8, _hoisted_1068), [[_vModelSelect, dialog.form.group]])]),
                        _createElementVNode("label", null, [_cache[413] || (_cache[413] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.root_id) = $event) }, [_cache[412] || (_cache[412] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                          return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_1071))
                        }), 256))], 8, _hoisted_1070), [[_vModelSelect, dialog.form.root_id]])]),
                        _createElementVNode("label", null, [_cache[414] || (_cache[414] = _createTextVNode("历史路径片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.q) = $event) }, null, 8, _hoisted_1072), [[_vModelText, dialog.form.q]])]),
                        _createElementVNode("label", null, [_cache[415] || (_cache[415] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.ext) = $event),
                          placeholder: "xlsx, csv"
                        }, null, 8, _hoisted_1073), [[_vModelText, dialog.form.ext]])]),
                        _createElementVNode("label", null, [_cache[416] || (_cache[416] = _createTextVNode("事件类型")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.kind) = $event),
                          placeholder: "例如 内容修改"
                        }, null, 8, _hoisted_1074), [[_vModelText, dialog.form.kind]])]),
                        _createElementVNode("label", null, [_cache[417] || (_cache[417] = _createTextVNode("采集来源")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.source) = $event),
                          placeholder: "例如 手动扫描"
                        }, null, 8, _hoisted_1075), [[_vModelText, dialog.form.source]])]),
                        _createElementVNode("label", null, [_cache[418] || (_cache[418] = _createTextVNode("只看分组")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.trend) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({'':'全部',up:'次数增加',down:'次数减少',equal:'次数相同',new:'本期才出现',gone:'仅上期出现'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_1077))
                        }), 256))], 8, _hoisted_1076), [[_vModelSelect, dialog.form.trend]])]),
                        _createElementVNode("label", null, [_cache[419] || (_cache[419] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.sort) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({after:'本期次数',before:'上期次数',delta:'增幅最大（次数）',drop:'减幅最大（次数）',files:'文件最多',days:'活跃天数最多',label:'分组名称'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_1079))
                        }), 256))], 8, _hoisted_1078), [[_vModelSelect, dialog.form.sort]])]),
                        _createElementVNode("label", null, [_cache[421] || (_cache[421] = _createElementVNode("span", null, "初次采集", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.initial) = $event)
                        }, null, 8, _hoisted_1080), [[_vModelCheckbox, dialog.form.initial]]), _cache[420] || (_cache[420] = _createTextVNode(" 包含初始建档"))])])
                      ]))
                    : _createCommentVNode("", true),
                  (dialog.type==='trace')
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1081, "填写业务编号、字段或位置中的至少一项，查看这个文件多次保存之间的变化。"))
                    : _createCommentVNode("", true),
                  (dialog.type==='trace')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_1082, [
                        _createElementVNode("label", null, [_cache[422] || (_cache[422] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.record) = $event),
                          placeholder: "例如 MD-001"
                        }, null, 8, _hoisted_1083), [[_vModelText, dialog.form.record]])]),
                        _createElementVNode("label", null, [_cache[423] || (_cache[423] = _createTextVNode("字段")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.field) = $event),
                          placeholder: "例如 现存量"
                        }, null, 8, _hoisted_1084), [[_vModelText, dialog.form.field]])]),
                        _createElementVNode("label", null, [_cache[424] || (_cache[424] = _createTextVNode("位置")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.location) = $event),
                          placeholder: "例如 C2"
                        }, null, 8, _hoisted_1085), [[_vModelText, dialog.form.location]])]),
                        _createElementVNode("label", null, [_cache[425] || (_cache[425] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.sheet) = $event) }, null, 8, _hoisted_1086), [[_vModelText, dialog.form.sheet]])]),
                        _createElementVNode("label", null, [_cache[426] || (_cache[426] = _createTextVNode("起始新版本号")), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": $event => ((dialog.form.low) = $event)
                        }, null, 8, _hoisted_1087), [[_vModelText, dialog.form.low]])]),
                        _createElementVNode("label", null, [_cache[427] || (_cache[427] = _createTextVNode("结束新版本号")), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": $event => ((dialog.form.high) = $event)
                        }, null, 8, _hoisted_1088), [[_vModelText, dialog.form.high]])]),
                        _createElementVNode("label", null, [_cache[429] || (_cache[429] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.kind) = $event) }, [_cache[428] || (_cache[428] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (t) => {
                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(t), 1))
                        }), 256))], 8, _hoisted_1089), [[_vModelSelect, dialog.form.kind]])]),
                        _createElementVNode("label", null, [_cache[430] || (_cache[430] = _createTextVNode("差异类别")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.category) = $event),
                          placeholder: "例如 单元格值"
                        }, null, 8, _hoisted_1090), [[_vModelText, dialog.form.category]])]),
                        _createElementVNode("label", null, [_cache[431] || (_cache[431] = _createTextVNode("旧值或新值含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.value) = $event) }, null, 8, _hoisted_1091), [[_vModelText, dialog.form.value]])]),
                        _createElementVNode("label", null, [_cache[433] || (_cache[433] = _createElementVNode("span", null, "轨迹", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.only_return) = $event)
                        }, null, 8, _hoisted_1092), [[_vModelCheckbox, dialog.form.only_return]]), _cache[432] || (_cache[432] = _createTextVNode(" 只看回到先前可见值"))])]),
                        _createElementVNode("label", null, [_cache[435] || (_cache[435] = _createElementVNode("span", null, "时间顺序", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.ascending) = $event)
                        }, null, 8, _hoisted_1093), [[_vModelCheckbox, dialog.form.ascending]]), _cache[434] || (_cache[434] = _createTextVNode(" 最早版本优先"))])])
                      ]))
                    : _createCommentVNode("", true),
                  _createElementVNode("div", _hoisted_1094, [_createElementVNode("button", {
                    type: "button",
                    class: "primary",
                    onClick: $event => (runReport())
                  }, "查询", 8, _hoisted_1095), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: !dialog.data?.total,
                    onClick: exportReport
                  }, "导出查询结果 CSV", 8, _hoisted_1096)]),
                  (dialog.loading)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1097, "正在读取变动…"))
                    : _createCommentVNode("", true),
                  (dialog.data)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [(dialog.type==='period')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("p", null, [_createTextVNode("上期 " + _toDisplayString(dialog.data.previous) + " 至 " + _toDisplayString(dialog.data.previous_end) + "，" + _toDisplayString(dialog.data.before) + " 次，涉及 " + _toDisplayString(dialog.data.files_before) + " 个文件。", 1), _cache[436] || (_cache[436] = _createElementVNode("br", null, null, -1)), _createTextVNode("本期 " + _toDisplayString(dialog.data.start) + " 至 " + _toDisplayString(dialog.data.end) + "，" + _toDisplayString(dialog.data.after) + " 次，涉及 " + _toDisplayString(dialog.data.files_after) + " 个文件。", 1)]), _createElementVNode("div", _hoisted_1098, [_createElementVNode("table", null, [_cache[438] || (_cache[438] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "分组"),
                            _createElementVNode("th", null, "上期"),
                            _createElementVNode("th", null, "本期"),
                            _createElementVNode("th", null, "增减"),
                            _createElementVNode("th", null, "本期文件"),
                            _createElementVNode("th", null, "活跃天数"),
                            _createElementVNode("th", null, "本期首次 / 最近"),
                            _createElementVNode("th", null, "核查")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, _toDisplayString(r.label), 1),
                              _createElementVNode("td", null, _toDisplayString(r.before), 1),
                              _createElementVNode("td", null, _toDisplayString(r.after), 1),
                              _createElementVNode("td", null, _toDisplayString(r.delta>0?'+'+r.delta:r.delta), 1),
                              _createElementVNode("td", null, _toDisplayString(r.files), 1),
                              _createElementVNode("td", null, _toDisplayString(r.days), 1),
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.first?fmt(r.first):'—'), 1), _cache[437] || (_cache[437] = _createElementVNode("br", null, null, -1)), _createTextVNode(_toDisplayString(r.last?fmt(r.last):'—'), 1)]),
                              _createElementVNode("td", null, [_createElementVNode("button", {
                                type: "button",
                                class: "textbtn",
                                onClick: $event => (reportSource(r))
                              }, "最近事件", 8, _hoisted_1099)])
                            ]))
                          }), 256))])])])], 64))
                        : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createElementVNode("p", null, "命中 " + _toDisplayString(dialog.data.versions) + " 个版本 · 回到先前可见值 " + _toDisplayString(dialog.data.returns) + " 项", 1), _createElementVNode("small", null, [_cache[439] || (_cache[439] = _createTextVNode("所选范围内可见相邻版本的解析情况：")), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.coverage, (n, k) => {
                            return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                          }), 256))]), _createElementVNode("div", _hoisted_1100, [_createElementVNode("table", null, [_cache[443] || (_cache[443] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "保存时间 / 版本"),
                            _createElementVNode("th", null, "当时路径 / 位置"),
                            _createElementVNode("th", null, "编号 / 字段"),
                            _createElementVNode("th", null, "旧值"),
                            _createElementVNode("th", null, "新值"),
                            _createElementVNode("th", null, "变化")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(r.stamp)), 1), _cache[440] || (_cache[440] = _createElementVNode("br", null, null, -1)), _createTextVNode("V" + _toDisplayString(r.prior) + " → V" + _toDisplayString(r.version), 1)]),
                              _createElementVNode("td", null, [
                                _createTextVNode(_toDisplayString(r.rel), 1),
                                _cache[441] || (_cache[441] = _createElementVNode("br", null, null, -1)),
                                _createTextVNode(_toDisplayString(r.sheet) + " · ", 1),
                                _createElementVNode("button", {
                                  type: "button",
                                  class: "textbtn",
                                  onClick: $event => (reportSource(r))
                                }, _toDisplayString(r.location), 9, _hoisted_1101)
                              ]),
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.record), 1), _cache[442] || (_cache[442] = _createElementVNode("br", null, null, -1)), _createTextVNode(_toDisplayString(r.field), 1)]),
                              _createElementVNode("td", _hoisted_1102, _toDisplayString(r.old??'—'), 1),
                              _createElementVNode("td", _hoisted_1103, _toDisplayString(r.new??'—'), 1),
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.kind) + " " + _toDisplayString(r.category), 1), (r.returning==='是')
                                ? (_openBlock(), _createElementBlock("small", _hoisted_1104, "回到先前可见值"))
                                : _createCommentVNode("", true)])
                            ]))
                          }), 256))])])])], 64)), (!dialog.data.total)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_1105, "当前条件没有匹配项。"))
                        : _createCommentVNode("", true), _createElementVNode("div", _hoisted_1106, [_createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page===1,
                        onClick: $event => (runReport(dialog.data.page-1,dialog.applied))
                      }, "上一页", 8, _hoisted_1107), _createElementVNode("span", null, _toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages) + " 页 · " + _toDisplayString(dialog.data.total) + " 项", 1), _createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page===dialog.data.pages,
                        onClick: $event => (runReport(dialog.data.page+1,dialog.applied))
                      }, "下一页", 8, _hoisted_1108)])], 64))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='capture_policy')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 14 }, [
                  _createElementVNode("p", _hoisted_1109, _toDisplayString(dialog.path), 1),
                  _createElementVNode("label", null, [_cache[444] || (_cache[444] = _createTextVNode("稳定等待时长")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.settle_ms) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([500,1500,3000,5000,10000], (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v }, _toDisplayString(v/1000) + " 秒", 9, _hoisted_1111))
                  }), 256))], 8, _hoisted_1110), [[
                    _vModelSelect,
                    dialog.settle_ms,
                    void 0,
                    { number: true }
                  ]])]),
                  _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.all_types) = $event)
                  }, null, 8, _hoisted_1112), [[_vModelCheckbox, dialog.all_types]]), _cache[445] || (_cache[445] = _createTextVNode("对所有扩展名启用稳定等待"))]),
                  _cache[446] || (_cache[446] = _createElementVNode("small", null, "监听到保存后，在复查中确认签名保持稳定。默认用于 Office、开放文档、PDF、电子书、ZIP 和笔记本等格式。", -1))
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='waiting_files')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 15 }, [
                  _createElementVNode("p", _hoisted_1113, _toDisplayString(dialog.path), 1),
                  _createElementVNode("div", _hoisted_1114, [_createElementVNode("label", null, [_cache[447] || (_cache[447] = _createTextVNode("文件路径")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.filters.q) = $event),
                    maxlength: "512",
                    placeholder: "输入相对路径片段"
                  }, null, 8, _hoisted_1115), [[_vModelText, dialog.filters.q]])]), _createElementVNode("label", null, [_cache[449] || (_cache[449] = _createTextVNode("等待原因")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.reason) = $event) }, [_cache[448] || (_cache[448] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(scanFacetChoices(dialog.reasons,dialog.filters.reason), (v) => {
                    return (_openBlock(), _createElementBlock("option", { key: v }, _toDisplayString(v), 1))
                  }), 128))], 8, _hoisted_1116), [[_vModelSelect, dialog.filters.reason]])]), _createElementVNode("label", null, [_cache[451] || (_cache[451] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.sort) = $event) }, _cache[450] || (_cache[450] = [
                    _createElementVNode("option", { value: "" }, "最早等待", -1),
                    _createElementVNode("option", { value: "recent" }, "最近观察", -1),
                    _createElementVNode("option", { value: "attempts" }, "观察次数最多", -1),
                    _createElementVNode("option", { value: "path" }, "文件路径", -1)
                  ]), 8, _hoisted_1117), [[_vModelSelect, dialog.filters.sort]])])]),
                  _createElementVNode("div", _hoisted_1118, [_cache[452] || (_cache[452] = _createElementVNode("button", {
                    type: "submit",
                    class: "primary"
                  }, "查询当前队列", -1)), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: resetWaiting
                  }, "重置", 8, _hoisted_1119), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: backToJournal
                  }, _toDisplayString(dialog.previousJournal?'返回扫描运行记录':'查看扫描运行记录'), 9, _hoisted_1120)]),
                  (dialog.loading)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1121, "正在读取当前等待队列…"))
                    : _createCommentVNode("", true),
                  (dialog.data)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                        scanFiltersPending
                          ? (_openBlock(), _createElementBlock("p", _hoisted_1122, "筛选条件已修改，查询后更新结果。"))
                          : _createCommentVNode("", true),
                        _createElementVNode("p", _hoisted_1123, "当前匹配 " + _toDisplayString(num(dialog.data.total)) + " 个等待文件", 1),
                        (Object.keys(dialog.data.counts||{}).length)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_1124, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.counts, (count, reason) => {
                              return (_openBlock(), _createElementBlock("button", {
                                key: reason,
                                type: "button",
                                class: "btn",
                                "aria-pressed": dialog.applied.reason===reason,
                                onClick: $event => (waitingReason(reason))
                              }, _toDisplayString(reason) + " " + _toDisplayString(num(count)), 9, _hoisted_1125))
                            }), 128))]))
                          : _createCommentVNode("", true),
                        (dialog.data.total)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_1126, [_createElementVNode("table", null, [_cache[453] || (_cache[453] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                              _createElementVNode("th", { scope: "col" }, "文件与原因"),
                              _createElementVNode("th", { scope: "col" }, "首次等待"),
                              _createElementVNode("th", { scope: "col" }, "最近观察"),
                              _createElementVNode("th", { scope: "col" }, "观察次数")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                              return (_openBlock(), _createElementBlock("tr", { key: r.rel }, [
                                _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.rel), 1), _createElementVNode("small", null, _toDisplayString(r.reason), 1)]),
                                _createElementVNode("td", null, _toDisplayString(fmt(r.first_seen)), 1),
                                _createElementVNode("td", null, _toDisplayString(fmt(r.last_seen)), 1),
                                _createElementVNode("td", null, _toDisplayString(num(r.attempts)), 1)
                              ]))
                            }), 128))])])]))
                          : (_openBlock(), _createElementBlock("p", _hoisted_1127, "当前条件下没有等待文件。")),
                        (dialog.data.pages>1)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_1128, [_createElementVNode("button", {
                              class: "btn",
                              type: "button",
                              disabled: dialog.data.page<=1,
                              onClick: $event => (loadWaiting(dialog.data.page-1))
                            }, "上一页", 8, _hoisted_1129), _createElementVNode("span", null, "第 " + _toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages) + " 页", 1), _createElementVNode("button", {
                              class: "btn",
                              type: "button",
                              disabled: dialog.data.page>=dialog.data.pages,
                              onClick: $event => (loadWaiting(dialog.data.page+1))
                            }, "下一页", 8, _hoisted_1130)]))
                          : _createCommentVNode("", true)
                      ], 64))
                    : _createCommentVNode("", true),
                  _cache[454] || (_cache[454] = _createElementVNode("small", null, "此处显示查询时仍在等待的文件。", -1))
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='scan_log')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 16 }, [
                  _createElementVNode("p", _hoisted_1131, _toDisplayString(dialog.path), 1),
                  _createElementVNode("div", _hoisted_1132, [
                    _createElementVNode("label", null, [_cache[456] || (_cache[456] = _createTextVNode("运行结果")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.state) = $event) }, [_cache[455] || (_cache[455] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.states, (v) => {
                      return (_openBlock(), _createElementBlock("option", { key: v }, _toDisplayString(v), 1))
                    }), 128))], 8, _hoisted_1133), [[_vModelSelect, dialog.filters.state]])]),
                    _createElementVNode("label", null, [_cache[458] || (_cache[458] = _createTextVNode("触发来源")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.source) = $event) }, [_cache[457] || (_cache[457] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(scanFacetChoices(dialog.sources,dialog.filters.source), (v) => {
                      return (_openBlock(), _createElementBlock("option", { key: v }, _toDisplayString(v), 1))
                    }), 128))], 8, _hoisted_1134), [[_vModelSelect, dialog.filters.source]])]),
                    _createElementVNode("label", null, [_cache[459] || (_cache[459] = _createTextVNode("起始日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((dialog.filters.start) = $event)
                    }, null, 8, _hoisted_1135), [[_vModelText, dialog.filters.start]])]),
                    _createElementVNode("label", null, [_cache[460] || (_cache[460] = _createTextVNode("结束日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((dialog.filters.end) = $event)
                    }, null, 8, _hoisted_1136), [[_vModelText, dialog.filters.end]])])
                  ]),
                  _createElementVNode("details", _hoisted_1137, [_cache[470] || (_cache[470] = _createElementVNode("summary", null, "异常、跳过与排序", -1)), _createElementVNode("div", _hoisted_1138, [
                    _createElementVNode("label", null, [_cache[462] || (_cache[462] = _createTextVNode("异常类别")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.problem) = $event) }, [_cache[461] || (_cache[461] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(scanFacetChoices(dialog.problems,dialog.filters.problem), (v) => {
                      return (_openBlock(), _createElementBlock("option", { key: v }, _toDisplayString(v), 1))
                    }), 128))], 8, _hoisted_1139), [[_vModelSelect, dialog.filters.problem]])]),
                    _createElementVNode("label", null, [_cache[464] || (_cache[464] = _createTextVNode("跳过原因")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.skip_reason) = $event) }, [_cache[463] || (_cache[463] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(scanFacetChoices(dialog.skipReasons,dialog.filters.skip_reason), (v) => {
                      return (_openBlock(), _createElementBlock("option", { key: v }, _toDisplayString(v), 1))
                    }), 128))], 8, _hoisted_1140), [[_vModelSelect, dialog.filters.skip_reason]])]),
                    _createElementVNode("label", null, [_cache[466] || (_cache[466] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.sort) = $event) }, _cache[465] || (_cache[465] = [
                      _createElementVNode("option", { value: "recent" }, "最新运行", -1),
                      _createElementVNode("option", { value: "oldest" }, "最早运行", -1),
                      _createElementVNode("option", { value: "slowest" }, "耗时最长", -1),
                      _createElementVNode("option", { value: "waiting" }, "等待数量最多", -1)
                    ]), 8, _hoisted_1141), [[_vModelSelect, dialog.filters.sort]])]),
                    _createElementVNode("label", null, [_cache[467] || (_cache[467] = _createTextVNode("每页条数")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.filters.size) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([20,50,100], (v) => {
                      return (_openBlock(), _createElementBlock("option", {
                        key: v,
                        value: v
                      }, _toDisplayString(v) + " 条", 9, _hoisted_1143))
                    }), 128))], 8, _hoisted_1142), [[
                      _vModelSelect,
                      dialog.filters.size,
                      void 0,
                      { number: true }
                    ]])])
                  ]), _createElementVNode("div", _hoisted_1144, [_createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.filters.skips) = $event)
                  }, null, 8, _hoisted_1145), [[_vModelCheckbox, dialog.filters.skips]]), _cache[468] || (_cache[468] = _createTextVNode("仅有跳过项"))]), _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.filters.waiting) = $event)
                  }, null, 8, _hoisted_1146), [[_vModelCheckbox, dialog.filters.waiting]]), _cache[469] || (_cache[469] = _createTextVNode("仅有等待项"))])])]),
                  _createElementVNode("div", _hoisted_1147, [
                    _cache[471] || (_cache[471] = _createElementVNode("button", {
                      type: "submit",
                      class: "primary"
                    }, "查询扫描记录", -1)),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: resetJournal
                    }, "重置", 8, _hoisted_1148),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      disabled: !dialog.data?.total||dialog.loading,
                      onClick: exportJournal
                    }, "导出当前结果 CSV", 8, _hoisted_1149),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: journalWaiting
                    }, "查看当前等待队列", 8, _hoisted_1150)
                  ]),
                  (dialog.loading)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1151, "正在读取扫描记录…"))
                    : _createCommentVNode("", true),
                  (dialog.data)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [scanFiltersPending
                        ? (_openBlock(), _createElementBlock("p", _hoisted_1152, "筛选条件已修改，查询后更新结果。"))
                        : _createCommentVNode("", true), _createElementVNode("p", _hoisted_1153, "匹配 " + _toDisplayString(num(dialog.data.total)) + " 次运行", 1), (dialog.data.total)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [(dialog.data.summary)
                            ? (_openBlock(), _createElementBlock("section", _hoisted_1154, [_createElementVNode("dl", _hoisted_1155, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([['candidates','候选'],['captured','快照读取'],['read_bytes','快照读取量'],['reused','内容复用'],['waiting','等待'],['skipped','跳过']], ([key,label]) => {
                                return (_openBlock(), _createElementBlock("div", { key: key }, [_createElementVNode("dt", null, _toDisplayString(label), 1), _createElementVNode("dd", null, _toDisplayString(journalMetric(key,dialog.data.summary[key])), 1)]))
                              }), 128))]), (dialog.data.summary.finished)
                                ? (_openBlock(), _createElementBlock("p", _hoisted_1156, _toDisplayString(num(dialog.data.summary.finished)) + " 次有耗时记录 · 平均 " + _toDisplayString(num(dialog.data.average)) + " 毫秒 · 最长 " + _toDisplayString(num(dialog.data.longest)) + " 毫秒", 1))
                                : (_openBlock(), _createElementBlock("p", _hoisted_1157, "当前结果没有耗时记录。")), _createElementVNode("details", _hoisted_1158, [
                                _cache[472] || (_cache[472] = _createElementVNode("summary", null, "运行分布与耗时分位", -1)),
                                (dialog.data.summary.finished)
                                  ? (_openBlock(), _createElementBlock("p", _hoisted_1159, "50% 的有耗时运行在 " + _toDisplayString(num(dialog.data.summary.p50)) + " 毫秒内 · 95% 在 " + _toDisplayString(num(dialog.data.summary.p95)) + " 毫秒内", 1))
                                  : _createCommentVNode("", true),
                                _createElementVNode("div", _hoisted_1160, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.summary.states, (n, name) => {
                                  return (_openBlock(), _createElementBlock(_Fragment, { key: name }, [n
                                    ? (_openBlock(), _createElementBlock("button", {
                                        key: 0,
                                        type: "button",
                                        class: "btn",
                                        "aria-pressed": dialog.applied.state===name,
                                        onClick: $event => (journalFacet('state',name))
                                      }, _toDisplayString(name) + " " + _toDisplayString(num(n)), 9, _hoisted_1161))
                                    : _createCommentVNode("", true)], 64))
                                }), 128))]),
                                (Object.keys(dialog.data.summary.skip_reasons).length)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_1162, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.summary.skip_reasons, (n, name) => {
                                      return (_openBlock(), _createElementBlock("button", {
                                        key: name,
                                        type: "button",
                                        class: "btn",
                                        "aria-pressed": dialog.applied.skip_reason===name,
                                        onClick: $event => (journalFacet('skip_reason',name))
                                      }, _toDisplayString(name) + " " + _toDisplayString(num(n)), 9, _hoisted_1163))
                                    }), 128))]))
                                  : _createCommentVNode("", true),
                                (Object.keys(dialog.data.summary.problems).length)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_1164, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.summary.problems, (n, name) => {
                                      return (_openBlock(), _createElementBlock("button", {
                                        key: name,
                                        type: "button",
                                        class: "btn",
                                        "aria-pressed": dialog.applied.problem===name,
                                        onClick: $event => (journalFacet('problem',name))
                                      }, _toDisplayString(name) + " " + _toDisplayString(num(n)), 9, _hoisted_1165))
                                    }), 128))]))
                                  : _createCommentVNode("", true)
                              ])]))
                            : _createCommentVNode("", true)], 64))
                        : (_openBlock(), _createElementBlock("p", _hoisted_1166, "没有匹配的运行记录。"))], 64))
                    : _createCommentVNode("", true),
                  (dialog.selectedRuns.length)
                    ? (_openBlock(), _createElementBlock("section", _hoisted_1167, [_createElementVNode("div", _hoisted_1168, [_createElementVNode("span", _hoisted_1169, "已选 " + _toDisplayString(dialog.selectedRuns.length) + " / 2", 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.selectedRuns, (run) => {
                        return (_openBlock(), _createElementBlock("button", {
                          key: run.id,
                          type: "button",
                          class: "btn",
                          onClick: $event => (toggleJournalRun(run)),
                          "aria-label": '移除扫描 #'+run.id
                        }, "移除 #" + _toDisplayString(run.id), 9, _hoisted_1170))
                      }), 128)), _createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        onClick: $event => (dialog.selectedRuns=[])
                      }, "清空对照", 8, _hoisted_1171)]), journalComparison
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_cache[477] || (_cache[477] = _createElementVNode("h3", null, "两次扫描对照", -1)), _createElementVNode("div", _hoisted_1172, [_createElementVNode("table", null, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _cache[473] || (_cache[473] = _createElementVNode("th", { scope: "col" }, "指标", -1)),
                            _createElementVNode("th", _hoisted_1173, "较早 #" + _toDisplayString(journalComparison.before.id), 1),
                            _createElementVNode("th", _hoisted_1174, "较晚 #" + _toDisplayString(journalComparison.after.id), 1),
                            _cache[474] || (_cache[474] = _createElementVNode("th", { scope: "col" }, "增减", -1))
                          ])]), _createElementVNode("tbody", null, [_createElementVNode("tr", null, [
                            _cache[475] || (_cache[475] = _createElementVNode("th", { scope: "row" }, "开始与来源", -1)),
                            _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(journalComparison.before.started)), 1), _createElementVNode("small", null, _toDisplayString(journalComparison.before.source) + " · " + _toDisplayString(journalComparison.before.status), 1)]),
                            _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(journalComparison.after.started)), 1), _createElementVNode("small", null, _toDisplayString(journalComparison.after.source) + " · " + _toDisplayString(journalComparison.after.status), 1)]),
                            _cache[476] || (_cache[476] = _createElementVNode("td", null, "—", -1))
                          ]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(journalComparison.metrics, (metric) => {
                            return (_openBlock(), _createElementBlock("tr", { key: metric.key }, [
                              _createElementVNode("th", _hoisted_1175, _toDisplayString(metric.label), 1),
                              _createElementVNode("td", null, _toDisplayString(journalMetric(metric.key,metric.before)), 1),
                              _createElementVNode("td", null, _toDisplayString(journalMetric(metric.key,metric.after)), 1),
                              _createElementVNode("td", null, _toDisplayString(journalMetric(metric.key,metric.delta,true)), 1)
                            ]))
                          }), 128))])])])], 64))
                        : (_openBlock(), _createElementBlock("p", _hoisted_1176, "再选一次扫描即可对照。已选记录会保留到下一页。"))]))
                    : _createCommentVNode("", true),
                  (dialog.data?.total)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [_createElementVNode("div", _hoisted_1177, [_createElementVNode("table", null, [_cache[479] || (_cache[479] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                        _createElementVNode("th", { scope: "col" }, "开始与来源"),
                        _createElementVNode("th", { scope: "col" }, "结果"),
                        _createElementVNode("th", { scope: "col" }, "耗时"),
                        _createElementVNode("th", { scope: "col" }, "运行数据"),
                        _createElementVNode("th", { scope: "col" }, "对照")
                      ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                        return (_openBlock(), _createElementBlock("tr", { key: r.id }, [
                          _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(r.started)), 1), _createElementVNode("small", null, "#" + _toDisplayString(r.id) + " · " + _toDisplayString(r.source), 1)]),
                          _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.status), 1), (r.problem)
                            ? (_openBlock(), _createElementBlock("small", _hoisted_1178, _toDisplayString(r.problem), 1))
                            : _createCommentVNode("", true)]),
                          _createElementVNode("td", null, _toDisplayString(r.ended?num(r.elapsed_ms)+' ms':'—'), 1),
                          _createElementVNode("td", null, [_createElementVNode("details", null, [
                            _cache[478] || (_cache[478] = _createElementVNode("summary", null, "查看运行数据", -1)),
                            _createElementVNode("p", null, "候选 " + _toDisplayString(num(r.candidates)) + " · 快照读取 " + _toDisplayString(num(r.captured)) + "（" + _toDisplayString(bytes(r.read_bytes)) + "）· 内容复用 " + _toDisplayString(num(r.reused)) + " · 等待 " + _toDisplayString(num(r.waiting)) + " · 跳过 " + _toDisplayString(num(r.skipped)), 1),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.skip_reasons, (n, k) => {
                              return (_openBlock(), _createElementBlock("p", { key: k }, _toDisplayString(k) + " " + _toDisplayString(num(n)), 1))
                            }), 128)),
                            (r.ended)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_1179, "结束于 " + _toDisplayString(fmt(r.ended)), 1))
                              : _createCommentVNode("", true)
                          ])]),
                          _createElementVNode("td", null, [_createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            "aria-label": (journalHasRun(r.id)?'移除':'选择')+'扫描 #'+r.id,
                            "aria-pressed": journalHasRun(r.id),
                            disabled: r.status==='进行中'||(!journalHasRun(r.id)&&dialog.selectedRuns.length>=2),
                            onClick: $event => (toggleJournalRun(r))
                          }, _toDisplayString(journalHasRun(r.id)?'移除':'选择'), 9, _hoisted_1180)])
                        ]))
                      }), 128))])])]), (dialog.data.pages>1)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_1181, [_createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: dialog.data.page<=1,
                            onClick: $event => (loadJournal(dialog.data.page-1))
                          }, "上一页", 8, _hoisted_1182), _createElementVNode("span", null, "第 " + _toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages) + " 页", 1), _createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: dialog.data.page>=dialog.data.pages,
                            onClick: $event => (loadJournal(dialog.data.page+1))
                          }, "下一页", 8, _hoisted_1183)]))
                        : _createCommentVNode("", true)], 64))
                    : _createCommentVNode("", true),
                  _cache[480] || (_cache[480] = _createElementVNode("small", null, "每个目录保留最近 200 次扫描。汇总涵盖所有匹配运行，同一文件可能计入多次。", -1))
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='rule_history')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 17 }, [_createElementVNode("p", _hoisted_1184, _toDisplayString(dialog.path), 1), _createElementVNode("ol", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.entries, (r) => {
                  return (_openBlock(), _createElementBlock("li", { key: r.id }, _toDisplayString(fmt(r.stamp)) + " · " + _toDisplayString(r.patterns||'无排除规则') + " · " + _toDisplayString(r.max_mb ? r.max_mb+' MiB':'不限大小'), 1))
                }), 128))]), _cache[481] || (_cache[481] = _createElementVNode("small", null, "最近 100 次配置，最新在前。", -1))], 64))
              : _createCommentVNode("", true),
            (dialog.type==='inspect')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 18 }, [_createElementVNode("label", null, [_cache[482] || (_cache[482] = _createTextVNode("备份 ZIP 路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_1185), [[_vModelText, dialog.path]])]), _cache[483] || (_cache[483] = _createElementVNode("small", null, "逐个核对对象，无需退出监控。", -1))], 64))
              : _createCommentVNode("", true),
            (dialog.type==='backup')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 19 }, [_createElementVNode("label", null, [_cache[484] || (_cache[484] = _createTextVNode("管理口令")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.password) = $event),
                  type: "password",
                  autocomplete: "off",
                  required: ""
                }, null, 8, _hoisted_1186), [[_vModelText, dialog.password]])]), _createElementVNode("label", null, [_cache[485] || (_cache[485] = _createTextVNode("新备份文件的完整路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_1187), [[_vModelText, dialog.path]])])], 64))
              : _createCommentVNode("", true),
            (dialog.type==='root')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 20 }, [
                  _createElementVNode("label", null, [_cache[486] || (_cache[486] = _createTextVNode("目录路径")), _createElementVNode("div", _hoisted_1188, [_withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.path) = $event),
                    placeholder: "例如 D:\\业务资料\\仓库",
                    required: "",
                    readonly: !!dialog.id
                  }, null, 8, _hoisted_1189), [[_vModelText, dialog.path]]), (native&&!dialog.id)
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn",
                        onClick: chooseDir
                      }, "浏览", 8, _hoisted_1190))
                    : _createCommentVNode("", true)])]),
                  _createElementVNode("label", null, [_cache[487] || (_cache[487] = _createTextVNode("排除规则")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.patterns) = $event),
                    placeholder: "例如 *.tmp，*.bak，缓存/*"
                  }, null, 8, _hoisted_1191), [[_vModelText, dialog.patterns]])]),
                  _createElementVNode("label", null, [_cache[488] || (_cache[488] = _createTextVNode("单文件大小上限（MiB）")), _withDirectives(_createElementVNode("input", {
                    type: "number",
                    min: "0",
                    "onUpdate:modelValue": $event => ((dialog.max_mb) = $event)
                  }, null, 8, _hoisted_1192), [[
                    _vModelText,
                    dialog.max_mb,
                    void 0,
                    { number: true }
                  ]])]),
                  _cache[492] || (_cache[492] = _createElementVNode("small", null, "填 0 表示不限大小。超过上限的文件会跳过。", -1)),
                  _createElementVNode("details", null, [
                    _cache[491] || (_cache[491] = _createElementVNode("summary", null, "保存前预演规则", -1)),
                    _createElementVNode("label", null, [_cache[489] || (_cache[489] = _createTextVNode("待测文件相对路径，每行一个")), _withDirectives(_createElementVNode("textarea", {
                      "onUpdate:modelValue": $event => ((dialog.paths) = $event),
                      placeholder: "草稿/试算.xlsx"
                    }, null, 8, _hoisted_1193), [[_vModelText, dialog.paths]])]),
                    _createElementVNode("label", null, [_cache[490] || (_cache[490] = _createTextVNode("假设每个文件大小（字节，可留空）")), _withDirectives(_createElementVNode("input", {
                      type: "number",
                      min: "0",
                      "onUpdate:modelValue": $event => ((dialog.probeBytes) = $event)
                    }, null, 8, _hoisted_1194), [[_vModelText, dialog.probeBytes]])]),
                    _createElementVNode("button", {
                      class: "btn",
                      type: "button",
                      onClick: previewRules
                    }, "预演", 8, _hoisted_1195),
                    (dialog.samples&&dialog.probed===ruleSignature(dialog))
                      ? (_openBlock(), _createElementBlock("ul", _hoisted_1196, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.samples, (r) => {
                          return (_openBlock(), _createElementBlock("li", null, [_createTextVNode(_toDisplayString(r.rel) + " · " + _toDisplayString(r.reason) + " ", 1), (r.pattern)
                            ? (_openBlock(), _createElementBlock("span", _hoisted_1197, "· " + _toDisplayString(r.pattern) + " 命中 " + _toDisplayString(r.part), 1))
                            : _createCommentVNode("", true)]))
                        }), 256))]))
                      : _createCommentVNode("", true)
                  ])
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='save')
              ? (_openBlock(), _createElementBlock("label", _hoisted_1198, [_cache[493] || (_cache[493] = _createTextVNode("保存路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: "",
                  placeholder: "请输入完整的新文件路径"
                }, null, 8, _hoisted_1199), [[_vModelText, dialog.path]])]))
              : _createCommentVNode("", true),
            (['info','confirm'].includes(dialog.type))
              ? (_openBlock(), _createElementBlock("p", _hoisted_1200, _toDisplayString(dialog.body), 1))
              : _createCommentVNode("", true),
            (dialog.type==='tree')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 23 }, [_createElementVNode("label", _hoisted_1201, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.query) = $event),
                  placeholder: "搜索子目录路径"
                }, null, 8, _hoisted_1202), [[_vModelText, dialog.query]])]), _createElementVNode("div", _hoisted_1203, [_createElementVNode("button", {
                  type: "button",
                  onClick: $event => (rootFiles(dialog.root))
                }, "全部文件", 8, _hoisted_1204), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleFolders, (folder) => {
                  return (_openBlock(), _createElementBlock("button", {
                    type: "button",
                    key: folder.path,
                    onClick: $event => (treeSelect(dialog.root,folder.path)),
                    style: _normalizeStyle({paddingLeft:(8+14*(folder.path.split('/').length-1))+'px'})
                  }, [_createVNode(_component_ico, { n: "folder" }), _createElementVNode("span", null, _toDisplayString(folder.path), 1), _createElementVNode("small", null, _toDisplayString(folder.total) + " 个文件", 1)], 12, _hoisted_1205))
                }), 128))]), (!dialog.folders.length)
                  ? (_openBlock(), _createElementBlock("small", _hoisted_1206, "当前目录没有含已跟踪文件的子目录。"))
                  : (!visibleFolders.length)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_1207, "没有匹配的子目录。"))
                    : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='pick')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 24 }, [_createElementVNode("div", _hoisted_1208, [_createElementVNode("label", _hoisted_1209, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                  id: "filePicker",
                  "onUpdate:modelValue": $event => ((pickQ) = $event),
                  onInput: searchPick,
                  placeholder: "搜索现名、旧名或相对路径"
                }, null, 40, _hoisted_1210), [[_vModelText, pickQ]])]), _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": $event => ((pickScope) = $event),
                  "aria-label": "历史文件范围",
                  onChange: $event => {pickPage=1;loadPicks()}
                }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(fileScopes, (entry) => {
                  return (_openBlock(), _createElementBlock("option", { value: entry[0] }, _toDisplayString(entry[1]), 9, _hoisted_1212))
                }), 256))], 40, _hoisted_1211), [[_vModelSelect, pickScope]])]), _createElementVNode("div", _hoisted_1213, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(picks.items, (v) => {
                  return (_openBlock(), _createElementBlock("button", {
                    type: "button",
                    key: v.id,
                    disabled: pickLoading,
                    onClick: $event => (picked(v))
                  }, [_createElementVNode("span", { class: _normalizeClass(["file-icon", tone(v.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(v.ext) }, null, 8, ["n"])], 2), _createElementVNode("span", _hoisted_1215, [
                    _createElementVNode("b", null, _toDisplayString(base(v.rel)), 1),
                    _createElementVNode("small", null, _toDisplayString(parent(v.root,v.rel)), 1),
                    (v.matched_path)
                      ? (_openBlock(), _createElementBlock("small", _hoisted_1216, "原路径：" + _toDisplayString(v.matched_path), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("small", null, [_createElementVNode("span", { class: _normalizeClass(["tag", stateTone(v.file_state)]) }, _toDisplayString(v.file_state), 3), _createTextVNode("　V" + _toDisplayString(v.version) + " · " + _toDisplayString(fmt(v.updated)), 1)])
                  ]), _createVNode(_component_ico, { n: "chevron-right" })], 8, _hoisted_1214))
                }), 128)), pickLoading
                  ? (_openBlock(), _createElementBlock("p", _hoisted_1217, "正在查找…"))
                  : (!picks.items.length)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_1218, "当前范围内没有找到文件"))
                    : _createCommentVNode("", true)]), _createElementVNode("div", _hoisted_1219, [_createElementVNode("span", null, "共 " + _toDisplayString(picks.total) + " 个文件", 1), _createElementVNode("span", null, [_createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: pickPage<=1,
                  onClick: $event => {pickPage--;loadPicks()}
                }, "上一页", 8, _hoisted_1220), _cache[494] || (_cache[494] = _createTextVNode()), _createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: pickPage*picks.size>=picks.total,
                  onClick: $event => {pickPage++;loadPicks()}
                }, "下一页", 8, _hoisted_1221)])])], 64))
              : _createCommentVNode("", true),
            (dialog.error)
              ? (_openBlock(), _createElementBlock("p", _hoisted_1222, _toDisplayString(dialog.error), 1))
              : _createCommentVNode("", true),
            (!['pick','info','tree','rule_history','private_records','scan_log','waiting_files','ledger','receipt','period','trace','inventory','health','variance','backup_result','delivery_result','review_batch'].includes(dialog.type)&&!(dialog.type==='restore_preview'&&(demo||dialog.loading||!dialog.info||dialog.info.identical)))
              ? (_openBlock(), _createElementBlock("div", _hoisted_1223, [_createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: busy,
                  onClick: $event => (dialog=null)
                }, "取消", 8, _hoisted_1224), _createElementVNode("button", {
                  class: "primary",
                  disabled: busy
                }, _toDisplayString(busy?'处理中…':dialog.submit||'保存'), 9, _hoisted_1225)]))
              : _createCommentVNode("", true)
          ], 40, _hoisted_834)], 10, _hoisted_831)], 8, _hoisted_830))
        : _createCommentVNode("", true),
      message
        ? (_openBlock(), _createElementBlock("div", _hoisted_1226, _toDisplayString(message), 1))
        : _createCommentVNode("", true)
    ], 2))
  }
}
})();
window.FG_VIEW._rc=true;

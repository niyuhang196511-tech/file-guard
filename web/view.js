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
const _hoisted_22 = { class: "hero" }
const _hoisted_23 = { class: "hero-state" }
const _hoisted_24 = ["disabled", "onClick"]
const _hoisted_25 = { class: "stats" }
const _hoisted_26 = ["onClick"]
const _hoisted_27 = { class: "stat-title" }
const _hoisted_28 = { class: "chart-row" }
const _hoisted_29 = { class: "card trend" }
const _hoisted_30 = { class: "card-head" }
const _hoisted_31 = ["onUpdate:modelValue", "onChange"]
const _hoisted_32 = ["value"]
const _hoisted_33 = {
  key: 0,
  class: "chart"
}
const _hoisted_34 = {
  viewBox: "0 0 640 146",
  role: "img",
  "aria-label": "每日内容修改、新增和其他变更趋势"
}
const _hoisted_35 = ["y1", "y2"]
const _hoisted_36 = ["y"]
const _hoisted_37 = ["d"]
const _hoisted_38 = ["points", "stroke", "stroke-width"]
const _hoisted_39 = ["x"]
const _hoisted_40 = ["x"]
const _hoisted_41 = { class: "card" }
const _hoisted_42 = { class: "distribution" }
const _hoisted_43 = { class: "dist-list" }
const _hoisted_44 = {
  key: 0,
  class: "quiet"
}
const _hoisted_45 = { class: "bottom-row" }
const _hoisted_46 = { class: "card" }
const _hoisted_47 = { class: "card-head" }
const _hoisted_48 = ["onClick"]
const _hoisted_49 = ["onClick", "onKeydown"]
const _hoisted_50 = { class: "activity-name" }
const _hoisted_51 = {
  key: 0,
  class: "empty"
}
const _hoisted_52 = { class: "card" }
const _hoisted_53 = { class: "card-head" }
const _hoisted_54 = ["onClick"]
const _hoisted_55 = { class: "root-mini" }
const _hoisted_56 = { class: "folder-icon" }
const _hoisted_57 = {
  key: 0,
  class: "empty"
}
const _hoisted_58 = ["onClick"]
const _hoisted_59 = { class: "page-title" }
const _hoisted_60 = { class: "actions" }
const _hoisted_61 = ["disabled", "onClick"]
const _hoisted_62 = ["onClick"]
const _hoisted_63 = ["onClick"]
const _hoisted_64 = ["onClick"]
const _hoisted_65 = ["onClick"]
const _hoisted_66 = ["onClick"]
const _hoisted_67 = ["onClick"]
const _hoisted_68 = ["onClick"]
const _hoisted_69 = ["disabled", "onClick"]
const _hoisted_70 = {
  key: 0,
  class: "card empty"
}
const _hoisted_71 = ["onClick"]
const _hoisted_72 = {
  key: 1,
  class: "card root-toolbar"
}
const _hoisted_73 = { class: "search-input" }
const _hoisted_74 = ["onUpdate:modelValue"]
const _hoisted_75 = ["onUpdate:modelValue"]
const _hoisted_76 = { class: "root-tabs" }
const _hoisted_77 = ["aria-pressed", "onClick"]
const _hoisted_78 = ["onClick"]
const _hoisted_79 = { class: "folder-icon" }
const _hoisted_80 = { class: "grow" }
const _hoisted_81 = { class: "path" }
const _hoisted_82 = {
  key: 0,
  class: "wait-list"
}
const _hoisted_83 = { key: 0 }
const _hoisted_84 = {
  key: 1,
  class: "skip-details"
}
const _hoisted_85 = { key: 0 }
const _hoisted_86 = { key: 1 }
const _hoisted_87 = {
  key: 2,
  class: "error"
}
const _hoisted_88 = { class: "right" }
const _hoisted_89 = {
  key: 0,
  class: "queue-state"
}
const _hoisted_90 = { class: "actions" }
const _hoisted_91 = ["onClick"]
const _hoisted_92 = ["onClick"]
const _hoisted_93 = ["onClick"]
const _hoisted_94 = ["onClick"]
const _hoisted_95 = ["onClick"]
const _hoisted_96 = ["onClick"]
const _hoisted_97 = ["onClick"]
const _hoisted_98 = ["disabled", "onClick"]
const _hoisted_99 = ["onClick"]
const _hoisted_100 = ["onClick"]
const _hoisted_101 = ["onClick"]
const _hoisted_102 = {
  key: 2,
  class: "card empty"
}
const _hoisted_103 = ["onClick"]
const _hoisted_104 = {
  key: 1,
  class: "card listcard"
}
const _hoisted_105 = {
  key: 0,
  class: "tag blue"
}
const _hoisted_106 = { class: "filters" }
const _hoisted_107 = { class: "search-input" }
const _hoisted_108 = ["onUpdate:modelValue", "placeholder", "onInput"]
const _hoisted_109 = ["onUpdate:modelValue", "onChange"]
const _hoisted_110 = ["value"]
const _hoisted_111 = ["onUpdate:modelValue", "onInput"]
const _hoisted_112 = ["onUpdate:modelValue", "onChange"]
const _hoisted_113 = ["value"]
const _hoisted_114 = ["onUpdate:modelValue", "onChange"]
const _hoisted_115 = ["onUpdate:modelValue", "onChange"]
const _hoisted_116 = ["value"]
const _hoisted_117 = ["onClick"]
const _hoisted_118 = { class: "advanced" }
const _hoisted_119 = { class: "filter-grid" }
const _hoisted_120 = ["onUpdate:modelValue", "onChange"]
const _hoisted_121 = ["onUpdate:modelValue", "onChange"]
const _hoisted_122 = ["onUpdate:modelValue", "onInput"]
const _hoisted_123 = ["onUpdate:modelValue", "onChange"]
const _hoisted_124 = ["onUpdate:modelValue", "onInput"]
const _hoisted_125 = ["onUpdate:modelValue", "onInput"]
const _hoisted_126 = ["onUpdate:modelValue", "onChange"]
const _hoisted_127 = ["onClick"]
const _hoisted_128 = ["onUpdate:modelValue", "onInput"]
const _hoisted_129 = ["onUpdate:modelValue", "onInput"]
const _hoisted_130 = ["onUpdate:modelValue", "onChange"]
const _hoisted_131 = ["onUpdate:modelValue", "onChange"]
const _hoisted_132 = ["onUpdate:modelValue", "onChange"]
const _hoisted_133 = {
  key: 1,
  class: "range-tools"
}
const _hoisted_134 = { class: "date-field" }
const _hoisted_135 = ["onUpdate:modelValue", "max", "onChange"]
const _hoisted_136 = { class: "date-field" }
const _hoisted_137 = ["onUpdate:modelValue", "min", "onChange"]
const _hoisted_138 = ["onClick"]
const _hoisted_139 = ["onClick"]
const _hoisted_140 = { class: "activity-toggle" }
const _hoisted_141 = ["onUpdate:modelValue", "onChange"]
const _hoisted_142 = {
  key: 2,
  class: "error",
  role: "alert"
}
const _hoisted_143 = { class: "scroll" }
const _hoisted_144 = { key: 0 }
const _hoisted_145 = { class: "filecell" }
const _hoisted_146 = { class: "file-summary" }
const _hoisted_147 = { key: 0 }
const _hoisted_148 = { class: "file-folder" }
const _hoisted_149 = ["aria-pressed", "onClick"]
const _hoisted_150 = ["onClick"]
const _hoisted_151 = ["onClick"]
const _hoisted_152 = { key: 1 }
const _hoisted_153 = { key: 0 }
const _hoisted_154 = { key: 0 }
const _hoisted_155 = ["disabled", "onClick"]
const _hoisted_156 = ["onClick"]
const _hoisted_157 = { key: 2 }
const _hoisted_158 = { class: "wrap" }
const _hoisted_159 = {
  key: 3,
  class: "empty"
}
const _hoisted_160 = { class: "pager" }
const _hoisted_161 = ["onUpdate:modelValue", "onChange"]
const _hoisted_162 = ["value"]
const _hoisted_163 = ["disabled", "onClick"]
const _hoisted_164 = ["disabled", "onClick"]
const _hoisted_165 = { class: "card picker" }
const _hoisted_166 = { class: "folder-icon" }
const _hoisted_167 = { class: "grow" }
const _hoisted_168 = ["onClick"]
const _hoisted_169 = { class: "split-head" }
const _hoisted_170 = ["onClick"]
const _hoisted_171 = {
  key: 0,
  class: "card timeline"
}
const _hoisted_172 = { class: "timeline-filters" }
const _hoisted_173 = ["onUpdate:modelValue", "onChange"]
const _hoisted_174 = ["onUpdate:modelValue", "onInput"]
const _hoisted_175 = ["onUpdate:modelValue", "onChange"]
const _hoisted_176 = ["onUpdate:modelValue", "onChange"]
const _hoisted_177 = ["onClick"]
const _hoisted_178 = {
  key: 0,
  class: "empty"
}
const _hoisted_179 = { class: "grow" }
const _hoisted_180 = { class: "tag neutral" }
const _hoisted_181 = {
  key: 0,
  class: "review-note"
}
const _hoisted_182 = { class: "hash" }
const _hoisted_183 = {
  key: 1,
  class: "error"
}
const _hoisted_184 = { class: "actions" }
const _hoisted_185 = ["onClick"]
const _hoisted_186 = ["onClick"]
const _hoisted_187 = ["onClick"]
const _hoisted_188 = ["onClick"]
const _hoisted_189 = ["onClick"]
const _hoisted_190 = ["onClick"]
const _hoisted_191 = {
  key: 1,
  class: "pager"
}
const _hoisted_192 = ["disabled", "onClick"]
const _hoisted_193 = ["disabled", "onClick"]
const _hoisted_194 = {
  key: 1,
  class: "card"
}
const _hoisted_195 = { class: "pair" }
const _hoisted_196 = ["onUpdate:modelValue", "onChange"]
const _hoisted_197 = ["value"]
const _hoisted_198 = ["disabled", "onClick"]
const _hoisted_199 = ["onUpdate:modelValue", "onChange"]
const _hoisted_200 = ["value"]
const _hoisted_201 = {
  key: 0,
  class: "diff-options"
}
const _hoisted_202 = {
  class: "mode-switch",
  "aria-label": "源文件比较方式"
}
const _hoisted_203 = ["aria-pressed", "onClick"]
const _hoisted_204 = ["aria-pressed", "onClick"]
const _hoisted_205 = {
  key: 1,
  class: "diff-options"
}
const _hoisted_206 = {
  class: "mode-switch",
  "aria-label": "比较方式"
}
const _hoisted_207 = ["aria-pressed", "onClick"]
const _hoisted_208 = { key: 0 }
const _hoisted_209 = { key: 1 }
const _hoisted_210 = { key: 2 }
const _hoisted_211 = ["onClick"]
const _hoisted_212 = {
  key: 3,
  class: "view-tabs"
}
const _hoisted_213 = ["aria-pressed", "onClick"]
const _hoisted_214 = ["aria-pressed", "onClick"]
const _hoisted_215 = {
  key: 4,
  class: "sheet-review"
}
const _hoisted_216 = {
  key: 0,
  class: "grid-toolbar"
}
const _hoisted_217 = ["onUpdate:modelValue", "onChange"]
const _hoisted_218 = ["onUpdate:modelValue", "onChange"]
const _hoisted_219 = { key: 0 }
const _hoisted_220 = ["disabled", "onUpdate:modelValue", "onChange"]
const _hoisted_221 = {
  key: 1,
  class: "cell-search111"
}
const _hoisted_222 = { class: "filters" }
const _hoisted_223 = ["onUpdate:modelValue", "onKeyup"]
const _hoisted_224 = ["onUpdate:modelValue"]
const _hoisted_225 = ["onUpdate:modelValue"]
const _hoisted_226 = ["onUpdate:modelValue"]
const _hoisted_227 = ["onUpdate:modelValue"]
const _hoisted_228 = ["onUpdate:modelValue"]
const _hoisted_229 = ["onUpdate:modelValue"]
const _hoisted_230 = ["disabled", "onClick"]
const _hoisted_231 = { key: 0 }
const _hoisted_232 = ["onClick"]
const _hoisted_233 = ["disabled", "onClick"]
const _hoisted_234 = ["disabled", "onClick"]
const _hoisted_235 = {
  key: 2,
  class: "grid-tools19"
}
const _hoisted_236 = ["onUpdate:modelValue"]
const _hoisted_237 = {
  key: 0,
  value: "key"
}
const _hoisted_238 = ["onUpdate:modelValue", "placeholder", "onKeyup"]
const _hoisted_239 = ["disabled", "onClick"]
const _hoisted_240 = {
  key: 3,
  role: "alert",
  class: "error"
}
const _hoisted_241 = {
  key: 4,
  class: "empty"
}
const _hoisted_242 = { class: "scroll sheet-scroll" }
const _hoisted_243 = { class: "sheet-table" }
const _hoisted_244 = ["colspan"]
const _hoisted_245 = ["onClick"]
const _hoisted_246 = { key: 0 }
const _hoisted_247 = { key: 0 }
const _hoisted_248 = { key: 1 }
const _hoisted_249 = { class: "pager" }
const _hoisted_250 = ["disabled", "onClick"]
const _hoisted_251 = ["disabled", "onClick"]
const _hoisted_252 = ["disabled", "onClick"]
const _hoisted_253 = ["disabled", "onClick"]
const _hoisted_254 = ["onClick"]
const _hoisted_255 = { class: "diff-meta" }
const _hoisted_256 = ["aria-pressed", "onClick"]
const _hoisted_257 = ["onClick"]
const _hoisted_258 = { class: "quiet" }
const _hoisted_259 = { class: "filters" }
const _hoisted_260 = ["onUpdate:modelValue", "onChange"]
const _hoisted_261 = ["onUpdate:modelValue", "onChange"]
const _hoisted_262 = { class: "search-input" }
const _hoisted_263 = ["onUpdate:modelValue", "placeholder", "onInput"]
const _hoisted_264 = ["onClick"]
const _hoisted_265 = ["disabled", "onClick"]
const _hoisted_266 = { class: "advanced" }
const _hoisted_267 = { class: "filter-grid" }
const _hoisted_268 = ["onUpdate:modelValue", "onChange"]
const _hoisted_269 = ["onUpdate:modelValue", "onChange"]
const _hoisted_270 = ["onUpdate:modelValue", "onChange"]
const _hoisted_271 = ["onUpdate:modelValue", "onChange"]
const _hoisted_272 = ["onUpdate:modelValue", "onInput"]
const _hoisted_273 = {
  key: 0,
  class: "revision-groups"
}
const _hoisted_274 = { class: "revision-group" }
const _hoisted_275 = { class: "scroll" }
const _hoisted_276 = { class: "compare" }
const _hoisted_277 = { class: "oldval" }
const _hoisted_278 = { class: "newval" }
const _hoisted_279 = {
  key: 1,
  class: "revision-groups"
}
const _hoisted_280 = { class: "revision-group" }
const _hoisted_281 = {
  key: 2,
  class: "scroll"
}
const _hoisted_282 = { class: "compare" }
const _hoisted_283 = { key: 0 }
const _hoisted_284 = {
  key: 1,
  class: "record-key"
}
const _hoisted_285 = { class: "oldval" }
const _hoisted_286 = {
  key: 0,
  class: "value-type"
}
const _hoisted_287 = { class: "newval" }
const _hoisted_288 = {
  key: 0,
  class: "value-type"
}
const _hoisted_289 = {
  key: 3,
  class: "empty"
}
const _hoisted_290 = { class: "pager" }
const _hoisted_291 = ["onUpdate:modelValue", "onChange"]
const _hoisted_292 = ["value"]
const _hoisted_293 = ["disabled", "onClick"]
const _hoisted_294 = ["disabled", "onClick"]
const _hoisted_295 = ["onClick"]
const _hoisted_296 = { class: "hash" }
const _hoisted_297 = {
  key: 1,
  class: "empty"
}
const _hoisted_298 = {
  key: 3,
  class: "card review-board"
}
const _hoisted_299 = { class: "review-statebar" }
const _hoisted_300 = ["aria-pressed", "onClick"]
const _hoisted_301 = { class: "filters" }
const _hoisted_302 = ["onUpdate:modelValue", "onInput", "onKeyup"]
const _hoisted_303 = ["onClick"]
const _hoisted_304 = ["onClick"]
const _hoisted_305 = ["disabled", "onClick"]
const _hoisted_306 = { class: "advanced" }
const _hoisted_307 = { class: "filter-grid" }
const _hoisted_308 = ["onUpdate:modelValue", "onChange"]
const _hoisted_309 = ["value"]
const _hoisted_310 = ["onUpdate:modelValue", "onChange"]
const _hoisted_311 = ["onUpdate:modelValue", "onChange"]
const _hoisted_312 = ["onUpdate:modelValue", "onChange"]
const _hoisted_313 = ["onUpdate:modelValue", "onChange"]
const _hoisted_314 = ["onUpdate:modelValue", "onChange"]
const _hoisted_315 = ["onUpdate:modelValue", "onChange"]
const _hoisted_316 = ["onUpdate:modelValue", "onChange"]
const _hoisted_317 = ["onUpdate:modelValue", "onChange"]
const _hoisted_318 = { class: "scroll" }
const _hoisted_319 = { key: 0 }
const _hoisted_320 = {
  key: 1,
  class: "error"
}
const _hoisted_321 = { class: "review-note" }
const _hoisted_322 = { key: 0 }
const _hoisted_323 = ["onClick"]
const _hoisted_324 = ["onClick"]
const _hoisted_325 = ["onClick"]
const _hoisted_326 = {
  key: 0,
  class: "empty"
}
const _hoisted_327 = { class: "pager" }
const _hoisted_328 = ["disabled", "onClick"]
const _hoisted_329 = ["disabled", "onClick"]
const _hoisted_330 = { class: "card listcard" }
const _hoisted_331 = ["onSubmit"]
const _hoisted_332 = { class: "filters" }
const _hoisted_333 = ["onUpdate:modelValue"]
const _hoisted_334 = ["onUpdate:modelValue"]
const _hoisted_335 = ["onUpdate:modelValue"]
const _hoisted_336 = ["value"]
const _hoisted_337 = ["onUpdate:modelValue"]
const _hoisted_338 = ["onUpdate:modelValue"]
const _hoisted_339 = ["onUpdate:modelValue"]
const _hoisted_340 = ["onUpdate:modelValue"]
const _hoisted_341 = { class: "filters" }
const _hoisted_342 = ["onUpdate:modelValue"]
const _hoisted_343 = ["onUpdate:modelValue"]
const _hoisted_344 = ["onUpdate:modelValue"]
const _hoisted_345 = ["onUpdate:modelValue"]
const _hoisted_346 = ["onUpdate:modelValue"]
const _hoisted_347 = ["onUpdate:modelValue"]
const _hoisted_348 = ["onUpdate:modelValue"]
const _hoisted_349 = ["onUpdate:modelValue"]
const _hoisted_350 = { class: "filters" }
const _hoisted_351 = ["onUpdate:modelValue"]
const _hoisted_352 = ["disabled"]
const _hoisted_353 = ["onClick"]
const _hoisted_354 = { class: "filters" }
const _hoisted_355 = ["onUpdate:modelValue"]
const _hoisted_356 = ["disabled", "onClick"]
const _hoisted_357 = ["onUpdate:modelValue", "onChange"]
const _hoisted_358 = ["value"]
const _hoisted_359 = ["value"]
const _hoisted_360 = ["disabled", "onClick"]
const _hoisted_361 = {
  class: "card listcard",
  "aria-live": "polite"
}
const _hoisted_362 = { key: 0 }
const _hoisted_363 = { class: "card-head" }
const _hoisted_364 = ["disabled", "onClick"]
const _hoisted_365 = { class: "scroll" }
const _hoisted_366 = { class: "snippet111" }
const _hoisted_367 = { class: "snippet111" }
const _hoisted_368 = ["onClick"]
const _hoisted_369 = { key: 0 }
const _hoisted_370 = { class: "pager" }
const _hoisted_371 = ["disabled", "onClick"]
const _hoisted_372 = ["disabled", "onClick"]
const _hoisted_373 = { class: "card settings" }
const _hoisted_374 = ["disabled", "onClick"]
const _hoisted_375 = ["onUpdate:modelValue", "onChange"]
const _hoisted_376 = ["value"]
const _hoisted_377 = { key: 0 }
const _hoisted_378 = ["onUpdate:modelValue"]
const _hoisted_379 = ["onClick", "disabled"]
const _hoisted_380 = { key: 1 }
const _hoisted_381 = { class: "pair" }
const _hoisted_382 = ["onUpdate:modelValue", "onChange"]
const _hoisted_383 = ["value"]
const _hoisted_384 = ["disabled", "onClick"]
const _hoisted_385 = ["onUpdate:modelValue", "onChange"]
const _hoisted_386 = ["value"]
const _hoisted_387 = { key: 2 }
const _hoisted_388 = {
  key: 0,
  class: "card listcard"
}
const _hoisted_389 = { class: "filters" }
const _hoisted_390 = ["onUpdate:modelValue", "onInput"]
const _hoisted_391 = ["onUpdate:modelValue", "onChange"]
const _hoisted_392 = ["onUpdate:modelValue", "onChange"]
const _hoisted_393 = ["onUpdate:modelValue", "onChange"]
const _hoisted_394 = ["disabled", "onClick"]
const _hoisted_395 = {
  key: 0,
  role: "status"
}
const _hoisted_396 = { class: "scroll" }
const _hoisted_397 = ["onClick"]
const _hoisted_398 = { key: 0 }
const _hoisted_399 = { class: "pager" }
const _hoisted_400 = ["disabled", "onClick"]
const _hoisted_401 = ["disabled", "onClick"]
const _hoisted_402 = { class: "card settings" }
const _hoisted_403 = ["onClick"]
const _hoisted_404 = { key: 0 }
const _hoisted_405 = { class: "error" }
const _hoisted_406 = { class: "card settings" }
const _hoisted_407 = ["onUpdate:modelValue"]
const _hoisted_408 = ["value"]
const _hoisted_409 = ["onUpdate:modelValue"]
const _hoisted_410 = { key: 0 }
const _hoisted_411 = ["onUpdate:modelValue"]
const _hoisted_412 = ["onClick"]
const _hoisted_413 = { class: "card settings" }
const _hoisted_414 = { class: "actions" }
const _hoisted_415 = ["onClick"]
const _hoisted_416 = ["onClick"]
const _hoisted_417 = ["onClick"]
const _hoisted_418 = ["onClick"]
const _hoisted_419 = {
  key: 0,
  class: "storage19"
}
const _hoisted_420 = ["onClick"]
const _hoisted_421 = { key: 1 }
const _hoisted_422 = { key: 2 }
const _hoisted_423 = ["onClick"]
const _hoisted_424 = ["onClick"]
const _hoisted_425 = { key: 1 }
const _hoisted_426 = { key: 3 }
const _hoisted_427 = { class: "actions" }
const _hoisted_428 = ["onClick"]
const _hoisted_429 = ["onClick"]
const _hoisted_430 = ["onClick"]
const _hoisted_431 = { class: "foot" }
const _hoisted_432 = ["onClick"]
const _hoisted_433 = ["aria-label"]
const _hoisted_434 = { class: "card-head" }
const _hoisted_435 = ["disabled", "onClick"]
const _hoisted_436 = ["onSubmit"]
const _hoisted_437 = ["onUpdate:modelValue"]
const _hoisted_438 = ["onUpdate:modelValue", "required"]
const _hoisted_439 = { key: 0 }
const _hoisted_440 = ["onUpdate:modelValue", "onKeydown"]
const _hoisted_441 = ["onClick"]
const _hoisted_442 = { key: 1 }
const _hoisted_443 = ["onClick"]
const _hoisted_444 = ["onClick"]
const _hoisted_445 = {
  key: 0,
  class: "quiet"
}
const _hoisted_446 = { key: 1 }
const _hoisted_447 = ["onUpdate:modelValue"]
const _hoisted_448 = ["onClick"]
const _hoisted_449 = {
  key: 2,
  class: "admin-history"
}
const _hoisted_450 = { key: 0 }
const _hoisted_451 = ["onUpdate:modelValue"]
const _hoisted_452 = { key: 3 }
const _hoisted_453 = ["onUpdate:modelValue"]
const _hoisted_454 = ["onUpdate:modelValue"]
const _hoisted_455 = { key: 4 }
const _hoisted_456 = { class: "actions" }
const _hoisted_457 = ["onUpdate:modelValue", "onChange"]
const _hoisted_458 = ["onUpdate:modelValue", "onChange"]
const _hoisted_459 = { key: 0 }
const _hoisted_460 = ["onUpdate:modelValue", "onChange"]
const _hoisted_461 = ["disabled", "onClick"]
const _hoisted_462 = {
  key: 0,
  role: "status"
}
const _hoisted_463 = { key: 0 }
const _hoisted_464 = { class: "hash" }
const _hoisted_465 = { class: "hash" }
const _hoisted_466 = { key: 0 }
const _hoisted_467 = { key: 0 }
const _hoisted_468 = { key: 0 }
const _hoisted_469 = { key: 1 }
const _hoisted_470 = { key: 2 }
const _hoisted_471 = ["disabled", "onClick"]
const _hoisted_472 = { class: "ledger-sides" }
const _hoisted_473 = ["onUpdate:modelValue", "onChange"]
const _hoisted_474 = ["value"]
const _hoisted_475 = { key: 0 }
const _hoisted_476 = ["onUpdate:modelValue", "onChange"]
const _hoisted_477 = { key: 1 }
const _hoisted_478 = ["onUpdate:modelValue", "onChange"]
const _hoisted_479 = ["onUpdate:modelValue", "onChange"]
const _hoisted_480 = ["value"]
const _hoisted_481 = { key: 0 }
const _hoisted_482 = ["onUpdate:modelValue", "onChange"]
const _hoisted_483 = { key: 1 }
const _hoisted_484 = ["onUpdate:modelValue", "onChange"]
const _hoisted_485 = { class: "actions" }
const _hoisted_486 = ["onUpdate:modelValue", "onKeydown"]
const _hoisted_487 = ["onClick"]
const _hoisted_488 = ["onClick"]
const _hoisted_489 = { key: 0 }
const _hoisted_490 = ["disabled", "onClick"]
const _hoisted_491 = ["disabled", "onClick"]
const _hoisted_492 = {
  key: 0,
  role: "status"
}
const _hoisted_493 = ["onClick"]
const _hoisted_494 = { class: "actions" }
const _hoisted_495 = ["onUpdate:modelValue"]
const _hoisted_496 = ["disabled", "onClick"]
const _hoisted_497 = ["onUpdate:modelValue", "onChange"]
const _hoisted_498 = ["value"]
const _hoisted_499 = ["value"]
const _hoisted_500 = ["disabled", "onClick"]
const _hoisted_501 = ["disabled", "onClick"]
const _hoisted_502 = { class: "actions" }
const _hoisted_503 = ["onUpdate:modelValue", "onChange"]
const _hoisted_504 = ["value"]
const _hoisted_505 = ["value"]
const _hoisted_506 = ["onUpdate:modelValue", "onChange"]
const _hoisted_507 = ["value"]
const _hoisted_508 = ["value"]
const _hoisted_509 = ["onClick"]
const _hoisted_510 = ["disabled", "onClick"]
const _hoisted_511 = { class: "actions" }
const _hoisted_512 = ["onClick"]
const _hoisted_513 = ["onClick"]
const _hoisted_514 = { class: "ledger-map" }
const _hoisted_515 = { class: "actions" }
const _hoisted_516 = ["onUpdate:modelValue", "onChange"]
const _hoisted_517 = ["onUpdate:modelValue", "onChange"]
const _hoisted_518 = ["value"]
const _hoisted_519 = ["value"]
const _hoisted_520 = ["onUpdate:modelValue", "onChange"]
const _hoisted_521 = ["value"]
const _hoisted_522 = ["value"]
const _hoisted_523 = { class: "report-controls" }
const _hoisted_524 = ["onUpdate:modelValue", "onChange"]
const _hoisted_525 = { key: 0 }
const _hoisted_526 = ["onUpdate:modelValue", "onInput"]
const _hoisted_527 = { class: "actions" }
const _hoisted_528 = ["onClick"]
const _hoisted_529 = ["disabled", "onClick"]
const _hoisted_530 = ["disabled", "onClick"]
const _hoisted_531 = ["disabled", "onClick"]
const _hoisted_532 = ["onUpdate:modelValue", "onChange"]
const _hoisted_533 = ["onClick"]
const _hoisted_534 = ["onInput", "onChange"]
const _hoisted_535 = ["onUpdate:modelValue"]
const _hoisted_536 = ["onUpdate:modelValue"]
const _hoisted_537 = ["onUpdate:modelValue"]
const _hoisted_538 = ["onUpdate:modelValue"]
const _hoisted_539 = ["onUpdate:modelValue"]
const _hoisted_540 = ["onUpdate:modelValue"]
const _hoisted_541 = ["onUpdate:modelValue"]
const _hoisted_542 = ["onUpdate:modelValue"]
const _hoisted_543 = ["onUpdate:modelValue"]
const _hoisted_544 = { key: 0 }
const _hoisted_545 = ["onClick"]
const _hoisted_546 = { class: "scroll" }
const _hoisted_547 = ["onClick"]
const _hoisted_548 = { key: 0 }
const _hoisted_549 = { colspan: "4" }
const _hoisted_550 = { key: 0 }
const _hoisted_551 = { key: 1 }
const _hoisted_552 = { class: "ledger-field" }
const _hoisted_553 = { key: 1 }
const _hoisted_554 = ["onClick"]
const _hoisted_555 = { class: "scroll" }
const _hoisted_556 = ["onClick"]
const _hoisted_557 = { class: "actions" }
const _hoisted_558 = ["onUpdate:modelValue", "onInput"]
const _hoisted_559 = ["onUpdate:modelValue", "onChange"]
const _hoisted_560 = ["onClick"]
const _hoisted_561 = { class: "trace-value" }
const _hoisted_562 = {
  key: 5,
  class: "actions"
}
const _hoisted_563 = ["disabled", "onClick"]
const _hoisted_564 = ["disabled", "onClick"]
const _hoisted_565 = ["disabled", "onClick"]
const _hoisted_566 = ["disabled", "onClick"]
const _hoisted_567 = { class: "path" }
const _hoisted_568 = { class: "hash" }
const _hoisted_569 = { class: "hash" }
const _hoisted_570 = { key: 0 }
const _hoisted_571 = { key: 0 }
const _hoisted_572 = { key: 1 }
const _hoisted_573 = { class: "filters" }
const _hoisted_574 = ["onUpdate:modelValue"]
const _hoisted_575 = ["onUpdate:modelValue"]
const _hoisted_576 = ["onUpdate:modelValue"]
const _hoisted_577 = ["onUpdate:modelValue"]
const _hoisted_578 = ["onUpdate:modelValue"]
const _hoisted_579 = ["onClick"]
const _hoisted_580 = { class: "actions" }
const _hoisted_581 = ["disabled", "onClick"]
const _hoisted_582 = ["onClick"]
const _hoisted_583 = ["onUpdate:modelValue", "onChange"]
const _hoisted_584 = ["disabled", "onClick"]
const _hoisted_585 = ["onClick"]
const _hoisted_586 = {
  key: 0,
  open: ""
}
const _hoisted_587 = { key: 0 }
const _hoisted_588 = { key: 1 }
const _hoisted_589 = { class: "scroll" }
const _hoisted_590 = { class: "hash" }
const _hoisted_591 = { class: "pager" }
const _hoisted_592 = ["disabled", "onClick"]
const _hoisted_593 = ["disabled", "onClick"]
const _hoisted_594 = ["onUpdate:modelValue"]
const _hoisted_595 = { key: 0 }
const _hoisted_596 = { class: "actions" }
const _hoisted_597 = ["disabled", "onClick"]
const _hoisted_598 = ["onClick"]
const _hoisted_599 = { role: "status" }
const _hoisted_600 = { key: 0 }
const _hoisted_601 = ["onUpdate:modelValue", "onChange"]
const _hoisted_602 = ["value"]
const _hoisted_603 = { class: "filters" }
const _hoisted_604 = ["onUpdate:modelValue"]
const _hoisted_605 = ["onUpdate:modelValue"]
const _hoisted_606 = ["onUpdate:modelValue"]
const _hoisted_607 = ["onClick"]
const _hoisted_608 = ["onClick"]
const _hoisted_609 = { class: "hash" }
const _hoisted_610 = ["onClick"]
const _hoisted_611 = { class: "pager" }
const _hoisted_612 = ["disabled", "onClick"]
const _hoisted_613 = ["disabled", "onClick"]
const _hoisted_614 = {
  key: 0,
  open: ""
}
const _hoisted_615 = ["disabled", "onClick"]
const _hoisted_616 = ["disabled", "onClick"]
const _hoisted_617 = { class: "filters" }
const _hoisted_618 = ["onUpdate:modelValue"]
const _hoisted_619 = ["onUpdate:modelValue"]
const _hoisted_620 = ["onUpdate:modelValue"]
const _hoisted_621 = ["onUpdate:modelValue"]
const _hoisted_622 = ["onUpdate:modelValue"]
const _hoisted_623 = ["onUpdate:modelValue"]
const _hoisted_624 = ["onUpdate:modelValue"]
const _hoisted_625 = ["onClick"]
const _hoisted_626 = { class: "scroll" }
const _hoisted_627 = ["onClick"]
const _hoisted_628 = ["onClick"]
const _hoisted_629 = { class: "pager" }
const _hoisted_630 = ["disabled", "onClick"]
const _hoisted_631 = ["disabled", "onClick"]
const _hoisted_632 = ["disabled", "onClick"]
const _hoisted_633 = {
  key: 0,
  class: "report-controls"
}
const _hoisted_634 = ["onUpdate:modelValue"]
const _hoisted_635 = ["onUpdate:modelValue"]
const _hoisted_636 = ["onUpdate:modelValue"]
const _hoisted_637 = ["value"]
const _hoisted_638 = ["onUpdate:modelValue"]
const _hoisted_639 = ["value"]
const _hoisted_640 = ["onUpdate:modelValue"]
const _hoisted_641 = ["onUpdate:modelValue"]
const _hoisted_642 = ["onUpdate:modelValue"]
const _hoisted_643 = ["onUpdate:modelValue"]
const _hoisted_644 = ["onUpdate:modelValue"]
const _hoisted_645 = ["value"]
const _hoisted_646 = ["onUpdate:modelValue"]
const _hoisted_647 = ["value"]
const _hoisted_648 = ["onUpdate:modelValue"]
const _hoisted_649 = { key: 1 }
const _hoisted_650 = {
  key: 2,
  class: "report-controls"
}
const _hoisted_651 = ["onUpdate:modelValue"]
const _hoisted_652 = ["onUpdate:modelValue"]
const _hoisted_653 = ["onUpdate:modelValue"]
const _hoisted_654 = ["onUpdate:modelValue"]
const _hoisted_655 = ["onUpdate:modelValue"]
const _hoisted_656 = ["onUpdate:modelValue"]
const _hoisted_657 = ["onUpdate:modelValue"]
const _hoisted_658 = ["onUpdate:modelValue"]
const _hoisted_659 = ["onUpdate:modelValue"]
const _hoisted_660 = ["onUpdate:modelValue"]
const _hoisted_661 = ["onUpdate:modelValue"]
const _hoisted_662 = { class: "actions" }
const _hoisted_663 = ["onClick"]
const _hoisted_664 = ["disabled", "onClick"]
const _hoisted_665 = {
  key: 3,
  role: "status"
}
const _hoisted_666 = { class: "scroll" }
const _hoisted_667 = ["onClick"]
const _hoisted_668 = { class: "scroll" }
const _hoisted_669 = ["onClick"]
const _hoisted_670 = { class: "trace-value" }
const _hoisted_671 = { class: "trace-value" }
const _hoisted_672 = { key: 0 }
const _hoisted_673 = { key: 2 }
const _hoisted_674 = { class: "actions" }
const _hoisted_675 = ["disabled", "onClick"]
const _hoisted_676 = ["disabled", "onClick"]
const _hoisted_677 = { class: "path" }
const _hoisted_678 = ["onUpdate:modelValue"]
const _hoisted_679 = ["value"]
const _hoisted_680 = ["onUpdate:modelValue"]
const _hoisted_681 = { class: "path" }
const _hoisted_682 = { class: "filters" }
const _hoisted_683 = ["onUpdate:modelValue", "onKeyup"]
const _hoisted_684 = ["onUpdate:modelValue", "onChange"]
const _hoisted_685 = ["onUpdate:modelValue", "onChange"]
const _hoisted_686 = ["onClick"]
const _hoisted_687 = { class: "scroll" }
const _hoisted_688 = { class: "pager" }
const _hoisted_689 = ["disabled", "onClick"]
const _hoisted_690 = ["disabled", "onClick"]
const _hoisted_691 = { class: "path" }
const _hoisted_692 = { class: "filters" }
const _hoisted_693 = ["onUpdate:modelValue", "onChange"]
const _hoisted_694 = ["onUpdate:modelValue", "onChange"]
const _hoisted_695 = ["onUpdate:modelValue", "onChange"]
const _hoisted_696 = ["onClick"]
const _hoisted_697 = { class: "scroll" }
const _hoisted_698 = { key: 0 }
const _hoisted_699 = { key: 0 }
const _hoisted_700 = { class: "pager" }
const _hoisted_701 = ["disabled", "onClick"]
const _hoisted_702 = ["disabled", "onClick"]
const _hoisted_703 = ["disabled", "onClick"]
const _hoisted_704 = { class: "path" }
const _hoisted_705 = ["onUpdate:modelValue"]
const _hoisted_706 = ["onUpdate:modelValue"]
const _hoisted_707 = ["onUpdate:modelValue"]
const _hoisted_708 = { class: "inline" }
const _hoisted_709 = ["onUpdate:modelValue", "readonly"]
const _hoisted_710 = ["onClick"]
const _hoisted_711 = ["onUpdate:modelValue"]
const _hoisted_712 = ["onUpdate:modelValue"]
const _hoisted_713 = ["onUpdate:modelValue"]
const _hoisted_714 = ["onUpdate:modelValue"]
const _hoisted_715 = ["onClick"]
const _hoisted_716 = { key: 0 }
const _hoisted_717 = { key: 0 }
const _hoisted_718 = { key: 20 }
const _hoisted_719 = ["onUpdate:modelValue"]
const _hoisted_720 = {
  key: 21,
  style: {"white-space":"pre-line"}
}
const _hoisted_721 = { class: "search-input" }
const _hoisted_722 = ["onUpdate:modelValue"]
const _hoisted_723 = { class: "picklist" }
const _hoisted_724 = ["onClick"]
const _hoisted_725 = ["onClick"]
const _hoisted_726 = { key: 0 }
const _hoisted_727 = { key: 1 }
const _hoisted_728 = { class: "picker-tools" }
const _hoisted_729 = { class: "search-input" }
const _hoisted_730 = ["onUpdate:modelValue", "onInput"]
const _hoisted_731 = ["onUpdate:modelValue", "onChange"]
const _hoisted_732 = ["value"]
const _hoisted_733 = { class: "picklist" }
const _hoisted_734 = ["disabled", "onClick"]
const _hoisted_735 = { class: "file-summary" }
const _hoisted_736 = { key: 0 }
const _hoisted_737 = {
  key: 0,
  role: "status"
}
const _hoisted_738 = { key: 1 }
const _hoisted_739 = { class: "pager" }
const _hoisted_740 = ["disabled", "onClick"]
const _hoisted_741 = ["disabled", "onClick"]
const _hoisted_742 = {
  key: 24,
  class: "error"
}
const _hoisted_743 = {
  key: 25,
  class: "form-actions"
}
const _hoisted_744 = ["disabled", "onClick"]
const _hoisted_745 = ["disabled"]
const _hoisted_746 = {
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
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(nav.slice(0,9), (x) => {
          return (_openBlock(), _createElementBlock("button", {
            "aria-label": x[0],
            "aria-current": page===x[0]?'page':undefined,
            class: _normalizeClass({active:page===x[0]}),
            onClick: $event => (go(x[0]))
          }, [_createVNode(_component_ico, { n: x[1] }, null, 8, ["n"]), _createTextVNode(_toDisplayString(x[0]), 1)], 10, _hoisted_3))
        }), 256)),
        _cache[2] || (_cache[2] = _createElementVNode("div", { class: "nav-label second" }, "系统管理", -1)),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(nav.slice(9), (x) => {
          return (_openBlock(), _createElementBlock("button", {
            "aria-label": x[0],
            "aria-current": page===x[0]?'page':undefined,
            class: _normalizeClass({active:page===x[0]}),
            onClick: $event => (go(x[0]))
          }, [_createVNode(_component_ico, { n: x[1] }, null, 8, ["n"]), _createTextVNode(_toDisplayString(x[0]), 1)], 10, _hoisted_4))
        }), 256))
      ]), _createElementVNode("div", _hoisted_5, [_createElementVNode("div", _hoisted_6, [_createVNode(_component_ico, { n: "monitor" })]), _createElementVNode("div", null, [_createElementVNode("b", null, _toDisplayString(demo?'示例工作区':'本地工作区'), 1), _cache[3] || (_cache[3] = _createElementVNode("small", null, "桌面版 · 1.14.0", -1))])])]),
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
        _createElementVNode("div", _hoisted_21, [(page==='系统总览')
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("section", _hoisted_22, [_cache[15] || (_cache[15] = _createElementVNode("div", { class: "contours" }, null, -1)), _createElementVNode("div", null, [_createElementVNode("div", _hoisted_23, [_cache[11] || (_cache[11] = _createElementVNode("span", { class: "dot" }, null, -1)), _createTextVNode(_toDisplayString(statusText), 1)]), _cache[14] || (_cache[14] = _createElementVNode("h1", null, "监控工作台", -1)), _createElementVNode("p", null, [
                _createTextVNode(_toDisplayString(demo?'示例工作区':'本地工作区'), 1),
                _cache[12] || (_cache[12] = _createElementVNode("i", null, "·", -1)),
                _createTextVNode(_toDisplayString(activeRoots) + " 个目录正在监控", 1),
                _cache[13] || (_cache[13] = _createElementVNode("i", null, "·", -1)),
                _createTextVNode(_toDisplayString(dateText), 1)
              ])]), _createElementVNode("button", {
                class: "hero-btn",
                disabled: demo&&!s.recent.some(r=>r.rel.endsWith('库存台账.xlsx')&&r.kind==='内容修改'),
                onClick: $event => (demo?fromEvent(s.recent.find(r=>r.rel.endsWith('库存台账.xlsx')&&r.kind==='内容修改')):rootDialog())
              }, [_createVNode(_component_ico, { n: demo?'folder':'plus' }, null, 8, ["n"]), _createTextVNode(_toDisplayString(demo?'体验整行对比':'添加目录'), 1)], 8, _hoisted_24)]),
              _createElementVNode("div", _hoisted_25, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(metrics, (m) => {
                return (_openBlock(), _createElementBlock("button", {
                  class: "stat",
                  onClick: $event => (metricGo(m))
                }, [_createElementVNode("span", _hoisted_27, [_createTextVNode(_toDisplayString(m.label), 1), _createElementVNode("span", { class: _normalizeClass(["tile-icon", m.tone]) }, [_createVNode(_component_ico, { n: m.icon }, null, 8, ["n"])], 2)]), _createElementVNode("strong", null, _toDisplayString(num(m.value)), 1), _createElementVNode("small", null, _toDisplayString(m.hint), 1)], 8, _hoisted_26))
              }), 256))]),
              _createElementVNode("div", _hoisted_28, [_createElementVNode("section", _hoisted_29, [_createElementVNode("div", _hoisted_30, [_cache[16] || (_cache[16] = _createElementVNode("h2", null, "文件变更趋势", -1)), _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": $event => ((days) = $event),
                onChange: refresh
              }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([7,14,30], (v) => {
                return (_openBlock(), _createElementBlock("option", { value: v }, "近 " + _toDisplayString(v) + " 天", 9, _hoisted_32))
              }), 256))], 40, _hoisted_31), [[
                _vModelSelect,
                days,
                void 0,
                { number: true }
              ]])]), _cache[18] || (_cache[18] = _createElementVNode("div", { class: "legend" }, [_createElementVNode("span", null, [_createElementVNode("b", { class: "bl" }), _createTextVNode("内容修改")]), _createElementVNode("span", null, [_createElementVNode("b", { class: "te" }), _createTextVNode("新增文件")]), _createElementVNode("span", null, [_createElementVNode("b", { class: "sl" }), _createTextVNode("其他变更")])], -1)), (s.trend.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_33, [(_openBlock(), _createElementBlock("svg", _hoisted_34, [
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
                      }, null, 8, _hoisted_35), _createElementVNode("text", {
                        x: "24",
                        y: 19+j*34,
                        "text-anchor": "end"
                      }, _toDisplayString(ceil*(3-j)/3), 9, _hoisted_36)]))
                    }), 256)),
                    _createElementVNode("path", {
                      d: area,
                      fill: "url(#fill)"
                    }, null, 8, _hoisted_37),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['edited','added','other'], (k, i) => {
                      return (_openBlock(), _createElementBlock("polyline", {
                        points: points(k),
                        fill: "none",
                        stroke: ['#426fbd','#36a99a','#99a9bf'][i],
                        "stroke-width": i===0?3:2,
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                      }, null, 8, _hoisted_38))
                    }), 256)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.trend, (d, i) => {
                      return (_openBlock(), _createElementBlock("g", null, [(xlabel(i))
                        ? (_openBlock(), _createElementBlock("text", {
                            key: 0,
                            x: px(i),
                            y: "141",
                            "text-anchor": "middle"
                          }, _toDisplayString(d.day.slice(5).replace('-','/')), 9, _hoisted_39))
                        : _createCommentVNode("", true), _createElementVNode("rect", {
                        x: px(i)-8,
                        y: "4",
                        width: "16",
                        height: "116",
                        fill: "transparent"
                      }, [_createElementVNode("title", null, _toDisplayString(d.day) + "　修改 " + _toDisplayString(d.edited) + "　新增 " + _toDisplayString(d.added) + "　其他 " + _toDisplayString(d.other), 1)], 8, _hoisted_40)]))
                    }), 256))
                  ]))]))
                : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_41, [_cache[20] || (_cache[20] = _createElementVNode("div", { class: "card-head" }, [_createElementVNode("h2", null, "文件类型分布"), _createElementVNode("span", { class: "quiet" }, "按文件数")], -1)), _createElementVNode("div", _hoisted_42, [_createElementVNode("div", {
                class: "donut",
                style: _normalizeStyle({background:donut})
              }, [_createElementVNode("div", null, [_createElementVNode("strong", null, _toDisplayString(num(s.files)), 1), _cache[19] || (_cache[19] = _createElementVNode("small", null, "文件总数", -1))])], 4), _createElementVNode("div", _hoisted_43, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.groups, (g, i) => {
                return (_openBlock(), _createElementBlock("div", null, [_createElementVNode("span", null, [_createElementVNode("b", { style: _normalizeStyle({background:palette[i%5]}) }, null, 4), _createTextVNode(_toDisplayString(g[0]), 1)]), _createElementVNode("strong", null, _toDisplayString(num(g[1])), 1)]))
              }), 256)), (!s.groups.length)
                ? (_openBlock(), _createElementBlock("span", _hoisted_44, "尚无已监控文件"))
                : _createCommentVNode("", true)])])])]),
              _createElementVNode("div", _hoisted_45, [_createElementVNode("section", _hoisted_46, [_createElementVNode("div", _hoisted_47, [_cache[22] || (_cache[22] = _createElementVNode("h2", null, "最近变更", -1)), _createElementVNode("button", {
                class: "textbtn",
                onClick: $event => (go('变更记录'))
              }, [_cache[21] || (_cache[21] = _createTextVNode("全部记录 ")), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_48)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.recent, (e) => {
                return (_openBlock(), _createElementBlock("div", {
                  class: "activity",
                  onClick: $event => (fromEvent(e)),
                  tabindex: "0",
                  onKeydown: _withKeys($event => (fromEvent(e)), ["enter"])
                }, [
                  _createElementVNode("div", { class: _normalizeClass(["file-icon", tone(e.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(e.ext) }, null, 8, ["n"])], 2),
                  _createElementVNode("div", _hoisted_50, [_createElementVNode("b", null, _toDisplayString(base(e.rel)), 1), _createElementVNode("small", null, _toDisplayString(parent(e.root,e.rel)), 1)]),
                  _createElementVNode("span", { class: _normalizeClass(["tag", kindTone(e.kind)]) }, _toDisplayString(e.kind), 3),
                  _createElementVNode("time", null, _toDisplayString(shortTime(e.stamp)), 1)
                ], 40, _hoisted_49))
              }), 256)), (!s.recent.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_51, [_createVNode(_component_ico, { n: "history" }), _cache[23] || (_cache[23] = _createElementVNode("b", null, "暂无变更记录", -1)), _cache[24] || (_cache[24] = _createElementVNode("small", null, "添加目录后，这里将显示最近的文件活动。", -1))]))
                : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_52, [_createElementVNode("div", _hoisted_53, [_cache[26] || (_cache[26] = _createElementVNode("h2", null, "监控目录", -1)), _createElementVNode("button", {
                class: "textbtn",
                onClick: $event => (go('目录监控'))
              }, [_cache[25] || (_cache[25] = _createTextVNode("管理 ")), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_54)]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots.slice(0,4), (r) => {
                return (_openBlock(), _createElementBlock("div", _hoisted_55, [_createElementVNode("div", _hoisted_56, [_createVNode(_component_ico, { n: "folder" })]), _createElementVNode("div", null, [_createElementVNode("b", null, _toDisplayString(base(r.path)), 1), _createElementVNode("small", null, _toDisplayString(num(r.total)) + " 个文件", 1)]), _createElementVNode("span", { class: _normalizeClass(["light-state", {warn:!!r.error,off:!r.active}]) }, [_cache[27] || (_cache[27] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(rstate(r)), 1)], 2)]))
              }), 256)), (!s.roots.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_57, [_createVNode(_component_ico, { n: "folder-plus" }), _cache[28] || (_cache[28] = _createElementVNode("b", null, "还没有监控目录", -1)), _createElementVNode("button", {
                    class: "textbtn",
                    onClick: $event => (rootDialog())
                  }, "添加第一个目录", 8, _hoisted_58)]))
                : _createCommentVNode("", true)])])
            ], 64))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _createElementVNode("div", _hoisted_59, [_createElementVNode("div", null, [_createElementVNode("h1", null, _toDisplayString(page), 1), _createElementVNode("p", null, _toDisplayString(descs[page]), 1)]), _createElementVNode("div", _hoisted_60, [
                (page==='目录监控')
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 0,
                      class: "btn",
                      disabled: !activeRoots,
                      onClick: $event => (scanRoots())
                    }, [_createVNode(_component_ico, { n: "refresh-cw" }), _createTextVNode(_toDisplayString(demo?'模拟扫描全部':'扫描全部'), 1)], 8, _hoisted_61))
                  : _createCommentVNode("", true),
                (page==='目录监控'&&!demo)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 1,
                      class: "primary",
                      onClick: $event => (rootDialog())
                    }, [_createVNode(_component_ico, { n: "plus" }), _cache[29] || (_cache[29] = _createTextVNode("添加目录"))], 8, _hoisted_62))
                  : _createCommentVNode("", true),
                (page==='变更记录')
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 2,
                      class: "btn",
                      onClick: $event => (reportDialog('period'))
                    }, "变更期间对照", 8, _hoisted_63))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 3,
                      class: "btn",
                      onClick: $event => (reportDialog('trace'))
                    }, "字段变动轨迹", 8, _hoisted_64))
                  : _createCommentVNode("", true),
                (file&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 4,
                      class: "btn",
                      onClick: receiptDialog
                    }, "保存核对", 8, _hoisted_65))
                  : _createCommentVNode("", true),
                (ledgerEnabled&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 5,
                      class: "btn",
                      onClick: ledgerDialog
                    }, "台账对账", 8, _hoisted_66))
                  : _createCommentVNode("", true),
                (reviewReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 6,
                      class: "btn",
                      onClick: $event => (go('复核工作台'))
                    }, "返回复核工作台", 8, _hoisted_67))
                  : _createCommentVNode("", true),
                (eventReturn&&['历史版本','版本对比'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 7,
                      class: "btn",
                      onClick: returnToEvents
                    }, "返回变更记录", 8, _hoisted_68))
                  : _createCommentVNode("", true),
                (['变更记录','文件管理','审计中心'].includes(page))
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 8,
                      class: "btn",
                      disabled: listLoading||!!rangeError||!list.total,
                      onClick: exportEvents
                    }, [_createVNode(_component_ico, { n: "download" }), _createTextVNode(_toDisplayString(listLoading?'正在筛选…':'导出记录（'+num(list.total)+' 条）'), 1)], 8, _hoisted_69))
                  : _createCommentVNode("", true)
              ])]),
              (page==='目录监控')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                    (!s.roots.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_70, [
                          _createVNode(_component_ico, { n: "folder-plus" }),
                          _cache[30] || (_cache[30] = _createElementVNode("b", null, "添加第一个业务目录", -1)),
                          _cache[31] || (_cache[31] = _createElementVNode("small", null, "首次扫描会为已有文件建立初始版本。", -1)),
                          _createElementVNode("button", {
                            class: "primary",
                            onClick: $event => (rootDialog())
                          }, "添加目录", 8, _hoisted_71)
                        ]))
                      : _createCommentVNode("", true),
                    (s.roots.length)
                      ? (_openBlock(), _createElementBlock("section", _hoisted_72, [
                          _createElementVNode("label", _hoisted_73, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((rootQuery) = $event),
                            placeholder: "搜索目录名称或完整路径",
                            "aria-label": "搜索监控目录"
                          }, null, 8, _hoisted_74), [[_vModelText, rootQuery]])]),
                          _withDirectives(_createElementVNode("select", {
                            "aria-label": "目录排序",
                            "onUpdate:modelValue": $event => ((rootOrder) = $event)
                          }, _cache[32] || (_cache[32] = [_createElementVNode("option", { value: "" }, "添加顺序", -1), _createElementVNode("option", { value: "count" }, "在册文件最多", -1)]), 8, _hoisted_75), [[_vModelSelect, rootOrder]]),
                          _createElementVNode("div", _hoisted_76, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(rootTabs, (tab) => {
                            return (_openBlock(), _createElementBlock("button", {
                              "aria-pressed": rootScope===tab.label,
                              onClick: $event => {rootScope=tab.label;rootFocus=null}
                            }, [_createTextVNode(_toDisplayString(tab.label) + " ", 1), _createElementVNode("b", null, _toDisplayString(tab.count), 1)], 8, _hoisted_77))
                          }), 256))]),
                          (rootFocus||rootQuery||rootScope!=='全部')
                            ? (_openBlock(), _createElementBlock("button", {
                                key: 0,
                                class: "textbtn",
                                onClick: clearRootFilter
                              }, "清除筛选", 8, _hoisted_78))
                            : _createCommentVNode("", true)
                        ]))
                      : _createCommentVNode("", true),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleRoots, (r) => {
                      return (_openBlock(), _createElementBlock("section", {
                        class: "card root-card",
                        key: r.id
                      }, [_createElementVNode("div", _hoisted_79, [_createVNode(_component_ico, { n: "folder" })]), _createElementVNode("div", _hoisted_80, [
                        _createElementVNode("h2", null, _toDisplayString(base(r.path)), 1),
                        _createElementVNode("p", _hoisted_81, _toDisplayString(r.path), 1),
                        _createElementVNode("small", null, _toDisplayString(num(r.total)) + " 个在册文件　·　" + _toDisplayString(r.watch_mode) + "　·　最近扫描 " + _toDisplayString(fmt(r.last_scan)), 1),
                        (r.active&&r.waiting)
                          ? (_openBlock(), _createElementBlock("details", _hoisted_82, [
                              _createElementVNode("summary", null, "等待保存或读取 · " + _toDisplayString(r.waiting) + " 项", 1),
                              _createElementVNode("p", null, "引擎已安排复查，重试间隔约 " + _toDisplayString(r.retry_delay) + " 秒。", 1),
                              _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.wait_samples, (entry) => {
                                return (_openBlock(), _createElementBlock("li", null, _toDisplayString(entry[0]) + " · " + _toDisplayString(entry[1]), 1))
                              }), 256))]),
                              (r.waiting>10)
                                ? (_openBlock(), _createElementBlock("small", _hoisted_83, "显示前 10 项"))
                                : _createCommentVNode("", true)
                            ]))
                          : _createCommentVNode("", true),
                        (r.skipped)
                          ? (_openBlock(), _createElementBlock("details", _hoisted_84, [_createElementVNode("summary", null, "上次完成扫描跳过 " + _toDisplayString(r.skipped) + " 项", 1), (r.skip_counts)
                              ? (_openBlock(), _createElementBlock("ul", _hoisted_85, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.skip_counts, (count, reason) => {
                                  return (_openBlock(), _createElementBlock("li", null, _toDisplayString(reason) + " · " + _toDisplayString(count) + " 项", 1))
                                }), 256))]))
                              : (_openBlock(), _createElementBlock("small", _hoisted_86, "下次扫描后可查看原因。"))]))
                          : _createCommentVNode("", true),
                        (r.error)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_87, _toDisplayString(r.error), 1))
                          : _createCommentVNode("", true)
                      ]), _createElementVNode("div", _hoisted_88, [_createElementVNode("span", { class: _normalizeClass(["light-state", {off:!r.active,warn:!!r.error}]) }, [_cache[33] || (_cache[33] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(rstate(r)), 1)], 2), (r.progress||r.queued_source)
                        ? (_openBlock(), _createElementBlock("small", _hoisted_89, _toDisplayString(r.progress || r.queued_source), 1))
                        : _createCommentVNode("", true), _createElementVNode("div", _hoisted_90, [
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (policyDialog(r))
                        }, "监听采集策略", 8, _hoisted_91),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (waitingDialog(r))
                        }, "等待队列", 8, _hoisted_92),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (scanJournal(r))
                        }, "扫描运行记录", 8, _hoisted_93),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (showRuleHistory(r))
                        }, "规则沿革", 8, _hoisted_94),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (treeFor(r))
                        }, "子目录", 8, _hoisted_95),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (rootFiles(r))
                        }, "查看文件", 8, _hoisted_96),
                        _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (rootEvents(r))
                        }, "变更记录", 8, _hoisted_97),
                        _createElementVNode("button", {
                          class: "textbtn",
                          disabled: !r.active||!!r.progress||!!r.queued_source,
                          onClick: $event => (scanRoots(r))
                        }, _toDisplayString(demo?'模拟扫描':'扫描此目录'), 9, _hoisted_98),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              class: "textbtn",
                              onClick: $event => (rootDialog(r))
                            }, "配置", 8, _hoisted_99))
                          : _createCommentVNode("", true),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 1,
                              class: "textbtn",
                              onClick: $event => (actRoot(r,r.active?'暂停':'继续'))
                            }, _toDisplayString(r.active?'暂停':'继续'), 9, _hoisted_100))
                          : _createCommentVNode("", true),
                        (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 2,
                              class: "textbtn danger",
                              onClick: $event => (actRoot(r,'移除'))
                            }, "移除", 8, _hoisted_101))
                          : _createCommentVNode("", true)
                      ])])]))
                    }), 128)),
                    (s.roots.length&&!visibleRoots.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_102, [_cache[34] || (_cache[34] = _createElementVNode("b", null, "没有匹配的监控目录", -1)), _createElementVNode("button", {
                          class: "textbtn",
                          onClick: clearRootFilter
                        }, "显示全部目录", 8, _hoisted_103)]))
                      : _createCommentVNode("", true)
                  ], 64))
                : _createCommentVNode("", true),
              (['文件管理','变更记录','审计中心'].includes(page))
                ? (_openBlock(), _createElementBlock("section", _hoisted_104, [
                    (f.prefix)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_105, "目录范围：" + _toDisplayString(f.prefix), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_106, [
                      _createElementVNode("label", _hoisted_107, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                        "aria-label": "搜索记录",
                        "onUpdate:modelValue": $event => ((f.q) = $event),
                        placeholder: page==='审计中心'?'搜索操作名称或内容':page==='变更记录'?'搜索文件名、现路径或原路径':'搜索现名、旧名或相对路径',
                        onInput: searchLater
                      }, null, 40, _hoisted_108), [[_vModelText, f.q]])]),
                      (page!=='审计中心')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_withDirectives(_createElementVNode("select", {
                            "aria-label": "监控目录",
                            "onUpdate:modelValue": $event => ((f.root) = $event),
                            onChange: queryFirst
                          }, [_cache[35] || (_cache[35] = _createElementVNode("option", { value: "" }, "全部目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                            return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(base(r.path)), 9, _hoisted_110))
                          }), 256))], 40, _hoisted_109), [[_vModelSelect, f.root]]), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((f.ext) = $event),
                            class: "extbox",
                            "aria-label": "扩展名",
                            placeholder: "xlsx, pdf",
                            onInput: searchLater
                          }, null, 40, _hoisted_111), [[_vModelText, f.ext]])], 64))
                        : _createCommentVNode("", true),
                      (page==='文件管理')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 1,
                            "aria-label": "文件范围",
                            "onUpdate:modelValue": $event => ((f.scope) = $event),
                            onChange: queryFirst
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(fileScopes, (entry) => {
                            return (_openBlock(), _createElementBlock("option", { value: entry[0] }, _toDisplayString(entry[1]), 9, _hoisted_113))
                          }), 256))], 40, _hoisted_112)), [[_vModelSelect, f.scope]])
                        : _createCommentVNode("", true),
                      (page==='变更记录')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 2,
                            "onUpdate:modelValue": $event => ((f.kind) = $event),
                            onChange: queryFirst
                          }, [_cache[36] || (_cache[36] = _createElementVNode("option", { value: "" }, "全部变化", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(kinds, (k) => {
                            return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                          }), 256))], 40, _hoisted_114)), [[_vModelSelect, f.kind]])
                        : _createCommentVNode("", true),
                      (page==='审计中心')
                        ? _withDirectives((_openBlock(), _createElementBlock("select", {
                            key: 3,
                            "aria-label": "管理操作",
                            "onUpdate:modelValue": $event => ((f.action) = $event),
                            onChange: queryFirst
                          }, [_cache[37] || (_cache[37] = _createElementVNode("option", { value: "" }, "全部操作", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.actions, (action) => {
                            return (_openBlock(), _createElementBlock("option", { value: action }, _toDisplayString(action), 9, _hoisted_116))
                          }), 256))], 40, _hoisted_115)), [[_vModelSelect, f.action]])
                        : _createCommentVNode("", true),
                      (Object.values(f).some(Boolean))
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 4,
                            class: "textbtn",
                            onClick: clearFilter
                          }, "重置", 8, _hoisted_117))
                        : _createCommentVNode("", true)
                    ]),
                    _createElementVNode("details", _hoisted_118, [_cache[57] || (_cache[57] = _createElementVNode("summary", null, "更多筛选与排序", -1)), _createElementVNode("div", _hoisted_119, [
                      _createElementVNode("label", null, [_cache[43] || (_cache[43] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((f.sort) = $event),
                        onChange: queryFirst
                      }, [_cache[41] || (_cache[41] = _createElementVNode("option", { value: "" }, "最近优先", -1)), _cache[42] || (_cache[42] = _createElementVNode("option", { value: "oldest" }, "最早优先", -1)), (page==='文件管理')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_cache[38] || (_cache[38] = _createElementVNode("option", { value: "size" }, "大小降序", -1)), _cache[39] || (_cache[39] = _createElementVNode("option", { value: "versions" }, "版本最多", -1)), _cache[40] || (_cache[40] = _createElementVNode("option", { value: "name" }, "路径升序", -1))], 64))
                        : _createCommentVNode("", true)], 40, _hoisted_120), [[_vModelSelect, f.sort]])]),
                      (page!=='审计中心')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[45] || (_cache[45] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((f.status) = $event),
                            onChange: queryFirst
                          }, [_cache[44] || (_cache[44] = _createElementVNode("option", { value: "" }, "全部状态", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (v) => {
                            return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                          }), 256))], 40, _hoisted_121), [[_vModelSelect, f.status]])]), _createElementVNode("label", null, [_cache[46] || (_cache[46] = _createTextVNode("SHA-256 前缀")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((f.sha) = $event),
                            maxlength: "64",
                            onInput: searchLater,
                            placeholder: "例如 43af"
                          }, null, 40, _hoisted_122), [[_vModelText, f.sha]])])], 64))
                        : _createCommentVNode("", true),
                      (page==='文件管理')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.starred) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_123), [[_vModelCheckbox, f.starred]]), _cache[47] || (_cache[47] = _createTextVNode("仅关注文件"))]),
                            _createElementVNode("label", null, [_cache[48] || (_cache[48] = _createTextVNode("最小字节数")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.min_bytes) = $event),
                              type: "number",
                              min: "0",
                              onInput: searchLater
                            }, null, 40, _hoisted_124), [[_vModelText, f.min_bytes]])]),
                            _createElementVNode("label", null, [_cache[49] || (_cache[49] = _createTextVNode("最大字节数")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.max_bytes) = $event),
                              type: "number",
                              min: "0",
                              onInput: searchLater
                            }, null, 40, _hoisted_125), [[_vModelText, f.max_bytes]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.multiple) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_126), [[_vModelCheckbox, f.multiple]]), _cache[50] || (_cache[50] = _createTextVNode("仅多版本文件"))])
                          ], 64))
                        : _createCommentVNode("", true),
                      (page==='变更记录')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createElementVNode("button", {
                              class: "btn",
                              onClick: privateDialog
                            }, "管理已移出记录", 8, _hoisted_127),
                            _createElementVNode("label", null, [_cache[51] || (_cache[51] = _createTextVNode("事件编号")), _withDirectives(_createElementVNode("input", {
                              type: "number",
                              min: "1",
                              "onUpdate:modelValue": $event => ((f.event_id) = $event),
                              onInput: searchLater
                            }, null, 40, _hoisted_128), [[_vModelText, f.event_id]])]),
                            _createElementVNode("label", null, [_cache[52] || (_cache[52] = _createTextVNode("公开更正说明")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((f.caption) = $event),
                              onInput: searchLater
                            }, null, 40, _hoisted_129), [[_vModelText, f.caption]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.amended) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_130), [[_vModelCheckbox, f.amended]]), _cache[53] || (_cache[53] = _createTextVNode("仅已处置"))]),
                            _createElementVNode("label", null, [_cache[55] || (_cache[55] = _createTextVNode("记录来源")), _withDirectives(_createElementVNode("select", {
                              "onUpdate:modelValue": $event => ((f.source) = $event),
                              onChange: queryFirst
                            }, [_cache[54] || (_cache[54] = _createElementVNode("option", { value: "" }, "全部来源", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.sources, (v) => {
                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                            }), 256))], 40, _hoisted_131), [[_vModelSelect, f.source]])]),
                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.with_diff) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_132), [[_vModelCheckbox, f.with_diff]]), _cache[56] || (_cache[56] = _createTextVNode("仅有内容差异"))])
                          ], 64))
                        : _createCommentVNode("", true)
                    ])]),
                    (['文件管理','变更记录','审计中心'].includes(page))
                      ? (_openBlock(), _createElementBlock("div", _hoisted_133, [_createElementVNode("label", _hoisted_134, [_cache[58] || (_cache[58] = _createTextVNode("从 ")), _withDirectives(_createElementVNode("input", {
                          "aria-label": "开始日期",
                          type: "date",
                          "onUpdate:modelValue": $event => ((f.start) = $event),
                          max: f.end||undefined,
                          onChange: queryFirst
                        }, null, 40, _hoisted_135), [[_vModelText, f.start]])]), _createElementVNode("label", _hoisted_136, [_cache[59] || (_cache[59] = _createTextVNode("至 ")), _withDirectives(_createElementVNode("input", {
                          "aria-label": "结束日期",
                          type: "date",
                          "onUpdate:modelValue": $event => ((f.end) = $event),
                          min: f.start||undefined,
                          onChange: queryFirst
                        }, null, 40, _hoisted_137), [[_vModelText, f.end]])]), (page==='变更记录')
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("button", {
                              class: "range-preset",
                              onClick: $event => (recentDays(1))
                            }, "今天", 8, _hoisted_138), _createElementVNode("button", {
                              class: "range-preset",
                              onClick: $event => (recentDays(7))
                            }, "近七天", 8, _hoisted_139), _createElementVNode("label", _hoisted_140, [_withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": $event => ((f.activity) = $event),
                              onChange: queryFirst
                            }, null, 40, _hoisted_141), [[_vModelCheckbox, f.activity]]), _cache[60] || (_cache[60] = _createTextVNode("隐藏初始建档"))])], 64))
                          : _createCommentVNode("", true)]))
                      : _createCommentVNode("", true),
                    rangeError
                      ? (_openBlock(), _createElementBlock("p", _hoisted_142, _toDisplayString(rangeError), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_143, [(page==='文件管理')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_144, [_cache[61] || (_cache[61] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "文件名称"),
                          _createElementVNode("th", null, "所属目录"),
                          _createElementVNode("th", null, "大小"),
                          _createElementVNode("th", null, "最近版本"),
                          _createElementVNode("th", null, "最近变化"),
                          _createElementVNode("th")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [
                            _createElementVNode("td", null, [_createElementVNode("div", _hoisted_145, [_createElementVNode("span", { class: _normalizeClass(["file-icon", tone(x.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(x.ext) }, null, 8, ["n"])], 2), _createElementVNode("div", _hoisted_146, [_createElementVNode("strong", null, _toDisplayString(base(x.rel)), 1), (x.matched_path)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_147, "原路径：" + _toDisplayString(x.matched_path), 1))
                              : _createCommentVNode("", true), _createElementVNode("span", { class: _normalizeClass(["tag", stateTone(x.file_state)]) }, _toDisplayString(x.file_state), 3)])])]),
                            _createElementVNode("td", _hoisted_148, _toDisplayString(parent(x.root,x.rel)), 1),
                            _createElementVNode("td", null, _toDisplayString(bytes(x.size)), 1),
                            _createElementVNode("td", null, "V" + _toDisplayString(x.version), 1),
                            _createElementVNode("td", null, _toDisplayString(fmt(x.updated)), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              "aria-pressed": !!x.starred,
                              onClick: $event => (toggleStar(x))
                            }, _toDisplayString(x.starred?'取消关注':'关注'), 9, _hoisted_149), _createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (selectFile(x))
                            }, "历史版本", 8, _hoisted_150), (native&&x.live&&!x.root_removed)
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  class: "textbtn",
                                  onClick: $event => (perform('open_dir',{id:x.id}))
                                }, "打开位置", 8, _hoisted_151))
                              : _createCommentVNode("", true)])
                          ]))
                        }), 256))])]))
                      : _createCommentVNode("", true), (page==='变更记录')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_152, [_cache[62] || (_cache[62] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "文件与位置"),
                          _createElementVNode("th", null, "变更类型"),
                          _createElementVNode("th", null, "版本"),
                          _createElementVNode("th", null, "记录时间"),
                          _createElementVNode("th", null, "解析状态"),
                          _createElementVNode("th")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [
                            _createElementVNode("td", null, [_createElementVNode("strong", null, _toDisplayString(base(x.rel)), 1), _createElementVNode("small", null, _toDisplayString(parent(x.root,x.rel)), 1), (x.old_rel)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_153, "原路径：" + _toDisplayString(x.old_rel), 1))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass(["tag", kindTone(x.kind)]) }, _toDisplayString(x.kind), 3), (x.caption)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_154, "更正：" + _toDisplayString(x.caption), 1))
                              : _createCommentVNode("", true)]),
                            _createElementVNode("td", null, _toDisplayString(x.prior?'V'+x.prior:'—') + " → " + _toDisplayString(x.version?'V'+x.version:'—'), 1),
                            _createElementVNode("td", null, _toDisplayString(fmt(x.stamp)), 1),
                            _createElementVNode("td", null, _toDisplayString(x.status||'已记录'), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              disabled: listLoading||x.kind==='已撤回',
                              onClick: $event => (fromEvent(x))
                            }, "查看详情", 8, _hoisted_155), _createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (recordDialog(x))
                            }, "管理记录", 8, _hoisted_156)])
                          ]))
                        }), 256))])]))
                      : _createCommentVNode("", true), (page==='审计中心')
                      ? (_openBlock(), _createElementBlock("table", _hoisted_157, [_cache[63] || (_cache[63] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [_createElementVNode("th", null, "时间"), _createElementVNode("th", null, "管理操作"), _createElementVNode("th", null, "操作内容")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list.items, (x) => {
                          return (_openBlock(), _createElementBlock("tr", null, [_createElementVNode("td", null, _toDisplayString(fmt(x.stamp)), 1), _createElementVNode("td", null, _toDisplayString(x.action), 1), _createElementVNode("td", _hoisted_158, _toDisplayString(x.note), 1)]))
                        }), 256))])]))
                      : _createCommentVNode("", true)]),
                    (!list.items.length&&!listLoading&&!rangeError)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_159, [_createVNode(_component_ico, { n: "search" }), _cache[64] || (_cache[64] = _createElementVNode("b", null, "没有符合条件的记录", -1))]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_160, [_createElementVNode("span", null, [_createTextVNode("共 " + _toDisplayString(num(list.total)) + " 条　", 1), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((listSize) = $event),
                      "aria-label": "记录每页条数",
                      onChange: queryFirst
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([10,25,50,100], (v) => {
                      return (_openBlock(), _createElementBlock("option", { value: v }, "每页 " + _toDisplayString(v) + " 条", 9, _hoisted_162))
                    }), 256))], 40, _hoisted_161), [[
                      _vModelSelect,
                      listSize,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("div", null, [_createElementVNode("button", {
                      class: "btn",
                      disabled: p<=1,
                      onClick: $event => {p--;loadList()}
                    }, "上一页", 8, _hoisted_163), _createTextVNode(" " + _toDisplayString(p) + " / " + _toDisplayString(Math.max(1,Math.ceil(list.total/list.size))) + " ", 1), _createElementVNode("button", {
                      class: "btn",
                      disabled: p*list.size>=list.total,
                      onClick: $event => {p++;loadList()}
                    }, "下一页", 8, _hoisted_164)])])
                  ]))
                : _createCommentVNode("", true),
              (['历史版本','版本对比'].includes(page))
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_createElementVNode("div", _hoisted_165, [_createElementVNode("div", _hoisted_166, [_createVNode(_component_ico, { n: "files" })]), _createElementVNode("div", _hoisted_167, [_createElementVNode("b", null, _toDisplayString(file?base(file.rel):'选择需要追溯的文件'), 1), _createElementVNode("small", null, _toDisplayString(file?parent(file.root,file.rel):'可以查找已删除文件的历史记录'), 1), (file&&file.file_state)
                    ? (_openBlock(), _createElementBlock("span", {
                        key: 0,
                        class: _normalizeClass(["tag", stateTone(file.file_state)])
                      }, _toDisplayString(file.file_state), 3))
                    : _createCommentVNode("", true)]), _createElementVNode("button", {
                    class: "btn",
                    onClick: fileDialog
                  }, "选择文件", 8, _hoisted_168)]), (file&&versions.length)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", _hoisted_169, [_createElementVNode("h2", null, _toDisplayString(page==='历史版本'?'版本时间线':'版本选择'), 1), _createElementVNode("button", {
                        class: "textbtn",
                        onClick: $event => (navVersion(page==='历史版本'?'版本对比':'历史版本'))
                      }, [_createTextVNode(_toDisplayString(page==='历史版本'?'比较版本':'查看时间线') + " ", 1), _createVNode(_component_ico, { n: "arrow-right" })], 8, _hoisted_170)]), (page==='历史版本')
                        ? (_openBlock(), _createElementBlock("section", _hoisted_171, [
                            _createElementVNode("div", _hoisted_172, [
                              _createElementVNode("label", null, [_cache[66] || (_cache[66] = _createTextVNode("复核结论")), _withDirectives(_createElementVNode("select", {
                                "onUpdate:modelValue": $event => ((historyReview) = $event),
                                onChange: $event => (versionPage=1)
                              }, [_cache[65] || (_cache[65] = _createElementVNode("option", { value: "" }, "全部结论", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewStates, (v) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                              }), 256))], 40, _hoisted_173), [[_vModelSelect, historyReview]])]),
                              _createElementVNode("label", null, [_cache[67] || (_cache[67] = _createTextVNode("版本号或摘要")), _withDirectives(_createElementVNode("input", {
                                "onUpdate:modelValue": $event => ((versionQuery) = $event),
                                onInput: $event => (versionPage=1),
                                placeholder: "V2 或至少 6 位摘要",
                                "aria-label": "查找版本号"
                              }, null, 40, _hoisted_174), [[_vModelText, versionQuery]])]),
                              _createElementVNode("label", null, [_cache[68] || (_cache[68] = _createTextVNode("保存日期")), _withDirectives(_createElementVNode("input", {
                                type: "date",
                                "onUpdate:modelValue": $event => ((versionDay) = $event),
                                onChange: $event => (versionPage=1),
                                "aria-label": "版本保存日期"
                              }, null, 40, _hoisted_175), [[_vModelText, versionDay]])]),
                              _createElementVNode("label", null, [_cache[70] || (_cache[70] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                                "onUpdate:modelValue": $event => ((versionStatus) = $event),
                                onChange: $event => (versionPage=1)
                              }, [_cache[69] || (_cache[69] = _createElementVNode("option", { value: "" }, "全部状态", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (v) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                              }), 256))], 40, _hoisted_176), [[_vModelSelect, versionStatus]])]),
                              (versionQuery||versionDay||versionStatus||historyReview)
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 0,
                                    class: "textbtn",
                                    onClick: resetVersions
                                  }, "清除条件", 8, _hoisted_177))
                                : _createCommentVNode("", true),
                              _createElementVNode("small", null, "共 " + _toDisplayString(matchedVersions.length) + " 个版本", 1)
                            ]),
                            (!visibleVersions.length)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_178, _cache[71] || (_cache[71] = [_createElementVNode("b", null, "没有符合条件的版本", -1), _createElementVNode("small", null, "可清除条件查看完整时间线。", -1)])))
                              : _createCommentVNode("", true),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleVersions, (v) => {
                              return (_openBlock(), _createElementBlock("div", {
                                class: "version",
                                key: v.id
                              }, [_cache[72] || (_cache[72] = _createElementVNode("span", { class: "node" }, null, -1)), _createElementVNode("div", _hoisted_179, [
                                _createElementVNode("h3", null, [_createTextVNode("V" + _toDisplayString(v.num) + " ", 1), _createElementVNode("span", _hoisted_180, _toDisplayString(v.status), 1)]),
                                _createElementVNode("p", null, [_createTextVNode(_toDisplayString(fmt(v.stamp)) + "　·　" + _toDisplayString(bytes(v.size)), 1), (v.delta!=null)
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode("　·　" + _toDisplayString(v.delta>=0?'+':'−') + _toDisplayString(bytes(Math.abs(v.delta))), 1)], 64))
                                  : _createCommentVNode("", true), (v.status==='已解析')
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createTextVNode("　·　" + _toDisplayString(v.changes) + " 项差异", 1)], 64))
                                  : _createCommentVNode("", true)]),
                                (v.note)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_181, _toDisplayString(v.note), 1))
                                  : _createCommentVNode("", true),
                                _createElementVNode("small", _hoisted_182, "SHA-256　" + _toDisplayString(v.sha), 1),
                                (v.error)
                                  ? (_openBlock(), _createElementBlock("small", _hoisted_183, _toDisplayString(v.error), 1))
                                  : _createCommentVNode("", true)
                              ]), _createElementVNode("div", _hoisted_184, [
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (editReview(v))
                                }, _toDisplayString(v.review||'待复核') + " · 登记", 9, _hoisted_185),
                                (v.num>2)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 0,
                                      class: "textbtn",
                                      onClick: $event => (pair(versions[versions.length-1].id,v.id))
                                    }, "与首版比较", 8, _hoisted_186))
                                  : _createCommentVNode("", true),
                                (v.id!==versions[0].id)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 1,
                                      class: "textbtn",
                                      onClick: $event => (pair(v.id,versions[0].id))
                                    }, "与最新版比较", 8, _hoisted_187))
                                  : _createCommentVNode("", true),
                                (v.parent_id)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 2,
                                      class: "textbtn",
                                      onClick: $event => (pair(v.parent_id,v.id))
                                    }, "比较", 8, _hoisted_188))
                                  : _createCommentVNode("", true),
                                (!demo)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 3,
                                      class: "textbtn",
                                      onClick: $event => (saveFile('copy',base(file.rel),v.id))
                                    }, "另存", 8, _hoisted_189))
                                  : _createCommentVNode("", true),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (restoreDialog(v))
                                }, _toDisplayString(demo?'恢复预览':'恢复'), 9, _hoisted_190)
                              ])]))
                            }), 128)),
                            (versionPages>1)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_191, [_createElementVNode("span", null, "第 " + _toDisplayString(versionPage) + " / " + _toDisplayString(versionPages) + " 页", 1), _createElementVNode("div", null, [_createElementVNode("button", {
                                  class: "btn",
                                  disabled: versionPage<=1,
                                  onClick: $event => (versionPage--)
                                }, "上一页", 8, _hoisted_192), _cache[73] || (_cache[73] = _createTextVNode()), _createElementVNode("button", {
                                  class: "btn",
                                  disabled: versionPage>=versionPages,
                                  onClick: $event => (versionPage++)
                                }, "下一页", 8, _hoisted_193)])]))
                              : _createCommentVNode("", true)
                          ]))
                        : (_openBlock(), _createElementBlock("section", _hoisted_194, [_createElementVNode("div", _hoisted_195, [_createElementVNode("label", null, [_cache[74] || (_cache[74] = _createTextVNode("旧版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((left) = $event),
                            onChange: changePair
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions, (v) => {
                            return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + "　" + _toDisplayString(fmt(v.stamp)), 9, _hoisted_197))
                          }), 256))], 40, _hoisted_196), [[
                            _vModelSelect,
                            left,
                            void 0,
                            { number: true }
                          ]])]), _createElementVNode("button", {
                            class: "btn swap-pair",
                            disabled: left===right||diffLoading,
                            onClick: swapPair
                          }, "交换版本", 8, _hoisted_198), _createElementVNode("label", null, [_cache[75] || (_cache[75] = _createTextVNode("新版本")), _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": $event => ((right) = $event),
                            onChange: changePair
                          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions, (v) => {
                            return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + "　" + _toDisplayString(fmt(v.stamp)), 9, _hoisted_200))
                          }), 256))], 40, _hoisted_199), [[
                            _vModelSelect,
                            right,
                            void 0,
                            { number: true }
                          ]])])]), (left!==right&&diff)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                (diff.is_source)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_201, [_createElementVNode("div", _hoisted_202, [_createElementVNode("button", {
                                      "aria-pressed": diffMode==='aligned',
                                      onClick: $event => (setDiffMode('aligned'))
                                    }, "按结构比较", 8, _hoisted_203), _createElementVNode("button", {
                                      "aria-pressed": diffMode==='coordinate',
                                      onClick: $event => (setDiffMode('coordinate'))
                                    }, "按原文逐行比较", 8, _hoisted_204)])]))
                                  : _createCommentVNode("", true),
                                (diff.is_excel||diff.is_word||diff.is_tabular)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_205, [_createElementVNode("div", _hoisted_206, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([['aligned',diff.is_word?'按段落内容对齐':'按编号对齐'],['coordinate',diff.is_word?'按原始位置':'按原始坐标']], (m) => {
                                      return (_openBlock(), _createElementBlock("button", {
                                        "aria-pressed": diffMode===m[0],
                                        onClick: $event => (setDiffMode(m[0]))
                                      }, _toDisplayString(m[1]), 9, _hoisted_207))
                                    }), 256))]), (diff.is_word)
                                      ? (_openBlock(), _createElementBlock("small", _hoisted_208, _toDisplayString(diffMode==='aligned'?'按文档区域核对段落，突出显示修改文字':'逐个段号和表格位置核对'), 1))
                                      : (diffMode==='aligned' && Object.keys(diff.aligned).length)
                                        ? (_openBlock(), _createElementBlock("small", _hoisted_209, "按 " + _toDisplayString(Object.entries(diff.aligned).filter(([name])=>!sheet || sheet===name).map(([name,key])=>name+' · '+key).join('、') || '单元格坐标') + " 核对", 1))
                                        : (_openBlock(), _createElementBlock("small", _hoisted_210, "按单元格坐标核对"))]))
                                  : _createCommentVNode("", true),
                                (diff.is_excel||diff.is_tabular)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 2,
                                      class: "btn",
                                      onClick: varianceDialog
                                    }, "数值差异核对", 8, _hoisted_211))
                                  : _createCommentVNode("", true),
                                (formatView[0]!=='detail')
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_212, [_createElementVNode("button", {
                                      "aria-pressed": displayMode==='auto',
                                      onClick: $event => {displayMode='auto';changePair()}
                                    }, _toDisplayString(formatView[1]), 9, _hoisted_213), _createElementVNode("button", {
                                      "aria-pressed": displayMode==='detail',
                                      onClick: $event => (displayMode='detail')
                                    }, _toDisplayString(diff.is_excel?'单元格与属性明细':'明细表') + " · " + _toDisplayString(diff.is_excel?'筛选与导出':'并排查看'), 9, _hoisted_214)]))
                                  : _createCommentVNode("", true),
                                (presentation==='grid')
                                  ? (_openBlock(), _createElementBlock("section", _hoisted_215, [
                                      grid
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_216, [
                                            _createElementVNode("label", null, [_cache[76] || (_cache[76] = _createTextVNode("工作表 ")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((gridSheet) = $event),
                                              onChange: $event => {gridPage=1;gridCol=1;loadGrid()}
                                            }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.sheets, (g) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(g), 1))
                                            }), 256))], 40, _hoisted_217), [[_vModelSelect, gridSheet]])]),
                                            _createElementVNode("span", null, _toDisplayString(grid.key?'按「'+grid.key+'」配对':'按原始行号配对'), 1),
                                            _createElementVNode("label", null, [_cache[78] || (_cache[78] = _createTextVNode("整行筛选")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((gridFilter) = $event),
                                              onChange: $event => {gridPage=1;loadGrid()}
                                            }, [_cache[77] || (_cache[77] = _createElementVNode("option", { value: "" }, "全部行", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增行','删除行','修改行','调序行','内容','批注','格式','超链接'], (v) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                                            }), 256))], 40, _hoisted_218), [[_vModelSelect, gridFilter]])]),
                                            (grid.row_filter)
                                              ? (_openBlock(), _createElementBlock("span", _hoisted_219, "匹配 " + _toDisplayString(grid.matches) + " 行", 1))
                                              : _createCommentVNode("", true),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              disabled: !!gridFilter,
                                              "onUpdate:modelValue": $event => ((expandRows) = $event),
                                              onChange: $event => {gridPage=1;loadGrid()}
                                            }, null, 40, _hoisted_220), [[_vModelCheckbox, expandRows]]), _cache[79] || (_cache[79] = _createTextVNode("显示未变行"))])
                                          ]))
                                        : _createCommentVNode("", true),
                                      grid
                                        ? (_openBlock(), _createElementBlock("details", _hoisted_221, [_cache[89] || (_cache[89] = _createElementVNode("summary", null, "从整张工作表查找单元格", -1)), _createElementVNode("div", _hoisted_222, [
                                            _createElementVNode("label", null, [_cache[80] || (_cache[80] = _createTextVNode("单元格内容")), _withDirectives(_createElementVNode("input", {
                                              "onUpdate:modelValue": $event => ((cellSearch.q) = $event),
                                              maxlength: "512",
                                              onKeyup: _withKeys($event => (searchCells()), ["enter"])
                                            }, null, 40, _hoisted_223), [[_vModelText, cellSearch.q]])]),
                                            _createElementVNode("label", null, [_cache[82] || (_cache[82] = _createTextVNode("工作表一侧")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((cellSearch.side) = $event) }, _cache[81] || (_cache[81] = [_createElementVNode("option", { value: "" }, "两侧", -1), _createElementVNode("option", { value: "old" }, "旧表", -1), _createElementVNode("option", { value: "new" }, "新表", -1)]), 8, _hoisted_224), [[_vModelSelect, cellSearch.side]])]),
                                            _createElementVNode("label", null, [_cache[83] || (_cache[83] = _createTextVNode("字段名")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((cellSearch.field) = $event) }, null, 8, _hoisted_225), [[_vModelText, cellSearch.field]])]),
                                            _createElementVNode("label", null, [_cache[85] || (_cache[85] = _createTextVNode("数据类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((cellSearch.type) = $event) }, [_cache[84] || (_cache[84] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['文本','数字','公式','日期时间','布尔值','错误值'], (t) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(t), 1))
                                            }), 256))], 8, _hoisted_226), [[_vModelSelect, cellSearch.type]])]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.changed) = $event)
                                            }, null, 8, _hoisted_227), [[_vModelCheckbox, cellSearch.changed]]), _cache[86] || (_cache[86] = _createTextVNode("仅发生变化的单元格"))]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.exact) = $event)
                                            }, null, 8, _hoisted_228), [[_vModelCheckbox, cellSearch.exact]]), _cache[87] || (_cache[87] = _createTextVNode("整格匹配"))]),
                                            _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                              type: "checkbox",
                                              "onUpdate:modelValue": $event => ((cellSearch.sensitive) = $event)
                                            }, null, 8, _hoisted_229), [[_vModelCheckbox, cellSearch.sensitive]]), _cache[88] || (_cache[88] = _createTextVNode("区分大小写"))]),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: !cellSearch.q.trim()||cellBusy,
                                              onClick: $event => (searchCells())
                                            }, "查找单元格", 8, _hoisted_230)
                                          ]), (cellHits&&cellSig===JSON.stringify(cellOptions()))
                                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                                (!cellHits.items.length)
                                                  ? (_openBlock(), _createElementBlock("p", _hoisted_231, "没有匹配的单元格。"))
                                                  : _createCommentVNode("", true),
                                                _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cellHits.items, (h) => {
                                                  return (_openBlock(), _createElementBlock("li", null, [_createElementVNode("button", {
                                                    class: "textbtn",
                                                    onClick: $event => (jumpCell(h))
                                                  }, _toDisplayString(h.side==='old'?'旧表':'新表') + " " + _toDisplayString(h.address), 9, _hoisted_232), _createTextVNode(" · " + _toDisplayString(h.field) + " · " + _toDisplayString(h.value), 1)]))
                                                }), 256))]),
                                                _createElementVNode("button", {
                                                  class: "btn",
                                                  disabled: !cellHits.offset,
                                                  onClick: $event => (searchCells(cellHits.offset-20))
                                                }, "上一批", 8, _hoisted_233),
                                                _createElementVNode("button", {
                                                  class: "btn",
                                                  disabled: !cellHits.more,
                                                  onClick: $event => (searchCells(cellHits.offset+20))
                                                }, "下一批", 8, _hoisted_234)
                                              ], 64))
                                            : _createCommentVNode("", true)]))
                                        : _createCommentVNode("", true),
                                      grid
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_235, [_createElementVNode("div", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.summary, (n, label) => {
                                            return (_openBlock(), _createElementBlock("span", null, [_createTextVNode(_toDisplayString(label) + " ", 1), _createElementVNode("b", null, _toDisplayString(n), 1)]))
                                          }), 256))]), _createElementVNode("div", null, [_withDirectives(_createElementVNode("select", {
                                            "onUpdate:modelValue": $event => ((gridLocate) = $event),
                                            "aria-label": "整行定位方式"
                                          }, [_cache[90] || (_cache[90] = _createElementVNode("option", { value: "new" }, "新表地址", -1)), _cache[91] || (_cache[91] = _createElementVNode("option", { value: "old" }, "旧表地址", -1)), (grid.key)
                                            ? (_openBlock(), _createElementBlock("option", _hoisted_237, "业务编号"))
                                            : _createCommentVNode("", true)], 8, _hoisted_236), [[_vModelSelect, gridLocate]]), _withDirectives(_createElementVNode("input", {
                                            "onUpdate:modelValue": $event => ((gridTarget) = $event),
                                            placeholder: gridLocate==='key'?'输入完整编号':'例如 C24 或 24',
                                            onKeyup: _withKeys($event => (loadGrid(true)), ["enter"])
                                          }, null, 40, _hoisted_238), [[_vModelText, gridTarget]]), _createElementVNode("button", {
                                            class: "btn",
                                            disabled: !gridTarget.trim(),
                                            onClick: $event => (loadGrid(true))
                                          }, "定位", 8, _hoisted_239)])]))
                                        : _createCommentVNode("", true),
                                      (grid&&gridError)
                                        ? (_openBlock(), _createElementBlock("p", _hoisted_240, _toDisplayString(gridError), 1))
                                        : _createCommentVNode("", true),
                                      (!grid)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_241, _toDisplayString(gridError||diff.error||'正在读取工作表…'), 1))
                                        : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [_createElementVNode("div", _hoisted_242, [_createElementVNode("table", _hoisted_243, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                            _cache[92] || (_cache[92] = _createElementVNode("th", null, "旧行", -1)),
                                            _cache[93] || (_cache[93] = _createElementVNode("th", null, "新行", -1)),
                                            _cache[94] || (_cache[94] = _createElementVNode("th", null, "修订", -1)),
                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.columns, (c) => {
                                              return (_openBlock(), _createElementBlock("th", null, [_createTextVNode(_toDisplayString(c.title), 1), _createElementVNode("small", null, _toDisplayString(c.old||'—') + " → " + _toDisplayString(c.new||'—'), 1)]))
                                            }), 256))
                                          ])]), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grid.rows, (line) => {
                                            return (_openBlock(), _createElementBlock("tr", { class: _normalizeClass({'row-add':line.kind==='新增','row-del':line.kind==='删除','row-gap':line.kind==='gap','row-target':line.target}) }, [(line.kind==='gap')
                                              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("td", null, _toDisplayString(line.old), 1), _createElementVNode("td", null, _toDisplayString(line.new), 1), _createElementVNode("td", { colspan: 1+grid.columns.length }, [_createElementVNode("button", { onClick: $event => {expandRows=true;gridPage=line.expand_page;loadGrid()} }, "展开 " + _toDisplayString(line.count) + " 个未变行", 9, _hoisted_245)], 8, _hoisted_244)], 64))
                                              : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                                  _createElementVNode("td", null, _toDisplayString(line.old||''), 1),
                                                  _createElementVNode("td", null, _toDisplayString(line.new||''), 1),
                                                  _createElementVNode("td", null, [_createTextVNode(_toDisplayString(line.kind==='新增'?'＋':line.kind==='删除'?'−':'·'), 1), (line.moved)
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_246, "调序"))
                                                    : _createCommentVNode("", true)]),
                                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(line.cells, (cell) => {
                                                    return (_openBlock(), _createElementBlock("td", { class: _normalizeClass({'cell-changed':!!cell.note}) }, [_createElementVNode("span", null, _toDisplayString(cell.value??'—'), 1), (cell.note)
                                                      ? (_openBlock(), _createElementBlock("small", _hoisted_247, [_createTextVNode(_toDisplayString(cell.address) + " · " + _toDisplayString(cell.note), 1), (cell.type)
                                                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · " + _toDisplayString(cell.type), 1)], 64))
                                                          : _createCommentVNode("", true)]))
                                                      : _createCommentVNode("", true), (cell.detail)
                                                      ? (_openBlock(), _createElementBlock("details", _hoisted_248, [_cache[95] || (_cache[95] = _createElementVNode("summary", null, "具体变化", -1)), _createElementVNode("small", null, _toDisplayString(cell.detail), 1)]))
                                                      : _createCommentVNode("", true)], 2))
                                                  }), 256))
                                                ], 64))], 2))
                                          }), 256))])])]), _createElementVNode("div", _hoisted_249, [_createElementVNode("span", null, "整行视图 · " + _toDisplayString(grid.page) + " / " + _toDisplayString(grid.pages) + " 页 · 列组 " + _toDisplayString(grid.col_page) + " / " + _toDisplayString(grid.col_pages), 1), _createElementVNode("div", null, [
                                            (grid.col_pages>1)
                                              ? (_openBlock(), _createElementBlock("button", {
                                                  key: 0,
                                                  class: "btn",
                                                  disabled: gridCol===1,
                                                  onClick: $event => {gridCol--;loadGrid()}
                                                }, "上一组列", 8, _hoisted_250))
                                              : _createCommentVNode("", true),
                                            _cache[96] || (_cache[96] = _createTextVNode()),
                                            (grid.col_pages>1)
                                              ? (_openBlock(), _createElementBlock("button", {
                                                  key: 1,
                                                  class: "btn",
                                                  disabled: gridCol===grid.col_pages,
                                                  onClick: $event => {gridCol++;loadGrid()}
                                                }, "下一组列", 8, _hoisted_251))
                                              : _createCommentVNode("", true),
                                            _cache[97] || (_cache[97] = _createTextVNode()),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: gridPage===1,
                                              onClick: $event => {gridPage--;loadGrid()}
                                            }, "上一页", 8, _hoisted_252),
                                            _cache[98] || (_cache[98] = _createTextVNode()),
                                            _createElementVNode("button", {
                                              class: "btn",
                                              disabled: gridPage===grid.pages,
                                              onClick: $event => {gridPage++;loadGrid()}
                                            }, "下一页", 8, _hoisted_253)
                                          ])])], 64)),
                                      _createElementVNode("button", {
                                        class: "textbtn",
                                        onClick: $event => (displayMode='detail')
                                      }, "查看单元格、打印设置及其他属性差异（" + _toDisplayString(diff.total) + " 项）", 9, _hoisted_254)
                                    ]))
                                  : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
                                      _createElementVNode("div", _hoisted_255, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (k) => {
                                        return (_openBlock(), _createElementBlock("button", {
                                          class: _normalizeClass(["kind-chip", kindTone(k)]),
                                          "aria-pressed": diffKind===k,
                                          onClick: $event => (filterDiff(k))
                                        }, [_createTextVNode(_toDisplayString(k) + " ", 1), _createElementVNode("b", null, _toDisplayString(diff.counts[k]), 1)], 10, _hoisted_256))
                                      }), 256)), diffKind
                                        ? (_openBlock(), _createElementBlock("button", {
                                            key: 0,
                                            class: "textbtn",
                                            onClick: $event => (filterDiff(diffKind))
                                          }, "显示全部", 8, _hoisted_257))
                                        : _createCommentVNode("", true), _createElementVNode("span", _hoisted_258, _toDisplayString(diff.status), 1)]),
                                      _createElementVNode("div", _hoisted_259, [
                                        _withDirectives(_createElementVNode("select", {
                                          "onUpdate:modelValue": $event => ((sheet) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, [_cache[99] || (_cache[99] = _createElementVNode("option", { value: "" }, "全部位置分组", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.sheets, (g) => {
                                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(g), 1))
                                        }), 256))], 40, _hoisted_260), [[_vModelSelect, sheet]]),
                                        (diff.is_excel||diff.is_tabular)
                                          ? _withDirectives((_openBlock(), _createElementBlock("select", {
                                              key: 0,
                                              "aria-label": "差异类别",
                                              "onUpdate:modelValue": $event => ((diffCategory) = $event),
                                              onChange: $event => {dp=1;loadDiff()}
                                            }, [_cache[100] || (_cache[100] = _createElementVNode("option", { value: "" }, "全部差异类别", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.categories, (c) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(c), 1))
                                            }), 256))], 40, _hoisted_261)), [[_vModelSelect, diffCategory]])
                                          : _createCommentVNode("", true),
                                        _createElementVNode("label", _hoisted_262, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                                          "onUpdate:modelValue": $event => ((loc) = $event),
                                          placeholder: diff.is_excel?'搜索字段、位置、编号或值':'搜索位置、旧值或新值',
                                          onInput: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_263), [[_vModelText, loc]])]),
                                        diffFiltered
                                          ? (_openBlock(), _createElementBlock("button", {
                                              key: 1,
                                              class: "textbtn",
                                              onClick: changePair
                                            }, "清除筛选", 8, _hoisted_264))
                                          : _createCommentVNode("", true),
                                        _createElementVNode("button", {
                                          class: "btn export-diff",
                                          disabled: diffLoading||!diff.total,
                                          onClick: exportDifference
                                        }, [_createVNode(_component_ico, { n: "download" }), _createTextVNode("导出筛选结果（" + _toDisplayString(diff.total) + " 项）", 1)], 8, _hoisted_265)
                                      ]),
                                      _createElementVNode("details", _hoisted_266, [_cache[108] || (_cache[108] = _createElementVNode("summary", null, "精确查找与匹配范围", -1)), _createElementVNode("div", _hoisted_267, [
                                        _createElementVNode("label", null, [_cache[102] || (_cache[102] = _createTextVNode("搜索范围")), _withDirectives(_createElementVNode("select", {
                                          "onUpdate:modelValue": $event => ((searchIn) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, _cache[101] || (_cache[101] = [
                                          _createElementVNode("option", { value: "" }, "全部内容", -1),
                                          _createElementVNode("option", { value: "old" }, "仅旧值", -1),
                                          _createElementVNode("option", { value: "new" }, "仅新值", -1),
                                          _createElementVNode("option", { value: "location" }, "仅位置", -1)
                                        ]), 40, _hoisted_268), [[_vModelSelect, searchIn]])]),
                                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                          type: "checkbox",
                                          "onUpdate:modelValue": $event => ((caseSensitive) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_269), [[_vModelCheckbox, caseSensitive]]), _cache[103] || (_cache[103] = _createTextVNode("区分大小写"))]),
                                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                                          type: "checkbox",
                                          "onUpdate:modelValue": $event => ((exact) = $event),
                                          onChange: $event => {dp=1;loadDiff()}
                                        }, null, 40, _hoisted_270), [[_vModelCheckbox, exact]]), _cache[104] || (_cache[104] = _createTextVNode("完全匹配"))]),
                                        (diff.is_excel||diff.is_tabular)
                                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[106] || (_cache[106] = _createTextVNode("业务字段")), _withDirectives(_createElementVNode("select", {
                                              "onUpdate:modelValue": $event => ((diffField) = $event),
                                              onChange: $event => {dp=1;loadDiff()}
                                            }, [_cache[105] || (_cache[105] = _createElementVNode("option", { value: "" }, "全部字段", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(diff.fields, (v) => {
                                              return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                                            }), 256))], 40, _hoisted_271), [[_vModelSelect, diffField]])]), _createElementVNode("label", null, [_cache[107] || (_cache[107] = _createTextVNode("完整记录编号")), _withDirectives(_createElementVNode("input", {
                                              "onUpdate:modelValue": $event => ((recordId) = $event),
                                              onInput: $event => {dp=1;loadDiff()}
                                            }, null, 40, _hoisted_272), [[_vModelText, recordId]])])], 64))
                                          : _createCommentVNode("", true)
                                      ])]),
                                      (['records','paths','assets'].includes(presentation))
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_273, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupedChanges, ([group,items]) => {
                                            return (_openBlock(), _createElementBlock("section", _hoisted_274, [_createElementVNode("h3", null, _toDisplayString(group), 1), _createElementVNode("div", _hoisted_275, [_createElementVNode("table", _hoisted_276, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
                                              _createElementVNode("th", null, _toDisplayString(presentation==='records'?'列':presentation==='paths'?'字段路径':'条目'), 1),
                                              _cache[109] || (_cache[109] = _createElementVNode("th", null, "旧版本", -1)),
                                              _cache[110] || (_cache[110] = _createElementVNode("th", null, "新版本", -1)),
                                              _cache[111] || (_cache[111] = _createElementVNode("th", null, "变化", -1))
                                            ])]), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (d) => {
                                              return (_openBlock(), _createElementBlock("tr", null, [
                                                _createElementVNode("td", null, _toDisplayString(presentation==='records'?d.location.split(' · ').pop():d.location), 1),
                                                _createElementVNode("td", _hoisted_277, _toDisplayString(d.old??'—'), 1),
                                                _createElementVNode("td", _hoisted_278, _toDisplayString(d.new??'—'), 1),
                                                _createElementVNode("td", null, _toDisplayString(d.kind), 1)
                                              ]))
                                            }), 256))])])])]))
                                          }), 256))]))
                                        : (presentation!=='detail')
                                          ? (_openBlock(), _createElementBlock("div", _hoisted_279, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupedChanges, ([group,items]) => {
                                              return (_openBlock(), _createElementBlock("section", _hoisted_280, [_createElementVNode("h3", null, _toDisplayString(group), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (d) => {
                                                return (_openBlock(), _createElementBlock("article", null, [_createElementVNode("h4", null, _toDisplayString(d.location) + " · " + _toDisplayString(d.kind), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['old','new'].filter(k=>d[k]!=null), (side) => {
                                                  return (_openBlock(), _createElementBlock("div", { class: _normalizeClass([side==='old'?'row-del':'row-add', "revision-line"]) }, [_createElementVNode("b", null, _toDisplayString(side==='old'?'−':'＋'), 1), _createElementVNode("span", null, [(d[side+'_parts'])
                                                    ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(d[side+'_parts'], (part) => {
                                                        return (_openBlock(), _createElementBlock("span", { class: _normalizeClass({'fragment-change':part[1]}) }, _toDisplayString(part[0]), 3))
                                                      }), 256))
                                                    : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createTextVNode(_toDisplayString(d[side]), 1)], 64))])], 2))
                                                }), 256))]))
                                              }), 256))]))
                                            }), 256))]))
                                          : (_openBlock(), _createElementBlock("div", _hoisted_281, [_createElementVNode("table", _hoisted_282, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_283, [_createTextVNode(_toDisplayString(d.category), 1), (d.field)
                                                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createTextVNode(" · " + _toDisplayString(d.field), 1)], 64))
                                                        : _createCommentVNode("", true)]))
                                                    : _createCommentVNode("", true),
                                                  (d.record_key)
                                                    ? (_openBlock(), _createElementBlock("small", _hoisted_284, _toDisplayString(d.record_key), 1))
                                                    : _createCommentVNode("", true)
                                                ]),
                                                _createElementVNode("td", _hoisted_285, [(d.old_type&&d.new_type&&d.old_type!==d.new_type)
                                                  ? (_openBlock(), _createElementBlock("small", _hoisted_286, _toDisplayString(d.old_type), 1))
                                                  : _createCommentVNode("", true), (d.old_parts)
                                                  ? (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(d.old_parts, (part, index) => {
                                                      return (_openBlock(), _createElementBlock("span", {
                                                        key: index,
                                                        class: _normalizeClass({'text-change':part[1]})
                                                      }, _toDisplayString(part[0]), 3))
                                                    }), 128))
                                                  : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_createTextVNode(_toDisplayString(d.old===null?'—':d.old), 1)], 64))]),
                                                _createElementVNode("td", _hoisted_287, [(d.old_type&&d.new_type&&d.old_type!==d.new_type)
                                                  ? (_openBlock(), _createElementBlock("small", _hoisted_288, _toDisplayString(d.new_type), 1))
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
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_289, [_createElementVNode("b", null, _toDisplayString(diff.error||(diffFiltered?'当前筛选没有匹配项':'两个版本没有可列出的结构化差异')), 1), _cache[114] || (_cache[114] = _createElementVNode("small", null, "可在下方核对版本属性。", -1))]))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_290, [_createElementVNode("span", null, [_createTextVNode("共 " + _toDisplayString(diff.total) + " 项　", 1), _withDirectives(_createElementVNode("select", {
                                        "aria-label": "差异每页条数",
                                        "onUpdate:modelValue": $event => ((diffSize) = $event),
                                        onChange: $event => {dp=1;loadDiff()}
                                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([20,40,80,100], (n) => {
                                        return (_openBlock(), _createElementBlock("option", { value: n }, "每页 " + _toDisplayString(n) + " 项", 9, _hoisted_292))
                                      }), 256))], 40, _hoisted_291), [[
                                        _vModelSelect,
                                        diffSize,
                                        void 0,
                                        { number: true }
                                      ]])]), _createElementVNode("div", null, [_createElementVNode("button", {
                                        class: "btn",
                                        disabled: dp===1,
                                        onClick: $event => {dp--;loadDiff()}
                                      }, "上一页", 8, _hoisted_293), _createTextVNode(" " + _toDisplayString(dp) + " ", 1), _createElementVNode("button", {
                                        class: "btn",
                                        disabled: dp*diff.size>=diff.total,
                                        onClick: $event => {dp++;loadDiff()}
                                      }, "下一页", 8, _hoisted_294)])])
                                    ], 64)),
                                _createElementVNode("button", {
                                  class: "textbtn",
                                  onClick: $event => (editReview(versions.find(v=>v.id===right)))
                                }, "登记新侧版本 V" + _toDisplayString(diff.new_number) + " 的复核结论", 9, _hoisted_295),
                                _createElementVNode("details", null, [_cache[115] || (_cache[115] = _createElementVNode("summary", null, "文件大小与 SHA-256", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(versions.filter(v=>v.id===left||v.id===right), (v) => {
                                  return (_openBlock(), _createElementBlock("p", _hoisted_296, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(bytes(v.size)) + " · " + _toDisplayString(v.sha), 1))
                                }), 256))])
                              ], 64))
                            : (_openBlock(), _createElementBlock("p", _hoisted_297, _toDisplayString(diffLoading?'正在比较版本…':left===right?'请选择两个不同的历史版本进行对比。':'暂时无法显示对比结果。'), 1))]))], 64))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='复核工作台')
                ? (_openBlock(), _createElementBlock("section", _hoisted_298, [
                    _createElementVNode("div", _hoisted_299, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['',...reviewStates], (state) => {
                      return (_openBlock(), _createElementBlock("button", {
                        "aria-pressed": reviewFilter.state===state,
                        onClick: $event => {reviewFilter.state=state;loadReview(true)}
                      }, [_createTextVNode(_toDisplayString(state||'全部') + " ", 1), _createElementVNode("b", null, _toDisplayString(state?reviews.counts[state]||0:Object.values(reviews.counts).reduce((a,b)=>a+b,0)), 1)], 8, _hoisted_300))
                    }), 256))]),
                    _createElementVNode("div", _hoisted_301, [
                      _withDirectives(_createElementVNode("input", {
                        "onUpdate:modelValue": $event => ((reviewFilter.q) = $event),
                        "aria-label": "搜索复核记录",
                        onInput: scheduleReview,
                        onKeyup: _withKeys($event => (loadReview(true)), ["enter"]),
                        placeholder: "文件名、复核备注或失败原因"
                      }, null, 40, _hoisted_302), [[_vModelText, reviewFilter.q]]),
                      _createElementVNode("button", {
                        class: "btn",
                        onClick: $event => (loadReview(true))
                      }, "查询", 8, _hoisted_303),
                      _createElementVNode("button", {
                        class: "btn",
                        onClick: $event => {reviewFilter=freshReviewForm();loadReview(true)}
                      }, "清除条件", 8, _hoisted_304),
                      _createElementVNode("button", {
                        class: "btn",
                        disabled: reviewBusy||!reviews.total,
                        onClick: exportReviews
                      }, "导出复核清单", 8, _hoisted_305)
                    ]),
                    _createElementVNode("details", _hoisted_306, [_cache[128] || (_cache[128] = _createElementVNode("summary", null, "复核范围与排序", -1)), _createElementVNode("div", _hoisted_307, [
                      _createElementVNode("label", null, [_cache[117] || (_cache[117] = _createTextVNode("目录")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.root) = $event),
                        onChange: $event => (loadReview(true))
                      }, [_cache[116] || (_cache[116] = _createElementVNode("option", { value: "" }, "全部目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                        return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(base(r.path)), 9, _hoisted_309))
                      }), 256))], 40, _hoisted_308), [[_vModelSelect, reviewFilter.root]])]),
                      _createElementVNode("label", null, [_cache[118] || (_cache[118] = _createTextVNode("文件类型")), _withDirectives(_createElementVNode("input", {
                        "onUpdate:modelValue": $event => ((reviewFilter.ext) = $event),
                        onChange: $event => (loadReview(true)),
                        placeholder: "例如 xlsx"
                      }, null, 40, _hoisted_310), [[_vModelText, reviewFilter.ext]])]),
                      _createElementVNode("label", null, [_cache[120] || (_cache[120] = _createTextVNode("解析状态")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.status) = $event),
                        onChange: $event => (loadReview(true))
                      }, [_cache[119] || (_cache[119] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(parseStates, (n) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(n), 1))
                      }), 256))], 40, _hoisted_311), [[_vModelSelect, reviewFilter.status]])]),
                      _createElementVNode("label", null, [_cache[121] || (_cache[121] = _createTextVNode("起始日")), _withDirectives(_createElementVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": $event => ((reviewFilter.start) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_312), [[_vModelText, reviewFilter.start]])]),
                      _createElementVNode("label", null, [_cache[122] || (_cache[122] = _createTextVNode("结束日")), _withDirectives(_createElementVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": $event => ((reviewFilter.end) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_313), [[_vModelText, reviewFilter.end]])]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.baseline) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_314), [[_vModelCheckbox, reviewFilter.baseline]]), _cache[123] || (_cache[123] = _createTextVNode("包含初始快照"))]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.latest) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_315), [[_vModelCheckbox, reviewFilter.latest]]), _cache[124] || (_cache[124] = _createTextVNode("仅文件最新版"))]),
                      _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((reviewFilter.starred) = $event),
                        onChange: $event => (loadReview(true))
                      }, null, 40, _hoisted_316), [[_vModelCheckbox, reviewFilter.starred]]), _cache[125] || (_cache[125] = _createTextVNode("仅关注文件"))]),
                      _createElementVNode("label", null, [_cache[127] || (_cache[127] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((reviewFilter.sort) = $event),
                        onChange: $event => (loadReview(true))
                      }, _cache[126] || (_cache[126] = [
                        _createElementVNode("option", { value: "" }, "最近保存", -1),
                        _createElementVNode("option", { value: "oldest" }, "最早保存", -1),
                        _createElementVNode("option", { value: "changes" }, "差异最多", -1),
                        _createElementVNode("option", { value: "reviewed" }, "最近复核", -1)
                      ]), 40, _hoisted_317), [[_vModelSelect, reviewFilter.sort]])])
                    ])]),
                    _createElementVNode("div", _hoisted_318, [_createElementVNode("table", null, [_cache[129] || (_cache[129] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                      _createElementVNode("th", null, "文件与版本"),
                      _createElementVNode("th", null, "保存时间"),
                      _createElementVNode("th", null, "解析结果"),
                      _createElementVNode("th", null, "复核结论"),
                      _createElementVNode("th", null, "操作")
                    ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviews.items, (v) => {
                      return (_openBlock(), _createElementBlock("tr", { key: v.id }, [
                        _createElementVNode("td", null, [_createElementVNode("b", null, _toDisplayString(base(v.rel)) + " · V" + _toDisplayString(v.num), 1), _createElementVNode("small", null, _toDisplayString(parent(v.root,v.rel)), 1)]),
                        _createElementVNode("td", null, _toDisplayString(fmt(v.stamp)), 1),
                        _createElementVNode("td", null, [_createTextVNode(_toDisplayString(v.status), 1), (v.status==='已解析')
                          ? (_openBlock(), _createElementBlock("small", _hoisted_319, _toDisplayString(v.changes) + " 项差异", 1))
                          : _createCommentVNode("", true), (v.error)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_320, _toDisplayString(v.error), 1))
                          : _createCommentVNode("", true)]),
                        _createElementVNode("td", null, [_createElementVNode("span", { class: _normalizeClass(["tag", v.review==='已复核'?'green':v.review==='需跟进'?'amber':'neutral']) }, _toDisplayString(v.review), 3), _createElementVNode("small", _hoisted_321, _toDisplayString(v.note), 1), (v.reviewed_at)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_322, _toDisplayString(fmt(v.reviewed_at)), 1))
                          : _createCommentVNode("", true)]),
                        _createElementVNode("td", null, [_createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (openReviewVersion(v))
                        }, _toDisplayString(v.parent_id?'查看差异':'查看初版'), 9, _hoisted_323), _createElementVNode("button", {
                          class: "textbtn",
                          onClick: $event => (editReview(v))
                        }, "登记复核", 8, _hoisted_324), (!demo&&v.status==='解析失败')
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              class: "textbtn",
                              onClick: $event => (perform('retry',{id:v.id}).then(()=>loadReview()))
                            }, "重试此版本", 8, _hoisted_325))
                          : _createCommentVNode("", true)])
                      ]))
                    }), 128))])])]),
                    (!reviews.items.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_326, _toDisplayString(reviewBusy?'正在读取…':'当前范围没有复核记录'), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_327, [_createElementVNode("span", null, "共 " + _toDisplayString(reviews.total) + " 个版本", 1), _createElementVNode("div", null, [_createElementVNode("button", {
                      class: "btn",
                      disabled: reviewBusy||reviews.page<=1,
                      onClick: $event => {reviewFilter.page--;loadReview()}
                    }, "上一页", 8, _hoisted_328), _createTextVNode(" " + _toDisplayString(reviews.page) + " / " + _toDisplayString(reviews.pages) + " ", 1), _createElementVNode("button", {
                      class: "btn",
                      disabled: reviewBusy||reviews.page>=reviews.pages,
                      onClick: $event => {reviewFilter.page++;loadReview()}
                    }, "下一页", 8, _hoisted_329)])])
                  ]))
                : _createCommentVNode("", true),
              (page==='差异检索')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("section", _hoisted_330, [_createElementVNode("form", { onSubmit: _withModifiers($event => (findChanges()), ["prevent"]) }, [_createElementVNode("div", _hoisted_332, [
                    _createElementVNode("label", null, [_cache[130] || (_cache[130] = _createTextVNode("检索内容")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.q) = $event),
                      maxlength: "512",
                      placeholder: "例如物料编号、库存或旧值"
                    }, null, 8, _hoisted_333), [[_vModelText, findForm.q]])]),
                    _createElementVNode("label", null, [_cache[132] || (_cache[132] = _createTextVNode("查找范围")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.side) = $event) }, _cache[131] || (_cache[131] = [
                      _createElementVNode("option", { value: "" }, "全部位置与值", -1),
                      _createElementVNode("option", { value: "old_value" }, "仅旧值", -1),
                      _createElementVNode("option", { value: "new_value" }, "仅新值", -1),
                      _createElementVNode("option", { value: "location" }, "仅位置", -1)
                    ]), 8, _hoisted_334), [[_vModelSelect, findForm.side]])]),
                    _createElementVNode("label", null, [_cache[134] || (_cache[134] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.root) = $event) }, [_cache[133] || (_cache[133] = _createElementVNode("option", { value: "" }, "所有目录", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_336))
                    }), 256))], 8, _hoisted_335), [[_vModelSelect, findForm.root]])]),
                    _createElementVNode("label", null, [_cache[135] || (_cache[135] = _createTextVNode("事件路径")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.filename) = $event),
                      placeholder: "文件名或路径片段"
                    }, null, 8, _hoisted_337), [[_vModelText, findForm.filename]])]),
                    _createElementVNode("label", null, [_cache[136] || (_cache[136] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((findForm.ext) = $event),
                      placeholder: "xlsx, csv"
                    }, null, 8, _hoisted_338), [[_vModelText, findForm.ext]])]),
                    _createElementVNode("label", null, [_cache[138] || (_cache[138] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.kind) = $event) }, [_cache[137] || (_cache[137] = _createElementVNode("option", { value: "" }, "全部类型", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (k) => {
                      return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                    }), 256))], 8, _hoisted_339), [[_vModelSelect, findForm.kind]])]),
                    _createElementVNode("label", null, [_cache[140] || (_cache[140] = _createTextVNode("数值方向")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.direction) = $event) }, _cache[139] || (_cache[139] = [
                      _createElementVNode("option", { value: "" }, "全部", -1),
                      _createElementVNode("option", { value: "up" }, "数值上升", -1),
                      _createElementVNode("option", { value: "down" }, "数值下降", -1),
                      _createElementVNode("option", { value: "same" }, "数值等值", -1)
                    ]), 8, _hoisted_340), [[_vModelSelect, findForm.direction]])])
                  ]), _createElementVNode("details", null, [_cache[149] || (_cache[149] = _createElementVNode("summary", null, "更多查询条件", -1)), _createElementVNode("div", _hoisted_341, [
                    _createElementVNode("label", null, [_cache[141] || (_cache[141] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.sheet) = $event) }, null, 8, _hoisted_342), [[_vModelText, findForm.sheet]])]),
                    _createElementVNode("label", null, [_cache[142] || (_cache[142] = _createTextVNode("字段名")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.field) = $event) }, null, 8, _hoisted_343), [[_vModelText, findForm.field]])]),
                    _createElementVNode("label", null, [_cache[143] || (_cache[143] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((findForm.record) = $event) }, null, 8, _hoisted_344), [[_vModelText, findForm.record]])]),
                    _createElementVNode("label", null, [_cache[144] || (_cache[144] = _createTextVNode("开始日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((findForm.start) = $event)
                    }, null, 8, _hoisted_345), [[_vModelText, findForm.start]])]),
                    _createElementVNode("label", null, [_cache[145] || (_cache[145] = _createTextVNode("结束日期")), _withDirectives(_createElementVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": $event => ((findForm.end) = $event)
                    }, null, 8, _hoisted_346), [[_vModelText, findForm.end]])]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.exact) = $event)
                    }, null, 8, _hoisted_347), [[_vModelCheckbox, findForm.exact]]), _cache[146] || (_cache[146] = _createTextVNode("整项匹配"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.sensitive) = $event)
                    }, null, 8, _hoisted_348), [[_vModelCheckbox, findForm.sensitive]]), _cache[147] || (_cache[147] = _createTextVNode("区分大小写"))]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((findForm.starred) = $event)
                    }, null, 8, _hoisted_349), [[_vModelCheckbox, findForm.starred]]), _cache[148] || (_cache[148] = _createTextVNode("仅关注文件"))])
                  ])]), _createElementVNode("div", _hoisted_350, [_createElementVNode("label", null, [_cache[151] || (_cache[151] = _createTextVNode("结果排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((findForm.sort) = $event) }, _cache[150] || (_cache[150] = [_createElementVNode("option", { value: "" }, "最近优先", -1), _createElementVNode("option", { value: "oldest" }, "最早优先", -1), _createElementVNode("option", { value: "path" }, "事件路径", -1)]), 8, _hoisted_351), [[_vModelSelect, findForm.sort]])]), _createElementVNode("button", {
                    class: "primary",
                    disabled: finderBusy
                  }, "查询差异", 8, _hoisted_352), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => {findForm=freshFind();presetId=0;findChanges()}
                  }, "清空条件", 8, _hoisted_353)])], 40, _hoisted_331), _createElementVNode("details", null, [_cache[154] || (_cache[154] = _createElementVNode("summary", null, "保存或使用查询条件", -1)), _createElementVNode("div", _hoisted_354, [
                    _createElementVNode("label", null, [_cache[152] || (_cache[152] = _createTextVNode("组合名称")), _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": $event => ((presetName) = $event),
                      maxlength: "60"
                    }, null, 8, _hoisted_355), [[_vModelText, presetName]])]),
                    _createElementVNode("button", {
                      class: "btn",
                      disabled: !presetName.trim(),
                      onClick: savePreset
                    }, "保存条件", 8, _hoisted_356),
                    _createElementVNode("label", null, [_cache[153] || (_cache[153] = _createTextVNode("已保存组合")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((presetId) = $event),
                      onChange: applyPreset
                    }, [_createElementVNode("option", { value: 0 }, "自定义", 8, _hoisted_358), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(presets, (p) => {
                      return (_openBlock(), _createElementBlock("option", { value: p.id }, _toDisplayString(p.name), 9, _hoisted_359))
                    }), 256))], 40, _hoisted_357), [[
                      _vModelSelect,
                      presetId,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("button", {
                      class: "textbtn",
                      disabled: !presetId,
                      onClick: forgetPreset
                    }, "移除组合", 8, _hoisted_360)
                  ])])]), _createElementVNode("section", _hoisted_361, [finderBusy
                    ? (_openBlock(), _createElementBlock("p", _hoisted_362, "正在查询已解析差异…"))
                    : _createCommentVNode("", true), found
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                        _createElementVNode("div", _hoisted_363, [_createElementVNode("h2", null, _toDisplayString(found.total) + " 项差异", 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: !found.total,
                          onClick: exportFinder
                        }, "导出查询结果", 8, _hoisted_364)]),
                        _createElementVNode("p", null, _toDisplayString(found.files) + " 个文件 · " + _toDisplayString(found.events) + " 条变更事件", 1),
                        _createElementVNode("div", _hoisted_365, [_createElementVNode("table", null, [_cache[155] || (_cache[155] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                            _createElementVNode("td", _hoisted_366, _toDisplayString(r.old_value??'—') + _toDisplayString(r.old_value_truncated?'…':''), 1),
                            _createElementVNode("td", _hoisted_367, _toDisplayString(r.new_value??'—') + _toDisplayString(r.new_value_truncated?'…':''), 1),
                            _createElementVNode("td", null, [_createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (openFound(r))
                            }, "核对原差异", 8, _hoisted_368)])
                          ]))
                        }), 128))])])]),
                        (!found.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_369, "没有匹配的可见差异。"))
                          : _createCommentVNode("", true),
                        _createElementVNode("div", _hoisted_370, [_createElementVNode("button", {
                          class: "btn",
                          disabled: found.page===1,
                          onClick: $event => (findChanges(found.page-1,findApplied))
                        }, "上一页", 8, _hoisted_371), _createElementVNode("span", null, _toDisplayString(found.page) + " / " + _toDisplayString(found.pages), 1), _createElementVNode("button", {
                          class: "btn",
                          disabled: found.page===found.pages,
                          onClick: $event => (findChanges(found.page+1,findApplied))
                        }, "下一页", 8, _hoisted_372)])
                      ], 64))
                    : _createCommentVNode("", true)])], 64))
                : _createCommentVNode("", true),
              (page==='目录清单')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [_createElementVNode("section", _hoisted_373, [
                    _cache[160] || (_cache[160] = _createElementVNode("h2", null, "保存与选择清单", -1)),
                    _createElementVNode("button", {
                      class: "btn",
                      disabled: !cpNew,
                      onClick: inventoryDialog
                    }, "查看目标清单成员与交付", 8, _hoisted_374),
                    _createElementVNode("label", null, [_cache[156] || (_cache[156] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpRoot) = $event),
                      onChange: $event => {cpLabel='';loadCheckpoints()}
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                      return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_376))
                    }), 256))], 40, _hoisted_375), [[
                      _vModelSelect,
                      cpRoot,
                      void 0,
                      { number: true }
                    ]])]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_377, [_createElementVNode("label", null, [_cache[157] || (_cache[157] = _createTextVNode("新清单名称")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((cpLabel) = $event),
                          maxlength: "80",
                          placeholder: "例如 月末交接前"
                        }, null, 8, _hoisted_378), [[_vModelText, cpLabel]])]), _createElementVNode("button", {
                          class: "btn",
                          onClick: saveCheckpoint,
                          disabled: !cpRoot||!cpLabel.trim()||cpBusy
                        }, "保存当前在册清单", 8, _hoisted_379)]))
                      : _createCommentVNode("", true),
                    (checkpoints.length<2)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_380, "至少需要同一目录的两份清单才能对照。"))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_381, [_createElementVNode("label", null, [_cache[158] || (_cache[158] = _createTextVNode("原清单")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpOld) = $event),
                      onChange: $event => (loadCheckpointDiff())
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints, (c) => {
                      return (_openBlock(), _createElementBlock("option", { value: c.id }, _toDisplayString(c.label) + " · " + _toDisplayString(c.files) + " 个文件", 9, _hoisted_383))
                    }), 256))], 40, _hoisted_382), [[
                      _vModelSelect,
                      cpOld,
                      void 0,
                      { number: true }
                    ]])]), _createElementVNode("button", {
                      class: "btn",
                      disabled: !cpOld||!cpNew||cpOld===cpNew,
                      onClick: $event => {[cpOld,cpNew]=[cpNew,cpOld];loadCheckpointDiff()}
                    }, "交换", 8, _hoisted_384), _createElementVNode("label", null, [_cache[159] || (_cache[159] = _createTextVNode("目标清单")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((cpNew) = $event),
                      onChange: $event => (loadCheckpointDiff())
                    }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints, (c) => {
                      return (_openBlock(), _createElementBlock("option", { value: c.id }, _toDisplayString(c.label) + " · " + _toDisplayString(c.files) + " 个文件", 9, _hoisted_386))
                    }), 256))], 40, _hoisted_385), [[
                      _vModelSelect,
                      cpNew,
                      void 0,
                      { number: true }
                    ]])])]),
                    (cpOld&&cpOld===cpNew)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_387, "请选择两份不同清单。"))
                      : _createCommentVNode("", true),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(checkpoints.filter(x=>x.id===cpOld||x.id===cpNew), (c) => {
                      return (_openBlock(), _createElementBlock("small", null, _toDisplayString(c.label) + " · 扫描 " + _toDisplayString(fmt(c.last_scan)) + " · " + _toDisplayString(bytes(c.bytes)) + "　", 1))
                    }), 256))
                  ]), (cpOld&&cpNew&&cpOld!==cpNew)
                    ? (_openBlock(), _createElementBlock("section", _hoisted_388, [_createElementVNode("div", _hoisted_389, [
                        _createElementVNode("label", null, [_cache[161] || (_cache[161] = _createTextVNode("路径关键词")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((cpQ) = $event),
                          onInput: $event => (loadCheckpointDiff()),
                          placeholder: "原路径或现路径"
                        }, null, 40, _hoisted_390), [[_vModelText, cpQ]])]),
                        _createElementVNode("label", null, [_cache[163] || (_cache[163] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((cpKind) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, [_cache[162] || (_cache[162] = _createElementVNode("option", { value: "" }, "全部变化", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','移出','内容修改','路径变更','路径与内容变更','相同'], (k) => {
                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                        }), 256))], 40, _hoisted_391), [[_vModelSelect, cpKind]])]),
                        _createElementVNode("label", null, [_cache[165] || (_cache[165] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((cpSort) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, _cache[164] || (_cache[164] = [
                          _createElementVNode("option", { value: "" }, "按路径", -1),
                          _createElementVNode("option", { value: "growth" }, "增长最多", -1),
                          _createElementVNode("option", { value: "shrink" }, "减少最多", -1),
                          _createElementVNode("option", { value: "change" }, "体积变化最大", -1)
                        ]), 40, _hoisted_392), [[_vModelSelect, cpSort]])]),
                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((cpSame) = $event),
                          onChange: $event => (loadCheckpointDiff())
                        }, null, 40, _hoisted_393), [[_vModelCheckbox, cpSame]]), _cache[166] || (_cache[166] = _createTextVNode("包括相同项"))]),
                        _createElementVNode("button", {
                          class: "btn",
                          disabled: !cpData?.total,
                          onClick: exportCheckpoints
                        }, "导出对照 CSV", 8, _hoisted_394)
                      ]), cpBusy
                        ? (_openBlock(), _createElementBlock("p", _hoisted_395, "正在读取清单…"))
                        : _createCommentVNode("", true), cpData
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createElementVNode("p", null, "匹配 " + _toDisplayString(cpData.total) + " 项 · 净变化 " + _toDisplayString(cpData.delta) + " 字节", 1),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cpData.counts, (count, kind) => {
                              return (_openBlock(), _createElementBlock("small", null, _toDisplayString(kind) + " " + _toDisplayString(count) + "　", 1))
                            }), 256)),
                            _createElementVNode("div", _hoisted_396, [_createElementVNode("table", null, [_cache[167] || (_cache[167] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                                }, _toDisplayString(r.old&&r.new&&r.old!==r.new?'对比版本':'版本历史'), 9, _hoisted_397)])
                              ]))
                            }), 128))])])]),
                            (!cpData.total)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_398, "没有符合条件的文件。"))
                              : _createCommentVNode("", true),
                            _createElementVNode("div", _hoisted_399, [_createElementVNode("button", {
                              class: "btn",
                              disabled: cpPage<=1,
                              onClick: $event => (loadCheckpointDiff(cpPage-1))
                            }, "上一页", 8, _hoisted_400), _createElementVNode("span", null, "第 " + _toDisplayString(cpPage) + " 页", 1), _createElementVNode("button", {
                              class: "btn",
                              disabled: cpPage*cpData.size>=cpData.total,
                              onClick: $event => (loadCheckpointDiff(cpPage+1))
                            }, "下一页", 8, _hoisted_401)])
                          ], 64))
                        : _createCommentVNode("", true)]))
                    : _createCommentVNode("", true)], 64))
                : _createCommentVNode("", true),
              (page==='系统设置')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 6 }, [_createElementVNode("section", _hoisted_402, [_cache[168] || (_cache[168] = _createElementVNode("h2", null, "后台引擎状态", -1)), _createElementVNode("div", null, [_createElementVNode("label", null, _toDisplayString(demo?'示例进程':'当前进程') + " " + _toDisplayString(runtime?.pid||'—'), 1), _createElementVNode("button", {
                    class: "btn",
                    onClick: loadRuntime
                  }, "刷新状态", 8, _hoisted_403)]), runtime
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        _createElementVNode("p", null, "启动 " + _toDisplayString(fmt(runtime.started)) + " · 已运行 " + _toDisplayString(runtime.uptime) + " 秒 · " + _toDisplayString(runtime.watch), 1),
                        _createElementVNode("p", null, [_createTextVNode("待扫描目录 " + _toDisplayString(runtime.queued) + " · 待解析版本 " + _toDisplayString(runtime.parsing) + " · 等待文件 " + _toDisplayString(runtime.waiting), 1), (runtime.due_in!==null)
                          ? (_openBlock(), _createElementBlock("span", _hoisted_404, " · 最早任务约 " + _toDisplayString(runtime.due_in) + " 秒后到期", 1))
                          : _createCommentVNode("", true)]),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(runtime.beats, (stamp, name) => {
                          return (_openBlock(), _createElementBlock("p", null, _toDisplayString(name) + "最近活动 · " + _toDisplayString(fmt(stamp)), 1))
                        }), 256)),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(runtime.faults, (stamp, name) => {
                          return (_openBlock(), _createElementBlock("p", _hoisted_405, _toDisplayString(name) + " · " + _toDisplayString(fmt(stamp)), 1))
                        }), 256))
                      ], 64))
                    : _createCommentVNode("", true)]), _createElementVNode("section", _hoisted_406, [
                    _cache[174] || (_cache[174] = _createElementVNode("h2", null, "监控与外观", -1)),
                    _createElementVNode("div", null, [_cache[169] || (_cache[169] = _createElementVNode("label", null, [_createTextVNode("周期校对间隔"), _createElementVNode("small", null, "重新检查目录并核对文件内容")], -1)), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((prefs.interval) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,15,30,60,300,900,3600], (n) => {
                      return (_openBlock(), _createElementBlock("option", { value: n }, _toDisplayString(n<60?n+' 秒':n/60+' 分钟'), 9, _hoisted_408))
                    }), 256))], 8, _hoisted_407), [[
                      _vModelSelect,
                      prefs.interval,
                      void 0,
                      { number: true }
                    ]])]),
                    _createElementVNode("div", null, [_cache[171] || (_cache[171] = _createElementVNode("label", null, "界面主题", -1)), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((prefs.theme) = $event) }, _cache[170] || (_cache[170] = [_createElementVNode("option", null, "浅色", -1), _createElementVNode("option", null, "深色", -1)]), 8, _hoisted_409), [[_vModelSelect, prefs.theme]])]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_410, [_cache[172] || (_cache[172] = _createElementVNode("label", null, "登录 Windows 后后台启动", -1)), _withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((prefs.autostart) = $event)
                        }, null, 8, _hoisted_411), [[_vModelCheckbox, prefs.autostart]])]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_cache[173] || (_cache[173] = _createElementVNode("span", null, null, -1)), _createElementVNode("button", {
                      class: "primary",
                      onClick: savePrefs
                    }, "保存设置", 8, _hoisted_412)])
                  ]), _createElementVNode("section", _hoisted_413, [
                    _cache[183] || (_cache[183] = _createElementVNode("h2", null, "存储与维护", -1)),
                    _createElementVNode("div", _hoisted_414, [_createElementVNode("button", {
                      class: "btn",
                      onClick: healthDialog
                    }, "仓库体检报告", 8, _hoisted_415), _createElementVNode("button", {
                      class: "btn",
                      onClick: $event => (deliveryDialog())
                    }, "核查交付包", 8, _hoisted_416), demo
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          class: "btn",
                          onClick: inspectDialog
                        }, "示例备份覆盖情况", 8, _hoisted_417))
                      : _createCommentVNode("", true)]),
                    _createElementVNode("div", null, [_cache[175] || (_cache[175] = _createElementVNode("label", null, [_createTextVNode("仓库用量"), _createElementVNode("small", null, "按快照大小计算，重复内容只存一份。")], -1)), _createElementVNode("button", {
                      class: "btn",
                      onClick: loadStorage
                    }, "计算用量", 8, _hoisted_418)]),
                    storageData
                      ? (_openBlock(), _createElementBlock("section", _hoisted_419, [
                          _createElementVNode("p", null, "历史版本合计 " + _toDisplayString(bytes(storageData.logical)) + " · 唯一对象 " + _toDisplayString(bytes(storageData.unique)) + " · 去重节省 " + _toDisplayString(bytes(storageData.saved)), 1),
                          _createElementVNode("p", null, "数据库与日志 " + _toDisplayString(bytes(storageData.database)) + " · 所在磁盘可用 " + _toDisplayString(bytes(storageData.free)), 1),
                          _createElementVNode("details", null, [_cache[176] || (_cache[176] = _createElementVNode("summary", null, "各目录历史用量", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(storageData.by_root, (r) => {
                            return (_openBlock(), _createElementBlock("p", null, _toDisplayString(r.root) + " · " + _toDisplayString(r.versions) + " 版 · " + _toDisplayString(bytes(r.bytes)), 1))
                          }), 256))]),
                          _createElementVNode("details", null, [_cache[177] || (_cache[177] = _createElementVNode("summary", null, "历史体积最大的文件", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(storageData.largest, (r) => {
                            return (_openBlock(), _createElementBlock("p", null, [_createElementVNode("button", {
                              class: "textbtn",
                              onClick: $event => (selectFile(r))
                            }, _toDisplayString(r.rel), 9, _hoisted_420), _createTextVNode(" · " + _toDisplayString(r.versions) + " 版 · " + _toDisplayString(bytes(r.bytes)), 1)]))
                          }), 256))])
                        ]))
                      : _createCommentVNode("", true),
                    native
                      ? (_openBlock(), _createElementBlock("div", _hoisted_421, _cache[178] || (_cache[178] = [_createElementVNode("label", null, [_createTextVNode("后台监控"), _createElementVNode("small", null, "点窗口 × 收到托盘。左键托盘图标打开工作台，右键「退出监控」停止引擎。")], -1)])))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_createElementVNode("label", null, [_cache[179] || (_cache[179] = _createTextVNode("版本仓库")), _createElementVNode("small", null, _toDisplayString(s.home), 1)]), _createElementVNode("span", null, _toDisplayString(num(s.objects)) + " 个对象", 1)]),
                    (s.recovery)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_422, [_cache[180] || (_cache[180] = _createElementVNode("label", null, [_createTextVNode("待核对的恢复任务"), _createElementVNode("small", null, "正在等待目录上线或文件可读")], -1)), (!demo)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              class: "btn",
                              onClick: $event => (perform('retry_recovery',{}))
                            }, "重新核对（" + _toDisplayString(s.recovery) + "）", 9, _hoisted_423))
                          : _createCommentVNode("", true)]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", null, [_cache[181] || (_cache[181] = _createElementVNode("label", null, [_createTextVNode("解析失败"), _createElementVNode("small", null, "失败文件的历史原件仍然保留")], -1)), (!demo&&s.failures)
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          class: "btn",
                          onClick: $event => (perform('retry',{},'已重新安排解析'))
                        }, "重新解析", 8, _hoisted_424))
                      : (_openBlock(), _createElementBlock("span", _hoisted_425, _toDisplayString(s.failures) + " 项", 1))]),
                    (!demo)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_426, [_cache[182] || (_cache[182] = _createElementVNode("label", null, "备份与完整性", -1)), _createElementVNode("span", _hoisted_427, [_createElementVNode("button", {
                          class: "btn",
                          onClick: $event => (perform('verify',{}))
                        }, "校验仓库", 8, _hoisted_428), _createElementVNode("button", {
                          class: "btn",
                          onClick: inspectDialog
                        }, "核查已有备份", 8, _hoisted_429), _createElementVNode("button", {
                          class: "btn",
                          onClick: $event => (backupDialog())
                        }, "创建备份", 8, _hoisted_430)])]))
                      : _createCommentVNode("", true)
                  ])], 64))
                : _createCommentVNode("", true)
            ], 64))]),
        _createElementVNode("footer", _hoisted_431, [_createElementVNode("span", null, [_cache[184] || (_cache[184] = _createElementVNode("i", null, null, -1)), _createTextVNode(_toDisplayString(demo?'示例数据':s.watch), 1)]), _cache[185] || (_cache[185] = _createElementVNode("span", null, "FileGuard · 1.14.0", -1))])
      ]),
      dialog
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "mask",
            onClick: _withModifiers($event => (!busy&&(dialog=null)), ["self"])
          }, [_createElementVNode("section", {
            class: _normalizeClass(["modal", {'wide-review':['ledger','receipt','period','trace','variance','inventory','health','delivery_result','restore_preview'].includes(dialog.type)}]),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": dialog.title
          }, [_createElementVNode("div", _hoisted_434, [_createElementVNode("h2", null, _toDisplayString(dialog.title), 1), _createElementVNode("button", {
            class: "iconbtn",
            "aria-label": "关闭",
            disabled: busy,
            onClick: $event => (dialog=null)
          }, [_createVNode(_component_ico, { n: "x" })], 8, _hoisted_435)]), _createElementVNode("form", { onSubmit: _withModifiers(submitDialog, ["prevent"]) }, [
            (dialog.type==='review')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[186] || (_cache[186] = _createTextVNode("结论")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.state) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reviewStates, (v) => {
                  return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                }), 256))], 8, _hoisted_437), [[_vModelSelect, dialog.state]])]), _createElementVNode("label", null, [_cache[187] || (_cache[187] = _createTextVNode("复核备注")), _withDirectives(_createElementVNode("textarea", {
                  "onUpdate:modelValue": $event => ((dialog.note) = $event),
                  rows: "4",
                  maxlength: "2000",
                  required: dialog.state==='需跟进'
                }, null, 8, _hoisted_438), [[_vModelText, dialog.note]])]), _createElementVNode("small", null, _toDisplayString(dialog.note.length) + " / 2000", 1)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='private_records')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                  (!demo)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_439, [_cache[188] || (_cache[188] = _createTextVNode("记录管理口令")), _withDirectives(_createElementVNode("input", {
                        type: "password",
                        autocomplete: "off",
                        "onUpdate:modelValue": $event => ((dialog.password) = $event),
                        onKeydown: _withKeys(_withModifiers($event => (loadPrivate()), ["prevent"]), ["enter"])
                      }, null, 40, _hoisted_440), [[_vModelText, dialog.password]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadPrivate())
                  }, "查看已移出记录", 8, _hoisted_441),
                  (dialog.entries&&!dialog.entries.length)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_442, "没有已移出的记录。"))
                    : _createCommentVNode("", true),
                  _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.entries, (r) => {
                    return (_openBlock(), _createElementBlock("li", null, [_createElementVNode("button", {
                      type: "button",
                      class: "textbtn",
                      onClick: $event => (recordDialog(r))
                    }, "事件 #" + _toDisplayString(r.id) + " · " + _toDisplayString(fmt(r.stamp)) + " · 管理", 9, _hoisted_443)]))
                  }), 256))]),
                  (dialog.before)
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 2,
                        type: "button",
                        onClick: $event => (loadPrivate(true))
                      }, "验证并读取下一页", 8, _hoisted_444))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='admin')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                  _cache[193] || (_cache[193] = _createElementVNode("p", null, "“撤回”保留公开标记。“移出普通日志”将此事件从普通列表、首页活动和事件导出中移除。管理员可恢复展示。文件版本和管理审计单独保留。", -1)),
                  demo
                    ? (_openBlock(), _createElementBlock("p", _hoisted_445, "此处使用虚构记录演示，关闭预览后复位。"))
                    : _createCommentVNode("", true),
                  (!demo)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_446, [_cache[189] || (_cache[189] = _createTextVNode("管理口令")), _withDirectives(_createElementVNode("input", {
                        type: "password",
                        "onUpdate:modelValue": $event => ((dialog.password) = $event),
                        autocomplete: "off",
                        required: ""
                      }, null, 8, _hoisted_447), [[_vModelText, dialog.password]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "textbtn",
                    onClick: seeOriginal
                  }, "核查原始记录与处置历史", 8, _hoisted_448),
                  (dialog.info)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_449, [_createElementVNode("p", null, _toDisplayString(dialog.info.original.rel) + " · " + _toDisplayString(dialog.info.original.kind) + " · " + _toDisplayString(fmt(dialog.info.original.stamp)), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.info.changes, (h) => {
                        return (_openBlock(), _createElementBlock("p", null, [_createTextVNode(_toDisplayString(fmt(h.stamp)) + " · " + _toDisplayString(h.action) + " · " + _toDisplayString(h.reason), 1), (h.caption)
                          ? (_openBlock(), _createElementBlock("small", _hoisted_450, "更正说明：" + _toDisplayString(h.caption), 1))
                          : _createCommentVNode("", true)]))
                      }), 256))]))
                    : _createCommentVNode("", true),
                  _createElementVNode("label", null, [_cache[190] || (_cache[190] = _createTextVNode("操作")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.action) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.hidden?['恢复展示']:['更正','撤回','移出普通日志'], (a) => {
                    return (_openBlock(), _createElementBlock("option", null, _toDisplayString(a), 1))
                  }), 256))], 8, _hoisted_451), [[_vModelSelect, dialog.action]])]),
                  (dialog.action==='更正')
                    ? (_openBlock(), _createElementBlock("label", _hoisted_452, [_cache[191] || (_cache[191] = _createTextVNode("公开更正说明")), _withDirectives(_createElementVNode("textarea", {
                        "onUpdate:modelValue": $event => ((dialog.caption) = $event),
                        maxlength: "1000",
                        required: ""
                      }, null, 8, _hoisted_453), [[_vModelText, dialog.caption]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("label", null, [_cache[192] || (_cache[192] = _createTextVNode("操作原因（供管理员核查）")), _withDirectives(_createElementVNode("textarea", {
                    "onUpdate:modelValue": $event => ((dialog.reason) = $event),
                    maxlength: "1000",
                    required: ""
                  }, null, 8, _hoisted_454), [[_vModelText, dialog.reason]])]),
                  (!demo&&!s.record_admin_ready)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_455, "请仓库负责人先运行本机FileGuard-RecordAdmin.cmd 脚本。"))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='receipt')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [_createElementVNode("div", _hoisted_456, [
                  _createElementVNode("label", null, [_cache[195] || (_cache[195] = _createTextVNode("核对方式")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.mode) = $event),
                    onChange: $event => {dialog.auto=false;readReceipt()}
                  }, _cache[194] || (_cache[194] = [_createElementVNode("option", { value: "quick" }, "快速比大小", -1), _createElementVNode("option", { value: "full" }, "完整核对正文 SHA-256", -1)]), 40, _hoisted_457), [[_vModelSelect, dialog.mode]])]),
                  _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.verify) = $event),
                    onChange: $event => {dialog.auto=false;readReceipt()}
                  }, null, 40, _hoisted_458), [[_vModelCheckbox, dialog.verify]]), _cache[196] || (_cache[196] = _createTextVNode(" 同时校验在册历史副本"))]),
                  (!demo&&dialog.mode==='quick'&&!dialog.verify)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_459, [_withDirectives(_createElementVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": $event => ((dialog.auto) = $event),
                        onChange: $event => (readReceipt())
                      }, null, 40, _hoisted_460), [[_vModelCheckbox, dialog.auto]]), _cache[197] || (_cache[197] = _createTextVNode(" 每 5 秒刷新"))]))
                    : _createCommentVNode("", true),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: dialog.loading,
                    onClick: $event => (readReceipt())
                  }, "重新核对", 8, _hoisted_461)
                ]), (dialog.loading)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_462, "正在核对…"))
                  : _createCommentVNode("", true), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                      _createElementVNode("h3", null, [_createTextVNode(_toDisplayString(dialog.data.result), 1), (dialog.data.object_state.includes('损坏'))
                        ? (_openBlock(), _createElementBlock("span", _hoisted_463, " · 历史副本校验失败"))
                        : _createCommentVNode("", true)]),
                      _createElementVNode("p", null, _toDisplayString(dialog.data.root) + " / " + _toDisplayString(dialog.data.rel) + " · " + _toDisplayString(fmt(dialog.data.checked)) + _toDisplayString(demo?' · 示例现场':''), 1),
                      _createElementVNode("table", null, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [_cache[198] || (_cache[198] = _createElementVNode("th", null, "核对项", -1)), _cache[199] || (_cache[199] = _createElementVNode("th", null, "磁盘现场", -1)), _createElementVNode("th", null, "最新在册 V" + _toDisplayString(dialog.data.version), 1)])]), _createElementVNode("tbody", null, [_createElementVNode("tr", null, [_cache[200] || (_cache[200] = _createElementVNode("th", null, "字节", -1)), _createElementVNode("td", null, _toDisplayString(dialog.data.disk_size??'—'), 1), _createElementVNode("td", null, _toDisplayString(dialog.data.size), 1)]), _createElementVNode("tr", null, [_cache[201] || (_cache[201] = _createElementVNode("th", null, "时间", -1)), _createElementVNode("td", null, _toDisplayString(dialog.data.mtime?fmt(dialog.data.mtime):'—'), 1), _createElementVNode("td", null, _toDisplayString(fmt(dialog.data.stamp)), 1)]), _createElementVNode("tr", null, [_cache[202] || (_cache[202] = _createElementVNode("th", null, "SHA-256", -1)), _createElementVNode("td", _hoisted_464, _toDisplayString(dialog.data.disk_sha||'—'), 1), _createElementVNode("td", _hoisted_465, _toDisplayString(dialog.data.sha), 1)])])]),
                      _createElementVNode("p", null, [_createTextVNode("现场字节差 " + _toDisplayString(dialog.data.delta??'—') + " · 版本解析：" + _toDisplayString(dialog.data.parse) + " ", 1), (dialog.data.object_state)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_466, " · " + _toDisplayString(dialog.data.object_state), 1))
                        : _createCommentVNode("", true)]),
                      (dialog.mode==='full'&&dialog.data.disk_sha)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_467, [_createTextVNode("同一文件有 " + _toDisplayString(dialog.data.matches) + " 个版本匹配现场内容", 1), (dialog.data.matched_version)
                            ? (_openBlock(), _createElementBlock("span", _hoisted_468, "，最近匹配 V" + _toDisplayString(dialog.data.matched_version), 1))
                            : _createCommentVNode("", true), _cache[203] || (_cache[203] = _createTextVNode("。"))]))
                        : _createCommentVNode("", true),
                      _createElementVNode("p", null, "目录" + _toDisplayString(dialog.data.active?'启用':'未启用') + " · 文件" + _toDisplayString(dialog.data.tracked?'在监控范围':'已排除') + " · " + _toDisplayString(dialog.data.rule||'未检查现场规则') + " · 监听稳定等待 " + _toDisplayString(dialog.data.settle_ms) + " ms（" + _toDisplayString(dialog.data.all_types?'全部文件':'指定格式') + "）", 1),
                      _createElementVNode("p", null, "最近目录扫描 " + _toDisplayString(dialog.data.last_scan?fmt(dialog.data.last_scan):'尚无') + " · " + _toDisplayString(dialog.data.queued?'待执行：'+dialog.data.queued:'暂无排队扫描'), 1),
                      (dialog.data.root_error)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_469, _toDisplayString(dialog.data.root_error), 1))
                        : _createCommentVNode("", true),
                      (dialog.data.waiting)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_470, _toDisplayString(dialog.data.waiting.reason) + " · 已尝试 " + _toDisplayString(dialog.data.waiting.attempts) + " 次 · " + _toDisplayString(fmt(dialog.data.waiting.first_seen)) + " 至 " + _toDisplayString(fmt(dialog.data.waiting.last_seen)), 1))
                        : _createCommentVNode("", true),
                      _cache[204] || (_cache[204] = _createElementVNode("p", null, "编辑器中的草稿保存到磁盘后才能核对。", -1)),
                      (!demo)
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 3,
                            type: "button",
                            class: "btn",
                            disabled: !dialog.data.active||dialog.loading,
                            onClick: receiptScan
                          }, "请求扫描这个目录", 8, _hoisted_471))
                        : _createCommentVNode("", true)
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='ledger')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("div", _hoisted_472, [_createElementVNode("section", null, [
                  _cache[208] || (_cache[208] = _createElementVNode("h3", null, "左侧版本", -1)),
                  _createElementVNode("p", null, _toDisplayString(dialog.fileA?.rel), 1),
                  _createElementVNode("label", null, [_cache[205] || (_cache[205] = _createTextVNode("版本")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.a) = $event),
                    onChange: $event => {dialog.sheetA='';dialog.ha=1;ledgerLoad()}
                  }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.versionsA, (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)), 9, _hoisted_474))
                  }), 256))], 40, _hoisted_473), [[
                    _vModelSelect,
                    dialog.a,
                    void 0,
                    { number: true }
                  ]])]),
                  (dialog.namesA.length)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_475, [_cache[206] || (_cache[206] = _createTextVNode("工作表")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.sheetA) = $event),
                        onChange: $event => {dialog.ha=1;ledgerLoad()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.namesA, (s) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(s), 1))
                      }), 256))], 40, _hoisted_476), [[_vModelSelect, dialog.sheetA]])]))
                    : _createCommentVNode("", true),
                  (dialog.oa)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_477, [_cache[207] || (_cache[207] = _createTextVNode("表头行")), _withDirectives(_createElementVNode("input", {
                        type: "number",
                        min: "1",
                        "onUpdate:modelValue": $event => ((dialog.ha) = $event),
                        onChange: $event => (ledgerMap())
                      }, null, 40, _hoisted_478), [[
                        _vModelText,
                        dialog.ha,
                        void 0,
                        { number: true }
                      ]])]))
                    : _createCommentVNode("", true)
                ]), _createElementVNode("section", null, [
                  _cache[213] || (_cache[213] = _createElementVNode("h3", null, "右侧版本", -1)),
                  _createElementVNode("p", null, _toDisplayString(dialog.fileB?.rel), 1),
                  _createElementVNode("label", null, [_cache[209] || (_cache[209] = _createTextVNode("版本")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.b) = $event),
                    onChange: $event => {dialog.sheetB='';dialog.hb=1;ledgerLoad()}
                  }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.versionsB, (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v.id }, "V" + _toDisplayString(v.num) + " · " + _toDisplayString(fmt(v.stamp)), 9, _hoisted_480))
                  }), 256))], 40, _hoisted_479), [[
                    _vModelSelect,
                    dialog.b,
                    void 0,
                    { number: true }
                  ]])]),
                  (dialog.namesB.length)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_481, [_cache[210] || (_cache[210] = _createTextVNode("工作表")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.sheetB) = $event),
                        onChange: $event => {dialog.hb=1;ledgerLoad()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.namesB, (s) => {
                        return (_openBlock(), _createElementBlock("option", null, _toDisplayString(s), 1))
                      }), 256))], 40, _hoisted_482), [[_vModelSelect, dialog.sheetB]])]))
                    : _createCommentVNode("", true),
                  (dialog.ob)
                    ? (_openBlock(), _createElementBlock("label", _hoisted_483, [_cache[211] || (_cache[211] = _createTextVNode("表头行")), _withDirectives(_createElementVNode("input", {
                        type: "number",
                        min: "1",
                        "onUpdate:modelValue": $event => ((dialog.hb) = $event),
                        onChange: $event => (ledgerMap())
                      }, null, 40, _hoisted_484), [[
                        _vModelText,
                        dialog.hb,
                        void 0,
                        { number: true }
                      ]])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("details", null, [_cache[212] || (_cache[212] = _createElementVNode("summary", null, "更换右侧台账", -1)), _createElementVNode("div", _hoisted_485, [_withDirectives(_createElementVNode("input", {
                    "aria-label": "台账路径片段",
                    "onUpdate:modelValue": $event => ((dialog.find) = $event),
                    onKeydown: _withKeys(_withModifiers($event => (ledgerSearch()), ["prevent"]), ["enter"]),
                    placeholder: "文件名或路径"
                  }, null, 40, _hoisted_486), [[_vModelText, dialog.find]]), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (ledgerSearch())
                  }, "搜索历史文件", 8, _hoisted_487)]), (dialog.choices)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.choices.items, (f) => {
                          return (_openBlock(), _createElementBlock("button", {
                            type: "button",
                            class: "textbtn ledger-choice",
                            onClick: $event => (ledgerFile(f))
                          }, _toDisplayString(f.root) + " / " + _toDisplayString(f.rel), 9, _hoisted_488))
                        }), 256)),
                        (!dialog.choices.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_489, "没有匹配文件"))
                          : _createCommentVNode("", true),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.choices.page<=1,
                          onClick: $event => (ledgerSearch(dialog.choices.page-1))
                        }, "上一页", 8, _hoisted_490),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.choices.page*15>=dialog.choices.total,
                          onClick: $event => (ledgerSearch(dialog.choices.page+1))
                        }, "下一页", 8, _hoisted_491)
                      ], 64))
                    : _createCommentVNode("", true)])
                ])]), (dialog.loading)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_492, "正在读取历史版本…"))
                  : _createCommentVNode("", true), (dialog.oa&&dialog.ob)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                      _createElementVNode("button", {
                        class: "textbtn",
                        type: "button",
                        onClick: ledgerSwap
                      }, "交换左右台账与规则", 8, _hoisted_493),
                      _createElementVNode("details", null, [_cache[216] || (_cache[216] = _createElementVNode("summary", null, "保存或使用对账模板", -1)), _createElementVNode("div", _hoisted_494, [
                        _createElementVNode("label", null, [_cache[214] || (_cache[214] = _createTextVNode("新模板名称")), _withDirectives(_createElementVNode("input", {
                          maxlength: "60",
                          "onUpdate:modelValue": $event => ((dialog.tname) = $event)
                        }, null, 8, _hoisted_495), [[_vModelText, dialog.tname]])]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report||!dialog.tname.trim(),
                          onClick: ledgerTemplateSave
                        }, "保存当前规则", 8, _hoisted_496),
                        _createElementVNode("label", null, [_cache[215] || (_cache[215] = _createTextVNode("已有模板")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((dialog.tid) = $event),
                          onChange: $event => (dialog.confirmRemove=false)
                        }, [_createElementVNode("option", { value: 0 }, "请选择", 8, _hoisted_498), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.templates, (t) => {
                          return (_openBlock(), _createElementBlock("option", { value: t.id }, _toDisplayString(t.name), 9, _hoisted_499))
                        }), 256))], 40, _hoisted_497), [[
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
                        }, "按表头应用", 8, _hoisted_500),
                        _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          disabled: !dialog.tid,
                          onClick: ledgerTemplateRemove
                        }, _toDisplayString(dialog.confirmRemove?'确认移除所选模板':'移除模板'), 9, _hoisted_501)
                      ])]),
                      _cache[244] || (_cache[244] = _createElementVNode("h3", null, "业务编号", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.keys, (k, i) => {
                        return (_openBlock(), _createElementBlock("div", _hoisted_502, [_createElementVNode("label", null, [_cache[217] || (_cache[217] = _createTextVNode("左侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((k.l) = $event),
                          onChange: ledgerReset
                        }, [_createElementVNode("option", { value: -1 }, "选择字段", 8, _hoisted_504), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsA, (c) => {
                          return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_505))
                        }), 256))], 40, _hoisted_503), [[
                          _vModelSelect,
                          k.l,
                          void 0,
                          { number: true }
                        ]])]), _createElementVNode("label", null, [_cache[218] || (_cache[218] = _createTextVNode("右侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((k.r) = $event),
                          onChange: ledgerReset
                        }, [_createElementVNode("option", { value: -1 }, "选择字段", 8, _hoisted_507), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsB, (c) => {
                          return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_508))
                        }), 256))], 40, _hoisted_506), [[
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
                            }, "移除", 8, _hoisted_509))
                          : _createCommentVNode("", true)]))
                      }), 256)),
                      _createElementVNode("button", {
                        type: "button",
                        class: "textbtn",
                        disabled: dialog.keys.length>=3,
                        onClick: $event => {dialog.keys.push({l:-1,r:-1});ledgerReset()}
                      }, "添加组合编号列", 8, _hoisted_510),
                      _createElementVNode("details", null, [
                        _cache[221] || (_cache[221] = _createElementVNode("summary", null, "参与核对的字段与配对规则", -1)),
                        _createElementVNode("div", _hoisted_511, [_createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: ledgerMap
                        }, "重新按表头配对", 8, _hoisted_512), _createElementVNode("button", {
                          type: "button",
                          class: "textbtn",
                          onClick: $event => {dialog.pairs.forEach(p=>p.use=false);ledgerReset()}
                        }, "清除字段选择", 8, _hoisted_513)]),
                        _createElementVNode("div", _hoisted_514, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.pairs, (p, i) => {
                          return (_openBlock(), _createElementBlock("div", _hoisted_515, [
                            _withDirectives(_createElementVNode("input", {
                              type: "checkbox",
                              "aria-label": "核对此字段",
                              "onUpdate:modelValue": $event => ((p.use) = $event),
                              onChange: ledgerReset
                            }, null, 40, _hoisted_516), [[_vModelCheckbox, p.use]]),
                            _withDirectives(_createElementVNode("select", {
                              "aria-label": "左字段",
                              "onUpdate:modelValue": $event => ((p.l) = $event),
                              onChange: ledgerReset
                            }, [_createElementVNode("option", { value: -1 }, "无左列", 8, _hoisted_518), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsA, (c) => {
                              return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_519))
                            }), 256))], 40, _hoisted_517), [[
                              _vModelSelect,
                              p.l,
                              void 0,
                              { number: true }
                            ]]),
                            _cache[219] || (_cache[219] = _createElementVNode("span", null, "→", -1)),
                            _withDirectives(_createElementVNode("select", {
                              "aria-label": "右字段",
                              "onUpdate:modelValue": $event => ((p.r) = $event),
                              onChange: ledgerReset
                            }, [_createElementVNode("option", { value: -1 }, "无右列", 8, _hoisted_521), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.colsB, (c) => {
                              return (_openBlock(), _createElementBlock("option", { value: c.index }, _toDisplayString(c.label), 9, _hoisted_522))
                            }), 256))], 40, _hoisted_520), [[
                              _vModelSelect,
                              p.r,
                              void 0,
                              { number: true }
                            ]])
                          ]))
                        }), 256))]),
                        _createElementVNode("div", _hoisted_523, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({keyTrim:'编号去首尾空白',trim:'文本去首尾空白',fold:'文本忽略大小写',width:'文本 Unicode 兼容归一',typed:'区分文本与数值类型',numeric:'使用十进制数值比较',empty:'空文本与缺格等价'}, (name, k) => {
                          return (_openBlock(), _createElementBlock("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((dialog[k]) = $event),
                            onChange: ledgerReset
                          }, null, 40, _hoisted_524), [[_vModelCheckbox, dialog[k]]]), _createTextVNode(" " + _toDisplayString(name), 1)])]))
                        }), 256)), (dialog.numeric)
                          ? (_openBlock(), _createElementBlock("label", _hoisted_525, [_cache[220] || (_cache[220] = _createTextVNode("允许绝对差值")), _withDirectives(_createElementVNode("input", {
                              "onUpdate:modelValue": $event => ((dialog.tolerance) = $event),
                              onInput: ledgerReset
                            }, null, 40, _hoisted_526), [[_vModelText, dialog.tolerance]])]))
                          : _createCommentVNode("", true)])
                      ]),
                      _createElementVNode("div", _hoisted_527, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "primary",
                          onClick: ledgerRun
                        }, "按当前规则对账", 8, _hoisted_528),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('records'))
                        }, "记录对照", 8, _hoisted_529),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('fields'))
                        }, "字段影响汇总", 8, _hoisted_530),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.report,
                          onClick: $event => (ledgerTab('issues'))
                        }, "编号问题 " + _toDisplayString(dialog.report?.issues.length||0), 9, _hoisted_531),
                        _createElementVNode("label", null, [_cache[223] || (_cache[223] = _createTextVNode("体检一侧")), _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": $event => ((dialog.profileSide) = $event),
                          onChange: $event => (ledgerTab('profile'))
                        }, _cache[222] || (_cache[222] = [_createElementVNode("option", { value: "r" }, "右侧", -1), _createElementVNode("option", { value: "l" }, "左侧", -1)]), 40, _hoisted_532), [[_vModelSelect, dialog.profileSide]])]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (ledgerTab('profile'))
                        }, "字段体检", 8, _hoisted_533)
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
                              _createElementVNode("label", null, [_cache[224] || (_cache[224] = _createTextVNode("左表行号")), _withDirectives(_createElementVNode("input", {
                                type: "number",
                                min: "1",
                                "onUpdate:modelValue": $event => ((dialog.leftRow) = $event)
                              }, null, 8, _hoisted_535), [[
                                _vModelText,
                                dialog.leftRow,
                                void 0,
                                { number: true }
                              ]])]),
                              _createElementVNode("label", null, [_cache[225] || (_cache[225] = _createTextVNode("右表行号")), _withDirectives(_createElementVNode("input", {
                                type: "number",
                                min: "1",
                                "onUpdate:modelValue": $event => ((dialog.rightRow) = $event)
                              }, null, 8, _hoisted_536), [[
                                _vModelText,
                                dialog.rightRow,
                                void 0,
                                { number: true }
                              ]])]),
                              _createElementVNode("label", null, [_cache[227] || (_cache[227] = _createTextVNode("含变化的值类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.cellType) = $event) }, [_cache[226] || (_cache[226] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['文本','数值','公式','错误','布尔','日期时间','时长'], (k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_537), [[_vModelSelect, dialog.cellType]])]),
                              _createElementVNode("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((dialog.onlySuppressed) = $event)
                              }, null, 8, _hoisted_538), [[_vModelCheckbox, dialog.onlySuppressed]]), _cache[228] || (_cache[228] = _createTextVNode(" 只看按规则视为相同的原始差别"))])]),
                              _createElementVNode("label", null, [_cache[229] || (_cache[229] = _createTextVNode("编号含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_539), [[_vModelText, dialog.q]])]),
                              _createElementVNode("label", null, [_cache[230] || (_cache[230] = _createTextVNode("变化字段含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.field) = $event) }, null, 8, _hoisted_540), [[_vModelText, dialog.field]])]),
                              _createElementVNode("label", null, [_cache[232] || (_cache[232] = _createTextVNode("状态")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.status) = $event) }, [_cache[231] || (_cache[231] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.report.counts, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_541), [[_vModelSelect, dialog.status]])]),
                              _createElementVNode("label", null, [_cache[234] || (_cache[234] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[233] || (_cache[233] = [
                                _createElementVNode("option", { value: "" }, "右表原顺序", -1),
                                _createElementVNode("option", { value: "old" }, "左表原顺序", -1),
                                _createElementVNode("option", { value: "key" }, "按编号", -1),
                                _createElementVNode("option", { value: "count" }, "变动字段最多", -1)
                              ]), 8, _hoisted_542), [[_vModelSelect, dialog.sort]])]),
                              _createElementVNode("label", null, [_createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                                type: "checkbox",
                                "onUpdate:modelValue": $event => ((dialog.differences) = $event)
                              }, null, 8, _hoisted_543), [[_vModelCheckbox, dialog.differences]]), _cache[235] || (_cache[235] = _createTextVNode(" 隐藏一致行"))])])
                            ], 40, _hoisted_534),
                            (dialog.fieldMatch)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_544, [_createTextVNode("限定字段 " + _toDisplayString(dialog.fieldMatch.left) + " → " + _toDisplayString(dialog.fieldMatch.right) + " ", 1), _createElementVNode("button", {
                                  type: "button",
                                  class: "textbtn",
                                  onClick: $event => {dialog.fieldMatch=null;dialog.page=1}
                                }, "取消限定", 8, _hoisted_545)]))
                              : _createCommentVNode("", true),
                            _createElementVNode("div", _hoisted_546, [_createElementVNode("table", null, [_cache[236] || (_cache[236] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                                }, _toDisplayString(r.key), 9, _hoisted_547)]),
                                _createElementVNode("td", null, _toDisplayString(r.old??'—') + " → " + _toDisplayString(r.new??'—'), 1),
                                _createElementVNode("td", null, _toDisplayString(r.status), 1),
                                _createElementVNode("td", null, _toDisplayString(r.changes.length), 1)
                              ]), (dialog.expand===r.key)
                                ? (_openBlock(), _createElementBlock("tr", _hoisted_548, [_createElementVNode("td", _hoisted_549, [(!r.changes.length)
                                    ? (_openBlock(), _createElementBlock("p", _hoisted_550, "没有字段值差异。"))
                                    : _createCommentVNode("", true), (r.suppressed.length)
                                    ? (_openBlock(), _createElementBlock("details", _hoisted_551, [_createElementVNode("summary", null, "按规则视为相同的原始差别 · " + _toDisplayString(r.suppressed.length), 1), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.suppressed, (c) => {
                                        return (_openBlock(), _createElementBlock("p", null, _toDisplayString(c.left) + " " + _toDisplayString(c.oldAddress) + "［" + _toDisplayString(c.before?.[0]||'缺格') + "］" + _toDisplayString(c.before?.[1]??'—') + " → " + _toDisplayString(c.right) + " " + _toDisplayString(c.newAddress) + "［" + _toDisplayString(c.after?.[0]||'缺格') + "］" + _toDisplayString(c.after?.[1]??'—'), 1))
                                      }), 256))]))
                                    : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.changes, (c) => {
                                    return (_openBlock(), _createElementBlock("div", _hoisted_552, [_createElementVNode("b", null, _toDisplayString(c.left||'—') + " → " + _toDisplayString(c.right||'—'), 1), _createElementVNode("span", null, _toDisplayString(c.oldAddress||'—') + "　" + _toDisplayString(c.before?.[0]||'缺格') + "　" + _toDisplayString(c.before?.[1]??'—'), 1), _createElementVNode("span", null, _toDisplayString(c.newAddress||'—') + "　" + _toDisplayString(c.after?.[0]||'缺格') + "　" + _toDisplayString(c.after?.[1]??'—'), 1)]))
                                  }), 256))])]))
                                : _createCommentVNode("", true)], 64))
                            }), 256))])])])
                          ], 64))
                        : _createCommentVNode("", true),
                      (dialog.tab==='fields')
                        ? (_openBlock(), _createElementBlock("table", _hoisted_553, [_cache[237] || (_cache[237] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                              }, _toDisplayString(v.left||'—') + " → " + _toDisplayString(v.right||'—'), 9, _hoisted_554)]),
                              _createElementVNode("td", null, _toDisplayString(v.count), 1),
                              _createElementVNode("td", null, _toDisplayString(v.added), 1),
                              _createElementVNode("td", null, _toDisplayString(v.removed), 1),
                              _createElementVNode("td", null, _toDisplayString(v.changed), 1),
                              _createElementVNode("td", null, _toDisplayString(v.retyped), 1)
                            ]))
                          }), 256))])]))
                        : _createCommentVNode("", true),
                      (dialog.tab==='issues')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [_cache[239] || (_cache[239] = _createElementVNode("p", null, "编号重复或不完整的行单列，避免配错业务记录。", -1)), _createElementVNode("table", null, [_cache[238] || (_cache[238] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [_createElementVNode("p", null, "基于" + _toDisplayString(dialog.profileSide==='l'?'左':'右') + "表表头以下的非空数据行。点击字段查看各取值出现次数。", 1), _createElementVNode("div", _hoisted_555, [_createElementVNode("table", null, [_cache[240] || (_cache[240] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                              }, _toDisplayString(p.field), 9, _hoisted_556)]),
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
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [_createElementVNode("h3", null, _toDisplayString(dialog.frequency.field) + " · 取值频次", 1), _createElementVNode("div", _hoisted_557, [_createElementVNode("label", null, [_cache[241] || (_cache[241] = _createTextVNode("取值片段")), _withDirectives(_createElementVNode("input", {
                            "onUpdate:modelValue": $event => ((dialog.freqTerm) = $event),
                            onInput: $event => (dialog.page=1)
                          }, null, 40, _hoisted_558), [[_vModelText, dialog.freqTerm]])]), _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": $event => ((dialog.repeatOnly) = $event),
                            onChange: $event => (dialog.page=1)
                          }, null, 40, _hoisted_559), [[_vModelCheckbox, dialog.repeatOnly]]), _cache[242] || (_cache[242] = _createTextVNode(" 只看重复值"))]), _createElementVNode("button", {
                            type: "button",
                            class: "textbtn",
                            onClick: $event => (ledgerTab('profile'))
                          }, "返回字段体检", 8, _hoisted_560)]), _createElementVNode("table", null, [_cache[243] || (_cache[243] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "取值"),
                            _createElementVNode("th", null, "类型"),
                            _createElementVNode("th", null, "次数"),
                            _createElementVNode("th", null, "首次 / 末次行")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ledgerSlice.items, (v) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", _hoisted_561, _toDisplayString(v.value), 1),
                              _createElementVNode("td", null, _toDisplayString(v.type), 1),
                              _createElementVNode("td", null, _toDisplayString(v.count), 1),
                              _createElementVNode("td", null, _toDisplayString(v.first) + " / " + _toDisplayString(v.last), 1)
                            ]))
                          }), 256))])])], 64))
                        : _createCommentVNode("", true),
                      (dialog.report||dialog.profile)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_562, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: ledgerSlice.page<=1,
                              onClick: $event => (dialog.page=ledgerSlice.page-1)
                            }, "上一页", 8, _hoisted_563),
                            _createElementVNode("span", null, _toDisplayString(ledgerSlice.page) + " / " + _toDisplayString(ledgerSlice.pages) + " 页 · " + _toDisplayString(ledgerSlice.total) + " 项", 1),
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: ledgerSlice.page>=ledgerSlice.pages,
                              onClick: $event => (dialog.page=ledgerSlice.page+1)
                            }, "下一页", 8, _hoisted_564),
                            _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: !ledgerSlice.total,
                              onClick: $event => (ledgerExport())
                            }, "导出当前结果 CSV", 8, _hoisted_565),
                            (dialog.tab==='records')
                              ? (_openBlock(), _createElementBlock("button", {
                                  key: 0,
                                  type: "button",
                                  class: "btn",
                                  disabled: !ledgerSlice.total,
                                  onClick: $event => (ledgerExport(true))
                                }, "导出字段明细 CSV", 8, _hoisted_566))
                              : _createCommentVNode("", true)
                          ]))
                        : _createCommentVNode("", true)
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='restore_preview')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
                  _createElementVNode("p", _hoisted_567, _toDisplayString(dialog.info.path), 1),
                  _createElementVNode("table", null, [_createElementVNode("thead", null, [_createElementVNode("tr", null, [_cache[245] || (_cache[245] = _createElementVNode("th", null, null, -1)), _cache[246] || (_cache[246] = _createElementVNode("th", null, "当前磁盘文件", -1)), _createElementVNode("th", null, "所选 V" + _toDisplayString(dialog.info.version), 1)])]), _createElementVNode("tbody", null, [_createElementVNode("tr", null, [_cache[247] || (_cache[247] = _createElementVNode("th", null, "大小", -1)), _createElementVNode("td", null, _toDisplayString(dialog.info.exists?bytes(dialog.info.current_size):'路径不存在'), 1), _createElementVNode("td", null, _toDisplayString(bytes(dialog.info.size)), 1)]), _createElementVNode("tr", null, [_cache[248] || (_cache[248] = _createElementVNode("th", null, "SHA-256", -1)), _createElementVNode("td", _hoisted_568, _toDisplayString(dialog.info.current_sha||'—'), 1), _createElementVNode("td", _hoisted_569, _toDisplayString(dialog.info.sha), 1)])])]),
                  _createElementVNode("p", null, "最新在册 V" + _toDisplayString(dialog.info.latest) + " · 写回字节差 " + _toDisplayString(dialog.info.delta), 1),
                  _createElementVNode("p", null, _toDisplayString(dialog.info.identical?'磁盘内容与所选版本一致。':dialog.info.unrecorded?'当前磁盘内容尚未记录，写回前会先留存版本。':dialog.info.exists?'确认后替换此路径的磁盘内容。':'确认后在原路径重建文件。'), 1),
                  demo
                    ? (_openBlock(), _createElementBlock("small", _hoisted_570, "此预览使用示例文件。"))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='backup_result')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 6 }, [
                  _createElementVNode("p", null, "数据库版本 " + _toDisplayString(dialog.result.schema) + " · " + _toDisplayString(dialog.result.roots) + " 个目录 · " + _toDisplayString(dialog.result.files) + " 个文件条目 · " + _toDisplayString(dialog.result.versions) + " 个版本", 1),
                  _createElementVNode("p", null, "创建时间 " + _toDisplayString(dialog.result.created?fmt(dialog.result.created):'旧版备份无创建清单') + " · 保存时间范围 " + _toDisplayString(fmt(dialog.result.oldest)) + " 至 " + _toDisplayString(fmt(dialog.result.latest)), 1),
                  _createElementVNode("p", null, "版本合计 " + _toDisplayString(bytes(dialog.result.logical)) + " · 去重后 " + _toDisplayString(bytes(dialog.result.bytes)) + " · 节省 " + _toDisplayString(bytes(dialog.result.saved)) + " · 待核对恢复 " + _toDisplayString(dialog.result.pending_restores) + " 项", 1),
                  (dialog.result.extra_entries)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_571, "另有 " + _toDisplayString(dialog.result.extra_entries) + " 个未列入备份索引的条目。", 1))
                    : _createCommentVNode("", true),
                  (dialog.result.coverage)
                    ? (_openBlock(), _createElementBlock("section", _hoisted_572, [_cache[249] || (_cache[249] = _createElementVNode("h3", null, "按内容摘要核对当前仓库", -1)), _createElementVNode("p", null, "两边都有 " + _toDisplayString(dialog.result.coverage.shared) + " 个对象。当前仓库独有 " + _toDisplayString(dialog.result.coverage.missing) + " 个，共 " + _toDisplayString(bytes(dialog.result.coverage.missing_bytes)) + "，涉及 " + _toDisplayString(dialog.result.coverage.affected_versions) + " 个当前版本。备份独有 " + _toDisplayString(dialog.result.coverage.only_backup) + " 个，共 " + _toDisplayString(bytes(dialog.result.coverage.only_backup_bytes)) + "。", 1), _cache[250] || (_cache[250] = _createElementVNode("small", null, "相同内容可以被多个历史版本引用。", -1))]))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='inventory')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 7 }, [_createElementVNode("div", _hoisted_573, [
                  _createElementVNode("label", null, [_cache[251] || (_cache[251] = _createTextVNode("路径片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_574), [[_vModelText, dialog.q]])]),
                  _createElementVNode("label", null, [_cache[252] || (_cache[252] = _createTextVNode("子目录及下级")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.folder) = $event),
                    placeholder: "业务明细"
                  }, null, 8, _hoisted_575), [[_vModelText, dialog.folder]])]),
                  _createElementVNode("label", null, [_cache[253] || (_cache[253] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.ext) = $event),
                    placeholder: "xlsx, csv"
                  }, null, 8, _hoisted_576), [[_vModelText, dialog.ext]])]),
                  _createElementVNode("label", null, [_cache[254] || (_cache[254] = _createTextVNode("摘要前缀")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.sha) = $event) }, null, 8, _hoisted_577), [[_vModelText, dialog.sha]])]),
                  _createElementVNode("label", null, [_cache[256] || (_cache[256] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[255] || (_cache[255] = [
                    _createElementVNode("option", { value: "" }, "按路径", -1),
                    _createElementVNode("option", { value: "size" }, "体积最大", -1),
                    _createElementVNode("option", { value: "updated" }, "最近保存", -1),
                    _createElementVNode("option", { value: "version" }, "版本号最高", -1)
                  ]), 8, _hoisted_578), [[_vModelSelect, dialog.sort]])]),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadInventory())
                  }, "查询成员", 8, _hoisted_579)
                ]), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _createElementVNode("p", null, _toDisplayString(dialog.data.meta.label) + " · " + _toDisplayString(dialog.data.total) + " 个文件 · " + _toDisplayString(bytes(dialog.data.bytes)) + " · " + _toDisplayString(dialog.data.objects) + " 个唯一内容", 1),
                      _createElementVNode("div", _hoisted_580, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total,
                          onClick: $event => (exportInventory())
                        }, "导出成员 CSV", 8, _hoisted_581),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (checkDisk(dialog.data.page))
                        }, "核对本页原路径", 8, _hoisted_582),
                        _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.quick) = $event),
                          onChange: $event => (dialog.disk=null)
                        }, null, 40, _hoisted_583), [[_vModelCheckbox, dialog.quick]]), _cache[257] || (_cache[257] = _createTextVNode("只核对大小"))]),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total||(demo&&(dialog.active.q||dialog.active.ext||dialog.active.folder||dialog.active.sha)),
                          onClick: $event => (exportInventory(true))
                        }, _toDisplayString(demo?'下载完整示例包':'导出所选历史文件 ZIP'), 9, _hoisted_584),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          onClick: $event => (deliveryDialog(dialog.active))
                        }, "对照此范围核查交付包", 8, _hoisted_585)
                      ]),
                      (dialog.disk)
                        ? (_openBlock(), _createElementBlock("details", _hoisted_586, [_createElementVNode("summary", null, "原路径核对 · " + _toDisplayString(fmt(dialog.disk.checked)), 1), _createElementVNode("p", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.disk.counts, (n, k) => {
                            return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                          }), 256))]), _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.disk.items, (r) => {
                            return (_openBlock(), _createElementBlock("li", null, [_createTextVNode(_toDisplayString(r.rel) + " · " + _toDisplayString(r.state), 1), (r.current_rel&&r.current_rel!==r.rel)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_587, "当前在册位置 " + _toDisplayString(r.current_rel), 1))
                              : _createCommentVNode("", true), (r.replaced)
                              ? (_openBlock(), _createElementBlock("small", _hoisted_588, "此路径当前对应另一文件编号"))
                              : _createCommentVNode("", true)]))
                          }), 256))])]))
                        : _createCommentVNode("", true),
                      _createElementVNode("div", _hoisted_589, [_createElementVNode("table", null, [_cache[258] || (_cache[258] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                        _createElementVNode("th", null, "清单路径"),
                        _createElementVNode("th", null, "版本"),
                        _createElementVNode("th", null, "大小"),
                        _createElementVNode("th", null, "摘要")
                      ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                        return (_openBlock(), _createElementBlock("tr", null, [
                          _createElementVNode("td", null, _toDisplayString(r.rel), 1),
                          _createElementVNode("td", null, "V" + _toDisplayString(r.num), 1),
                          _createElementVNode("td", null, _toDisplayString(bytes(r.size)), 1),
                          _createElementVNode("td", null, [_createElementVNode("details", null, [_createElementVNode("summary", null, _toDisplayString(r.sha.slice(0,10)), 1), _createElementVNode("span", _hoisted_590, _toDisplayString(r.sha), 1)])])
                        ]))
                      }), 256))])])]),
                      _createElementVNode("div", _hoisted_591, [_createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page<=1,
                        onClick: $event => (loadInventory(dialog.data.page-1,dialog.active))
                      }, "上一页", 8, _hoisted_592), _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1), _createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page>=dialog.data.pages,
                        onClick: $event => (loadInventory(dialog.data.page+1,dialog.active))
                      }, "下一页", 8, _hoisted_593)])
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='delivery_check')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 8 }, [_createElementVNode("label", null, [_cache[259] || (_cache[259] = _createTextVNode("文件交付 ZIP 路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_594), [[_vModelText, dialog.path]])]), _createElementVNode("small", null, _toDisplayString(dialog.scope?'同时核对此范围的路径、版本、长度和摘要。':'依据包内清单校验每份副本。'), 1)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='delivery_result')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 9 }, [
                  _createElementVNode("p", null, _toDisplayString(dialog.result.label) + " · 打包 " + _toDisplayString(fmt(dialog.result.created)) + " · 来源扫描 " + _toDisplayString(fmt(dialog.result.scanned)), 1),
                  _createElementVNode("p", null, "清单 " + _toDisplayString(dialog.result.total) + " 项 · 内容通过 " + _toDisplayString(dialog.result.verified) + " 项 · 已核对 " + _toDisplayString(bytes(dialog.result.bytes)) + " · " + _toDisplayString(dialog.result.compared?'已对照所选清单':'依据包内清单'), 1),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.result.counts, (n, k) => {
                    return (_openBlock(), _createElementBlock("p", null, _toDisplayString(k) + " " + _toDisplayString(n), 1))
                  }), 256)),
                  _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.result.issues, (r) => {
                    return (_openBlock(), _createElementBlock("li", null, _toDisplayString(r.kind) + " · " + _toDisplayString(r.rel), 1))
                  }), 256))]),
                  (dialog.result.issue_count>100)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_595, "共 " + _toDisplayString(dialog.result.issue_count) + " 项问题，显示前 100 项。", 1))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='health')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 10 }, [
                  _cache[266] || (_cache[266] = _createElementVNode("p", null, "保留最近五份完整报告。检查读取历史对象，后台采集继续运行。", -1)),
                  _createElementVNode("div", _hoisted_596, [_createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: dialog.job.state==='检查中',
                    onClick: $event => (refreshHealth('health_start'))
                  }, _toDisplayString(demo?'查看示例检查':'开始检查'), 9, _hoisted_597), (dialog.job.state==='检查中')
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn",
                        onClick: $event => (refreshHealth('health_cancel'))
                      }, "取消检查", 8, _hoisted_598))
                    : _createCommentVNode("", true)]),
                  _createElementVNode("p", _hoisted_599, [_createTextVNode(_toDisplayString(dialog.job.state) + " ", 1), (dialog.job.state==='检查中')
                    ? (_openBlock(), _createElementBlock("span", _hoisted_600, _toDisplayString(dialog.job.done) + " / " + _toDisplayString(dialog.job.total), 1))
                    : _createCommentVNode("", true), _createTextVNode(" " + _toDisplayString(dialog.job.error), 1)]),
                  (dialog.reports.length)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("label", null, [_cache[260] || (_cache[260] = _createTextVNode("检查报告")), _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": $event => ((dialog.id) = $event),
                        onChange: $event => {dialog.status='';dialog.change='';loadHealth()}
                      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.reports, (r) => {
                        return (_openBlock(), _createElementBlock("option", { value: r.id }, "#" + _toDisplayString(r.id) + " · " + _toDisplayString(fmt(r.ended)), 9, _hoisted_602))
                      }), 256))], 40, _hoisted_601), [[
                        _vModelSelect,
                        dialog.id,
                        void 0,
                        { number: true }
                      ]])]), (dialog.data)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createElementVNode("p", null, "核验通过 " + _toDisplayString(dialog.data.report.verified) + " / " + _toDisplayString(dialog.data.report.objects) + " 个对象，" + _toDisplayString(bytes(dialog.data.report.verified_bytes)) + "。异常 " + _toDisplayString(dialog.data.report.issues) + "，涉及 " + _toDisplayString(dialog.data.report.affected) + " 个版本。另有未引用对象 " + _toDisplayString(dialog.data.report.unreferenced) + " 个。", 1),
                            _createElementVNode("div", _hoisted_603, [
                              _createElementVNode("label", null, [_cache[261] || (_cache[261] = _createTextVNode("对象摘要片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.q) = $event) }, null, 8, _hoisted_604), [[_vModelText, dialog.q]])]),
                              _createElementVNode("label", null, [_cache[263] || (_cache[263] = _createTextVNode("结果类别")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.status) = $event) }, [_cache[262] || (_cache[262] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.counts, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_605), [[_vModelSelect, dialog.status]])]),
                              _createElementVNode("label", null, [_cache[265] || (_cache[265] = _createTextVNode("与前一份报告相比")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.change) = $event) }, [_cache[264] || (_cache[264] = _createElementVNode("option", { value: "" }, "本轮发现", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.changes, (_, k) => {
                                return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                              }), 256))], 8, _hoisted_606), [[_vModelSelect, dialog.change]])]),
                              _createElementVNode("button", {
                                type: "button",
                                class: "btn",
                                onClick: $event => (loadHealth())
                              }, "筛选", 8, _hoisted_607),
                              _createElementVNode("button", {
                                type: "button",
                                class: "btn",
                                onClick: healthExport
                              }, "导出明细", 8, _hoisted_608)
                            ]),
                            _createElementVNode("p", null, _toDisplayString(dialog.data.total) + " 条匹配", 1),
                            _createElementVNode("ul", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                              return (_openBlock(), _createElementBlock("li", null, [
                                _createElementVNode("span", _hoisted_609, _toDisplayString(r.object_key), 1),
                                _createTextVNode(" · " + _toDisplayString(r.status) + " · " + _toDisplayString(r.change), 1),
                                _createElementVNode("small", null, "索引 " + _toDisplayString(r.expected??'—') + " / 实际 " + _toDisplayString(r.actual??'—') + " 字节 · " + _toDisplayString(r.versions) + " 版 / " + _toDisplayString(r.files) + " 个文件", 1),
                                (r.versions)
                                  ? (_openBlock(), _createElementBlock("button", {
                                      key: 0,
                                      class: "textbtn",
                                      type: "button",
                                      onClick: $event => (affectedVersions(r))
                                    }, "查看引用", 8, _hoisted_610))
                                  : _createCommentVNode("", true)
                              ]))
                            }), 256))]),
                            _createElementVNode("div", _hoisted_611, [_createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: dialog.data.page<=1,
                              onClick: $event => (loadHealth(dialog.data.page-1))
                            }, "上一页", 8, _hoisted_612), _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1), _createElementVNode("button", {
                              type: "button",
                              class: "btn",
                              disabled: dialog.data.page>=dialog.data.pages,
                              onClick: $event => (loadHealth(dialog.data.page+1))
                            }, "下一页", 8, _hoisted_613)]),
                            (dialog.refs)
                              ? (_openBlock(), _createElementBlock("details", _hoisted_614, [
                                  _createElementVNode("summary", null, "当前引用版本 · " + _toDisplayString(dialog.refs.total), 1),
                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.refs.items, (r) => {
                                    return (_openBlock(), _createElementBlock("p", null, _toDisplayString(r.root) + " / " + _toDisplayString(r.rel) + " · V" + _toDisplayString(r.num) + " · " + _toDisplayString(fmt(r.stamp)), 1))
                                  }), 256)),
                                  _createElementVNode("button", {
                                    type: "button",
                                    class: "btn",
                                    disabled: dialog.refs.page<=1,
                                    onClick: $event => (affectedVersions(dialog.refs.row,dialog.refs.page-1))
                                  }, "上一页", 8, _hoisted_615),
                                  _createElementVNode("button", {
                                    type: "button",
                                    class: "btn",
                                    disabled: dialog.refs.page>=dialog.refs.pages,
                                    onClick: $event => (affectedVersions(dialog.refs.row,dialog.refs.page+1))
                                  }, "下一页", 8, _hoisted_616)
                                ]))
                              : _createCommentVNode("", true)
                          ], 64))
                        : _createCommentVNode("", true)], 64))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='variance')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 11 }, [_createElementVNode("div", _hoisted_617, [
                  _createElementVNode("label", null, [_cache[267] || (_cache[267] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.sheet) = $event) }, null, 8, _hoisted_618), [[_vModelText, dialog.sheet]])]),
                  _createElementVNode("label", null, [_cache[268] || (_cache[268] = _createTextVNode("字段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.field) = $event) }, null, 8, _hoisted_619), [[_vModelText, dialog.field]])]),
                  _createElementVNode("label", null, [_cache[269] || (_cache[269] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.record) = $event) }, null, 8, _hoisted_620), [[_vModelText, dialog.record]])]),
                  _createElementVNode("label", null, [_cache[270] || (_cache[270] = _createTextVNode("绝对差额至少")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.minimum) = $event),
                    placeholder: "例如 5"
                  }, null, 8, _hoisted_621), [[_vModelText, dialog.minimum]])]),
                  _createElementVNode("label", null, [_cache[271] || (_cache[271] = _createTextVNode("绝对变化率至少（%）")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.rate) = $event),
                    placeholder: "例如 10"
                  }, null, 8, _hoisted_622), [[_vModelText, dialog.rate]])]),
                  _createElementVNode("label", null, [_cache[273] || (_cache[273] = _createTextVNode("变化方向")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.direction) = $event) }, [_cache[272] || (_cache[272] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['上升','下降','等值'], (k) => {
                    return (_openBlock(), _createElementBlock("option", null, _toDisplayString(k), 1))
                  }), 256))], 8, _hoisted_623), [[_vModelSelect, dialog.direction]])]),
                  _createElementVNode("label", null, [_cache[275] || (_cache[275] = _createTextVNode("顺序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.sort) = $event) }, _cache[274] || (_cache[274] = [
                    _createElementVNode("option", { value: "magnitude" }, "差额绝对值最大", -1),
                    _createElementVNode("option", { value: "rate" }, "变化率绝对值最大", -1),
                    _createElementVNode("option", { value: "up" }, "差额降序", -1),
                    _createElementVNode("option", { value: "down" }, "差额升序", -1),
                    _createElementVNode("option", { value: "position" }, "原始差异顺序", -1)
                  ]), 8, _hoisted_624), [[_vModelSelect, dialog.sort]])]),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadVariance())
                  }, "核对", 8, _hoisted_625)
                ]), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _createElementVNode("p", null, _toDisplayString(dialog.data.total) + " 项符合条件 · 上升 " + _toDisplayString(dialog.data.counts['上升']||0) + " · 下降 " + _toDisplayString(dialog.data.counts['下降']||0) + " · 等值 " + _toDisplayString(dialog.data.counts['等值']||0), 1),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.skips, (n, k) => {
                        return (_openBlock(), _createElementBlock("small", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                      }), 256)),
                      _createElementVNode("details", null, [_cache[276] || (_cache[276] = _createElementVNode("summary", null, "按分组与字段汇总匹配项", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.groups, (g) => {
                        return (_openBlock(), _createElementBlock("p", null, _toDisplayString(g.sheet) + " / " + _toDisplayString(g.field) + " · " + _toDisplayString(g.count) + " 项 · " + _toDisplayString(g.old) + " → " + _toDisplayString(g.new) + " · 净差 " + _toDisplayString(g.delta), 1))
                      }), 256))]),
                      _createElementVNode("div", _hoisted_626, [_createElementVNode("table", null, [_cache[278] || (_cache[278] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                            }, _toDisplayString(r.sheet) + " · " + _toDisplayString(r.location), 9, _hoisted_627),
                            _cache[277] || (_cache[277] = _createTextVNode()),
                            _createElementVNode("button", {
                              type: "button",
                              class: "textbtn",
                              onClick: $event => (reportDialog('trace',r))
                            }, "追踪此项", 8, _hoisted_628),
                            _createElementVNode("small", null, _toDisplayString(r.record) + "　" + _toDisplayString(r.field), 1)
                          ]),
                          _createElementVNode("td", null, _toDisplayString(r.old), 1),
                          _createElementVNode("td", null, _toDisplayString(r.new), 1),
                          _createElementVNode("td", null, _toDisplayString(r.delta), 1),
                          _createElementVNode("td", null, _toDisplayString(r.percent===null?'原值为零':r.percent+'%'), 1)
                        ]))
                      }), 256))])])]),
                      _createElementVNode("div", _hoisted_629, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.data.page<=1,
                          onClick: $event => (loadVariance(dialog.data.page-1,dialog.applied))
                        }, "上一页", 8, _hoisted_630),
                        _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: dialog.data.page>=dialog.data.pages,
                          onClick: $event => (loadVariance(dialog.data.page+1,dialog.applied))
                        }, "下一页", 8, _hoisted_631),
                        _createElementVNode("button", {
                          type: "button",
                          class: "btn",
                          disabled: !dialog.data.total,
                          onClick: varianceExport
                        }, "导出数值 CSV", 8, _hoisted_632)
                      ]),
                      _cache[279] || (_cache[279] = _createElementVNode("small", null, "变化率 = 差额 ÷ 旧值绝对值。此处仅统计差异中的可比数值。", -1))
                    ], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='period'||dialog.type==='trace')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 12 }, [
                  (dialog.type==='period')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_633, [
                        _createElementVNode("label", null, [_cache[280] || (_cache[280] = _createTextVNode("本期开始")), _withDirectives(_createElementVNode("input", {
                          type: "date",
                          "onUpdate:modelValue": $event => ((dialog.form.start) = $event)
                        }, null, 8, _hoisted_634), [[_vModelText, dialog.form.start]])]),
                        _createElementVNode("label", null, [_cache[281] || (_cache[281] = _createTextVNode("本期结束")), _withDirectives(_createElementVNode("input", {
                          type: "date",
                          "onUpdate:modelValue": $event => ((dialog.form.end) = $event)
                        }, null, 8, _hoisted_635), [[_vModelText, dialog.form.end]])]),
                        _createElementVNode("label", null, [_cache[282] || (_cache[282] = _createTextVNode("统计分组")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.group) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({file:'文件',root:'监控目录',folder:'所在文件夹',ext:'扩展名',kind:'变更类型',source:'采集来源',weekday:'星期',hour:'小时'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_637))
                        }), 256))], 8, _hoisted_636), [[_vModelSelect, dialog.form.group]])]),
                        _createElementVNode("label", null, [_cache[284] || (_cache[284] = _createTextVNode("监控目录")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.root_id) = $event) }, [_cache[283] || (_cache[283] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(s.roots, (r) => {
                          return (_openBlock(), _createElementBlock("option", { value: r.id }, _toDisplayString(r.path), 9, _hoisted_639))
                        }), 256))], 8, _hoisted_638), [[_vModelSelect, dialog.form.root_id]])]),
                        _createElementVNode("label", null, [_cache[285] || (_cache[285] = _createTextVNode("历史路径片段")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.q) = $event) }, null, 8, _hoisted_640), [[_vModelText, dialog.form.q]])]),
                        _createElementVNode("label", null, [_cache[286] || (_cache[286] = _createTextVNode("扩展名")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.ext) = $event),
                          placeholder: "xlsx, csv"
                        }, null, 8, _hoisted_641), [[_vModelText, dialog.form.ext]])]),
                        _createElementVNode("label", null, [_cache[287] || (_cache[287] = _createTextVNode("事件类型")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.kind) = $event),
                          placeholder: "例如 内容修改"
                        }, null, 8, _hoisted_642), [[_vModelText, dialog.form.kind]])]),
                        _createElementVNode("label", null, [_cache[288] || (_cache[288] = _createTextVNode("采集来源")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.source) = $event),
                          placeholder: "例如 手动扫描"
                        }, null, 8, _hoisted_643), [[_vModelText, dialog.form.source]])]),
                        _createElementVNode("label", null, [_cache[289] || (_cache[289] = _createTextVNode("只看分组")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.trend) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({'':'全部',up:'次数增加',down:'次数减少',equal:'次数相同',new:'本期才出现',gone:'仅上期出现'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_645))
                        }), 256))], 8, _hoisted_644), [[_vModelSelect, dialog.form.trend]])]),
                        _createElementVNode("label", null, [_cache[290] || (_cache[290] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.sort) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList({after:'本期次数',before:'上期次数',delta:'增幅最大（次数）',drop:'减幅最大（次数）',files:'文件最多',days:'活跃天数最多',label:'分组名称'}, (label, k) => {
                          return (_openBlock(), _createElementBlock("option", { value: k }, _toDisplayString(label), 9, _hoisted_647))
                        }), 256))], 8, _hoisted_646), [[_vModelSelect, dialog.form.sort]])]),
                        _createElementVNode("label", null, [_cache[292] || (_cache[292] = _createElementVNode("span", null, "初次采集", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.initial) = $event)
                        }, null, 8, _hoisted_648), [[_vModelCheckbox, dialog.form.initial]]), _cache[291] || (_cache[291] = _createTextVNode(" 包含初始建档"))])])
                      ]))
                    : _createCommentVNode("", true),
                  (dialog.type==='trace')
                    ? (_openBlock(), _createElementBlock("p", _hoisted_649, "填写业务编号、字段或位置中的至少一项，查看这个文件多次保存之间的变化。"))
                    : _createCommentVNode("", true),
                  (dialog.type==='trace')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_650, [
                        _createElementVNode("label", null, [_cache[293] || (_cache[293] = _createTextVNode("业务编号")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.record) = $event),
                          placeholder: "例如 MD-001"
                        }, null, 8, _hoisted_651), [[_vModelText, dialog.form.record]])]),
                        _createElementVNode("label", null, [_cache[294] || (_cache[294] = _createTextVNode("字段")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.field) = $event),
                          placeholder: "例如 现存量"
                        }, null, 8, _hoisted_652), [[_vModelText, dialog.form.field]])]),
                        _createElementVNode("label", null, [_cache[295] || (_cache[295] = _createTextVNode("位置")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.location) = $event),
                          placeholder: "例如 C2"
                        }, null, 8, _hoisted_653), [[_vModelText, dialog.form.location]])]),
                        _createElementVNode("label", null, [_cache[296] || (_cache[296] = _createTextVNode("工作表或分组")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.sheet) = $event) }, null, 8, _hoisted_654), [[_vModelText, dialog.form.sheet]])]),
                        _createElementVNode("label", null, [_cache[297] || (_cache[297] = _createTextVNode("起始新版本号")), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": $event => ((dialog.form.low) = $event)
                        }, null, 8, _hoisted_655), [[_vModelText, dialog.form.low]])]),
                        _createElementVNode("label", null, [_cache[298] || (_cache[298] = _createTextVNode("结束新版本号")), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": $event => ((dialog.form.high) = $event)
                        }, null, 8, _hoisted_656), [[_vModelText, dialog.form.high]])]),
                        _createElementVNode("label", null, [_cache[300] || (_cache[300] = _createTextVNode("变化类型")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.form.kind) = $event) }, [_cache[299] || (_cache[299] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['新增','修改','删除'], (t) => {
                          return (_openBlock(), _createElementBlock("option", null, _toDisplayString(t), 1))
                        }), 256))], 8, _hoisted_657), [[_vModelSelect, dialog.form.kind]])]),
                        _createElementVNode("label", null, [_cache[301] || (_cache[301] = _createTextVNode("差异类别")), _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": $event => ((dialog.form.category) = $event),
                          placeholder: "例如 单元格值"
                        }, null, 8, _hoisted_658), [[_vModelText, dialog.form.category]])]),
                        _createElementVNode("label", null, [_cache[302] || (_cache[302] = _createTextVNode("旧值或新值含有")), _withDirectives(_createElementVNode("input", { "onUpdate:modelValue": $event => ((dialog.form.value) = $event) }, null, 8, _hoisted_659), [[_vModelText, dialog.form.value]])]),
                        _createElementVNode("label", null, [_cache[304] || (_cache[304] = _createElementVNode("span", null, "轨迹", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.only_return) = $event)
                        }, null, 8, _hoisted_660), [[_vModelCheckbox, dialog.form.only_return]]), _cache[303] || (_cache[303] = _createTextVNode(" 只看回到先前可见值"))])]),
                        _createElementVNode("label", null, [_cache[306] || (_cache[306] = _createElementVNode("span", null, "时间顺序", -1)), _createElementVNode("span", null, [_withDirectives(_createElementVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": $event => ((dialog.form.ascending) = $event)
                        }, null, 8, _hoisted_661), [[_vModelCheckbox, dialog.form.ascending]]), _cache[305] || (_cache[305] = _createTextVNode(" 最早版本优先"))])])
                      ]))
                    : _createCommentVNode("", true),
                  _createElementVNode("div", _hoisted_662, [_createElementVNode("button", {
                    type: "button",
                    class: "primary",
                    onClick: $event => (runReport())
                  }, "查询", 8, _hoisted_663), _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    disabled: !dialog.data?.total,
                    onClick: exportReport
                  }, "导出查询结果 CSV", 8, _hoisted_664)]),
                  (dialog.loading)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_665, "正在读取变动…"))
                    : _createCommentVNode("", true),
                  (dialog.data)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [(dialog.type==='period')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("p", null, [_createTextVNode("上期 " + _toDisplayString(dialog.data.previous) + " 至 " + _toDisplayString(dialog.data.previous_end) + "，" + _toDisplayString(dialog.data.before) + " 次，涉及 " + _toDisplayString(dialog.data.files_before) + " 个文件。", 1), _cache[307] || (_cache[307] = _createElementVNode("br", null, null, -1)), _createTextVNode("本期 " + _toDisplayString(dialog.data.start) + " 至 " + _toDisplayString(dialog.data.end) + "，" + _toDisplayString(dialog.data.after) + " 次，涉及 " + _toDisplayString(dialog.data.files_after) + " 个文件。", 1)]), _createElementVNode("div", _hoisted_666, [_createElementVNode("table", null, [_cache[309] || (_cache[309] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
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
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.first?fmt(r.first):'—'), 1), _cache[308] || (_cache[308] = _createElementVNode("br", null, null, -1)), _createTextVNode(_toDisplayString(r.last?fmt(r.last):'—'), 1)]),
                              _createElementVNode("td", null, [_createElementVNode("button", {
                                type: "button",
                                class: "textbtn",
                                onClick: $event => (reportSource(r))
                              }, "最近事件", 8, _hoisted_667)])
                            ]))
                          }), 256))])])])], 64))
                        : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [_createElementVNode("p", null, "命中 " + _toDisplayString(dialog.data.versions) + " 个版本 · 回到先前可见值 " + _toDisplayString(dialog.data.returns) + " 项", 1), _createElementVNode("small", null, [_cache[310] || (_cache[310] = _createTextVNode("所选范围内可见相邻版本的解析情况：")), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.coverage, (n, k) => {
                            return (_openBlock(), _createElementBlock("span", null, _toDisplayString(k) + " " + _toDisplayString(n) + "　", 1))
                          }), 256))]), _createElementVNode("div", _hoisted_668, [_createElementVNode("table", null, [_cache[314] || (_cache[314] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                            _createElementVNode("th", null, "保存时间 / 版本"),
                            _createElementVNode("th", null, "当时路径 / 位置"),
                            _createElementVNode("th", null, "编号 / 字段"),
                            _createElementVNode("th", null, "旧值"),
                            _createElementVNode("th", null, "新值"),
                            _createElementVNode("th", null, "变化")
                          ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                            return (_openBlock(), _createElementBlock("tr", null, [
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(r.stamp)), 1), _cache[311] || (_cache[311] = _createElementVNode("br", null, null, -1)), _createTextVNode("V" + _toDisplayString(r.prior) + " → V" + _toDisplayString(r.version), 1)]),
                              _createElementVNode("td", null, [
                                _createTextVNode(_toDisplayString(r.rel), 1),
                                _cache[312] || (_cache[312] = _createElementVNode("br", null, null, -1)),
                                _createTextVNode(_toDisplayString(r.sheet) + " · ", 1),
                                _createElementVNode("button", {
                                  type: "button",
                                  class: "textbtn",
                                  onClick: $event => (reportSource(r))
                                }, _toDisplayString(r.location), 9, _hoisted_669)
                              ]),
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.record), 1), _cache[313] || (_cache[313] = _createElementVNode("br", null, null, -1)), _createTextVNode(_toDisplayString(r.field), 1)]),
                              _createElementVNode("td", _hoisted_670, _toDisplayString(r.old??'—'), 1),
                              _createElementVNode("td", _hoisted_671, _toDisplayString(r.new??'—'), 1),
                              _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.kind) + " " + _toDisplayString(r.category), 1), (r.returning==='是')
                                ? (_openBlock(), _createElementBlock("small", _hoisted_672, "回到先前可见值"))
                                : _createCommentVNode("", true)])
                            ]))
                          }), 256))])])])], 64)), (!dialog.data.total)
                        ? (_openBlock(), _createElementBlock("p", _hoisted_673, "当前条件没有匹配项。"))
                        : _createCommentVNode("", true), _createElementVNode("div", _hoisted_674, [_createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page===1,
                        onClick: $event => (runReport(dialog.data.page-1,dialog.applied))
                      }, "上一页", 8, _hoisted_675), _createElementVNode("span", null, _toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages) + " 页 · " + _toDisplayString(dialog.data.total) + " 项", 1), _createElementVNode("button", {
                        type: "button",
                        class: "btn",
                        disabled: dialog.data.page===dialog.data.pages,
                        onClick: $event => (runReport(dialog.data.page+1,dialog.applied))
                      }, "下一页", 8, _hoisted_676)])], 64))
                    : _createCommentVNode("", true)
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='capture_policy')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 13 }, [
                  _createElementVNode("p", _hoisted_677, _toDisplayString(dialog.path), 1),
                  _createElementVNode("label", null, [_cache[315] || (_cache[315] = _createTextVNode("稳定等待时长")), _withDirectives(_createElementVNode("select", { "onUpdate:modelValue": $event => ((dialog.settle_ms) = $event) }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([500,1500,3000,5000,10000], (v) => {
                    return (_openBlock(), _createElementBlock("option", { value: v }, _toDisplayString(v/1000) + " 秒", 9, _hoisted_679))
                  }), 256))], 8, _hoisted_678), [[
                    _vModelSelect,
                    dialog.settle_ms,
                    void 0,
                    { number: true }
                  ]])]),
                  _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => ((dialog.all_types) = $event)
                  }, null, 8, _hoisted_680), [[_vModelCheckbox, dialog.all_types]]), _cache[316] || (_cache[316] = _createTextVNode("对所有扩展名启用稳定等待"))]),
                  _cache[317] || (_cache[317] = _createElementVNode("small", null, "监听到保存后，在复查中确认签名保持稳定。默认用于 Office、开放文档、PDF、电子书、ZIP 和笔记本等格式。", -1))
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='waiting_files')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 14 }, [_createElementVNode("p", _hoisted_681, _toDisplayString(dialog.path), 1), _createElementVNode("div", _hoisted_682, [
                  _createElementVNode("label", null, [_cache[318] || (_cache[318] = _createTextVNode("文件路径")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.q) = $event),
                    onKeyup: _withKeys(_withModifiers($event => (loadWaiting()), ["prevent"]), ["enter"])
                  }, null, 40, _hoisted_683), [[_vModelText, dialog.q]])]),
                  _createElementVNode("label", null, [_cache[320] || (_cache[320] = _createTextVNode("等待原因")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.reason) = $event),
                    onChange: $event => (loadWaiting())
                  }, [_cache[319] || (_cache[319] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data?.reasons, (v) => {
                    return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                  }), 256))], 40, _hoisted_684), [[_vModelSelect, dialog.reason]])]),
                  _createElementVNode("label", null, [_cache[322] || (_cache[322] = _createTextVNode("排序")), _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((dialog.sort) = $event),
                    onChange: $event => (loadWaiting())
                  }, _cache[321] || (_cache[321] = [_createElementVNode("option", { value: "" }, "最早等待", -1), _createElementVNode("option", { value: "attempts" }, "复查次数最多", -1), _createElementVNode("option", { value: "path" }, "文件路径", -1)]), 40, _hoisted_685), [[_vModelSelect, dialog.sort]])]),
                  _createElementVNode("button", {
                    type: "button",
                    class: "btn",
                    onClick: $event => (loadWaiting())
                  }, "查询", 8, _hoisted_686)
                ]), (dialog.data)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("p", null, _toDisplayString(dialog.data.total) + " 个文件", 1), _createElementVNode("div", _hoisted_687, [_createElementVNode("table", null, [_cache[323] || (_cache[323] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                      _createElementVNode("th", null, "路径与原因"),
                      _createElementVNode("th", null, "首次等待"),
                      _createElementVNode("th", null, "最近一次"),
                      _createElementVNode("th", null, "观察次数")
                    ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                      return (_openBlock(), _createElementBlock("tr", null, [
                        _createElementVNode("td", null, [_createTextVNode(_toDisplayString(r.rel), 1), _createElementVNode("small", null, _toDisplayString(r.reason), 1)]),
                        _createElementVNode("td", null, _toDisplayString(fmt(r.first_seen)), 1),
                        _createElementVNode("td", null, _toDisplayString(fmt(r.last_seen)), 1),
                        _createElementVNode("td", null, _toDisplayString(r.attempts), 1)
                      ]))
                    }), 256))])])]), _createElementVNode("div", _hoisted_688, [_createElementVNode("button", {
                      class: "btn",
                      type: "button",
                      disabled: dialog.data.page<=1,
                      onClick: $event => (loadWaiting(dialog.data.page-1))
                    }, "上一页", 8, _hoisted_689), _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1), _createElementVNode("button", {
                      class: "btn",
                      type: "button",
                      disabled: dialog.data.page>=dialog.data.pages,
                      onClick: $event => (loadWaiting(dialog.data.page+1))
                    }, "下一页", 8, _hoisted_690)])], 64))
                  : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='scan_log')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 15 }, [
                  _createElementVNode("p", _hoisted_691, _toDisplayString(dialog.path), 1),
                  _createElementVNode("div", _hoisted_692, [
                    _createElementVNode("label", null, [_cache[325] || (_cache[325] = _createTextVNode("运行结果")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((dialog.state) = $event),
                      onChange: $event => (loadJournal())
                    }, [_cache[324] || (_cache[324] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['完成','等待保存','有异常','中断','进行中'], (v) => {
                      return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                    }), 256))], 40, _hoisted_693), [[_vModelSelect, dialog.state]])]),
                    _createElementVNode("label", null, [_cache[327] || (_cache[327] = _createTextVNode("触发来源")), _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": $event => ((dialog.source) = $event),
                      onChange: $event => (loadJournal())
                    }, [_cache[326] || (_cache[326] = _createElementVNode("option", { value: "" }, "全部", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data?.sources, (v) => {
                      return (_openBlock(), _createElementBlock("option", null, _toDisplayString(v), 1))
                    }), 256))], 40, _hoisted_694), [[_vModelSelect, dialog.source]])]),
                    _createElementVNode("label", null, [_withDirectives(_createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": $event => ((dialog.skips) = $event),
                      onChange: $event => (loadJournal())
                    }, null, 40, _hoisted_695), [[_vModelCheckbox, dialog.skips]]), _cache[328] || (_cache[328] = _createTextVNode("仅有跳过项"))]),
                    _createElementVNode("button", {
                      type: "button",
                      class: "btn",
                      onClick: $event => (loadJournal())
                    }, "刷新", 8, _hoisted_696)
                  ]),
                  (dialog.data)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        _createElementVNode("p", null, "匹配 " + _toDisplayString(dialog.data.total) + " 次 · 平均 " + _toDisplayString(dialog.data.average) + " 毫秒 · 最长 " + _toDisplayString(dialog.data.longest) + " 毫秒", 1),
                        _createElementVNode("div", _hoisted_697, [_createElementVNode("table", null, [_cache[330] || (_cache[330] = _createElementVNode("thead", null, [_createElementVNode("tr", null, [
                          _createElementVNode("th", null, "开始 / 来源"),
                          _createElementVNode("th", null, "结果"),
                          _createElementVNode("th", null, "耗时"),
                          _createElementVNode("th", null, "明细")
                        ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.data.items, (r) => {
                          return (_openBlock(), _createElementBlock("tr", { key: r.id }, [
                            _createElementVNode("td", null, [_createTextVNode(_toDisplayString(fmt(r.started)), 1), _createElementVNode("small", null, _toDisplayString(r.source), 1)]),
                            _createElementVNode("td", null, _toDisplayString(r.status), 1),
                            _createElementVNode("td", null, _toDisplayString(r.ended?r.elapsed_ms+' ms':'—'), 1),
                            _createElementVNode("td", null, [_createElementVNode("details", null, [
                              _cache[329] || (_cache[329] = _createElementVNode("summary", null, "运行数据", -1)),
                              _createElementVNode("p", null, "候选 " + _toDisplayString(r.candidates) + " · 快照读取 " + _toDisplayString(r.captured) + "（" + _toDisplayString(bytes(r.read_bytes)) + "）· 内容复用 " + _toDisplayString(r.reused) + " · 等待 " + _toDisplayString(r.waiting) + " · 跳过 " + _toDisplayString(r.skipped), 1),
                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(r.skip_reasons, (n, k) => {
                                return (_openBlock(), _createElementBlock("p", null, _toDisplayString(k) + " " + _toDisplayString(n), 1))
                              }), 256)),
                              (r.problem)
                                ? (_openBlock(), _createElementBlock("p", _hoisted_698, _toDisplayString(r.problem), 1))
                                : _createCommentVNode("", true)
                            ])])
                          ]))
                        }), 128))])])]),
                        (!dialog.data.total)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_699, "没有匹配的运行记录。"))
                          : _createCommentVNode("", true),
                        _createElementVNode("div", _hoisted_700, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: dialog.data.page<=1,
                            onClick: $event => (loadJournal(dialog.data.page-1))
                          }, "上一页", 8, _hoisted_701),
                          _createTextVNode(_toDisplayString(dialog.data.page) + " / " + _toDisplayString(dialog.data.pages), 1),
                          _createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: dialog.data.page>=dialog.data.pages,
                            onClick: $event => (loadJournal(dialog.data.page+1))
                          }, "下一页", 8, _hoisted_702),
                          _createElementVNode("button", {
                            type: "button",
                            class: "btn",
                            disabled: !dialog.data.total,
                            onClick: exportJournal
                          }, "导出 CSV", 8, _hoisted_703)
                        ])
                      ], 64))
                    : _createCommentVNode("", true),
                  _cache[331] || (_cache[331] = _createElementVNode("small", null, "每个目录保留最近 200 次扫描。", -1))
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='rule_history')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 16 }, [_createElementVNode("p", _hoisted_704, _toDisplayString(dialog.path), 1), _createElementVNode("ol", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.entries, (r) => {
                  return (_openBlock(), _createElementBlock("li", { key: r.id }, _toDisplayString(fmt(r.stamp)) + " · " + _toDisplayString(r.patterns||'无排除规则') + " · " + _toDisplayString(r.max_mb ? r.max_mb+' MiB':'不限大小'), 1))
                }), 128))]), _cache[332] || (_cache[332] = _createElementVNode("small", null, "最近 100 次配置，最新在前。", -1))], 64))
              : _createCommentVNode("", true),
            (dialog.type==='inspect')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 17 }, [_createElementVNode("label", null, [_cache[333] || (_cache[333] = _createTextVNode("备份 ZIP 路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_705), [[_vModelText, dialog.path]])]), _cache[334] || (_cache[334] = _createElementVNode("small", null, "逐个核对对象，无需退出监控。", -1))], 64))
              : _createCommentVNode("", true),
            (dialog.type==='backup')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 18 }, [_createElementVNode("label", null, [_cache[335] || (_cache[335] = _createTextVNode("管理口令")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.password) = $event),
                  type: "password",
                  autocomplete: "off",
                  required: ""
                }, null, 8, _hoisted_706), [[_vModelText, dialog.password]])]), _createElementVNode("label", null, [_cache[336] || (_cache[336] = _createTextVNode("新备份文件的完整路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: ""
                }, null, 8, _hoisted_707), [[_vModelText, dialog.path]])])], 64))
              : _createCommentVNode("", true),
            (dialog.type==='root')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 19 }, [
                  _createElementVNode("label", null, [_cache[337] || (_cache[337] = _createTextVNode("目录路径")), _createElementVNode("div", _hoisted_708, [_withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.path) = $event),
                    placeholder: "例如 D:\\业务资料\\仓库",
                    required: "",
                    readonly: !!dialog.id
                  }, null, 8, _hoisted_709), [[_vModelText, dialog.path]]), (native&&!dialog.id)
                    ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn",
                        onClick: chooseDir
                      }, "浏览", 8, _hoisted_710))
                    : _createCommentVNode("", true)])]),
                  _createElementVNode("label", null, [_cache[338] || (_cache[338] = _createTextVNode("排除规则")), _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": $event => ((dialog.patterns) = $event),
                    placeholder: "例如 *.tmp，*.bak，缓存/*"
                  }, null, 8, _hoisted_711), [[_vModelText, dialog.patterns]])]),
                  _createElementVNode("label", null, [_cache[339] || (_cache[339] = _createTextVNode("单文件大小上限（MiB）")), _withDirectives(_createElementVNode("input", {
                    type: "number",
                    min: "0",
                    "onUpdate:modelValue": $event => ((dialog.max_mb) = $event)
                  }, null, 8, _hoisted_712), [[
                    _vModelText,
                    dialog.max_mb,
                    void 0,
                    { number: true }
                  ]])]),
                  _cache[343] || (_cache[343] = _createElementVNode("small", null, "填 0 表示不限大小。超过上限的文件会跳过。", -1)),
                  _createElementVNode("details", null, [
                    _cache[342] || (_cache[342] = _createElementVNode("summary", null, "保存前预演规则", -1)),
                    _createElementVNode("label", null, [_cache[340] || (_cache[340] = _createTextVNode("待测文件相对路径，每行一个")), _withDirectives(_createElementVNode("textarea", {
                      "onUpdate:modelValue": $event => ((dialog.paths) = $event),
                      placeholder: "草稿/试算.xlsx"
                    }, null, 8, _hoisted_713), [[_vModelText, dialog.paths]])]),
                    _createElementVNode("label", null, [_cache[341] || (_cache[341] = _createTextVNode("假设每个文件大小（字节，可留空）")), _withDirectives(_createElementVNode("input", {
                      type: "number",
                      min: "0",
                      "onUpdate:modelValue": $event => ((dialog.probeBytes) = $event)
                    }, null, 8, _hoisted_714), [[_vModelText, dialog.probeBytes]])]),
                    _createElementVNode("button", {
                      class: "btn",
                      type: "button",
                      onClick: previewRules
                    }, "预演", 8, _hoisted_715),
                    (dialog.samples&&dialog.probed===ruleSignature(dialog))
                      ? (_openBlock(), _createElementBlock("ul", _hoisted_716, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dialog.samples, (r) => {
                          return (_openBlock(), _createElementBlock("li", null, [_createTextVNode(_toDisplayString(r.rel) + " · " + _toDisplayString(r.reason) + " ", 1), (r.pattern)
                            ? (_openBlock(), _createElementBlock("span", _hoisted_717, "· " + _toDisplayString(r.pattern) + " 命中 " + _toDisplayString(r.part), 1))
                            : _createCommentVNode("", true)]))
                        }), 256))]))
                      : _createCommentVNode("", true)
                  ])
                ], 64))
              : _createCommentVNode("", true),
            (dialog.type==='save')
              ? (_openBlock(), _createElementBlock("label", _hoisted_718, [_cache[344] || (_cache[344] = _createTextVNode("保存路径")), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.path) = $event),
                  required: "",
                  placeholder: "请输入完整的新文件路径"
                }, null, 8, _hoisted_719), [[_vModelText, dialog.path]])]))
              : _createCommentVNode("", true),
            (['info','confirm'].includes(dialog.type))
              ? (_openBlock(), _createElementBlock("p", _hoisted_720, _toDisplayString(dialog.body), 1))
              : _createCommentVNode("", true),
            (dialog.type==='tree')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 22 }, [_createElementVNode("label", _hoisted_721, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": $event => ((dialog.query) = $event),
                  placeholder: "搜索子目录路径"
                }, null, 8, _hoisted_722), [[_vModelText, dialog.query]])]), _createElementVNode("div", _hoisted_723, [_createElementVNode("button", {
                  type: "button",
                  onClick: $event => (rootFiles(dialog.root))
                }, "全部文件", 8, _hoisted_724), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleFolders, (folder) => {
                  return (_openBlock(), _createElementBlock("button", {
                    type: "button",
                    key: folder.path,
                    onClick: $event => (treeSelect(dialog.root,folder.path)),
                    style: _normalizeStyle({paddingLeft:(8+14*(folder.path.split('/').length-1))+'px'})
                  }, [_createVNode(_component_ico, { n: "folder" }), _createElementVNode("span", null, _toDisplayString(folder.path), 1), _createElementVNode("small", null, _toDisplayString(folder.total) + " 个文件", 1)], 12, _hoisted_725))
                }), 128))]), (!dialog.folders.length)
                  ? (_openBlock(), _createElementBlock("small", _hoisted_726, "当前目录没有含已跟踪文件的子目录。"))
                  : (!visibleFolders.length)
                    ? (_openBlock(), _createElementBlock("small", _hoisted_727, "没有匹配的子目录。"))
                    : _createCommentVNode("", true)], 64))
              : _createCommentVNode("", true),
            (dialog.type==='pick')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 23 }, [_createElementVNode("div", _hoisted_728, [_createElementVNode("label", _hoisted_729, [_createVNode(_component_ico, { n: "search" }), _withDirectives(_createElementVNode("input", {
                  id: "filePicker",
                  "onUpdate:modelValue": $event => ((pickQ) = $event),
                  onInput: searchPick,
                  placeholder: "搜索现名、旧名或相对路径"
                }, null, 40, _hoisted_730), [[_vModelText, pickQ]])]), _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": $event => ((pickScope) = $event),
                  "aria-label": "历史文件范围",
                  onChange: $event => {pickPage=1;loadPicks()}
                }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(fileScopes, (entry) => {
                  return (_openBlock(), _createElementBlock("option", { value: entry[0] }, _toDisplayString(entry[1]), 9, _hoisted_732))
                }), 256))], 40, _hoisted_731), [[_vModelSelect, pickScope]])]), _createElementVNode("div", _hoisted_733, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(picks.items, (v) => {
                  return (_openBlock(), _createElementBlock("button", {
                    type: "button",
                    key: v.id,
                    disabled: pickLoading,
                    onClick: $event => (picked(v))
                  }, [_createElementVNode("span", { class: _normalizeClass(["file-icon", tone(v.ext)]) }, [_createVNode(_component_ico, { n: fileIcon(v.ext) }, null, 8, ["n"])], 2), _createElementVNode("span", _hoisted_735, [
                    _createElementVNode("b", null, _toDisplayString(base(v.rel)), 1),
                    _createElementVNode("small", null, _toDisplayString(parent(v.root,v.rel)), 1),
                    (v.matched_path)
                      ? (_openBlock(), _createElementBlock("small", _hoisted_736, "原路径：" + _toDisplayString(v.matched_path), 1))
                      : _createCommentVNode("", true),
                    _createElementVNode("small", null, [_createElementVNode("span", { class: _normalizeClass(["tag", stateTone(v.file_state)]) }, _toDisplayString(v.file_state), 3), _createTextVNode("　V" + _toDisplayString(v.version) + " · " + _toDisplayString(fmt(v.updated)), 1)])
                  ]), _createVNode(_component_ico, { n: "chevron-right" })], 8, _hoisted_734))
                }), 128)), pickLoading
                  ? (_openBlock(), _createElementBlock("p", _hoisted_737, "正在查找…"))
                  : (!picks.items.length)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_738, "当前范围内没有找到文件"))
                    : _createCommentVNode("", true)]), _createElementVNode("div", _hoisted_739, [_createElementVNode("span", null, "共 " + _toDisplayString(picks.total) + " 个文件", 1), _createElementVNode("span", null, [_createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: pickPage<=1,
                  onClick: $event => {pickPage--;loadPicks()}
                }, "上一页", 8, _hoisted_740), _cache[345] || (_cache[345] = _createTextVNode()), _createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: pickPage*picks.size>=picks.total,
                  onClick: $event => {pickPage++;loadPicks()}
                }, "下一页", 8, _hoisted_741)])])], 64))
              : _createCommentVNode("", true),
            (dialog.error)
              ? (_openBlock(), _createElementBlock("p", _hoisted_742, _toDisplayString(dialog.error), 1))
              : _createCommentVNode("", true),
            (!['pick','info','tree','rule_history','private_records','scan_log','waiting_files','ledger','receipt','period','trace','inventory','health','variance','backup_result','delivery_result'].includes(dialog.type)&&!(dialog.type==='restore_preview'&&(demo||dialog.info.identical)))
              ? (_openBlock(), _createElementBlock("div", _hoisted_743, [_createElementVNode("button", {
                  type: "button",
                  class: "btn",
                  disabled: busy,
                  onClick: $event => (dialog=null)
                }, "取消", 8, _hoisted_744), _createElementVNode("button", {
                  class: "primary",
                  disabled: busy
                }, _toDisplayString(busy?'处理中…':dialog.submit||'保存'), 9, _hoisted_745)]))
              : _createCommentVNode("", true)
          ], 40, _hoisted_436)], 10, _hoisted_433)], 8, _hoisted_432))
        : _createCommentVNode("", true),
      message
        ? (_openBlock(), _createElementBlock("div", _hoisted_746, _toDisplayString(message), 1))
        : _createCommentVNode("", true)
    ], 2))
  }
}
})();
window.FG_VIEW._rc=true;

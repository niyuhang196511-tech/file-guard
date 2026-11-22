'use strict';
type EngineCommand = 'summary' | 'roots' | 'folders' | 'open_dir' | 'files' | 'events' | 'audit' | 'history' | 'compare' | 'configure' | 'root_action' | 'scan' | 'restore' | 'copy' | 'verify' | 'backup' | 'retry' | 'settings' | 'export' | 'sheet_rows' | 'export_files' | 'export_audit' | 'export_diff' | 'restore_info' | 'retry_recovery' | 'review_queue' | 'save_review' | 'star_file' | 'export_review' | 'storage' | 'record_detail' | 'record_amend' | 'inspect_backup' | 'finder' | 'waiting_files' | 'capture_policy' | 'finder_presets' | 'finder_save' | 'finder_forget' | 'finder_export' | 'scan_log' | 'scan_log_export' | 'sheet_find' | 'private_records' | 'runtime' | 'rule_preview' | 'rule_history' | 'checkpoints' | 'checkpoint_create' | 'checkpoint_diff' | 'checkpoint_export' | 'checkpoint_inventory' | 'inventory_csv' | 'handoff_create' | 'handoff_verify' | 'checkpoint_disk' | 'health_start' | 'health_cancel' | 'health_state' | 'health_results' | 'health_reports' | 'health_csv' | 'health_references' | 'variance' | 'variance_csv' | 'period_report' | 'period_csv' | 'field_trace' | 'trace_csv' | 'save_receipt' | 'table_source' | 'ledger_csv' | 'ledger_templates' | 'ledger_save' | 'ledger_remove' | 'text_search' | 'text_search_csv' | 'content_groups' | 'content_refs' | 'content_groups_csv' | 'content_refs_csv' | 'content_verify' | 'line_origins' | 'line_origins_csv' | 'review_batch_preview' | 'review_batch_apply' | 'version_bundle_preview' | 'version_bundle_create' | 'version_bundle_csv' | 'version_bundle_verify' | 'path_history' | 'path_history_csv' | 'checkpoint_three' | 'checkpoint_three_csv' | 'snapshot_preview' | 'snapshot_preview_csv';
type Arguments = Record<string, unknown>;
type DiffFocus = {sheet: string; location: string};
type TextHistoryFilter = {
    q:string; filename:string; ext:string; root:number; file:number; scope:string;
    start:string; end:string; context:number; latest:boolean; starred:boolean; exact:boolean; sensitive:boolean;
    skip_initial:boolean;
};
interface Window {
  FileGuardLedger: any;
  __TAURI__?: {core: {invoke: (command: string, args: Arguments) => Promise<any>}};
  FILEGUARD_EXAMPLE?: {contentCatalog?:{example?:string};lineOrigins?:{example?:unknown};versionBundle?:{example?:any[]};snapshotPreview?:{examples?:any}};
  FG_VIEW: (...args: any[]) => unknown;
  FG_ICONS: Record<string, [string, Record<string, string>][]>;
  exampleRequest: (command: EngineCommand, args: Arguments) => Promise<any>;
}
declare const Vue: {
  createApp: (options: any) => any;
  h: (tag: string, properties: object, children?: unknown) => unknown;
  nextTick: () => Promise<void>;
};

interface ListFilter {event_id:string;caption:string;amended:boolean;starred:boolean;source:string;status:string;sha:string;sort:string;min_bytes:string;max_bytes:string;with_diff:boolean;multiple:boolean;scope:string;q:string;root:string|number;ext:string;kind:string;activity:boolean;prefix:string;action:string;start:string;end:string}

const { createApp, h, nextTick } = Vue;
const Ledger=window.FileGuardLedger;
const ledgerExt=['.xlsx','.xlsm','.xltx','.xltm','.csv','.tsv'];
const nativeMode = !!window.__TAURI__?.core?.invoke;
const demoMode = typeof window.FILEGUARD_EXAMPLE !== 'undefined';
let token = '';
if (!demoMode && !nativeMode) {
    token = location.hash.slice(1) || sessionStorage.getItem('fileguard-session') || '';
    if (location.hash && token) {
        sessionStorage.setItem('fileguard-session', token);
        history.replaceState(null, '', location.pathname);
    }
}
async function request(cmd: EngineCommand, args: Arguments = {}): Promise<any> {
    if (demoMode) return window.exampleRequest(cmd, args);
    if (nativeMode) return window.__TAURI__.core.invoke('operation', {
        cmd,
        args
    });
    const res = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-FileGuard': token
        },
        body: JSON.stringify({
            cmd,
            args
        })
    });
    const payload = await res.json();
    if (!payload.ok) throw Error(payload.error || '操作失败');
    return payload.data;
}
const columns = [
    '系统总览',
    '目录监控',
    '文件管理',
    '变更记录',
    '历史版本',
    '版本对比',
    '复核工作台',
    '目录清单',
    '差异检索',
    '历史正文检索',
    '相同内容追溯',
    '逐行来源',
    '历史版本交付篮',
    '路径沿革',
    '清单三方对照',
    '历史原件预览',
    '审计中心',
    '系统设置'
];
const navIcons = [
    'layout-dashboard',
    'folder-search',
    'files',
    'activity',
    'history',
    'columns-2',
    'list-checks',
    'files',
    'search',
    'search',
    'files',
    'history',
    'files',
    'folder-search',
    'columns-2',
    'files',
    'clipboard-list',
    'settings'
];
const searchPath=(value:string)=>String(value || '').trim().toLowerCase().replaceAll('\\','/');
const listCommands = {
    '文件管理': {table:'files', exportCommand:'export_files', filename:'文件清单.csv'},
    '变更记录': {table:'events', exportCommand:'export', filename:'变更记录.csv'},
    '审计中心': {table:'audit', exportCommand:'export_audit', filename:'审计中心.csv'}
} as const;
const freshFilter = (): ListFilter =>({
        event_id:'',caption:'',amended:false,starred:false,source:'',status:'',sha:'',sort:'',min_bytes:'',max_bytes:'',with_diff:false,multiple:false,
        scope: '',
        q: '',
        root: '',
        ext: '',
        kind: '',
        activity: false,
        action: '',
        start: '',
        end: '',
        prefix: ''
    });
const freshFinder=()=>({q:'',filename:'',ext:'',root:'',kind:'',sheet:'',field:'',record:'',start:'',end:'',side:'',sort:'',direction:'',starred:false,exact:false,sensitive:false});
const freshPath=()=>({mode:'path',rel:'',root:0,file:0,start:'',end:'',source:'',kind:'',direction:'',
    sort:'newest',size:25,fold:false,structural:false});
const freshTri=()=>({base:0,left:0,right:0,q:'',ext:'',kind:'',sort:'review',size:25,unchanged:false,issues:false,collision:false});
const freshSnapshot=()=>({id:0,mode:'auto',q:'',size:50,width:16,low:null,high:null,at:null,exact:false,sensitive:false});
const freshLineage=()=>({id:0,depth:20,moves:false,q:'',kind:'',origin:0,low:0,high:0,exact:false,sensitive:false,size:50});
const freshContent=()=>({mode:'cross',sha:'',q:'',root:0,ext:'',state:'',start:'',end:'',
    minimum:'',maximum:'',latest:false,starred:false,empty:false,sort:'saved',size:25});
const freshTextHistory=(): TextHistoryFilter => ({
    q:'',filename:'',ext:'',root:0,file:0,scope:'',start:'',end:'',context:1,
    latest:true,starred:false,exact:false,sensitive:false,skip_initial:false
});
const isScanPanel=(dialog)=>dialog?.type==='scan_log'||dialog?.type==='waiting_files';
const scanStates=['完成','等待保存','有异常','中断','进行中'];
const scanMetrics=[
    ['elapsed_ms','耗时（毫秒）'],['candidates','候选'],['captured','快照读取'],
    ['read_bytes','快照读取量'],['reused','内容复用'],['waiting','等待'],['skipped','跳过']
];
const freshJournal=()=>({state:'',source:'',start:'',end:'',skips:false,waiting:false,
    problem:'',skip_reason:'',sort:'recent',size:20});
const freshWaiting=()=>({q:'',reason:'',sort:''});
const freshCellSearch=()=>({q:'',side:'',type:'',field:'',changed:false,exact:false,sensitive:false});
const freshReview=()=>({state:'',q:'',root:'',ext:'',status:'',baseline:false,starred:false,latest:false,start:'',end:'',sort:'',page:1,size:25});
const emptyList = ()=>({
        items: [],
        total: 0,
        page: 1,
        size: 25
    });
const blank = {
    roots: [],
    trend: [],
    groups: [],
    recent: [],
    files: 0,
    versions: 0,
    today: 0,
    pending: 0,
    objects: 0,
    failures: 0,
    recovery: 0,
    settings: {
        theme: '浅色',
        interval: 300,
        autostart: false
    },
    breakdown: {},
    watch: '正在连接',
    stamp: '',
    home: '',
    line_origin_exts: []
};
const descs = {
    '目录监控': '管理监控范围、排除规则和目录运行状态。',
    '文件管理': '按目录和类型查找文件，查看已保存的版本。',
    '变更记录': '按时间追溯文件活动，查看变更前后的版本。',
    '历史版本': '查看文件的每次保存，提取副本或恢复历史内容。',
    '版本对比': '选择同一文件的两个版本，定位内容变化。',
    '复核工作台':'逐个版本登记复核结论，集中查看需要跟进的问题。',
    '差异检索':'跨文件查询可见事件的已解析差异，打开原始版本对复核。',
    '历史正文检索':'在已保存的文本版本中查找字词、编号或整行内容。',
    '相同内容追溯':'按已保存的 SHA-256 查找跨文件副本、正文回退和共享对象的版本引用。',
    '逐行来源':'从目标文本版本逐版向前追溯，定位每行的保存来源。',
    '历史版本交付篮':'集中选择各文件的具体历史副本，打包交付并核查约定版本。',
    '路径沿革':'追踪路径侧的进入、移出和删除记录，区分同名文件的保存身份。',
    '清单三方对照':'以较早清单为参照，比较两份后续结果并定位冲突或路径争用。',
    '历史原件预览':'按文本行或十六进制字节核对已保存的原件。',
    '目录清单':'保存最近一次完成扫描的文件清单，对照两个时点的路径、版本和大小。',
    '审计中心': '查看目录配置、数据导出、历史恢复等管理操作。',
    '系统设置': '配置本机监控、界面外观与版本仓库。'
};
const app = createApp({
    render: window.FG_VIEW,
    data: ()=>({
            s: structuredClone(blank),
            summaryError: '',
            demo: demoMode,
            demoContentSha: window.FILEGUARD_EXAMPLE?.contentCatalog?.example || '',
            demoLineage: window.FILEGUARD_EXAMPLE?.lineOrigins?.example || null,
            demoBundle: window.FILEGUARD_EXAMPLE?.versionBundle?.example || [],
            demoSnapshots: window.FILEGUARD_EXAMPLE?.snapshotPreview?.examples || {},
            native: nativeMode,
            nav: columns.map((v, i)=>[
                    v,
                    navIcons[i]
                ]),
            descs,
            page: '系统总览',
            days: 7,
            theme: '浅色',
            prefs: {
                ...blank.settings
            },
            palette: [
                '#416eae',
                '#53a697',
                '#dfb26b',
                '#9183ba',
                '#aab8cb'
            ],
            listResult: null,
            findForm:freshFinder(),findApplied:null,found:null,finderBusy:false,presets:[],presetName:'',presetId:0,
            textForm:freshTextHistory(),textApplied:null,textFileLabel:'',textResult:null,textCursors:[],
            textBusy:false,textError:'',textReturn:false,
            contentForm:freshContent(),contentApplied:null,contentGroups:null,contentBusy:false,contentError:'',
            contentSelected:null,contentRefs:null,contentRefsBusy:false,contentRefsError:'',
            contentScoped:false,contentRefSort:'recent',contentRefSize:25,contentReturn:false,
            contentCheck:null,contentCheckBusy:false,contentCheckError:'',
            lineageForm:freshLineage(),lineageApplied:null,lineageData:null,lineageVersions:[],
            lineageFile:null,lineageBusy:false,lineageError:'',lineageReturn:false,lineageBack:'',
            cellSearch:freshCellSearch(),cellHits:null,cellSig:'',cellBusy:false,
            reviewFilter:freshReview(),reviews:{...emptyList(),pages:1,counts:{}},reviewBusy:false,reviewReturn:false,
            reviewSelected:[],
            bundleRows:[],bundleLabel:'',bundlePaths:false,bundleData:null,bundleActive:null,bundleBusy:false,bundleError:'',
            pathForm:freshPath(),pathResult:null,pathApplied:null,pathBusy:false,pathError:'',pathReturn:false,pathPrevious:null,
            pathRelations:['新占用记录','删除记录','移入范围','移出范围','范围内路径变化','重命名','移动','原位置记录'],
            triRoot:0,triList:[],triForm:freshTri(),triApplied:null,triData:null,triError:'',
            triBusy:false,triReturn:false,
            triKinds:['相同','仅左侧变动','仅右侧变动','两侧结果相同','两侧互补','两侧内容冲突','两侧路径冲突','两侧路径与内容冲突','移出与变动冲突'],
            snapshotFile:null,snapshotVersions:[],snapshotForm:freshSnapshot(),snapshotData:null,
            snapshotApplied:null,snapshotBusy:false,snapshotError:'',snapshotBack:'',
            reviewStates:['待复核','需跟进','已复核'],historyReview:'',storageData:null,
            gridFilter:'',gridTarget:'',gridLocate:'new',
            cpRoot:0,cpOld:0,cpNew:0,checkpoints:[],cpLabel:'',cpKind:'',cpQ:'',cpSort:'',cpSame:false,cpData:null,cpPage:1,cpBusy:false,
            runtime:null,ruleHistory:null,
            rootQuery: '',
            rootScope: '全部',
            rootFocus: null,
            listLoading: false,
            eventReturn: null,
            f: freshFilter(),
            p: 1,
            file: null,
            versions: [],
            versionQuery: '',
            versionDay: '',
            versionPage: 1,
            versionPageSize: 10,
            fileScopes: [['','当前监控范围'],['all','全部历史文件'],['deleted','已删除'],['excluded','规则已排除'],['removed','目录已移除']],
            left: 0,
            right: 0,
            diff: null,
            diffPair: '',
            diffLoading: false,
            dp: 1,
            sheet: '',
            diffMode: 'aligned',
            diffKind: '',
            diffCategory: '',
            searchIn:'', exact:false, caseSensitive:false, diffField:'', recordId:'',
            listSize:25, diffSize:40, versionStatus:'', rootOrder:'',
            displayMode:'auto', grid:null, gridSheet:'', gridPage:1, gridCol:1, expandRows:false, gridError:'',
            parseStates:['初始快照','待解析','已解析','属性对比','解析失败'],
            loc: '',
            dialog: null,
            scanOpener: null,
            message: '',
            busy: false,
            notifications: false,
            picks: emptyList(),
            pickQ: '',
            pickScope: 'all',
            pickLoading: false,
            pickPage: 1,
            flags: {},
            kinds: [
                '初始建档',
                '新增',
                '内容修改',
                '属性修改',
                '重命名',
                '移动',
                '删除',
                '历史恢复',
                '恢复前快照',
                '已撤回'
            ]
        }),
    watch: {
        dialog: {
            flush:'post',
            handler (current,previous) {
                if(isScanPanel(current)){
                    this.$refs.dialogClose?.focus?.({preventScroll:true});
                }else if(isScanPanel(previous)){
                    const trigger=this.scanOpener;
                    this.scanOpener=null;
                    if(!current&&trigger?.isConnected&&trigger.getClientRects().length&&!trigger.matches(':disabled'))
                        trigger.focus({preventScroll:true});
                }
            }
        }
    },
    computed: {
        listQuery () {
            const commands=listCommands[this.page];
            if(!commands)return null;
            const filters={...this.f};
            const args={...filters,page:this.p,size:this.listSize};
            return {...commands,key:JSON.stringify([commands.table,args]),filters,args};
        },
        list () {
            const query=this.listQuery, result=this.listResult;
            if(result&&query?.key===result.query.key)return result.data;
            const empty={...emptyList(),size:this.listSize};
            if(!query||!result||query.table!==result.query.table)return empty;
            const {actions,sources}=result.data;
            return {...empty,actions,sources};
        },
        journalComparison () {
            if(this.dialog?.type!=='scan_log'||this.dialog.selectedRuns.length!==2)return null;
            const [before,after]=[...this.dialog.selectedRuns].sort((a,b)=>a.id-b.id);
            const metrics=scanMetrics.map(([key,label])=>{
                const left=key==='elapsed_ms'&&!before.ended?null:before[key];
                const right=key==='elapsed_ms'&&!after.ended?null:after[key];
                return {key,label,before:left,after:right,delta:left==null||right==null?null:right-left};
            });
            return {before,after,metrics};
        },
        scanFiltersPending () {
            const d=this.dialog;
            return !!(d?.applied&&['scan_log','waiting_files'].includes(d.type)&&
                JSON.stringify(d.filters)!==JSON.stringify(d.applied));
        },
        activeContentVersion () {return this.versions.find(v=>v.id===this.right);},
        snapshotShowsHex () {return this.snapshotForm.mode==='hex'||(this.snapshotForm.mode==='auto'&&this.snapshotData?.mode==='hex');},
        ledgerEnabled () {return this.versions.some(v=>ledgerExt.includes(v.ext));},
        ledgerSlice () {return this.dialog?.type==='ledger'?Ledger.paginate(this.ledgerData(),this.dialog.page):Ledger.paginate([],1);},
        matchedVersions () {
            const query=this.versionQuery.trim();
            const number=/^v?(\d+)$/i.exec(query);
            return this.versions.filter(v=>(!query||(number&&v.num===Number(number[1]))||
                (/^[a-f0-9]{6,64}$/i.test(query)&&v.sha.startsWith(query.toLowerCase())))&&
                (!this.versionStatus||v.status===this.versionStatus)&&
                (!this.historyReview||v.review===this.historyReview)&&
                (!this.versionDay||v.stamp.slice(0,10)===this.versionDay));
        },
        versionPages () {
            return Math.max(1,Math.ceil(this.matchedVersions.length/this.versionPageSize));
        },
        visibleVersions () {
            const start=(this.versionPage-1)*this.versionPageSize;
            return this.matchedVersions.slice(start,start+this.versionPageSize);
        },
        formatView () {
            const ext=this.diff?.ext;
            if(this.diff?.is_source&&this.diff.mode==='coordinate')return ['lines','逐行修订'];
            if(this.diff?.is_excel)return ['grid','工作表整行'];
            if(this.diff?.is_word)return ['word','段落修订'];
            if(ext==='.odt')return ['word','按段落复核'];
            if(ext==='.ods')return ['paths','工作表位置'];
            if(ext==='.odp')return ['pages','按幻灯片复核'];
            if(ext==='.pdf')return ['pages','按页复核'];
            if(ext==='.pptx')return ['pages','按幻灯片复核'];
            if(['.csv','.tsv'].includes(ext))return ['records','按数据行'];
            if(['.json','.jsonl','.ndjson','.yaml','.yml','.xml'].includes(ext))return ['paths','字段路径'];
            if(['.ini','.toml','.ipynb','.srt','.svg','.xsd','.xsl','.xslt','.csproj','.props','.targets'].includes(ext))return ['paths','按结构位置'];
            if(['.epub','.eml','.gpx'].includes(ext))return ['paths',ext==='.eml'?'正文与附件':ext==='.epub'?'章节与资源':'轨迹与航点'];
            const formatLabels={'.ics':'日程组件','.vcf':'联系人属性','.vtt':'字幕提示','.geojson':'地理要素','.wav':'音频格式与采样','.tar':'归档成员'};
            if(formatLabels[ext])return ['paths',formatLabels[ext]];
            if(ext==='.zip')return ['assets','压缩包清单'];
            if(['.png','.jpg','.jpeg','.webp','.gif','.tif','.tiff','.bmp'].includes(ext))return ['assets','图像属性'];
            if(['.txt','.md','.sql','.ini','.log','.py','.js','.ts','.css','.html','.cfg','.ps1','.psm1','.bat','.cmd','.sh','.rs','.go','.c','.h','.cpp','.hpp','.java','.kt','.jsx','.tsx','.vue','.scss','.rst','.diff','.patch'].includes(ext))return ['lines','逐行修订'];
            return ['detail','明细表'];
        },
        presentation () {
            if(this.displayMode==='detail'||(this.diff?.is_excel&&this.diffFiltered))return 'detail';
            return this.formatView[0];
        },
        groupedChanges () {
            const groups=new Map();
            for(const row of this.diff?.items || []) {
                const group=this.presentation==='records'?[row.record_key,row.location.split(' · ')[0]].filter(Boolean).join(' · '):row.sheet;
                if(!groups.has(group))groups.set(group,[]);
                groups.get(group).push(row);
            }
            return [...groups];
        },
        diffFiltered () {
            return !!(this.sheet||this.loc.trim()||this.diffKind||this.diffCategory||this.searchIn||this.exact||this.caseSensitive||this.diffField||this.recordId);
        },
        rangeError () {
            if(this.page==='文件管理' && this.f.min_bytes!==''&&this.f.max_bytes!==''&&Number(this.f.min_bytes)>Number(this.f.max_bytes))return '最大字节数不能小于最小字节数';
            if(this.f.sha&&!/^[a-fA-F0-9]{1,64}$/.test(this.f.sha.trim()))return '摘要应为 1 至 64 位十六进制字符';
            return ['文件管理','变更记录','审计中心'].includes(this.page) && this.f.start && this.f.end && this.f.start>this.f.end
                ? '结束日期不能早于开始日期' : '';
        },
        activeRoots () {
            return this.s.roots.filter((r)=>r.active).length;
        },
        rootTabs () {
            return ['全部','需关注','已暂停','监控启用','等待保存','有跳过项'].map(label=>({
                label,count:this.s.roots.filter(r=>this.inRootScope(r,label)).length
            }));
        },
        visibleRoots () {
            const q=searchPath(this.rootQuery);
            return this.s.roots.filter(r=>(!this.rootFocus || r.id===this.rootFocus)&&
                this.inRootScope(r,this.rootScope)&&searchPath(r.path).includes(q)).sort((a,b)=>this.rootOrder==='count'?b.total-a.total:0);
        },
        visibleFolders () {
            if (this.dialog?.type!=='tree') return [];
            const q=searchPath(this.dialog.query);
            return this.dialog.folders.filter(f=>searchPath(f.path).includes(q));
        },
        alerts () {
            const alerts=this.s.roots.filter(r=>r.active&&r.error).map(r=>({
                root:r.id,label:this.base(r.path)+'：'+r.error
            }));
            if (this.s.recovery) alerts.push({root:null,label:this.s.recovery+' 项历史恢复等待核对'});
            if (this.s.failures) alerts.push({root:null,parser:true,label:this.s.failures+' 个版本解析失败'});
            return alerts;
        },
        statusText () {
            if(this.summaryError)return '监控引擎暂不可用';
            if(!this.s.stamp)return '正在连接监控引擎';
            return this.alerts.length ? '监控需要关注' : this.activeRoots ? '监控运行中' : this.s.roots.length ? '监控已暂停' : '等待添加目录';
        },
        dateText () {
            return this.s.stamp ? new Date(this.s.stamp).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : '正在连接';
        },
        metrics () {
            const b = this.s.breakdown;
            return [
                {
                    label: '监控文件',
                    value: this.s.files,
                    hint: '来自 ' + this.s.roots.length + ' 个目录',
                    icon: 'files',
                    tone: 'blue',
                    target: '文件管理'
                },
                {
                    label: '今日变更',
                    value: this.s.today,
                    hint: '新增 ' + (b['新增'] || 0) + ' · 修改 ' + (b['内容修改'] || 0) + ' · 删除 ' + (b['删除'] || 0),
                    icon: 'activity',
                    tone: 'green',
                    target: '变更记录'
                },
                {
                    label: '历史版本',
                    value: this.s.versions,
                    hint: '已保存 ' + this.s.objects + ' 个独立快照',
                    icon: 'layers',
                    tone: 'violet',
                    target: '历史版本'
                },
                {
                    label: '待处理任务',
                    value: this.s.pending,
                    hint: this.s.pending ? '扫描与解析任务进行中' : '扫描与解析队列空闲',
                    icon: 'list-checks',
                    tone: 'amber',
                    target: '目录监控'
                }
            ];
        },
        ceil () {
            return Math.max(3, Math.ceil(Math.max(0, ...this.s.trend.flatMap((d)=>[
                    d.edited,
                    d.added,
                    d.other
                ])) / 3) * 3);
        },
        area () {
            return 'M 34 117 L ' + this.s.trend.map((d, i)=>this.px(i) + ' ' + this.py(d.edited)).join(' L ') + ' L 624 117 Z';
        },
        donut () {
            let sum = 0;
            return this.s.files ? 'conic-gradient(' + this.s.groups.map((g, i)=>{
                const start = sum;
                sum += 100 * g[1] / this.s.files;
                return this.palette[i % 5] + ' ' + start + '% ' + sum + '%';
            }).join(',') + ')' : 'var(--line)';
        }
    },
    methods: {
        freshReviewForm:freshReview,
        num: (n)=>Number(n || 0).toLocaleString('zh-CN'),
        base: (path)=>String(path || '').split(/[\\/]/).filter(Boolean).pop() || path,
        sub: (rel)=>String(rel || '').split(/[\\/]/).slice(0, -1).join(' / '),
        parent (root, rel) {
            return [
                root,
                this.sub(rel)
            ].filter(Boolean).join(' / ');
        },
        stateTone (state) {
            return {'当前在册':'green','已删除':'red','目录已暂停':'amber'}[state] || 'neutral';
        },
        resetVersions () {
            this.versionQuery='';
            this.versionDay='';
            this.versionStatus='';this.historyReview='';
            this.versionPage=1;
        },
        bytes (n) {
            return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MiB' : n >= 1024 ? (n / 1024).toFixed(1) + ' KiB' : n + ' B';
        },
        fmt (s) {
            return s ? String(s).slice(0, 19).replace('T', ' ') : '尚未扫描';
        },
        shortTime (s) {
            return String(s).slice(0, 10) === this.s.stamp.slice(0, 10) ? s.slice(11, 16) : s.slice(5, 10);
        },
        tone (ext) {
            return [
                '.xlsx',
                '.xlsm',
                '.csv'
            ].includes(ext) ? 'green' : ext === '.pdf' ? 'red' : ext === '.pptx' ? 'amber' : [
                '.png',
                '.jpg',
                '.webp'
            ].includes(ext) ? 'violet' : 'blue';
        },
        fileIcon (ext) {
            return ({
                green: 'sheet',
                red: 'file-text',
                amber: 'presentation',
                violet: 'image',
                blue: 'file-text'
            })[this.tone(ext)];
        },
        kindTone (kind) {
            return [
                '修改',
                '内容修改',
                '属性修改'
            ].includes(kind) ? 'amber' : kind === '删除' ? 'red' : kind === '新增' ? 'green' : kind === '初始建档' ? 'neutral' : 'blue';
        },
        inRootScope (r,label) {
            if (label==='等待保存') return r.active&&r.waiting>0;
            if (label==='有跳过项') return r.skipped>0;
            if (label==='已暂停') return !r.active;
            if (label==='需关注') return r.active&&!!r.error;
            if (label==='监控启用') return !!r.active;
            return true;
        },
        clearRootFilter () {
            this.rootQuery='';
            this.rootScope='全部';
            this.rootOrder='';
            this.rootFocus=null;
        },
        async openAlert (alert) {
            if(alert.parser){
                this.reviewFilter={...freshReview(),status:'解析失败',baseline:true};
                await this.go('复核工作台');return;
            }
            await this.go(alert.root?'目录监控':'系统设置');
            if (alert.root) this.rootFocus=alert.root;
        },
        async scanRoots (root=null) {
            const ok=await this.perform('scan',root?{id:root.id}:{});
            if (ok&&this.demo) {
                setTimeout(()=>this.refresh(),500);
                setTimeout(()=>this.refresh(),1500);
            }
        },
        rstate (r) {
            return !r.active ? '已暂停' : r.progress ? '扫描中' : r.queued_source ? '等待扫描' : r.error ? '需关注' : '监控中';
        },
        px (i) {
            return 34 + 590 * i / Math.max(1, this.s.trend.length - 1);
        },
        py (v) {
            return 117 - v / this.ceil * 102;
        },
        points (k) {
            return this.s.trend.map((d, i)=>this.px(i) + ',' + this.py(d[k])).join(' ');
        },
        xlabel (i) {
            return i === 0 || i === this.s.trend.length - 1 || (this.days === 7 || i % (this.days === 14 ? 3 : 6) === 0) && i < this.s.trend.length - 2;
        },
        toast (msg) {
            this.message = String(msg);
            clearTimeout(this._msg);
            this._msg = setTimeout(()=>this.message = '', 4600);
        },
        async safe (fn) {
            try {
                return await fn();
            } catch (e) {
                const msg = String(e.message || e);
                if (this.dialog) this.dialog.error = msg;
                else this.toast(msg);
                return null;
            }
        },
        async refresh () {
            const seq = (this.flags.summary || 0) + 1;
            this.flags.summary = seq;
            try {
                const s = await request('summary', {
                    days: this.days
                });
                if (seq !== this.flags.summary) return false;
                this.s = s;
                this.summaryError = '';
                if (!this._started) {
                    this._started = true;
                    this.theme = s.settings.theme;
                    this.prefs = {
                        ...s.settings
                    };
                }
                return true;
            } catch (e) {
                if(seq===this.flags.summary)this.summaryError=String(e?.message || e || '连接失败');
                return false;
            }
        },
        async refreshWorkspace () {
            if(await this.refresh()&&!this.dialog)await this.loadList();
        },
        async go (page, filters:Partial<ListFilter> = {}) {
            const navigation=(this.flags.navigation||0)+1;
            this.flags.navigation=navigation;
            const isCurrent=()=>this.flags.navigation===navigation&&this.page===page;
            if (page==='目录监控') this.clearRootFilter();
            clearTimeout(this._timer);
            this.flags.list=(this.flags.list || 0)+1;
            this.flags.history=(this.flags.history || 0)+1;
            this.eventReturn=null;
            this.reviewReturn=false;
            this.textReturn=false;
            this.contentReturn=false;
            this.lineageReturn=false;
            this.pathReturn=false;
            this.triReturn=false;
            this.page = page;
            this.notifications = false;
            this.dialog = null;
            this.f = {...freshFilter(),...filters};
            this.p = 1;
            window.scrollTo(0, 0);
            if(page==='相同内容追溯'){
                if(filters.sha){
                    this.resetContent();
                    Object.assign(this.contentForm,{sha:filters.sha,mode:'all',empty:true});
                    await this.loadContentGroups();
                    if(isCurrent()&&this.contentGroups?.items[0]?.sha===filters.sha)
                        await this.selectContent(this.contentGroups.items[0]);
                } else if(!this.contentGroups&&!this.contentBusy)await this.loadContentGroups();
            }
            if(page==='差异检索'){
                await this.loadPresets();
                if(isCurrent())await this.findChanges();
            }
            if(page==='目录清单'){
                if(!this.s.roots.some(r=>r.id===this.cpRoot))this.cpRoot=this.s.roots[0]?.id||0;
                await this.loadCheckpoints();
            }
            if(page==='系统设置'){
                this.prefs = {...this.s.settings,theme:this.theme};
                await this.loadRuntime();
            }
            if(page==='复核工作台')await this.loadReview();
            if(page==='清单三方对照'&&!this.triList.length){
                this.triRoot=this.triRoot||this.s.roots[0]?.id||0;
                await this.loadTriList();
            }
            if(page==='历史版本交付篮'&&this.bundleRows.length&&!this.bundleData)await this.previewBundle();
            if ([
                '文件管理',
                '变更记录',
                '审计中心'
            ].includes(page)) await this.loadList();
            if ([
                '历史版本',
                '版本对比'
            ].includes(page) && this.file) {
                await this.selectFile(this.file, page);
            } else if ([
                '历史版本',
                '版本对比'
            ].includes(page)) {
                const needsDefault = () => isCurrent() && !this.file;
                try {
                    const found = await request('files', {
                        size: 1,
                        history: true
                    });
                    if (needsDefault() && found.items.length) await this.selectFile(found.items[0], page);
                } catch (e) {
                    if (needsDefault() && !this.dialog) this.toast(String(e?.message || e));
                }
            }
        },
        async metricGo (m) {
            if (m.target === '变更记录') {
                const day=this.s.stamp.slice(0,10);
                await this.go(m.target,{activity:true,start:day,end:day});
            } else await this.go(m.target);
        },
        async treeFor (r) {
            await this.safe(async ()=>{
                const folders = await request('folders', {
                    id: r.id, counts:true
                });
                this.dialog = {
                    type: 'tree',
                    query: '',
                    title: this.base(r.path),
                    root: r,
                    folders
                };
            });
        },
        async treeSelect (r, folder) {
            await this.go('文件管理',{root:r.id,prefix:folder});
        },
        async rootFiles (r) {
            await this.go('文件管理',{root:r.id});
        },
        async rootEvents (r) {
            await this.go('变更记录',{root:r.id});
        },
        recentDays (days: number) {
            const end=this.s.stamp.slice(0,10);
            const start=new Date(end+'T00:00:00Z');
            start.setUTCDate(start.getUTCDate()-days+1);
            this.f.start=start.toISOString().slice(0,10);
            this.f.end=end;
            return this.queryFirst();
        },
        async returnToEvents () {
            const saved=this.eventReturn;
            if (!saved) return;
            this.flags.history=(this.flags.history || 0)+1;
            this.eventReturn=null;
            this.dialog=null;
            this.page='变更记录';
            this.f={...saved.filters};
            this.p=saved.page;
            await this.loadList();
            await nextTick();
            window.scrollTo(0,saved.scroll);
        },
        searchLater () {
            this.flags.list=(this.flags.list || 0)+1;
            this.p=1;
            this.listLoading=true;
            clearTimeout(this._timer);
            this._timer = setTimeout(()=>this.queryFirst(), 170);
        },
        queryFirst () {
            clearTimeout(this._timer);
            this.p = 1;
            return this.loadList();
        },
        clearFilter () {
            this.f = freshFilter();
            return this.queryFirst();
        },
        async loadList () {
            const query=this.listQuery;
            if(!query)return;
            const marker = (this.flags.list || 0) + 1;
            this.flags.list = marker;
            if (this.rangeError) {
                this.listLoading=false;
                return;
            }
            this.listLoading=true;
            const isCurrent=()=>marker===this.flags.list&&query.key===this.listQuery?.key;
            try {
                const data=await request(query.table,query.args);
                if(!isCurrent())return;
                this.p=data.page;
                this.listResult={query:this.listQuery,data};
            } catch(e) {
                if(isCurrent()){
                    const {actions,sources}=this.list;
                    this.listResult={query,data:{...emptyList(),actions,sources,size:this.listSize}};
                    this.toast(String(e?.message || e));
                }
            } finally {
                if(marker===this.flags.list)this.listLoading=false;
            }
        },
        async perform (cmd, args, msg) {
            return this.safe(async ()=>{
                const r = await request(cmd, args);
                await this.refresh();
                this.toast(msg || r || '操作完成');
                return true;
            });
        },
        rootDialog (r) {
            this.dialog = {
                type: 'root',
                title: r ? '配置监控目录' : '添加监控目录',
                id: r?.id,
                path: r?.path || '',
                patterns: r?.patterns ?? '*.tmp',
                max_mb: r?.max_mb || 0
            };
        },
        async chooseDir () {
            await this.safe(async ()=>{
                let path = await window.__TAURI__.core.invoke('pick_path', {
                    kind: 'directory',
                    name: ''
                });
                if (path && this.dialog) this.dialog.path = path;
            });
        },
        async actRoot (r, action) {
            if (action === '移除') {
                this.dialog = {
                    type: 'confirm',
                    title: '移除监控目录',
                    body: '停止监控「' + r.path + '」？已保存的版本和记录将保留。',
                    cmd: 'root_action',
                    args: {
                        id: r.id,
                        action
                    },
                    submit: '移除目录'
                };
                return;
            }
            await this.perform('root_action', {
                id: r.id,
                action
            }, action === '暂停' ? '已暂停监控' : '已恢复监控');
        },
        scheduleReview () {
            clearTimeout(this._reviewTimer);
            this.flags.review=(this.flags.review||0)+1;
            this.reviewBusy=true;
            this._reviewTimer=setTimeout(()=>this.loadReview(true),180);
        },
        async loadReview (reset=false) {
            clearTimeout(this._reviewTimer);
            if(reset)this.reviewFilter.page=1;
            const seq=(this.flags.review||0)+1;
            this.flags.review=seq;this.reviewBusy=true;
            const result=await this.safe(()=>request('review_queue',{...this.reviewFilter}));
            if(this.flags.review===seq){this.reviewBusy=false;this.reviews=result||{...emptyList(),counts:{},pages:1};if(result)this.reviewFilter.page=result.page;}
        },
        async openReviewVersion (item) {
            this.reviewReturn=true;
            const ok=await this.selectFile({id:item.file_id,rel:item.rel,root:item.root,ext:item.ext});
            if(ok&&item.parent_id)await this.pair(item.parent_id,item.id);
        },
        editReview (v) {
            if(!v)return;
            this.dialog={type:'review',title:'复核 V'+v.num,id:v.id,state:v.review||'待复核',note:v.note||'',revision:v.revision||0};
        },
        reviewIsSelected (id) {return this.reviewSelected.some(v=>v.id===id);},
        selectReviewRows () {
            const unselected=this.reviews.items.filter(v=>!this.reviewIsSelected(v.id));
            if(this.reviewSelected.length+unselected.length>100){
                this.toast('每批最多选 100 个版本，请先取消部分选择');
                return;
            }
            for(const row of unselected)this.addReviewSelection(row);
        },
        addReviewSelection (row) {
            const {id,revision,rel,root,num}=row;
            this.reviewSelected.push({id,revision,rel,root,num});
        },
        hasBundleVersion (id) {return this.bundleRows.some(v=>v.id===id);},
        invalidateBundle () {
            this.flags.bundle=(this.flags.bundle||0)+1;
            this.bundleData=null;this.bundleActive=null;this.bundleBusy=false;this.bundleError='';
        },
        addBundleVersion (v) {
            if(this.hasBundleVersion(v.id)){
                this.toast('此版本已在交付篮');
                return;
            }
            if(this.bundleRows.length===100){
                this.toast('交付篮最多容纳 100 个版本');
                return;
            }
            this.bundleRows.push({id:v.id,num:v.num,rel:v.rel||this.file?.rel,root:v.root||this.file?.root});
            this.invalidateBundle();
            this.toast('V'+v.num+' 已加入交付篮');
        },
        removeBundleVersion (id) {
            this.bundleRows=this.bundleRows.filter(v=>v.id!==id);
            this.invalidateBundle();
        },
        clearBundle () {
            this.bundleRows=[];
            this.invalidateBundle();
        },
        async loadDemoBundle () {
            this.bundleRows=this.demoBundle.map(v=>({...v}));
            this.bundleLabel='';this.bundlePaths=false;
            await this.previewBundle();
        },
        async previewBundle () {
            if(!this.bundleRows.length)return;
            this.invalidateBundle();
            const seq=this.flags.bundle;
            const args={ids:this.bundleRows.map(v=>v.id),label:this.bundleLabel,include_paths:this.bundlePaths};
            this.bundleBusy=true;
            try {
                const result=await request('version_bundle_preview',args);
                if(seq===this.flags.bundle){this.bundleData=result;this.bundleActive={...args,token:result.token};}
            } catch (error) {
                if(seq===this.flags.bundle)this.bundleError=String(error.message||error);
            } finally {
                if(seq===this.flags.bundle)this.bundleBusy=false;
            }
        },
        async exportBundle (zip=false) {
            if(!this.bundleData?.complete||!this.bundleActive||this.bundleBusy||(zip&&!this.bundleData.ready))return;
            const args=this.bundleActive;
            const cmd=zip?'version_bundle_create':'version_bundle_csv';
            if(!this.demo){
                await this.saveFile(cmd,zip?'历史版本交付.zip':'历史版本交付明细.csv',null,args);
                return;
            }
            if(!zip){await this.downloadCsv(cmd,args,'历史版本交付明细.csv');return;}
            const encoded=await this.safe(()=>request(cmd,args));
            if(encoded)this.downloadBlob(new Blob([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))],{type:'application/zip'}),'示例历史版本交付.zip');
        },
        removeReviewSelection (id) {this.reviewSelected=this.reviewSelected.filter(v=>v.id!==id);},
        toggleReviewSelection (row) {
            if(this.reviewIsSelected(row.id))this.removeReviewSelection(row.id);
            else if(this.reviewSelected.length<100)this.addReviewSelection(row);
            else this.toast('每批最多选 100 个版本');
        },
        clearReviewPage () {
            const ids=new Set(this.reviews.items.map(v=>v.id));
            this.reviewSelected=this.reviewSelected.filter(v=>!ids.has(v.id));
        },
        openReviewBatch () {
            if(!this.reviewSelected.length)return;
            this.dialog={type:'review_batch',title:'批量版本复核',state:'',mode:'keep',note:'',reason:'',
                preview:null,loading:false,error:'',snapshot:'',result:null,onlyIssues:false};
        },
        reviewBatchArgs (dialog) {
            return {targets:this.reviewSelected.map(({id,revision})=>({id,revision})),
                state:dialog.state,mode:dialog.mode,note:dialog.mode==='keep'?'':dialog.note,reason:dialog.reason};
        },
        invalidateReviewBatch () {
            const dialog=this.dialog;
            dialog.preview=null;dialog.snapshot='';dialog.error='';dialog.onlyIssues=false;
        },
        async previewReviewBatch (refresh=false) {
            const dialog=this.dialog;
            if(dialog.loading||!this.reviewSelected.length)return;
            if(refresh){
                const revisions=new Map(dialog.preview.items.filter(v=>v.status==='conflict').map(v=>[v.id,v.revision]));
                for(const row of this.reviewSelected)if(revisions.has(row.id))row.revision=revisions.get(row.id);
            }
            this.invalidateReviewBatch();
            dialog.loading=true;
            const args=this.reviewBatchArgs(dialog);
            const snapshot=JSON.stringify(args);
            try {
                const result=await request('review_batch_preview',args);
                if(this.dialog===dialog&&snapshot===JSON.stringify(this.reviewBatchArgs(dialog))){
                    dialog.preview=result;dialog.snapshot=snapshot;
                }
            } catch (error) {
                if(this.dialog===dialog)dialog.error=String(error.message||error);
            } finally {
                if(this.dialog===dialog)dialog.loading=false;
            }
        },
        dropReviewBatchRow (id) {
            this.removeReviewSelection(id);
            this.invalidateReviewBatch();
        },
        async commitReviewBatch () {
            const dialog=this.dialog;
            const args=this.reviewBatchArgs(dialog);
            if(!dialog.preview?.token||JSON.stringify(args)!==dialog.snapshot||this.busy||dialog.loading)return;
            this.busy=true;dialog.error='';
            try {
                const result=await request('review_batch_apply',{...args,token:dialog.preview.token});
                if(this.dialog!==dialog)return;
                if(!result.applied){
                    dialog.preview=result.preview;dialog.onlyIssues=false;
                    dialog.error='批次未写入。请核对最新预览，再确认或调整选择。';
                    return;
                }
                dialog.result=result;dialog.preview=null;
                this.reviewSelected=[];
                await this.loadReview();
            } catch (error) {
                if(this.dialog===dialog)dialog.error=String(error.message||error);
            } finally {
                this.busy=false;
            }
        },
        freshFind:freshFinder,
        async openSnapshot (row,at=null) {
            const back=this.page;
            const current=this.file?.id===row.file_id?this.file:null;
            const file={id:row.file_id,rel:row.rel||current?.rel,root:row.root||current?.root};
            await this.go('历史原件预览');
            if(this.page!=='历史原件预览')return;
            const seq=(this.flags.snapshot||0)+1;
            this.flags.snapshot=seq;this.snapshotBusy=true;this.snapshotError='';
            this.snapshotBack=['历史版本','版本对比','历史正文检索','逐行来源'].includes(back)?back:'';
            this.snapshotFile=file;this.snapshotVersions=[];this.snapshotData=null;this.snapshotApplied=null;
            this.snapshotForm={...freshSnapshot(),id:row.id,at,mode:at===null?'auto':'text'};
            try {
                const versions=await request('history',{id:file.id});
                if(seq!==this.flags.snapshot)return;
                this.snapshotVersions=versions;
                await this.loadSnapshot();
            } catch (error) {
                if(seq===this.flags.snapshot)this.snapshotError=String(error.message||error);
            } finally {
                if(seq===this.flags.snapshot)this.snapshotBusy=false;
            }
        },
        async loadSnapshot (page=1,reuse=false) {
            const seq=(this.flags.snapshot||0)+1;
            this.flags.snapshot=seq;this.snapshotBusy=true;this.snapshotError='';
            const opts={...(reuse?this.snapshotApplied:this.snapshotForm)};
            for(const key of ['at','low','high'])if(opts[key]==='')opts[key]=null;
            if(reuse)opts.at=null;
            else {this.snapshotData=null;this.snapshotApplied=null;}
            try {
                const data=await request('snapshot_preview',{...opts,page});
                if(seq===this.flags.snapshot){this.snapshotData=data;this.snapshotApplied=opts;}
            } catch (error) {
                if(seq===this.flags.snapshot)this.snapshotError=String(error.message||error);
            } finally {
                if(seq===this.flags.snapshot)this.snapshotBusy=false;
            }
        },
        async resetSnapshotView () {
            const {id,mode,width,size}=this.snapshotForm;
            this.snapshotForm={...freshSnapshot(),id,mode,width,size};
            await this.loadSnapshot();
        },
        async exportSnapshot () {
            if(this.snapshotBusy||!this.snapshotData?.total)return;
            if(this.demo)await this.downloadCsv('snapshot_preview_csv',this.snapshotApplied,'历史原件预览.csv');
            else await this.saveFile('snapshot_preview_csv','历史原件预览.csv',null,this.snapshotApplied);
        },
        async saveSnapshotOriginal () {
            const id=this.snapshotForm.id;
            if(!id||this.demo)return;
            const chosen=this.snapshotVersions.find(v=>v.id===id);
            if(!chosen)return;
            const rel=this.snapshotFile.rel||'历史副本';
            const name=this.base(rel);
            const stem=name.replace(/\.[^.]+$/,'');
            await this.saveFile('copy',stem+'-V'+chosen.num+chosen.ext,id);
        },
        resetPath () {
            this.flags.path=(this.flags.path||0)+1;
            this.pathForm=freshPath();this.pathResult=null;this.pathApplied=null;
            this.pathBusy=false;this.pathError='';this.pathPrevious=null;
        },
        async openPath (row,mode='path') {
            const previous=this.page==='路径沿革'&&mode==='identity'&&this.pathResult?.mode!=='identity'?this.pathApplied:null;
            await this.go('路径沿革');
            if(this.page!=='路径沿革')return;
            this.resetPath();
            this.pathPrevious=previous;
            this.pathForm.mode=mode;
            this.pathForm.root=row.root_id||this.s.roots.find(r=>r.path===row.root)?.id||0;
            if(mode==='identity')this.pathForm.file=row.file_id||row.id;
            else this.pathForm.rel=row.rel||'';
            if(this.pathForm.file||this.pathForm.rel)await this.loadPath();
        },
        async restorePathScope () {
            if(!this.pathPrevious)return;
            const previous=this.pathPrevious;
            this.resetPath();
            this.pathForm={...previous};
            await this.loadPath();
        },
        async loadPath (page=1,identityPage=1,reuse=false) {
            const seq=(this.flags.path||0)+1;
            this.flags.path=seq;this.pathBusy=true;this.pathError='';
            const args={...(reuse?this.pathApplied:this.pathForm)};
            args.file ||= 0;
            if(!reuse){this.pathResult=null;this.pathApplied=null;}
            try {
                const result=await request('path_history',{...args,page,identity_page:identityPage});
                if(seq===this.flags.path){this.pathResult=result;this.pathApplied=args;}
            } catch (error) {
                if(seq===this.flags.path)this.pathError=String(error.message||error);
            } finally {
                if(seq===this.flags.path)this.pathBusy=false;
            }
        },
        async filterPathRelation (direction) {
            this.pathForm={...this.pathApplied,direction:this.pathApplied.direction===direction?'':direction};
            await this.loadPath();
        },
        async openPathEvent (row) {
            const seq=(this.flags.pathEvent||0)+1;
            this.flags.pathEvent=seq;
            const filters=this.flags.path;
            const result=await this.safe(()=>request('events',{event_id:row.id,size:1}));
            if(this.page!=='路径沿革'||!result||seq!==this.flags.pathEvent||filters!==this.flags.path)return;
            const event=result.items[0];
            if(!event?.file_id){this.toast('此记录已不在可见范围，请重新查询');return;}
            await this.fromEvent(event);
            if(['历史版本','版本对比'].includes(this.page))this.pathReturn=true;
        },
        async exportPath () {
            if(!this.pathResult?.total||this.pathBusy)return;
            if(this.demo)await this.downloadCsv('path_history_csv',this.pathApplied,'路径沿革.csv');
            else await this.saveFile('path_history_csv','路径沿革.csv',null,this.pathApplied);
        },
        canTraceLines (row) {
            return !!row&&this.s.line_origin_exts.includes(row.ext);
        },
        async openLineage (row,line=0) {
            const source=this.page;
            const file=this.file?.id===row.file_id?this.file:{id:row.file_id,rel:row.rel,root:row.root,ext:row.ext};
            await this.go('逐行来源');
            if(this.page!=='逐行来源')return;
            const seq=(this.flags.lineage||0)+1;
            this.flags.lineage=seq;
            this.lineageFile=file;
            this.lineageBack=['历史版本','版本对比','历史正文检索','历史原件预览'].includes(source)?source:'';
            this.lineageForm={...freshLineage(),id:row.id,low:line,high:line};
            this.lineageApplied=null;this.lineageData=null;this.lineageVersions=[];
            this.lineageBusy=true;this.lineageError='';
            try {
                const versions=await request('history',{id:file.id});
                if(seq!==this.flags.lineage)return;
                this.lineageVersions=versions.filter(v=>this.canTraceLines(v));
                await this.loadLineage();
            } catch (error) {
                if(seq===this.flags.lineage)this.lineageError=String(error.message||error);
            } finally {
                if(seq===this.flags.lineage)this.lineageBusy=false;
            }
        },
        async loadLineage (page=1,reuse=false) {
            const seq=(this.flags.lineage||0)+1;
            this.flags.lineage=seq;this.lineageBusy=true;this.lineageError='';
            const opts={...(reuse?this.lineageApplied:this.lineageForm)};
            for(const key of ['low','high'])opts[key] ||= 0;
            if(!reuse){this.lineageData=null;this.lineageApplied=null;}
            try {
                const report=await request('line_origins',{...opts,page});
                if(seq===this.flags.lineage){
                    this.lineageData=report;this.lineageApplied=opts;
                }
            } catch (error) {
                if(seq===this.flags.lineage)this.lineageError=String(error.message||error);
            } finally {
                if(seq===this.flags.lineage)this.lineageBusy=false;
            }
        },
        async changeLineageTarget () {
            this.lineageForm.origin=0;
            await this.loadLineage();
        },
        async resetLineageFilters () {
            const {id,depth,moves,size}=this.lineageForm;
            this.lineageForm={...freshLineage(),id,depth,moves,size};
            await this.loadLineage();
        },
        async filterLineageSource (row) {
            this.lineageForm={...this.lineageApplied,origin:row.id===this.lineageApplied?.origin?0:row.id};
            await this.loadLineage();
        },
        async openLineageVersion (origin,compare=false) {
            const target=this.lineageData.target;
            if(!await this.selectFile(this.lineageFile))return;
            this.lineageReturn=true;
            this.versionQuery='V'+origin.num;
            if(compare&&origin.id!==target.id)await this.pair(origin.id,target.id);
        },
        async exportLineage () {
            if(this.lineageBusy||!this.lineageData?.total)return;
            if(this.demo)await this.downloadCsv('line_origins_csv',this.lineageApplied,'逐行来源.csv');
            else await this.saveFile('line_origins_csv','逐行来源.csv',null,this.lineageApplied);
        },
        clearContentSelection () {
            this.flags.contentRefs=(this.flags.contentRefs||0)+1;
            this.flags.contentVerify=(this.flags.contentVerify||0)+1;
            this.contentSelected=null;this.contentRefs=null;this.contentRefsBusy=false;this.contentRefsError='';
            this.contentCheck=null;this.contentCheckBusy=false;this.contentCheckError='';
            this.contentScoped=false;this.contentRefSort='recent';this.contentRefSize=25;
        },
        resetContent () {
            this.flags.content=(this.flags.content||0)+1;
            this.clearContentSelection();
            this.contentForm=freshContent();this.contentApplied=null;this.contentGroups=null;
            this.contentBusy=false;this.contentError='';
        },
        async loadContentGroups (page=1,reuse=false) {
            const seq=(this.flags.content||0)+1;
            this.flags.content=seq;this.contentBusy=true;this.contentError='';
            const filters={...(reuse?this.contentApplied:this.contentForm)};
            if(!reuse){this.clearContentSelection();this.contentGroups=null;this.contentApplied=null;}
            try {
                const result=await request('content_groups',{...filters,page});
                if(seq!==this.flags.content)return;
                this.contentApplied=filters;this.contentGroups=result;
            } catch (error) {
                if(seq===this.flags.content)this.contentError=String(error.message||error);
            } finally {
                if(seq===this.flags.content)this.contentBusy=false;
            }
        },
        async selectContent (group) {
            this.clearContentSelection();
            this.contentSelected=group;
            await this.loadContentRefs();
        },
        contentRefArgs () {
            return {...(this.contentScoped?this.contentApplied:{}),sha:this.contentSelected.sha,
                sort:this.contentRefSort,size:this.contentRefSize};
        },
        async loadContentRefs (page=1) {
            if(!this.contentSelected)return;
            const seq=(this.flags.contentRefs||0)+1;
            this.flags.contentRefs=seq;this.contentRefsBusy=true;this.contentRefsError='';this.contentRefs=null;
            try {
                const result=await request('content_refs',{...this.contentRefArgs(),page});
                if(seq===this.flags.contentRefs)this.contentRefs=result;
            } catch (error) {
                if(seq===this.flags.contentRefs)this.contentRefsError=String(error.message||error);
            } finally {
                if(seq===this.flags.contentRefs)this.contentRefsBusy=false;
            }
        },
        async verifyContent () {
            const seq=(this.flags.contentVerify||0)+1;
            this.flags.contentVerify=seq;this.contentCheckBusy=true;this.contentCheck=null;this.contentCheckError='';
            try {
                const result=await request('content_verify',{sha:this.contentSelected.sha});
                if(seq===this.flags.contentVerify)this.contentCheck=result;
            } catch (error) {
                if(seq===this.flags.contentVerify)this.contentCheckError=String(error.message||error);
            } finally {
                if(seq===this.flags.contentVerify)this.contentCheckBusy=false;
            }
        },
        async exportContent (refs=false) {
            if(refs?this.contentRefsBusy||!this.contentRefs?.total:this.contentBusy||!this.contentGroups?.total)return;
            const cmd=refs?'content_refs_csv':'content_groups_csv';
            const name=refs?'正文引用明细.csv':'相同正文分组.csv';
            const args=refs?this.contentRefArgs():this.contentApplied;
            if(this.demo)await this.downloadCsv(cmd,args,name);
            else await this.saveFile(cmd,name,null,args);
        },
        async openContentVersion (row,compare=false) {
            const opened=await this.selectFile({id:row.file_id,rel:row.rel,root:row.root,ext:row.ext});
            if(!opened)return;
            this.versionQuery='V'+row.num;
            this.contentReturn=true;
            if(compare&&row.parent_id)await this.pair(row.parent_id,row.id);
        },
        resetTextSearch () {
            this.flags.text=(this.flags.text||0)+1;
            this.textForm=freshTextHistory();
            this.textApplied=null;this.textFileLabel='';this.textResult=null;this.textCursors=[];
            this.textBusy=false;this.textError='';
        },
        async searchThisFile () {
            const {id,rel}=this.file;
            await this.go('历史正文检索');
            this.resetTextSearch();
            this.textForm.file=id;this.textForm.latest=false;this.textFileLabel=rel;
        },
        async searchRootText (root) {
            await this.go('历史正文检索');
            this.resetTextSearch();
            this.textForm.root=root.id;
        },
        async searchText (step=0) {
            if((step>0&&!this.textResult?.next)||(step<0&&this.textCursors.length<2))return;
            const seq=(this.flags.text||0)+1;
            this.flags.text=seq;
            this.textBusy=true;
            this.textError='';
            const filters={...(step?this.textApplied:this.textForm)};
            const cursors=step>0?[...this.textCursors,this.textResult.next]:step<0?this.textCursors.slice(0,-1):[0];
            const before=cursors[cursors.length-1];
            const cap=step?this.textResult.cap:0;
            if(!step){this.textResult=null;this.textApplied=null;this.textCursors=[];}
            try {
                const result=await request('text_search',{...filters,before,cap});
                if(seq!==this.flags.text)return;
                this.textResult=result;
                this.textApplied=filters;
                this.textCursors=cursors;
            } catch (error) {
                if(seq===this.flags.text)this.textError=String(error.message||error);
            } finally {
                if(seq===this.flags.text)this.textBusy=false;
            }
        },
        async exportTextSearch () {
            if(this.textBusy||!this.textResult?.items.length)return;
            const args={...this.textApplied,cap:this.textResult.cap,before:this.textCursors[this.textCursors.length-1]};
            if(this.demo)await this.downloadCsv('text_search_csv',args,'历史正文命中.csv');
            else await this.saveFile('text_search_csv','历史正文命中.csv',null,args);
        },
        async openTextVersion (row, compare=false) {
            const ok=await this.selectFile({id:row.file_id,rel:row.rel,root:row.root,ext:row.ext});
            if(!ok)return;
            this.textReturn=true;
            this.versionQuery='V'+row.num;
            if(compare&&row.parent_id)await this.pair(row.parent_id,row.id);
        },
        async findChanges (page=1,filters=null) {
            const seq=(this.flags.find||0)+1;
            this.flags.find=seq;this.finderBusy=true;this.found=null;
            const args={...(filters||this.findForm)};
            const data=await this.safe(()=>request('finder',{...args,page}));
            if(seq!==this.flags.find)return;
            this.finderBusy=false;this.found=data;this.findApplied=data?args:null;
        },
        async exportFinder () {
            if(!this.findApplied||!this.found?.total)return;
            if(this.demo)await this.downloadCsv('finder_export',this.findApplied,'跨文件差异.csv');
            else await this.saveFile('finder_export','跨文件差异.csv',null,this.findApplied);
        },
        async openFound (r) {
            const ok=await this.selectFile({id:r.file_id,rel:r.rel,root:r.root_path,ext:r.ext});
            if(!ok)return;
            this.diffMode='aligned';
            await this.pair(r.old_v,r.new_v,{sheet:r.sheet||'',location:r.location||''});
        },
        async loadPresets () {this.presets=await this.safe(()=>request('finder_presets'))||[];},
        async savePreset () {
            const id=await this.safe(()=>request('finder_save',{...this.findForm,name:this.presetName}));
            if(id){this.presetName='';await this.loadPresets();this.presetId=id;}
        },
        async applyPreset () {
            const p=this.presets.find(p=>p.id===this.presetId);
            this.findForm={...freshFinder(),...(p?.filters||{})};await this.findChanges();
        },
        async forgetPreset () {
            if(!this.presetId)return;
            this.dialog={type:'confirm',title:'移除保存的查询条件',body:this.presets.find(p=>p.id===this.presetId)?.name,
                         cmd:'finder_forget',args:{id:this.presetId},submit:'移除'};
        },
        policyDialog (r) {
            this.dialog={type:'capture_policy',title:'监听采集策略',root:r.id,path:r.path,settle_ms:r.settle_ms||1500,all_types:!!r.all_types};
        },
        rememberScanOpener () {
            if(isScanPanel(this.dialog))return;
            const trigger=document.activeElement as HTMLElement;
            this.scanOpener=trigger?.matches?.('button:not(:disabled),a[href],[tabindex]')&&trigger.getClientRects?.().length?trigger:null;
        },
        trapScanTab (event: KeyboardEvent) {
            const dialog=this.$refs.dialogPanel as HTMLElement;
            const candidates=dialog?.querySelectorAll?.<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),summary,a[href],[tabindex="0"]');
            if(!candidates)return;
            const controls=Array.from(candidates).filter(control=>{
                const collapsed=control.closest('details:not([open])');
                return control.getClientRects().length&&getComputedStyle(control).visibility==='visible'&&
                    (!collapsed||collapsed.firstElementChild===control);
            });
            if(!controls.length)return;
            const active=document.activeElement, first=controls[0], last=controls.at(-1);
            if(!controls.some(control=>control===active)||(event.shiftKey?active===first:active===last)){
                event.preventDefault();
                (event.shiftKey?last:first).focus();
            }
        },
        async waitingDialog (root, previousJournal=null) {
            this.rememberScanOpener();
            this.dialog={type:'waiting_files',title:'当前等待队列',root:root.id,path:root.path,
                filters:freshWaiting(),applied:null,loading:false,error:'',reasons:[],data:null,previousJournal};
            await this.loadWaiting();
        },
        async loadWaiting (page=1, filters=null) {
            const d=this.dialog;
            if(d?.type!=='waiting_files')return;
            await this.loadScanPanel(d,filters||d.applied||freshWaiting(),page);
        },
        async applyWaiting () {
            const d=this.dialog;
            if(d?.type!=='waiting_files')return;
            d.filters.q=d.filters.q.trim();
            await this.loadWaiting(1,d.filters);
        },
        async resetWaiting () {
            this.dialog.filters=freshWaiting();
            await this.applyWaiting();
        },
        async waitingReason (value) {
            const filters=this.dialog.filters;
            filters.reason=filters.reason===value?'':value;
            await this.applyWaiting();
        },
        async scanJournal (root) {
            this.rememberScanOpener();
            this.dialog={type:'scan_log',title:'扫描运行记录',root:root.id,path:root.path,
                filters:freshJournal(),applied:null,loading:false,error:'',data:null,selectedRuns:[],
                sources:[],problems:[],skipReasons:[],states:scanStates};
            await this.loadJournal();
        },
        async loadJournal (page=1, filters=null) {
            const d=this.dialog;
            if(d?.type!=='scan_log')return;
            await this.loadScanPanel(d,filters||d.applied||freshJournal(),page);
        },
        async loadScanPanel (d, filters, page) {
            const seq=(this.flags.scanPanel||0)+1,applied={...filters};
            this.flags.scanPanel=seq;
            d.loading=true;d.error='';d.data=null;
            try {
                const result=await request(d.type,{root:d.root,...applied,page});
                if(this.dialog!==d||this.flags.scanPanel!==seq)return;
                d.data=result;d.applied=applied;
                if(d.type==='scan_log'){
                    d.sources=result.sources;
                    d.problems=result.facets.problems;
                    d.skipReasons=result.facets.skip_reasons;
                }else d.reasons=result.reasons;
            }catch(e){
                if(this.dialog===d&&this.flags.scanPanel===seq)d.error=String(e.message||e);
            }finally{
                if(this.dialog===d&&this.flags.scanPanel===seq)d.loading=false;
            }
        },
        async applyJournal () {
            const d=this.dialog;
            if(d?.type!=='scan_log')return;
            const {start,end}=d.filters;
            const invalid=[start,end].some(value=>{
                if(!value)return false;
                if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.startsWith('0000'))return true;
                const day=new Date(value+'T00:00:00Z');
                return Number.isNaN(day.valueOf())||day.toISOString().slice(0,10)!==value;
            });
            if(invalid||(start&&end&&start>end)){
                d.error=invalid?'请输入有效的起止日期。':'开始日期应早于或等于结束日期。';
                return;
            }
            await this.loadJournal(1,d.filters);
        },
        async resetJournal () {
            this.dialog.filters=freshJournal();
            await this.applyJournal();
        },
        async journalFacet (key,value) {
            const filters=this.dialog.filters;
            filters[key]=filters[key]===value?'':value;
            await this.applyJournal();
        },
        scanFacetChoices (options, value) {
            return value&&!options.includes(value)?[value,...options]:options;
        },
        async journalWaiting () {
            const d=this.dialog;
            if(d?.type==='scan_log')await this.waitingDialog({id:d.root,path:d.path},d);
        },
        async backToJournal () {
            const d=this.dialog;
            if(d?.type!=='waiting_files')return;
            if(!d.previousJournal){await this.scanJournal({id:d.root,path:d.path});return;}
            this.dialog=d.previousJournal;
            await this.loadJournal(this.dialog.data?.page||1);
        },
        journalHasRun (id) {
            return this.dialog.selectedRuns.some(r=>r.id===id);
        },
        toggleJournalRun (run) {
            const d=this.dialog;
            if(d?.type!=='scan_log')return;
            if(this.journalHasRun(run.id))d.selectedRuns=d.selectedRuns.filter(r=>r.id!==run.id);
            else if(run.status!=='进行中'&&d.selectedRuns.length<2)d.selectedRuns.push(run);
        },
        journalMetric (key, value, signed=false) {
            if(value==null)return '—';
            const absolute=key==='read_bytes'?this.bytes(Math.abs(value)):this.num(Math.abs(value));
            return (value<0?'−':signed&&value>0?'+':'')+absolute;
        },
        async exportJournal () {
            const d=this.dialog;
            if(d?.type!=='scan_log'||!d.data?.total||d.loading)return;
            const args={root:d.root,...d.applied,detail:true};
            if(this.demo)await this.downloadCsv('scan_log_export',args,'扫描运行记录.csv');
            else await this.saveFile('scan_log_export','扫描运行记录.csv',null,args);
        },
        cellOptions () {return {...this.cellSearch,old:this.left,new:this.right,sheet:this.gridSheet,mode:this.diffMode};},
        async searchCells (offset=0) {
            const args=this.cellOptions(),sig=JSON.stringify(args),seq=(this.flags.cell||0)+1;
            this.flags.cell=seq;this.cellBusy=true;this.cellHits=null;
            const data=await this.safe(()=>request('sheet_find',{...args,offset}));
            if(seq!==this.flags.cell)return;
            this.cellBusy=false;this.cellHits=data;this.cellSig=sig;
        },
        async jumpCell (hit) {this.gridLocate=hit.side;this.gridTarget=hit.address;await this.loadGrid(true);},
        async loadRuntime () {this.runtime=await this.safe(()=>request('runtime'));},
        async loadCheckpoints () {
            const root=this.cpRoot, mark=(this.flags.cpList||0)+1;
            this.flags.cpList=mark;
            this.flags.cpDiff=(this.flags.cpDiff||0)+1;
            this.cpData=null;this.cpBusy=false;this.cpOld=0;this.cpNew=0;this.checkpoints=[];
            if(!root)return;
            const items=await this.safe(()=>request('checkpoints',{root}));
            if(mark!==this.flags.cpList||!items)return;
            this.checkpoints=items;this.cpNew=items[0]?.id||0;this.cpOld=items[1]?.id||0;
            await this.loadCheckpointDiff();
        },
        async saveCheckpoint () {
            if(this.cpBusy||!this.cpLabel.trim())return;
            this.cpBusy=true;
            try{
                const saved=await this.safe(()=>request('checkpoint_create',{root:this.cpRoot,label:this.cpLabel}));
                if(saved){this.cpLabel='';await this.loadCheckpoints();this.toast('目录清单已保存');}
            }finally{this.cpBusy=false;}
        },
        cpArgs () {return {old:this.cpOld,new:this.cpNew,q:this.cpQ,kind:this.cpKind,unchanged:this.cpSame,sort:this.cpSort,page:this.cpPage,size:25};},
        async loadCheckpointDiff (page=1) {
            this.cpPage=page;this.cpData=null;
            const mark=(this.flags.cpDiff||0)+1;
            this.flags.cpDiff=mark;this.cpBusy=false;
            if(!this.cpOld||!this.cpNew||this.cpOld===this.cpNew)return;
            this.cpBusy=true;
            const data=await this.safe(()=>request('checkpoint_diff',this.cpArgs()));
            if(mark===this.flags.cpDiff){
                this.cpBusy=false;this.cpData=data;if(data)this.cpPage=data.page;
            }
        },
        async openCheckpointRow (item) {
            const root=this.s.roots.find(r=>r.id===this.cpRoot);
            const rel=item.new_path||item.old_path;
            if(await this.selectFile({id:item.file_id,root:root.path,rel,ext:'.'+rel.split('.').pop().toLowerCase()})&&item.old&&item.new&&item.old!==item.new)
                await this.pair(item.old,item.new);
        },
        async exportCheckpoints () {
            if(this.demo)await this.downloadCsv('checkpoint_export',this.cpArgs(),'目录清单对照.csv');
            else await this.saveFile('checkpoint_export','目录清单对照.csv',null,this.cpArgs());
        },
        async fromCheckpointThree () {
            if(this.triRoot!==this.cpRoot){
                this.triRoot=this.cpRoot;
                this.triList=[];
                this.triData=null;
            }
            await this.go('清单三方对照');
        },
        async loadTriList () {
            const seq=(this.flags.tri||0)+1;
            this.flags.tri=seq;this.triBusy=true;
            this.triList=[];this.triForm=freshTri();this.triData=null;this.triApplied=null;this.triError='';
            try {
                const list=this.triRoot?await request('checkpoints',{root:this.triRoot}):[];
                if(seq!==this.flags.tri)return;
                this.triList=list;
                if(list.length>=3){
                    Object.assign(this.triForm,{base:list.at(-1).id,left:list[1].id,right:list[0].id});
                    await this.loadTri();
                }
            } catch (error) {
                if(seq===this.flags.tri)this.triError=String(error.message||error);
            } finally {
                if(seq===this.flags.tri)this.triBusy=false;
            }
        },
        async loadTri (page=1,reuse=false) {
            const seq=(this.flags.tri||0)+1;
            this.flags.tri=seq;this.triBusy=true;this.triError='';
            const args={...(reuse?this.triApplied:this.triForm)};
            if(!reuse){this.triData=null;this.triApplied=null;}
            try {
                const data=await request('checkpoint_three',{...args,page});
                if(seq===this.flags.tri){this.triData=data;this.triApplied=args;}
            } catch (error) {
                if(seq===this.flags.tri)this.triError=String(error.message||error);
            } finally {
                if(seq===this.flags.tri)this.triBusy=false;
            }
        },
        async swapTri () {
            const {left,right}=this.triForm;
            Object.assign(this.triForm,{left:right,right:left,kind:'',
                sort:this.triForm.sort==='left'?'right':this.triForm.sort==='right'?'left':this.triForm.sort});
            await this.loadTri();
        },
        async resetTriFilters () {
            const {base,left,right}=this.triForm;
            this.triForm={...freshTri(),base,left,right};
            await this.loadTri();
        },
        async openTriVersion (row,first,second=null) {
            const version=second||first;
            const root=this.s.roots.find(r=>r.id===this.triData.meta.base.root_id);
            const rel=version.rel;
            if(!await this.selectFile({id:row.file_id,root:root?.path||'',rel,ext:rel.includes('.')?'.'+rel.split('.').pop().toLowerCase():''}))return;
            this.triReturn=true;this.versionQuery='V'+version.num;
            if(second&&first.id!==second.id)await this.pair(first.id,second.id);
        },
        async exportTri () {
            if(this.triBusy||!this.triData?.total)return;
            if(this.demo)await this.downloadCsv('checkpoint_three_csv',this.triApplied,'目录清单三方对照.csv');
            else await this.saveFile('checkpoint_three_csv','目录清单三方对照.csv',null,this.triApplied);
        },
        async showRuleHistory (r) {
            const entries=await this.safe(()=>request('rule_history',{root:r.id}));
            if(entries)this.dialog={type:'rule_history',title:'采集规则沿革',path:r.path,entries};
        },
        async previewRules () {
            const d=this.dialog;
            d.error='';d.samples=null;
            const args={paths:d.paths||'',patterns:d.patterns||'',max_mb:d.max_mb,bytes:d.probeBytes};
            const result=await this.safe(()=>request('rule_preview',args));
            if(this.dialog===d&&this.ruleSignature(d)===JSON.stringify(args)){d.samples=result;d.probed=this.ruleSignature(d);}
        },
        ruleSignature (d) {return JSON.stringify({paths:d.paths||'',patterns:d.patterns||'',max_mb:d.max_mb,bytes:d.probeBytes});},
        async exportReviews () {
            if(this.reviewBusy||!this.reviews.total)return;
            if(this.demo)await this.downloadCsv('export_review',{...this.reviewFilter},'版本复核.csv');
            else await this.saveFile('export_review','版本复核.csv',null,{...this.reviewFilter});
        },
        async toggleStar (f) {
            if(await this.perform('star_file',{id:f.id,starred:!f.starred}))await this.loadList();
        },
        async loadStorage () {this.storageData=await this.safe(()=>request('storage'));},
        privateDialog () {
            clearTimeout(this._adminTimer);
            this.dialog={type:'private_records',title:'已移出普通日志的记录',password:'',entries:null,before:null};
        },
        async loadPrivate (more=false) {
            const d=this.dialog;
            const data=await this.safe(()=>request('private_records',{password:d.password,before:more?d.before:null}));
            d.password='';
            if(data&&this.dialog===d){
                d.entries=more?[...(d.entries||[]),...data.items]:data.items;d.before=data.before;d.error='';
                clearTimeout(this._adminTimer);this._adminTimer=setTimeout(()=>{if(this.dialog===d)this.dialog=null;},60000);
            }
        },
        recordDialog (item) {
            this.dialog={type:'admin',title:'管理变更记录 #'+item.id,id:item.id,revision:item.revision||0,
                action:item.kind==='已撤回'?'恢复展示':'更正',hidden:item.kind==='已撤回',caption:item.caption||'',reason:'',password:'',submit:'提交处置'};
        },
        async seeOriginal () {
            const d=this.dialog;
            const info=await this.safe(()=>request('record_detail',{id:d.id,password:d.password}));
            d.password='';
            if(info&&this.dialog===d){
                d.info=info;d.revision=info.revision;d.error='';
                clearTimeout(this._adminTimer);
                this._adminTimer=setTimeout(()=>{if(this.dialog===d){d.info=null;d.password='';}},60000);
            }
        },
        async receiptDialog () {
            this.dialog={type:'receipt',title:'文件保存核对',id:this.file.id,mode:'quick',verify:false,auto:false,loading:false,data:null,error:''};
            await this.readReceipt();
        },
        async readReceipt () {
            const d=this.dialog;if(d?.type!=='receipt')return;
            clearTimeout(this._receiptTimer);
            const seq=(this.flags.receipt||0)+1;this.flags.receipt=seq;
            d.loading=true;d.error='';d.data=null;
            try{
                const data=await request('save_receipt',{id:d.id,mode:d.mode,object:d.verify});
                if(this.dialog===d&&this.flags.receipt===seq)d.data=data;
            }catch(err){if(this.dialog===d&&this.flags.receipt===seq){d.data=null;d.error=String(err.message||err);}}
            finally{
                if(this.dialog===d&&this.flags.receipt===seq){
                    d.loading=false;
                    if(d.auto&&d.mode==='quick'&&!d.verify)this._receiptTimer=setTimeout(()=>{if(this.dialog===d&&d.auto)this.readReceipt();},5000);
                }
            }
        },
        async receiptScan () {
            const d=this.dialog;if(!d.data?.active)return;
            const msg=await this.safe(()=>request('scan',{id:d.data.root_id}));
            if(this.dialog===d&&msg){this.toast(msg);await this.readReceipt();}
        },
        async ledgerDialog () {
            const versions=this.versions.filter(v=>ledgerExt.includes(v.ext));
            if(!versions.length)return;
            const choose=(id,fallback)=>versions.some(v=>v.id===id)?id:fallback;
            this.dialog={type:'ledger',title:'台账对账与字段体检',versionsA:versions,versionsB:versions,
                a:choose(this.left,versions[1]?.id||versions[0].id),b:choose(this.right,versions[0].id),
                fileA:this.file,fileB:this.file,oa:null,ob:null,namesA:[],namesB:[],sheetA:'',sheetB:'',ha:1,hb:1,pairs:[],keys:[],colsA:[],colsB:[],
                keyTrim:false,trim:false,fold:false,width:false,typed:true,numeric:false,tolerance:'0',empty:false,
                q:'',status:'',differences:true,field:'',leftRow:'',rightRow:'',cellType:'',fieldMatch:null,onlySuppressed:false,sort:'',page:1,tab:'records',expand:null,report:null,
                profileSide:'r',profile:null,frequency:null,freqTerm:'',repeatOnly:false,
                templates:[],tid:0,tname:'',confirmRemove:false,find:'',choices:null,looking:false,error:'',loading:false};
            const d=this.dialog;await this.ledgerLoad();
            if(this.dialog===d)d.templates=await this.safe(()=>request('ledger_templates'))||[];
        },
        async ledgerSearch (page=1) {
            const d=this.dialog,seq=(this.flags.ledgerSearch||0)+1;this.flags.ledgerSearch=seq;d.looking=true;
            const result=await this.safe(()=>request('files',{q:d.find,scope:'all',ext:ledgerExt.join(','),size:15,page}));
            if(this.dialog===d&&seq===this.flags.ledgerSearch){d.choices=result;d.looking=false;}
        },
        async ledgerFile (f) {
            const d=this.dialog,seq=(this.flags.ledgerFile||0)+1;
            this.flags.ledgerFile=seq;this.flags.ledger=(this.flags.ledger||0)+1;
            d.loading=true;d.report=null;d.profile=null;d.oa=null;d.ob=null;d.choices=null;
            const all=await this.safe(()=>request('history',{id:f.id}));
            if(this.dialog!==d||this.flags.ledgerFile!==seq)return;
            const versions=(all||[]).filter(v=>ledgerExt.includes(v.ext));
            if(!versions.length){d.loading=false;d.error='所选文件没有可用的表格版本';return;}
            d.fileB=f;d.versionsB=versions;d.b=versions[0].id;d.sheetB='';d.hb=1;await this.ledgerLoad();
        },
        async ledgerLoad () {
            const d=this.dialog,seq=(this.flags.ledger||0)+1;this.flags.ledger=seq;
            d.loading=true;d.error='';d.report=null;d.profile=null;d.frequency=null;d.oa=null;d.ob=null;
            try{
                const fetchSource=(id,sheet)=>request('table_source',{id,sheet,report_problem:true});
                const a=await fetchSource(d.a,d.sheetA);
                if(this.dialog!==d||this.flags.ledger!==seq)return;
                d.namesA=a.sheets;d.sheetA=a.sheet;
                const b=d.a===d.b&&(!d.sheetB||d.sheetB===a.sheet)?a:await fetchSource(d.b,d.sheetB);
                if(this.dialog!==d||this.flags.ledger!==seq)return;
                d.namesB=b.sheets;d.sheetB=b.sheet;
                if(a.problem||b.problem)throw Error((a.problem?'左侧：'+a.problem:'')+(a.problem&&b.problem?' / ':'')+(b.problem?'右侧：'+b.problem:''));
                d.oa=Object.freeze(a);d.ob=Object.freeze(b);d.sheetA=a.sheet;d.sheetB=b.sheet;
                this.ledgerMap();
            }catch(err){if(this.dialog===d&&this.flags.ledger===seq)d.error=String(err.message||err);}
            finally{if(this.dialog===d&&this.flags.ledger===seq)d.loading=false;}
        },
        ledgerReset () {
            const d=this.dialog;d.fieldMatch=null;d.report=null;d.profile=null;d.frequency=null;d.page=1;d.expand=null;d.error='';d.tab='records';
        },
        ledgerMap () {
            const d=this.dialog;this.ledgerReset();d.colsA=[];d.colsB=[];d.keys=[];d.pairs=[];
            try{
                d.colsA=Ledger.headers(d.oa,d.ha);d.colsB=Ledger.headers(d.ob,d.hb);
                const model=Ledger.autoMap(d.colsA,d.colsB);d.keys=model.keys;d.pairs=model.pairs;
                if(model.keys[0].l>=0)this.ledgerRun();
            }catch(err){d.error=String(err.message||err);}
        },
        ledgerRun () {
            const d=this.dialog;this.ledgerReset();
            try{d.report=Object.freeze(Ledger.reconcile(d.oa,d.ob,d));if(d.status&&!d.report.counts[d.status])d.status='';}
            catch(err){d.error=String(err.message||err);}
        },
        ledgerTab (name) {
            const d=this.dialog;d.tab=name;d.page=1;d.expand=null;d.error='';
            if(name==='profile'){
                d.frequency=null;
                try{d.profile=Object.freeze(Ledger.profile(d.profileSide==='l'?d.oa:d.ob,d.profileSide==='l'?d.ha:d.hb));}
                catch(err){d.profile=null;d.error=String(err.message||err);}
            }
        },
        ledgerSwap () {
            const d=this.dialog;
            for(const [first,second] of [['a','b'],['fileA','fileB'],['versionsA','versionsB'],['oa','ob'],['sheetA','sheetB'],['namesA','namesB'],['ha','hb'],['colsA','colsB']]){
                const earlier=d[first];d[first]=d[second];d[second]=earlier;
            }
            for(const pair of [...d.keys,...d.pairs]){const earlier=pair.l;pair.l=pair.r;pair.r=earlier;}
            const old=d.leftRow;d.leftRow=d.rightRow;d.rightRow=old;d.choices=null;
            this.ledgerRun();
        },
        ledgerFieldRows (s) {
            const d=this.dialog;Object.assign(d,{fieldMatch:s,q:'',field:'',status:'',leftRow:'',rightRow:'',cellType:'',onlySuppressed:false});
            this.ledgerTab('records');
        },
        ledgerFrequency (p) {
            const d=this.dialog;d.frequency=p;d.tab='freq';d.freqTerm='';d.repeatOnly=false;d.page=1;
        },
        ledgerData () {
            const d=this.dialog;
            if(d.tab==='records')return d.report?Ledger.selectRows(d.report,d):[];
            if(d.tab==='issues')return d.report?.issues||[];
            if(d.tab==='fields')return d.report?Ledger.fieldTotals(d.report):[];
            if(d.tab==='profile')return d.profile||[];
            const term=d.freqTerm.toLowerCase();
            return (d.frequency?.freq||[]).filter(x=>(!d.repeatOnly||x.count>1)&&(!term||x.value.toLowerCase().includes(term)));
        },
        async ledgerTemplateSave () {
            const d=this.dialog;
            if(!d.report){d.error='请先按当前规则完成一次对账';return;}
            try{
                const id=await request('ledger_save',{name:d.tname,config:Ledger.templateConfig(d)});
                d.templates=await request('ledger_templates');d.tid=id;d.tname='';d.error='';
            }catch(err){d.error=String(err.message||err);}
        },
        ledgerTemplateApply () {
            const d=this.dialog,cfg=d.templates.find(p=>p.id===d.tid)?.config;
            if(!cfg)return;
            try{
                const ha=Ledger.locateHeader(d.oa,cfg.left,d.ha),hb=Ledger.locateHeader(d.ob,cfg.right,d.hb);
                const copy=JSON.parse(JSON.stringify(cfg));delete copy.left;delete copy.right;
                Object.assign(d,copy,{ha,hb,colsA:Ledger.headers(d.oa,ha),colsB:Ledger.headers(d.ob,hb)});
                this.ledgerRun();
            }catch(err){d.error=String(err.message||err);}
        },
        async ledgerTemplateRemove () {
            const d=this.dialog;
            if(!d.confirmRemove){d.confirmRemove=true;return;}
            try{await request('ledger_remove',{id:d.tid});d.templates=await request('ledger_templates');d.tid=0;d.confirmRemove=false;d.error='';}
            catch(err){d.error=String(err.message||err);}
        },
        async ledgerExport (detail=false) {
            const d=this.dialog,all=this.ledgerData();
            if(!all.length)return;
            const source=s=>s.root+' / '+s.rel+' · V'+s.num+' · '+s.sheet;
            let cols=[];
            let rows: Iterable<any[]>;
            if(d.tab==='records'){
                cols=detail?['编号','状态','左行','右行','左字段','右字段','左位置','右位置','旧类型','新类型','旧值','新值']:['左编号','右编号','状态','左行','右行','字段差异数'];
                rows=detail?(function*(){for(const r of all)for(const c of r.changes)yield [r.key,r.status,r.old,r.new,c.left,c.right,c.oldAddress,c.newAddress,c.before?.[0],c.after?.[0],Ledger.text(c.before),Ledger.text(c.after)];})():all.map(r=>[r.leftKey,r.rightKey,r.status,r.old,r.new,r.changes.length]);
            }else if(d.tab==='fields'){
                cols=['左字段','右字段','影响记录','新增值','移除值','双侧变化','其中类型改变'];rows=all.map(s=>[s.left,s.right,s.count,s.added,s.removed,s.changed,s.retyped]);
            }else if(d.tab==='issues'){cols=['一侧','原始行','编号','问题'];rows=all.map(r=>[r.side==='l'?'左':'右',r.n,r.key,r.why]);}
            else if(d.tab==='profile'){cols=['一侧','字段','数据行','非空','空值','不同值','重复值种类','多余重复数','首尾空白','可比数值','零值数','最小','最大','最长字符','首次最长行','类型分布'];rows=all.map(p=>[d.profileSide==='l'?'左':'右',p.field,p.rows,p.filled,p.missing,p.unique,p.repeated,p.duplicates,p.spaces,p.numeric,p.zeros,p.min,p.max,p.longest,p.longRow,JSON.stringify(p.types)]);}
            else {cols=['一侧','字段','类型','取值','次数','首次行','末次行'];rows=all.map(v=>[d.profileSide==='l'?'左':'右',d.frequency.field,v.type,v.value,v.count,v.first,v.last]);}
            const body=[['左侧版本','右侧版本',...cols]],prefix=[source(d.oa),source(d.ob)];
            const encoder=new TextEncoder(),baseBytes=encoder.encode(JSON.stringify(prefix)).length;
            let used=0;
            for(const row of rows){
                used+=baseBytes+encoder.encode(JSON.stringify(row)).length;
                if(used>24*1024*1024){d.error='导出内容超过 24 MiB，请缩小筛选范围';return;}
                body.push([...prefix,...row]);
            }
            const name=({records:detail?'台账字段差异':'台账行对账',issues:'台账编号冲突',fields:'台账字段影响汇总',profile:'台账字段体检',freq:'台账取值频次'})[d.tab]+'.csv';
            if(this.native){await this.saveFile('ledger_csv',name,null,{rows:body});return;}
            this.downloadBlob(new Blob([Ledger.csv(body)],{type:'text/csv;charset=utf-8'}),name);
        },
        async reportDialog (type, row=null) {
            const end=String(this.s.stamp||new Date().toISOString()).slice(0,10);
            const day=new Date(end+'T00:00:00Z');
            day.setUTCDate(day.getUTCDate()-6);
            const form=type==='period' ? {start:day.toISOString().slice(0,10),end,group:'file',trend:'',sort:'after',root_id:'',q:'',ext:'',kind:'',source:'',initial:false} :
                {id:this.file?.id,record:row?.record_key||row?.record||'',field:row?.field||'',location:row?.record_key||row?.record?'':(row?.location||''),sheet:row?.sheet||'',low:'',high:'',kind:'',category:'',value:'',only_return:false,ascending:false};
            this.dialog={type,title:type==='period'?'变更期间对照':'字段变动轨迹',form,data:null,applied:null,error:'',loading:false};
            if(type==='period'||row)await this.runReport();
        },
        async runReport (page=1,applied=null) {
            const d=this.dialog, args=applied||{...d.form};
            const seq=(this.flags.reports||0)+1;this.flags.reports=seq;
            d.loading=true;d.data=null;d.error='';d.applied=null;
            try {
                const result=await request(d.type==='period'?'period_report':'field_trace',{...args,page});
                if(this.dialog===d&&this.flags.reports===seq){d.data=result;d.applied=args;}
            }catch(err){if(this.dialog===d&&this.flags.reports===seq)d.error=String(err.message||err);}
            finally{if(this.dialog===d&&this.flags.reports===seq)d.loading=false;}
        },
        async exportReport () {
            const d=this.dialog;
            if(!d.applied||!d.data?.total)return;
            const cmd=d.type==='period'?'period_csv':'trace_csv';
            if(this.demo)await this.downloadCsv(cmd,d.applied,d.title+'.csv');
            else await this.saveFile(cmd,d.title+'.csv',null,d.applied);
        },
        async reportSource (row) {
            const d=this.dialog;
            if(!['period','trace'].includes(d?.type)||!d.data?.items.includes(row))return;
            const seq=(this.flags.reportSource||0)+1;
            this.flags.reportSource=seq;
            const report=this.flags.reports, form=JSON.stringify(d.form);
            const isCurrent=()=>this.dialog===d&&this.flags.reportSource===seq&&
                this.flags.reports===report&&JSON.stringify(d.form)===form;
            d.error='';
            let match;
            try {
                match=await request('events',{event_id:row.event_id,size:1});
            } catch(e) {
                if(isCurrent())d.error=String(e?.message||e);
                return;
            }
            if(!isCurrent())return;
            const e=match?.items[0];
            if(!e?.file_id){d.error='该事件已不在普通日志中，请重新查询';return;}
            this.dialog=null;
            if(d.type==='period')await this.fromEvent(e,true);
            else await this.openFound({...row,file_id:e.file_id,rel:e.rel,root_path:e.root,ext:e.ext});
        },
        async inventoryDialog () {
            if(!this.cpNew)return;
            this.dialog={type:'inventory',title:'清单成员与交付',id:this.cpNew,q:'',folder:'',ext:'',sha:'',sort:'',data:null,active:null};
            await this.loadInventory();
        },
        async loadInventory (page=1,applied=null) {
            const d=this.dialog,args=applied||{id:d.id,q:d.q,folder:d.folder,ext:d.ext,sha:d.sha,sort:d.sort};
            const seq=(this.flags.inventory||0)+1;this.flags.inventory=seq;d.data=null;d.disk=null;d.active=null;d.error='';
            const data=await this.safe(()=>request('checkpoint_inventory',{...args,page}));
            if(this.dialog===d&&this.flags.inventory===seq&&data){d.data=data;d.active=args;}
        },
        async checkDisk (page=1) {
            const d=this.dialog,seq=(this.flags.disk||0)+1;this.flags.disk=seq;d.disk=null;
            const active=d.active;if(!active)return;
            const mode=!!d.quick;
            const data=await this.safe(()=>request('checkpoint_disk',{...active,page,quick:mode}));
            if(this.dialog===d&&d.active===active&&this.flags.disk===seq&&!!d.quick===mode)d.disk=data;
        },
        async exportInventory (zip=false) {
            const d=this.dialog;
            if(!d.active||!d.data?.total)return;
            if(this.demo){
                if(!zip){await this.downloadCsv('inventory_csv',d.active,'清单成员.csv');return;}
                const enc=await this.safe(()=>request('handoff_create',d.active));
                if(enc)this.downloadBlob(new Blob([Uint8Array.from(atob(enc),c=>c.charCodeAt(0))],{type:'application/zip'}),'示例历史文件交付.zip');
            }else await this.saveFile(zip?'handoff_create':'inventory_csv',zip?'历史文件交付.zip':'清单成员.csv',null,{...d.active});
        },
        downloadBlob (blob,name) {
            const url=URL.createObjectURL(blob),a=document.createElement('a');
            a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
        },
        async deliveryDialog (scope=null,versionBundle=false) {
            let path='';
            if(this.native){
                path=await this.safe(()=>window.__TAURI__.core.invoke('pick_path',{kind:'delivery',name:''}));
                if(!path)return;
            }
            this.dialog={type:'delivery_check',title:versionBundle?'按交付篮核查 ZIP':scope?'按所选清单核查交付包':'核查交付包',
                scope,path,versionBundle,submit:'核查交付包'};
            if(this.demo)await this.submitDialog();
        },
        async healthDialog () {
            this.dialog={type:'health',title:'仓库体检',reports:[],id:0,data:null,q:'',change:'',status:'',job:{state:'空闲'},refs:null};
            await this.refreshHealth();
        },
        async refreshHealth (cmd:EngineCommand='health_state') {
            const d=this.dialog;if(d?.type!=='health')return;
            const seq=(this.flags.health||0)+1;this.flags.health=seq;
            const job=await this.safe(()=>request(cmd));
            if(!job||this.dialog!==d||seq!==this.flags.health)return;
            const completed=job.report&&job.report!==d.job.report;
            d.job=job;
            const reports=await this.safe(()=>request('health_reports'));
            if(this.dialog!==d||seq!==this.flags.health||!reports)return;
            d.reports=reports;
            if(!reports.some(r=>r.id===d.id)||completed)d.id=reports[0]?.id||0;
            if(d.id)await this.loadHealth();
            clearTimeout(this._healthTimer);
            if(job.state==='检查中'&&this.dialog===d)this._healthTimer=setTimeout(()=>{if(this.dialog===d)this.refreshHealth();},800);
        },
        async loadHealth (page=1) {
            const d=this.dialog,seq=(this.flags.healthPage||0)+1;this.flags.healthPage=seq;d.refs=null;
            const args={id:d.id,q:d.q,status:d.status,change:d.change};
            const data=await this.safe(()=>request('health_results',{...args,page}));
            if(this.dialog===d&&seq===this.flags.healthPage){d.data=data;d.applied=args;}
        },
        async affectedVersions (row,page=1) {
            const d=this.dialog,seq=(this.flags.affected||0)+1;this.flags.affected=seq;
            const data=await this.safe(()=>request('health_references',{id:row.report_id,key:row.object_key,page}));
            if(this.dialog===d&&data&&this.flags.affected===seq)d.refs={row,...data};
        },
        async healthExport () {
            const args=this.dialog.applied;
            if(this.demo)await this.downloadCsv('health_csv',args,'仓库体检.csv');
            else await this.saveFile('health_csv','仓库体检.csv',null,args);
        },
        async varianceDialog () {
            this.dialog={type:'variance',title:'数值差异核对',old:this.left,new:this.right,mode:this.diffMode,field:'',sheet:'',record:'',minimum:'',rate:'',direction:'',sort:'magnitude',data:null};
            await this.loadVariance();
        },
        async loadVariance (page=1,previous=null) {
            const d=this.dialog,seq=(this.flags.variance||0)+1;this.flags.variance=seq;
            const {old,new:right,mode,field,sheet,record,minimum,rate,direction,sort}=d;
            const args=previous||{old,new:right,mode,field,sheet,record,minimum,rate,direction,sort};
            d.error='';d.data=null;
            const data=await this.safe(()=>request('variance',{...args,page}));
            if(this.dialog===d&&seq===this.flags.variance){d.data=data;d.applied=args;}
        },
        async varianceExport () {
            const args=this.dialog.applied;
            if(this.demo)await this.downloadCsv('variance_csv',args,'数值差异.csv');
            else await this.saveFile('variance_csv','数值差异.csv',null,args);
        },
        async varianceSource (row) {
            this.dialog=null;this.displayMode='detail';this.sheet=row.sheet;this.loc=row.location;this.searchIn='location';
            this.diffKind='';this.diffCategory='';this.diffField='';this.recordId='';this.exact=true;this.dp=1;
            await this.loadDiff();
        },
        async inspectDialog () {
            let path='';
            if(this.native){
                path=await this.safe(()=>window.__TAURI__.core.invoke('pick_path',{kind:'backup',name:''}));
                if(!path)return;
            }
            this.dialog={type:'inspect',title:'核查备份',path,submit:'开始核查'};
            if(this.demo)await this.submitDialog();
        },
        async backupDialog () {
            if(!this.s.record_admin_ready){await this.saveFile('backup','FileGuard-备份.zip',null);return;}
            this.dialog={type:'backup',title:'保存含原始记录的完整备份',path:'',password:'',submit:'保存备份'};
        },
        async submitDialog () {
            if (this.busy) return;
            const d = this.dialog;
            if(d?.type==='review_batch'){
                if(!d.result&&!d.loading)await this.previewReviewBatch();
                return;
            }
            if (d?.type==='scan_log'){await this.applyJournal();return;}
            if (d?.type==='waiting_files'){await this.applyWaiting();return;}
            if (d && ['period','trace'].includes(d.type)){if(!d.loading)await this.runReport();return;}
            if (!d || ['receipt','ledger','inventory','health','variance','delivery_result','backup_result'].includes(d.type)) return;
            if (d.type==='restore_preview' && (this.demo || d.loading || !d.info || d.info.identical)) return;
            this.busy = true;
            d.error = '';
            try {
                let msg;
                if(d.type==='inspect'){
                    const b=await request('inspect_backup',{path:d.path});
                    this.dialog={type:'backup_result',title:'备份核查通过',result:b};
                    return;
                }else if(d.type==='delivery_check'){
                    const result=await request(d.versionBundle?'version_bundle_verify':'handoff_verify',{...(d.scope||{}),path:d.path});
                    this.dialog={type:'delivery_result',title:result.ok?'交付包核查通过':'交付包存在差异',result};
                    return;
                }else if(d.type==='capture_policy'){
                    msg=await request('capture_policy',{root:d.root,settle_ms:d.settle_ms,all_types:d.all_types});
                }else if(d.type==='review'){
                    await request('save_review',{id:d.id,state:d.state,note:d.note,revision:d.revision});
                    if(this.page==='复核工作台')await this.loadReview();
                    else this.versions=await request('history',{id:this.file.id});
                    msg='已保存复核结论';
                }else if(d.type==='admin'){
                    msg=await request('record_amend',{id:d.id,password:d.password,revision:d.revision,action:d.action,reason:d.reason,caption:d.caption});
                    await this.loadList();
                }else if(d.type==='backup'){
                    msg=await request('backup',{path:d.path,password:d.password});
                }else if (d.type === 'root') {
                    await request('configure', {
                        id: d.id,
                        path: d.path,
                        patterns: d.patterns,
                        max_mb: d.max_mb
                    });
                    msg = '监控目录已保存';
                } else if (d.type === 'save') {
                    msg = await request(d.cmd, {
                        ...d.args,
                        path: d.path
                    });
                } else if (d.type === 'restore_preview' && !this.demo) {
                    msg=await request('restore',d.args);
                } else if (d.type === 'confirm') {
                    msg = await request(d.cmd, d.args);
                }
                if(d.cmd==='finder_forget'){this.presetId=0;await this.loadPresets();}
                clearTimeout(this._adminTimer);
                this.dialog = null;
                await this.refresh();
                if (d.cmd === 'restore') await this.selectFile(this.file, '历史版本');
                this.toast(msg || '操作完成');
            } catch (e) {
                d.error = String(e.message || e);
            } finally{
                if('password' in d)d.password='';
                this.busy = false;
            }
        },
        async saveFile (cmd, name, id, options = null) {
            const args = options || {id};
            if (this.native) {
                await this.safe(async ()=>{
                    const path = await window.__TAURI__.core.invoke('pick_path', {
                        kind: 'save',
                        name
                    });
                    if (path) await this.perform(cmd, {
                        ...args,
                        path
                    }, '已保存到 ' + path);
                });
                return;
            }
            this.dialog = {
                type: 'save',
                title: '保存到新文件',
                cmd,
                args,
                path: '',
                submit: '保存'
            };
        },
        async restoreDialog (v) {
            this.dialog={type:'restore_preview',title:'恢复 V'+v.num+' 到原路径',loading:true,
                info:null,error:'',submit:'确认恢复',cmd:'restore'};
            const d=this.dialog;
            try {
                const info = await request('restore_info', {id:v.id});
                if(this.dialog===d){
                    d.info=info;
                    d.args={id:v.id,preview:info.preview};
                }
            } catch (e) {
                if(this.dialog===d)d.error=String(e.message||e);
            } finally {
                if(this.dialog===d)d.loading=false;
            }
        },
        openSearch () {
            this.fileDialog();
        },
        async fileDialog () {
            clearTimeout(this._pickTimer);
            this.pickScope = 'all';
            this.pickQ = '';
            this.pickPage = 1;
            this.dialog = {
                type: 'pick',
                title: '查找历史文件'
            };
            await this.loadPicks();
            await nextTick();
            document.getElementById('filePicker')?.focus();
        },
        searchPick () {
            this.pickPage = 1;
            this.flags.pick=(this.flags.pick || 0)+1;
            this.pickLoading=true;
            clearTimeout(this._pickTimer);
            this._pickTimer = setTimeout(()=>this.loadPicks(), 130);
        },
        async loadPicks () {
            const seq = (this.flags.pick || 0) + 1;
            this.flags.pick = seq;
            this.pickLoading=true;
            const result=await this.safe(()=>request('files',{
                scope:this.pickScope || 'current', q:this.pickQ, page:this.pickPage, size:15
            }));
            if (seq===this.flags.pick) {
                this.picks=result || emptyList();
                this.pickLoading=false;
            }
        },
        async picked (v) {
            this.dialog = null;
            await this.selectFile(v, this.page === '版本对比' ? '版本对比' : '历史版本');
        },
        async fromEvent (e, fromReport=false) {
            if(e.kind==='已撤回'){this.toast('此记录已撤回，管理员可在变更记录中核查。');return;}
            if (this.page==='变更记录') {
                if (!fromReport&&(this.listLoading||this.rangeError))return;
                this.eventReturn={filters:{...this.f},page:this.p,scroll:window.scrollY || 0};
            }
            const file = {
                id: e.file_id,
                root_id:e.root_id,
                rel: e.current_rel || e.rel,
                root: e.root,
                ext: e.current_ext ?? e.ext,
                file_state:e.file_state
            };
            const selected=await this.selectFile(file, '历史版本');
            if (!selected) return;
            if (e.old_v && e.new_v && e.old_v !== e.new_v) await this.pair(e.old_v, e.new_v);
            else {
                this.dialog = {
                    type: 'info',
                    title: e.kind + ' · ' + this.base(e.rel)
                };
                this.dialog.body = this.fmt(e.stamp) + '　' + e.source + '\n' + this.parent(e.root, e.rel) + '\n文件：' + e.rel + (e.old_rel ? '\n原路径：' + e.old_rel : '') + '\n版本：' + (e.prior ? 'V' + e.prior : '—') + ' → ' + (e.version ? 'V' + e.version : '—');
            }
        },
        async selectFile (file, page = '历史版本') {
            this.textReturn=false;
            this.contentReturn=false;
            this.lineageReturn=false;
            this.pathReturn=false;
            this.triReturn=false;
            const marker=(this.flags.history || 0)+1;
            this.flags.history=marker;
            this.displayMode='auto';
            this.grid=null;
            this.flags.grid=(this.flags.grid||0)+1;
            this.file = file;
            this.page = page;
            this.resetVersions();
            this.versions=[];
            this.diff=null;
            this.diffLoading=false;
            this.flags.diff=(this.flags.diff||0)+1;
            return this.safe(async ()=>{
                const versions = await request('history', {
                    id: file.id
                });
                if (marker!==this.flags.history) return false;
                this.versions=versions;
                this.right = this.versions[0]?.id || 0;
                this.left = this.versions[1]?.id || this.right;
                if (page === '版本对比') await this.changePair();
                return marker===this.flags.history;
            });
        },
        async navVersion (page) {
            this.page = page;
            if (page === '版本对比') await this.changePair();
        },
        async pair (left, right, focus?: DiffFocus) {
            this.left = left;
            this.right = right;
            this.page = '版本对比';
            await this.changePair(focus);
        },
        async changePair (focus?: DiffFocus) {
            this.dp = 1;
            this.loc = focus?.location || '';
            this.sheet = focus?.sheet || '';
            this.diffKind = '';
            this.diffCategory = '';
            this.searchIn=focus?'location':'';
            this.exact=!!focus;
            this.caseSensitive=false;this.diffField='';this.recordId='';
            if(focus)this.displayMode='detail';
            this.cellHits=null;this.cellSearch=freshCellSearch();this.flags.cell=(this.flags.cell||0)+1;this.cellBusy=false;
            this.gridFilter='';this.gridTarget='';this.gridPage=1;this.gridCol=1;this.gridSheet='';this.expandRows=false;
            await this.loadDiff();
        },
        async filterDiff(kind: string) {
            this.diffKind = this.diffKind === kind ? '' : kind;
            this.dp = 1;
            await this.loadDiff();
        },
        async setDiffMode(mode: string) {
            this.diffMode = mode;
            await this.changePair();
        },
        async swapPair () {
            if (this.left===this.right) return;
            const previous=this.left;
            this.left=this.right;
            this.right=previous;
            if(this.gridFilter==='新增行')this.gridFilter='删除行';
            else if(this.gridFilter==='删除行')this.gridFilter='新增行';
            if (this.diffKind==='新增') this.diffKind='删除';
            else if (this.diffKind==='删除') this.diffKind='新增';
            this.searchIn=this.searchIn==='old'?'new':this.searchIn==='new'?'old':this.searchIn;
            this.gridPage=1;this.gridCol=1;this.dp=1;
            await this.loadDiff();
        },
        comparisonArgs () {
            return {old:this.left,new:this.right,sheet:this.sheet,mode:this.diffMode,kind:this.diffKind,category:this.diffCategory,q:this.loc,search_in:this.searchIn,case_sensitive:this.caseSensitive,exact:this.exact,field:this.diffField,record:this.recordId,size:this.diffSize};
        },
        async exportDifference () {
            if (this.diffLoading || !this.diff || !this.diff.total) return;
            const args=this.comparisonArgs();
            const name=this.base(this.file.rel)+'-V'+this.diff.old_number+'-V'+this.diff.new_number+'-差异.csv';
            if (!this.demo) {
                await this.saveFile('export_diff', name, null, args);
                return;
            }
            await this.downloadCsv('export_diff',args,name);
        },
        async exportEvents () {
            if (this.listLoading || this.rangeError || !this.list.total) return;
            const {exportCommand,filename,filters}=this.listResult.query;
            if (this.demo) await this.downloadCsv(exportCommand,filters,filename);
            else await this.saveFile(exportCommand,filename,null,filters);
        },
        async downloadCsv (cmd: EngineCommand, args: Arguments, name: string) {
            await this.safe(async () => {
                const csv=await request(cmd,args);
                const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
                const link=document.createElement('a');
                link.href=url;
                link.download=name;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 3000);
                this.toast('已导出当前筛选结果');
            });
        },
        async loadGrid (jump=false) {
            const seq=(this.flags.grid||0)+1;
            this.flags.grid=seq;
            this.gridError='';
            try {
                const grid=await request('sheet_rows',{old:this.left,new:this.right,mode:this.diffMode,
                    row_filter:this.gridFilter,target:jump===true?this.gridTarget:'',locate:this.gridLocate,sheet:this.gridSheet,page:this.gridPage,col_page:this.gridCol,expand:this.expandRows});
                if (seq===this.flags.grid) {this.grid=grid;this.gridFilter=grid.row_filter||'';this.gridSheet=grid.sheet;this.gridPage=grid.page;this.gridCol=grid.col_page;this.expandRows=grid.expanded;}
            } catch(e) {
                if(seq===this.flags.grid)this.gridError=String(e.message||e);
            }
        },
        async loadDiff () {
            this.flags.grid=(this.flags.grid||0)+1;
            this.grid=null;
            const seq = (this.flags.diff || 0) + 1;
            this.flags.diff = seq;
            const pair=this.left+':'+this.right;
            if(pair!==this.diffPair)this.diff=null;
            if (this.left === this.right) {
                this.diff = null;
                this.diffLoading = false;
                return;
            }
            this.diffLoading = true;
            const result = await this.safe(() => request('compare', {
                ...this.comparisonArgs(),
                page: this.dp
            }));
            if (seq === this.flags.diff) {
                this.diff = result;
                this.diffPair=pair;
                this.diffLoading = false;
                if(result)this.dp=result.page;
                if(result?.is_excel&&!result.error&&this.presentation==='grid')await this.loadGrid();
            }
        },
        async toggleTheme () {
            let theme = this.theme === '浅色' ? '深色' : '浅色';
            await this.safe(async ()=>{
                await request('settings', {
                    ...this.s.settings,
                    theme
                });
                this.theme = theme;
                this.prefs.theme = theme;
                await this.refresh();
            });
        },
        async savePrefs () {
            await this.safe(async ()=>{
                await request('settings', {
                    ...this.prefs
                });
                this.theme = this.prefs.theme;
                await this.refresh();
                this.toast('设置已保存');
            });
        }
    },
    async mounted () {
        await this.refresh();
        if (!this.demo) this._poll = setInterval(async ()=>{
            if (document.hidden || this.busy) return;
            await this.refreshWorkspace();
        }, 4500);
        document.addEventListener?.('visibilitychange',()=>{
            if(document.hidden&&['admin','backup'].includes(this.dialog?.type))this.dialog=null;
        });
        window.addEventListener('keydown', (e)=>{
            if(this.busy)return;
            if(e.key==='Tab'&&isScanPanel(this.dialog))this.trapScanTab(e);
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.fileDialog();
            }
            if (e.key === 'Escape') {
                this.dialog = null;
                this.notifications = false;
            }
        });
    }
});
app.component('ico', {
    props: [
        'n'
    ],
    render () {
        return h('svg', {
            class: 'ico',
            viewBox: '0 0 24 24',
            'aria-hidden': true
        }, (window.FG_ICONS[this.n] || []).map(([tag, attrs])=>h(tag, attrs)));
    }
});
app.mount('#app');

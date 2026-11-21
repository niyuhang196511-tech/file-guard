PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS roots(id INTEGER PRIMARY KEY,path TEXT NOT NULL UNIQUE,active INTEGER NOT NULL DEFAULT 1,removed INTEGER NOT NULL DEFAULT 0,patterns TEXT NOT NULL DEFAULT '',max_mb INTEGER NOT NULL DEFAULT 0,last_scan TEXT NOT NULL DEFAULT '',error TEXT NOT NULL DEFAULT '',skipped INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS files(id INTEGER PRIMARY KEY,root_id INTEGER NOT NULL REFERENCES roots,rel TEXT NOT NULL,fkey TEXT NOT NULL,tracked INTEGER NOT NULL DEFAULT 1,live INTEGER NOT NULL DEFAULT 1,size INTEGER NOT NULL,mtime INTEGER NOT NULL,sha TEXT NOT NULL,ext TEXT NOT NULL,updated TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS file_live ON files(root_id,rel) WHERE live=1;
CREATE TABLE IF NOT EXISTS versions(id INTEGER PRIMARY KEY,file_id INTEGER NOT NULL REFERENCES files,num INTEGER NOT NULL,parent_id INTEGER REFERENCES versions,sha TEXT NOT NULL,size INTEGER NOT NULL,ext TEXT NOT NULL,stamp TEXT NOT NULL,status TEXT NOT NULL,details TEXT NOT NULL DEFAULT '[]',error TEXT NOT NULL DEFAULT '',UNIQUE(file_id,num));
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY,file_id INTEGER NOT NULL REFERENCES files,root_id INTEGER NOT NULL REFERENCES roots,rel TEXT NOT NULL,old_rel TEXT NOT NULL DEFAULT '',ext TEXT NOT NULL,kind TEXT NOT NULL,old_v INTEGER REFERENCES versions,new_v INTEGER REFERENCES versions,stamp TEXT NOT NULL,source TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS event_date ON events(stamp);
CREATE INDEX IF NOT EXISTS event_file ON events(file_id,id);
CREATE TABLE IF NOT EXISTS tasks(root_id INTEGER PRIMARY KEY REFERENCES roots,due REAL NOT NULL,source TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,stamp TEXT NOT NULL,action TEXT NOT NULL,note TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,val TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS restores(id INTEGER PRIMARY KEY,file_id INTEGER NOT NULL REFERENCES files,version_id INTEGER NOT NULL REFERENCES versions,prior_sha TEXT,stamp TEXT NOT NULL);
-- Store applies the schema revision after scheduling compatible data migrations.

CREATE INDEX IF NOT EXISTS versions_pending ON versions(id) WHERE status='待解析';

CREATE INDEX IF NOT EXISTS audit_action_date ON audit(action,stamp);
CREATE INDEX IF NOT EXISTS audit_date ON audit(stamp);

CREATE TABLE IF NOT EXISTS scan_skips(root_id INTEGER PRIMARY KEY REFERENCES roots, counts TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS scan_waits(root_id INTEGER PRIMARY KEY REFERENCES roots, total INTEGER NOT NULL, samples TEXT NOT NULL, delay INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS version_reviews(
    version_id INTEGER PRIMARY KEY REFERENCES versions(id),
    state TEXT NOT NULL CHECK(state IN ('待复核','已复核','需跟进')),
    note TEXT NOT NULL, stamp TEXT NOT NULL, revision INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS file_stars(file_id INTEGER PRIMARY KEY REFERENCES files(id));
CREATE INDEX IF NOT EXISTS reviews_state ON version_reviews(state);
CREATE INDEX IF NOT EXISTS versions_sha ON versions(sha);
CREATE INDEX IF NOT EXISTS versions_stamp ON versions(stamp,id);
CREATE INDEX IF NOT EXISTS roots_visible_files ON files(root_id,live,tracked);

CREATE TABLE IF NOT EXISTS record_admin(id INTEGER PRIMARY KEY CHECK(id=1),salt BLOB NOT NULL,verifier BLOB NOT NULL);
CREATE TABLE IF NOT EXISTS event_edits(
    event_id INTEGER NOT NULL REFERENCES events(id),revision INTEGER NOT NULL,stamp TEXT NOT NULL,
    action TEXT NOT NULL,reason TEXT NOT NULL,caption TEXT NOT NULL,hidden INTEGER NOT NULL,
    PRIMARY KEY(event_id,revision));
CREATE VIEW IF NOT EXISTS public_events AS
SELECT e.id,CASE WHEN NOT coalesce(m.hidden,0) THEN e.file_id END AS file_id,
    CASE WHEN NOT coalesce(m.hidden,0) THEN e.root_id END AS root_id,
    CASE WHEN m.hidden THEN '（已撤回）' ELSE e.rel END AS rel,
    CASE WHEN m.hidden THEN '' ELSE e.old_rel END AS old_rel,
    CASE WHEN m.hidden THEN '' ELSE e.ext END AS ext,
    CASE WHEN m.hidden THEN '已撤回' ELSE e.kind END AS kind,
    CASE WHEN NOT coalesce(m.hidden,0) THEN e.old_v END AS old_v,
    CASE WHEN NOT coalesce(m.hidden,0) THEN e.new_v END AS new_v,e.stamp,
    CASE WHEN m.hidden THEN '' ELSE e.source END AS source,
    CASE WHEN m.hidden THEN '' ELSE coalesce(m.caption,'') END AS caption,
    coalesce(m.revision,0) AS revision
FROM events e LEFT JOIN event_edits m ON m.event_id=e.id
AND m.revision=(SELECT max(revision) FROM event_edits WHERE event_id=e.id);

CREATE TABLE IF NOT EXISTS checkpoints(
    id INTEGER PRIMARY KEY,root_id INTEGER NOT NULL REFERENCES roots,
    label TEXT NOT NULL,stamp TEXT NOT NULL,last_scan TEXT NOT NULL,
    UNIQUE(root_id,label));
CREATE TABLE IF NOT EXISTS checkpoint_files(
    checkpoint INTEGER NOT NULL REFERENCES checkpoints, file_id INTEGER NOT NULL REFERENCES files,
    rel TEXT NOT NULL,version INTEGER NOT NULL REFERENCES versions,
    PRIMARY KEY(checkpoint,file_id));
CREATE TABLE IF NOT EXISTS rule_changes(
    id INTEGER PRIMARY KEY,root_id INTEGER NOT NULL REFERENCES roots,
    stamp TEXT NOT NULL,patterns TEXT NOT NULL,max_mb INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rules_root ON rule_changes(root_id,id);
CREATE VIEW IF NOT EXISTS visible_events AS SELECT p.* FROM public_events p
WHERE NOT EXISTS (SELECT 1 FROM event_edits m WHERE m.event_id=p.id AND m.revision=p.revision AND m.hidden=2);

CREATE TABLE IF NOT EXISTS finder_presets(id INTEGER PRIMARY KEY,name TEXT NOT NULL UNIQUE,filters TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS scan_runs(
 id INTEGER PRIMARY KEY,root_id INTEGER NOT NULL REFERENCES roots,source TEXT NOT NULL,
 started TEXT NOT NULL,ended TEXT NOT NULL DEFAULT '',status TEXT NOT NULL,
 elapsed_ms INTEGER NOT NULL DEFAULT 0,candidates INTEGER NOT NULL DEFAULT 0,
 captured INTEGER NOT NULL DEFAULT 0,read_bytes INTEGER NOT NULL DEFAULT 0,
 reused INTEGER NOT NULL DEFAULT 0,waiting INTEGER NOT NULL DEFAULT 0,
 skipped INTEGER NOT NULL DEFAULT 0,skip_reasons TEXT NOT NULL DEFAULT '{}',
 problem TEXT NOT NULL DEFAULT '');
CREATE INDEX IF NOT EXISTS scan_runs_root ON scan_runs(root_id,id DESC);
CREATE TABLE IF NOT EXISTS capture_policy(
 root_id INTEGER PRIMARY KEY REFERENCES roots,settle_ms INTEGER NOT NULL DEFAULT 1500,all_types INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS waiting_files(
 root_id INTEGER NOT NULL REFERENCES roots,rel TEXT NOT NULL,reason TEXT NOT NULL,first_seen TEXT NOT NULL,
 last_seen TEXT NOT NULL,attempts INTEGER NOT NULL,PRIMARY KEY(root_id,rel));
CREATE INDEX IF NOT EXISTS event_version_pair ON events(new_v,old_v);
CREATE TABLE IF NOT EXISTS health_reports(
 id INTEGER PRIMARY KEY,started TEXT NOT NULL,ended TEXT NOT NULL,elapsed_ms INTEGER NOT NULL,
 objects INTEGER NOT NULL,versions INTEGER NOT NULL,verified INTEGER NOT NULL,verified_bytes INTEGER NOT NULL,
 issues INTEGER NOT NULL,unreferenced INTEGER NOT NULL,affected INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS health_findings(
 report_id INTEGER NOT NULL REFERENCES health_reports ON DELETE CASCADE,object_key TEXT NOT NULL,
 status TEXT NOT NULL,expected INTEGER,actual INTEGER,versions INTEGER NOT NULL,files INTEGER NOT NULL,
 PRIMARY KEY(report_id,object_key));

CREATE TABLE IF NOT EXISTS ledger_templates(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,
 stamp TEXT NOT NULL,config TEXT NOT NULL);

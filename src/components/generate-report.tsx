import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image 
} from '@react-pdf/renderer';
import ReactMarkdown from 'react-markdown';

// --- TYPES ---
type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

interface Section {
  id: string;
  title: string;
  content: string;
  cve: string;
  cvss: string;
  type: 'finding' | 'info';
  severity: Severity;
  imageUrl?: string;
}

interface ReportMeta {
  reportName: string;
  target: string;
}

interface Stats {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
  Info: number;
}

// --- CONSTANTS ---
const SEV_COLORS: Record<Severity, string> = {
  Critical: '#ff4d4d',
  High: '#ff8c00',
  Medium: '#ffcc00',
  Low: '#00cc66',
  Info: '#646cff'
};

const getSeverityFromScore = (score: string): Severity => {
  const s = parseFloat(score);
  if (isNaN(s)) return 'Info';
  if (s >= 9.0) return 'Critical';
  if (s >= 7.0) return 'High';
  if (s >= 4.0) return 'Medium';
  if (s > 0) return 'Low';
  return 'Info';
};

// --- PDF STYLES ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#050505', fontFamily: 'Helvetica', color: '#eeeeee' },
  header: { borderBottomWidth: 2, borderBottomColor: '#646cff', paddingBottom: 15, marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#ffffff' },
  subTitle: { fontSize: 9, color: '#888', marginTop: 6, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#646cff', marginTop: 25, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#646cff', paddingLeft: 8 },
  table: { display: 'flex', flexDirection: 'row', backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#222', borderRadius: 4, marginBottom: 25 },
  tableCol: { flex: 1, padding: 12, borderRightWidth: 1, borderRightColor: '#222', alignItems: 'center' },
  tableLabel: { fontSize: 7, color: '#666', marginBottom: 5 },
  tableValue: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  findingBox: { borderBottomWidth: 1, borderBottomColor: '#1a1a1a', paddingBottom: 20, marginBottom: 20 },
  findingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  findingTitle: { fontSize: 13, fontWeight: 'bold' },
  findingMeta: { fontSize: 9, color: '#666' },
  paragraph: { fontSize: 10, lineHeight: 1.6, color: '#bbbbbb', textAlign: 'left', marginBottom: 10 },
  codeInline: { fontFamily: 'Courier', color: '#646cff', backgroundColor: '#1a1a1a', paddingHorizontal: 2, borderRadius: 2 },
  boldText: { fontWeight: 'bold', color: '#ffffff' },
  italicText: { fontStyle: 'italic', color: '#dddddd' },
  evidenceImg: { width: '100%', marginTop: 10, borderRadius: 4 }
});

const ReportPDF = ({ meta, sections, stats }: { meta: ReportMeta, sections: Section[], stats: Stats }) => {
  const renderFormattedText = (text: string) => {
    const bulletedText = text ? text.replace(/^- /gm, '• ') : '';
    const parts = bulletedText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return (
      <Text style={pdfStyles.paragraph}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) return <Text key={i} style={pdfStyles.boldText}>{part.slice(2, -2)}</Text>;
          if (part.startsWith('*') && part.endsWith('*')) return <Text key={i} style={pdfStyles.italicText}>{part.slice(1, -1)}</Text>;
          if (part.startsWith('`') && part.endsWith('`')) return <Text key={i} style={pdfStyles.codeInline}>{" "}{part.slice(1, -1)}{" "}</Text>;
          return <Text key={i}>{part}</Text>;
        })}
      </Text>
    );
  };

  return (
    <Document title={meta.reportName}>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>{meta.reportName}</Text>
          <Text style={pdfStyles.subTitle}>TARGET: {meta.target} | CLASSIFICATION: CONFIDENTIAL</Text>
        </View>

        <View wrap={false}>
          <Text style={pdfStyles.sectionTitle}>EXECUTIVE RISK PROFILE</Text>
          <View style={pdfStyles.table}>
            {(Object.entries(stats) as [Severity, number][]).map(([label, value]) => (
              <View key={label} style={pdfStyles.tableCol}>
                <Text style={pdfStyles.tableLabel}>{label.toUpperCase()}</Text>
                <Text style={[pdfStyles.tableValue, { color: SEV_COLORS[label] || '#ffffff' }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>REPORT SECTIONS</Text>
        {sections.map((s) => (
          <View key={s.id} style={pdfStyles.findingBox} wrap={true}>
            <View style={pdfStyles.findingHeader}>
              <Text style={[pdfStyles.findingTitle, { color: SEV_COLORS[s.severity] || '#646cff' }]}>{s.title}</Text>
              {s.type !== 'info' && <Text style={pdfStyles.findingMeta}>CVSS: {s.cvss} | {s.cve}</Text>}
            </View>
            {renderFormattedText(s.content)}
            {s.imageUrl && <Image src={s.imageUrl} style={pdfStyles.evidenceImg} />}
          </View>
        ))}
      </Page>
    </Document>
  );
};

const FullCPTSReport = () => {
  const [reportMeta, setReportMeta] = useState<ReportMeta>(() => {
    const saved = localStorage.getItem('cpts_v_pure_meta');
    return saved ? JSON.parse(saved) : { reportName: 'JOKER CTF REPORT', target: '10.10.x.x' };
  });

  const [sections, setSections] = useState<Section[]>(() => {
    const saved = localStorage.getItem('cpts_v_pure_sections');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Executive Summary', content: 'Infiltration of the Joker machine via multiple vulnerabilities.', cve: 'N/A', cvss: '0.0', type: 'info', severity: 'Info', imageUrl: '' }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cpts_v_pure_sections', JSON.stringify(sections));
    localStorage.setItem('cpts_v_pure_meta', JSON.stringify(reportMeta));
  }, [sections, reportMeta]);

  const stats = useMemo<Stats>(() => {
    const counts: Stats = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
    sections.forEach(s => {
      if (s.type === 'info') return;
      if (counts[s.severity] !== undefined) counts[s.severity]++;
    });
    return counts;
  }, [sections]);

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value, severity: field === 'cvss' ? getSeverityFromScore(value) : s.severity } : s));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSectionId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSection(activeSectionId, 'imageUrl', reader.result as string);
        setActiveSectionId(null);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (id: string) => {
    setActiveSectionId(id);
    fileInputRef.current?.click();
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  };

  const addFormat = (id: string, currentContent: string, format: 'bold' | 'italic' | 'list' | 'code') => {
    const tags = { bold: '****', italic: '**', list: '\n- ', code: '``' };
    updateSection(id, 'content', currentContent + tags[format]);
  };

  return (
    <div className="app-container">
      <style>{`
        body, html { margin: 0; background: #050505; color: #eee; font-family: 'Inter', sans-serif; overflow: hidden; }
        .no-print-header { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; background: #0a0a0a; border-bottom: 1px solid #222; height: 60px; }
        .workspace { display: flex; height: calc(100vh - 60px); }
        .editor-pane { width: 45%; overflow-y: auto; padding: 20px; background: #080808; border-right: 1px solid #222; }
        .preview-pane { width: 55%; overflow-y: auto; padding: 40px; background: #000; display: flex; justify-content: center; }
        .preview-page { background: #050505; color: #eeeeee; width: 100%; max-width: 800px; padding: 40px; min-height: 100%; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
        .preview-header { border-bottom: 2px solid #646cff; padding-bottom: 15px; margin-bottom: 25px; }
        .preview-section-title { font-size: 14px; font-weight: bold; color: #646cff; margin-top: 25px; margin-bottom: 12px; border-left: 3px solid #646cff; padding-left: 8px; }
        .preview-table { display: flex; flex-direction: row; background: #0a0a0a; border: 1px solid #222; border-radius: 4px; margin-bottom: 25px; }
        .preview-table-col { flex: 1; padding: 12px; border-right: 1px solid #222; display: flex; flex-direction: column; align-items: center; }
        .preview-table-label { font-size: 7px; color: #666; margin-bottom: 5px; text-transform: uppercase; }
        .preview-table-value { font-size: 16px; font-weight: bold; }
        .card { background: #111; border: 1px solid #333; padding: 15px; margin-bottom: 15px; border-radius: 6px; }
        .card-tools { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid #222; padding-top: 10px; }
        .format-bar { display: flex; gap: 10px; margin-bottom: 5px; }
        .format-btn { background: none; border: none; color: #555; cursor: pointer; font-size: 10px; font-weight: bold; }
        .format-btn:hover { color: #646cff; }
        textarea { width: 100%; height: 120px; background: #050505; color: #ccc; border: 1px solid #222; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 13px; line-height: 1.5; resize: none; box-sizing: border-box; }
        .btn-primary { background: #646cff; color: white; padding: 10px 18px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-weight: bold; font-size: 12px; }
        .btn-tool { background: #222; color: #aaa; border: 1px solid #333; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; }
        .btn-move { background: #222; color: #646cff; border: 1px solid #333; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; }
        .btn-toggle { background: #333; color: #fff; border: 1px solid #444; padding: 4px 10px; border-radius: 20px; font-size: 9px; cursor: pointer; text-transform: uppercase; }
        .btn-toggle.active { background: #646cff; border-color: #646cff; }
        .sev-select { background: #000; color: #fff; border: 1px solid #333; font-size: 10px; padding: 2px 5px; border-radius: 3px; cursor: pointer; outline: none; }
        .md-preview code { background: #1a1a1a; color: #646cff; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        .preview-img { width: 100%; border-radius: 4px; margin-top: 10px; border: 1px solid #333; }
        .btn-upload { background: #1a1a1a; color: #646cff; border: 1px solid #646cff; padding: 8px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-top: 10px; font-weight: bold; width: 100%; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-upload:hover { background: #646cff; color: white; }
        .img-status { font-size: 9px; color: #00cc66; margin-top: 5px; display: block; text-align: center; font-weight: bold; }
      `}</style>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />

      <header className="no-print-header">
        <div style={{ display: 'flex', gap: '10px' }}>
          <input style={{background:'#111', color:'#fff', border:'1px solid #333', padding:'8px'}} value={reportMeta.reportName} onChange={e => setReportMeta({ ...reportMeta, reportName: e.target.value })} />
          <input style={{background:'#111', color:'#fff', border:'1px solid #333', padding:'8px'}} value={reportMeta.target} onChange={e => setReportMeta({ ...reportMeta, target: e.target.value })} />
        </div>
        
        {/* Dynamic Key forces re-generation of PDF when data changes */}
        <PDFDownloadLink 
          key={`${sections.length}-${sections.map(s => s.id).join('-')}-${reportMeta.reportName}`}
          document={<ReportPDF meta={reportMeta} sections={sections} stats={stats} />} 
          fileName={`${reportMeta.reportName}.pdf`} 
          className="btn-primary"
        >
          {({ loading }) => (loading ? 'RE-BUILDING...' : 'DOWNLOAD PDF')}
        </PDFDownloadLink>
      </header>

      <div className="workspace">
        <div className="editor-pane">
          {sections.map((s, index) => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input value={s.title} onChange={e => updateSection(s.id, 'title', e.target.value)} style={{ background: 'none', border: 'none', color: SEV_COLORS[s.severity] || '#646cff', fontWeight: 'bold', fontSize: '1rem', outline: 'none', flex: 1 }} />
                {s.type !== 'info' && (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input placeholder="CVE" value={s.cve} onChange={e => updateSection(s.id, 'cve', e.target.value)} style={{ background: '#000', border: '1px solid #222', color: '#888', width: '90px', fontSize: '10px' }} />
                    <input placeholder="CVSS" value={s.cvss} onChange={e => updateSection(s.id, 'cvss', e.target.value)} style={{ background: '#000', border: '1px solid #222', color: '#fff', width: '35px', textAlign: 'center' }} />
                  </div>
                )}
              </div>
              
              <div className="format-bar">
                <button className="format-btn" onClick={() => addFormat(s.id, s.content, 'bold')}>BOLD</button>
                <button className="format-btn" onClick={() => addFormat(s.id, s.content, 'italic')}>ITALIC</button>
                <button className="format-btn" onClick={() => addFormat(s.id, s.content, 'list')}>LIST</button>
                <button className="format-btn" onClick={() => addFormat(s.id, s.content, 'code')}>CODE</button>
              </div>

              <textarea value={s.content} onChange={e => updateSection(s.id, 'content', e.target.value)} />
              
              <button className="btn-upload" onClick={() => triggerUpload(s.id)}>
                 {s.imageUrl ? 'Change Screenshot' : '+ Upload Evidence'}
              </button>
              
              <div className="card-tools">
                <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                  <button className={`btn-toggle ${s.type === 'finding' ? 'active' : ''}`} onClick={() => updateSection(s.id, 'type', 'finding')}>Finding</button>
                  <button className={`btn-toggle ${s.type === 'info' ? 'active' : ''}`} onClick={() => updateSection(s.id, 'type', 'info')}>Info</button>
                  <select className="sev-select" value={s.severity} onChange={e => updateSection(s.id, 'severity', e.target.value as Severity)}>
                    {(Object.keys(SEV_COLORS) as Severity[]).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                  <button className="btn-move" onClick={() => moveSection(index, 'up')} disabled={index === 0}>▲</button>
                  <button className="btn-move" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>▼</button>
                  <button className="btn-tool" style={{ color: '#ff4d4d' }} onClick={() => setSections(sections.filter(x => x.id !== s.id))}>DEL</button>
                </div>
              </div>
            </div>
          ))}
          <button style={{width:'100%', padding:'12px', background:'#111', color:'#646cff', border:'1px dashed #444', cursor:'pointer'}} onClick={() => setSections([...sections, { id: Date.now().toString(), title: 'New Entry', content: '', cve: 'N/A', cvss: '5.0', type: 'finding', severity: 'Medium', imageUrl: '' }])}>+ ADD SECTION</button>
        </div>
        
        <div className="preview-pane">
          <div className="preview-page">
             <div className="preview-header"><div style={{fontSize:'26px', fontWeight:'bold'}}>{reportMeta.reportName}</div></div>
             <div className="preview-section-title">EXECUTIVE RISK PROFILE</div>
             <div className="preview-table">
                {(Object.entries(stats) as [Severity, number][]).map(([label, value]) => (
                  <div key={label} className="preview-table-col">
                    <span className="preview-table-label">{label}</span>
                    <span className="preview-table-value" style={{color: SEV_COLORS[label]}}>{value}</span>
                  </div>
                ))}
             </div>
             {sections.map(s => (
              <div key={s.id + '_v'} style={{borderBottom:'1px solid #1a1a1a', paddingBottom:'20px', marginBottom:'20px'}}>
                <div style={{fontWeight:'bold', color: SEV_COLORS[s.severity], marginBottom: '10px'}}>{s.title}</div>
                <div className="md-preview" style={{fontSize:'10px', color:'#bbbbbb'}}>
                  <ReactMarkdown>{s.content}</ReactMarkdown>
                </div>
                {s.imageUrl && <img src={s.imageUrl} className="preview-img" alt="evidence" />}
              </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCPTSReport;
import { VocCase } from '@/types/voc';

// Shapes returned by wsc2026-be (spec/voc-admin.openapi.yaml + spec/voc.openapi.yaml).
// Only the fields we actually use are declared — server response has more.

interface AdminCase {
  caseId: string;
  vocNumber: string;
  status: string;
  statusLabel: string;
  journeyCode: string;
  classification: {
    requestTypeCode: string;
    topicCode: string;
    issueCode: string;
    subIssueCode?: string;
  };
  incident: { peaOfficeCode: string; locationText: string };
  reporter: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    caNumber?: string;
  } | null;
  detail: string;
  createdAt: string;
}

interface Catalog {
  requestTypes: {
    code: string;
    name: string;
    topics: {
      code: string;
      name: string;
      issues: { code: string; name: string; subIssues: { code: string; name: string }[] }[];
    }[];
  }[];
  serviceAreas: { peaOfficeCode: string; peaOfficeName: string }[];
}

async function vocApiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = process.env.BACKEND_URL;
  const key = process.env.API_KEY;
  if (!base || !key) {
    throw new Error('BACKEND_URL / API_KEY not set (see .env.local)');
  }
  return fetch(`${base}${path}`, {
    ...init,
    headers: { ...init?.headers, 'X-API-Key': key },
    cache: 'no-store',
  });
}

// Flat code -> name lookups built from the catalog. Codes are unique enough
// across the demo taxonomy that a flat map is fine here.
// ponytail: flat map assumes no code collisions across request types; switch
// to a nested (requestTypeCode, topicCode) key if the real taxonomy grows.
function buildTaxonomyMaps(catalog: Catalog) {
  const requestTypeName = new Map<string, string>();
  const topicName = new Map<string, string>();
  const issueName = new Map<string, string>();
  const subIssueName = new Map<string, string>();
  for (const rt of catalog.requestTypes) {
    requestTypeName.set(rt.code, rt.name);
    for (const topic of rt.topics) {
      topicName.set(topic.code, topic.name);
      for (const issue of topic.issues) {
        issueName.set(issue.code, issue.name);
        for (const sub of issue.subIssues) {
          subIssueName.set(sub.code, sub.name);
        }
      }
    }
  }
  const peaOfficeName = new Map(catalog.serviceAreas.map((a) => [a.peaOfficeCode, a.peaOfficeName]));
  return { requestTypeName, topicName, issueName, subIssueName, peaOfficeName };
}

function formatThaiDateTime(iso: string): string {
  return new Date(iso).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
}

function toVocCase(c: AdminCase, taxonomy: ReturnType<typeof buildTaxonomyMaps>, index: number): VocCase {
  const { requestTypeName, topicName, issueName, subIssueName, peaOfficeName } = taxonomy;
  const cls = c.classification;
  const reporter = c.reporter;
  return {
    id: index + 1,
    vocNo: c.vocNumber,
    status: c.statusLabel,
    isMerged: false, // ponytail: not modeled by wsc2026-be yet
    complainantName: reporter ? `${reporter.firstName ?? ''} ${reporter.lastName ?? ''}`.trim() : 'ไม่ระบุตัวตน',
    customerGroup: '', // ponytail: not modeled by wsc2026-be yet
    voiceType: requestTypeName.get(cls.requestTypeCode) ?? cls.requestTypeCode,
    topic: topicName.get(cls.topicCode) ?? cls.topicCode,
    issue: issueName.get(cls.issueCode) ?? cls.issueCode,
    subIssue: cls.subIssueCode ? subIssueName.get(cls.subIssueCode) ?? cls.subIssueCode : '',
    peaBranch: peaOfficeName.get(c.incident.peaOfficeCode) ?? c.incident.peaOfficeCode,
    wbs: 'ไม่มี',
    durationDays: Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86_400_000)),
    phone: reporter?.phone,
    caNumber: reporter?.caNumber,
    detail: c.detail,
    createdAt: formatThaiDateTime(c.createdAt),
  };
}

export async function fetchVocCases(): Promise<VocCase[]> {
  const [casesRes, catalogRes] = await Promise.all([
    vocApiFetch('/api/v1/voc/admin/cases'),
    vocApiFetch('/api/v1/voc/catalog'),
  ]);
  if (!casesRes.ok) throw new Error(`voc admin/cases failed: ${casesRes.status}`);
  if (!catalogRes.ok) throw new Error(`voc catalog failed: ${catalogRes.status}`);

  const cases: AdminCase[] = await casesRes.json();
  const catalog: Catalog = await catalogRes.json();
  const taxonomy = buildTaxonomyMaps(catalog);

  return cases.map((c, i) => toVocCase(c, taxonomy, i));
}

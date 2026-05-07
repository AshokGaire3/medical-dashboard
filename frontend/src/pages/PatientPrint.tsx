import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { usePatient } from '../hooks/usePatients';
import { useVitals } from '../hooks/useVitals';
import { useMedications } from '../hooks/useMedications';
import { useTestResults } from '../hooks/useTestResults';
import { useMedicalConditions } from '../hooks/useMedicalConditions';

export default function PatientPrint() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = id ? Number(id) : undefined;

  const patientQ = usePatient(patientId);
  const vitalsQ = useVitals(patientId, Boolean(patientId));
  const medsQ = useMedications(patientId, undefined, Boolean(patientId));
  const testsQ = useTestResults(patientId, undefined, Boolean(patientId));
  const condsQ = useMedicalConditions(patientId, undefined, Boolean(patientId));

  const allReady =
    !patientQ.isLoading &&
    !vitalsQ.isLoading &&
    !medsQ.isLoading &&
    !testsQ.isLoading &&
    !condsQ.isLoading;

  useEffect(() => {
    if (allReady && patientQ.data) {
      const t = setTimeout(() => window.print(), 300);
      return () => clearTimeout(t);
    }
  }, [allReady, patientQ.data]);

  if (!patientId) {
    return <ErrorState message="Invalid patient id" onRetry={() => navigate(-1)} />;
  }

  if (patientQ.isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" label="Loading patient…" />
      </div>
    );
  }
  if (patientQ.isError || !patientQ.data) {
    return (
      <ErrorState
        message={(patientQ.error as Error)?.message ?? 'Patient not found'}
        onRetry={() => patientQ.refetch()}
      />
    );
  }

  const p = patientQ.data;
  const vitals = vitalsQ.data ?? [];
  const meds = medsQ.data ?? [];
  const tests = testsQ.data ?? [];
  const conds = condsQ.data ?? [];

  return (
    <div className="print-page bg-white text-gray-900 max-w-4xl mx-auto p-10 text-sm">
      <header className="border-b-2 border-gray-900 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="text-gray-700 mt-1">
              {p.age} yrs · {p.gender} · {p.condition}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">Status: {p.status}</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p>Medical Dashboard</p>
            <p>{format(new Date(), 'PPpp')}</p>
          </div>
        </div>
      </header>

      <Section title="Contact">
        <Pair label="Phone" value={p.contactInfo?.phone} />
        <Pair label="Email" value={p.contactInfo?.email} />
        <Pair label="Address" value={p.contactInfo?.address} />
        <Pair
          label="Emergency"
          value={
            p.emergencyContact?.name
              ? `${p.emergencyContact.name} (${p.emergencyContact.relationship}) — ${p.emergencyContact.phone}`
              : '—'
          }
        />
      </Section>

      <Section title="Allergies">
        {p.allergies?.length ? p.allergies.join(', ') : 'None recorded.'}
      </Section>

      <Section title="Medical history">
        {conds.length === 0 ? (
          <p>None recorded.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {conds.map((c) => (
              <li key={c.id}>
                <strong>{c.condition}</strong> — {c.severity}, {c.status}, diagnosed{' '}
                {format(parseISO(c.diagnosedDate), 'PP')}
                {c.notes ? ` · ${c.notes}` : ''}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Medications">
        {meds.length === 0 ? (
          <p>None.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Name</Th>
                <Th>Dosage</Th>
                <Th>Frequency</Th>
                <Th>Status</Th>
                <Th>Started</Th>
                <Th>Prescribed by</Th>
              </tr>
            </thead>
            <tbody>
              {meds.map((m) => (
                <tr key={m.id} className="border-b border-gray-200">
                  <Td>{m.name}</Td>
                  <Td>{m.dosage}</Td>
                  <Td>{m.frequency}</Td>
                  <Td>{m.status}</Td>
                  <Td>{format(parseISO(m.startDate), 'PP')}</Td>
                  <Td>{m.prescribedBy}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Test results">
        {tests.length === 0 ? (
          <p>None.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Date</Th>
                <Th>Test</Th>
                <Th>Type</Th>
                <Th>Result</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-b border-gray-200">
                  <Td>{format(parseISO(t.date), 'PP')}</Td>
                  <Td>{t.testName}</Td>
                  <Td>{t.testType}</Td>
                  <Td>{t.result}</Td>
                  <Td>{t.status}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Recent vitals (latest 5)">
        {vitals.length === 0 ? (
          <p>None.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Timestamp</Th>
                <Th>HR</Th>
                <Th>BP</Th>
                <Th>Temp</Th>
                <Th>SpO₂</Th>
                <Th>Resp</Th>
              </tr>
            </thead>
            <tbody>
              {vitals.slice(0, 5).map((v) => (
                <tr key={v.id} className="border-b border-gray-200">
                  <Td>{format(parseISO(v.timestamp), 'PPp')}</Td>
                  <Td>{v.heartRate}</Td>
                  <Td>
                    {v.bloodPressureSystemic}/{v.bloodPressureDiastolic}
                  </Td>
                  <Td>{v.temperature}°F</Td>
                  <Td>{v.oxygenSaturation}%</Td>
                  <Td>{v.respiratoryRate}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {p.treatmentNotes ? (
        <Section title="Treatment notes">{p.treatmentNotes}</Section>
      ) : null}

      <footer className="mt-8 pt-3 border-t border-gray-300 text-xs text-gray-500">
        Generated by Medical Dashboard · Confidential patient information.
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-400 pb-1 mb-2">
        {title}
      </h2>
      <div className="text-sm">{children}</div>
    </section>
  );
}

function Pair({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium w-28">{label}:</span>
      <span>{value || '—'}</span>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left py-1 pr-3 text-xs font-semibold">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-1 pr-3 align-top">{children}</td>;
}

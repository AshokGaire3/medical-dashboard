import { useState } from 'react';
import { FileDown, FileJson, FileText, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { reportsApi } from '../api';
import { useDashboardMetrics } from '../hooks/useDashboard';

export default function Reports() {
  const metricsQ = useDashboardMetrics();
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadCsv = async () => {
    setDownloading('csv');
    try {
      await reportsApi.downloadPatientsCsv(
        `patients-${new Date().toISOString().split('T')[0]}.csv`,
      );
      toast.success('CSV download started.');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDownloading(null);
    }
  };

  const downloadJson = async () => {
    setDownloading('json');
    try {
      const data = await reportsApi.patientsJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('JSON exported.');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDownloading(null);
    }
  };

  const metrics = metricsQ.data;

  return (
    <div className="p-6">
      <PageHeader
        title="Reports & exports"
        description="Export patient data in various formats for analysis or sharing."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total patients" value={metrics?.totalPatients ?? 0} />
        <Stat label="Current" value={metrics?.currentPatients ?? 0} />
        <Stat label="Recovered" value={metrics?.recoveredPatients ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportCard
          icon={<FileText className="w-6 h-6" />}
          title="Patients — CSV"
          description="All patient records in CSV format, suitable for Excel or analytics pipelines."
          action={
            <Button
              loading={downloading === 'csv'}
              leftIcon={<FileDown className="w-4 h-4" />}
              onClick={downloadCsv}
            >
              Download CSV
            </Button>
          }
        />
        <ReportCard
          icon={<FileJson className="w-6 h-6" />}
          title="Patients — JSON"
          description="Full patient records including nested vitals, medications, and appointments."
          action={
            <Button
              loading={downloading === 'json'}
              variant="outline"
              leftIcon={<FileDown className="w-4 h-4" />}
              onClick={downloadJson}
            >
              Download JSON
            </Button>
          }
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ReportCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          <div className="mt-4">{action}</div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import jsPDF from "jspdf";

interface FeatureOption {
  label: string;
  value: string;
  cost: number;
}

interface ProjectTypeOption {
  label: string;
  value: string;
  baseCost: number;
}

interface TimelineOption {
  label: string;
  value: string;
  fee: number;
}

interface MaintenanceOption {
  label: string;
  value: string;
  monthly: number;
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  { label: "Landing Page (GHC3,000)", value: "landing", baseCost: 3000 },
  { label: "Simple Full Website (GHC5,000)", value: "simple", baseCost: 5000 },
  { label: "E-commerce Website (GHC18,000)", value: "ecommerce", baseCost: 18000 },
  { label: "Web App UI Design (GHC12,000)", value: "webapp", baseCost: 12000 },
  { label: "CMS Website (GHC15,000)", value: "cms", baseCost: 15000 },
];

const FEATURES: FeatureOption[] = [
  { label: "User Authentication (GHC300)", value: "auth", cost: 300 },
  { label: "Payment Integration (GHC1200)", value: "payment", cost: 1200 },
  { label: "Blog/News Section (GHC800)", value: "blog", cost: 800 },
  { label: "Admin Dashboard (GHC1200)", value: "admin", cost: 1200 },
  { label: "Custom Animations (GHC1050)", value: "animations", cost: 1050 },
];

const TIMELINES: TimelineOption[] = [
  { label: "Standard (No Rush Fee)", value: "standard", fee: 0 },
  { label: "Express (5–7 days) (+GHC2,000)", value: "express", fee: 2000 },
  { label: "Urgent (2–3 days) (+GHC4,500)", value: "urgent", fee: 4500 },
];

const MAINTENANCE: MaintenanceOption[] = [
  { label: "None (GHC0/month)", value: "none", monthly: 0 },
  { label: "Basic Support (GHC200/month)", value: "basic", monthly: 200 },
  { label: "Full Support & Updates (GHC600/month)", value: "full", monthly: 600 },
];

const BASE_PAGES_INCLUDED = 5;
const EXTRA_PAGE_COST = 500;

export default function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [pages, setPages] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [maintenance, setMaintenance] = useState(MAINTENANCE[0]);

  if (!open) return null;

  // Calculate costs
  const baseCost = projectType.baseCost;
  const extraPages = Math.max(0, pages - BASE_PAGES_INCLUDED);
  const pagesCost = extraPages * EXTRA_PAGE_COST;
  const featuresCost = selectedFeatures.reduce(
    (sum, val) => sum + (FEATURES.find((f) => f.value === val)?.cost || 0),
    0
  );
  const rushFee = timeline.fee;
  const maintenanceCost = maintenance.monthly;
  const projectTotal = baseCost + pagesCost + featuresCost + rushFee;

  // Handlers
  const handleFeatureChange = (value: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Download PDF implementation
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Your Custom Quote", 14, 18);
    doc.setFontSize(12);
    let y = 30;
    doc.text(`Project Type: ${projectType.label}`, 14, y);
    y += 8;
    doc.text(`Number of Pages/Screens: ${pages}`, 14, y);
    y += 8;
    doc.text(
      `Additional Features: ${selectedFeatures.length > 0 ? selectedFeatures.map(f => FEATURES.find(opt => opt.value === f)?.label).join(", ") : "None"}`,
      14,
      y
    );
    y += 8;
    doc.text(`Delivery Timeline: ${timeline.label}`, 14, y);
    y += 8;
    doc.text(`Maintenance Plan: ${maintenance.label}`, 14, y);
    y += 12;
    doc.setFontSize(14);
    doc.text("Breakdown", 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Base Project: GHC${baseCost}`, 14, y);
    y += 8;
    doc.text(`Pages/Screens: GHC${pagesCost}`, 14, y);
    y += 8;
    doc.text(`Additional Features: GHC${featuresCost}`, 14, y);
    y += 8;
    doc.text(`Rush Fee: GHC${rushFee}`, 14, y);
    y += 8;
    doc.text(`Project Total: GHC${projectTotal}`, 14, y);
    y += 8;
    doc.text(`Monthly Maintenance: GHC${maintenanceCost}/month`, 14, y);
    y += 16;
    doc.setFontSize(10);
    doc.text("Thank you for using our quote generator!", 14, y);
    doc.save("project-quote.pdf");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl mx-4 overflow-hidden">
        {/* Left: Project Details */}
        <div className="flex-1 p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6">Project Details</h2>
          {/* Project Type */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Project Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={projectType.value}
              onChange={(e) => setProjectType(PROJECT_TYPES.find(pt => pt.value === e.target.value) || PROJECT_TYPES[0])}
            >
              {PROJECT_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>
          {/* Number of Pages/Screens */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Number of Pages/Screens</label>
            <input
              type="range"
              min={1}
              max={20}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>1</span>
              <span>{pages}</span>
              <span>20</span>
            </div>
          </div>
          {/* Additional Features */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Additional Features</label>
            <div className="flex flex-col gap-1">
              {FEATURES.map((f) => (
                <label key={f.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(f.value)}
                    onChange={() => handleFeatureChange(f.value)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
          {/* Delivery Timeline */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Delivery Timeline</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={timeline.value}
              onChange={(e) => setTimeline(TIMELINES.find(t => t.value === e.target.value) || TIMELINES[0])}
            >
              {TIMELINES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {/* Maintenance Plan */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Maintenance Plan</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={maintenance.value}
              onChange={(e) => setMaintenance(MAINTENANCE.find(m => m.value === e.target.value) || MAINTENANCE[0])}
            >
              {MAINTENANCE.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <button
            className="w-full py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold mb-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        {/* Right: Quote Summary */}
        <div className="flex-1 p-8 bg-gradient-to-br from-cyan-200 via-sky-200 to-cyan-400 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Custom Quote</h2>
            <div className="flex justify-between mb-2 text-base">
              <span>Base Project</span>
              <span>GHC{baseCost}</span>
            </div>
            <div className="flex justify-between mb-2 text-base">
              <span>Pages/Screens</span>
              <span>GHC{pagesCost}</span>
            </div>
            <div className="flex justify-between mb-2 text-base">
              <span>Additional Features</span>
              <span>GHC{featuresCost}</span>
            </div>
            <div className="flex justify-between mb-2 text-base">
              <span>Rush Fee</span>
              <span>GHC{rushFee}</span>
            </div>
            <div className="border-t border-cyan-300 my-4"></div>
            <div className="flex justify-between font-bold text-lg mb-2">
              <span>Project Total</span>
              <span>GHC{projectTotal}</span>
            </div>
            <div className="flex justify-between text-base mb-6">
              <span>Monthly Maintenance</span>
              <span>GHC{maintenanceCost}/month</span>
            </div>
          </div>
          <button
            className="w-full py-3 rounded bg-white text-cyan-700 font-semibold text-lg shadow hover:bg-cyan-50 border border-cyan-300 flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <span className="material-icons">download</span>
            Download Quote PDF
          </button>
        </div>
      </div>
    </div>
  );
} 
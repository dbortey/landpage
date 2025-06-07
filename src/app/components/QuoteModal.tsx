"use client";

import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  { label: "Simple Full Website (GHC8,000)", value: "simple", baseCost: 8000 },
  { label: "E-commerce Website (GHC18,000)", value: "ecommerce", baseCost: 18000 },
  { label: "Web App UI Design (GHC15,000)", value: "webapp", baseCost: 15000 },
  { label: "CMS Website (GHC20,000)", value: "cms", baseCost: 20000 },
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

  const pdfContentRef = useRef<HTMLDivElement>(null);

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
  const handleDownload = async () => {
    if (pdfContentRef.current) {
      const canvas = await html2canvas(pdfContentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('project-quote.pdf');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row w-full max-w-4xl mx-4 overflow-hidden z-10 max-h-[90vh] md:max-h-none overflow-y-auto">
        {/* Left: Project Details */}
        <div className="flex-1 p-8 bg-white text-gray-900">
          <h2 className="text-2xl font-bold mb-6">Project Details</h2>
          {/* Project Type */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Project Type</label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-900"
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
              className="w-full border rounded px-3 py-2 text-gray-900"
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
              className="w-full border rounded px-3 py-2 text-gray-900"
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
        <div className="flex-1 p-8 bg-gradient-to-br from-cyan-200 via-sky-200 to-cyan-400 flex flex-col justify-between text-gray-900">
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
      {/* Hidden content for PDF generation */}
      <div ref={pdfContentRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
        <div className="container">
            <h1>Your Custom Quote</h1>
            <div className="project-total">Project Total: GH¢{projectTotal}</div>
            <ul>
                <li>Project Type: {projectType.label}</li>
                <li>Number of Pages/Screens: {pages}</li>
                <li>Additional Features: {selectedFeatures.length > 0 ? selectedFeatures.map(f => FEATURES.find(opt => opt.value === f)?.label).join(', ') : 'None'}</li>
                <li>Delivery Timeline: {timeline.label}</li>
                <li>Maintenance Plan: {maintenance.label}</li>
            </ul>
            <h2>Breakdown</h2>
            <div className="breakdown">
                <div className="breakdown-item">Base Project: GH¢{baseCost}</div>
                <div className="breakdown-item">Rush Fee: GH¢{rushFee}</div>
                <div className="breakdown-item">Pages/Screens: GH¢{pagesCost}</div>
                <div className="breakdown-item">Additional Features: GH¢{featuresCost}</div>
                <div className="breakdown-item">Project Total: GH¢{projectTotal}</div>
                <div className="breakdown-item">Monthly Maintenance: GH¢{maintenanceCost}</div>
            </div>
            <div className="disclaimer">Disclaimer: this quote is created and managed by you. This quote is not fixed and can be updated based on project needs as at discussion.</div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
            body {
                font-family: Arial, sans-serif;
                background-color: #e6f3f9;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                color: #333;
                font-size: 9.6px; /* Reduced by 40% from default */
            }
            .container {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                width: 400px;
            }
            h1 {
                text-align: center;
                color: #1a73e8;
                margin-bottom: 20px;
                font-size: 12px; /* Reduced by 40% from 20px */
            }
            h2 {
                color: #1a73e8;
                margin-top: 20px;
                font-size: 9.6px; /* Reduced by 40% from 16px */
            }
            .project-total {
                font-size: 14.4px; /* Reduced by 40% from 24px */
                text-align: center;
                margin: 20px 0;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
            li {
                margin: 10px 0;
                position: relative;
                padding-left: 25px;
            }
            li:before {
                content: "\u2714"; /* Unicode checkmark */
                color: #1a73e8;
                position: absolute;
                left: 0;
            }
            .breakdown {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 20px;
            }
            .breakdown div {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-size: 9.6px; /* Reduced by 40% from default */
            }
            .disclaimer {
                font-size: 7.2px; /* Reduced by 40% from 12px */
                text-align: center;
                margin-top: 20px;
                color: #666;
            }
        ` }} />
      </div>
    </div>
  );
} 
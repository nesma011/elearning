import React, { useState } from 'react';
import { Search } from 'lucide-react';

const LabValue = () => {
  const [activeTab, setActiveTab] = useState('Serum');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLabValueVisible, setIsLabValueVisible] = useState(true);

  // Consolidated lab values from screenshots + original code
  const labData = {
    Serum: [
      // Original sample tests
      { test: 'Alanine aminotransferase (ALT)', range: '10-40 U/L' },
      { test: 'Aspartate aminotransferase (AST)', range: '12-38 U/L' },
      { test: 'Alkaline phosphatase', range: '25-100 U/L' },
      { test: 'Amylase', range: '25-125 U/L' },
      { test: 'Bilirubin Total', range: '0.1-1.0 mg/dL' },
      { test: 'Bilirubin Direct', range: '0.0-0.3 mg/dL' },
      { test: 'Calcium (serum)', range: '8.4-10.2 mg/dL' },

      // Additional serum values
      { test: 'Cholesterol, Total (Normal)', range: '<200 mg/dL' },
      { test: 'Cholesterol, High', range: '>240 mg/dL' },
      { test: 'Cholesterol, HDL', range: '40-60 mg/dL' },
      { test: 'Cholesterol, LDL', range: '<160 mg/dL' },

      { test: 'Triglycerides, Normal', range: '<150 mg/dL' },
      { test: 'Triglycerides, Borderline', range: '151-199 mg/dL' },

      { test: 'Cortisol, 0800 h', range: '5-23 µg/dL' },
      { test: 'Cortisol, 1600 h', range: '3-15 µg/dL' },
      { test: 'Cortisol, 2000 h', range: '<50% of 0800 h' },

      { test: 'Creatine kinase, Male', range: '25-90 U/L' },
      { test: 'Creatine kinase, Female', range: '10-70 U/L' },
      { test: 'Creatinine', range: '0.6-1.2 mg/dL' },
      { test: 'Urea nitrogen (BUN)', range: '7-18 mg/dL' },

      { test: 'Sodium (Na+)', range: '136-146 mEq/L' },
      { test: 'Potassium (K+)', range: '3.5-5.0 mEq/L' },
      { test: 'Chloride (Cl-)', range: '95-105 mEq/L' },
      { test: 'Bicarbonate (HCO3-)', range: '22-28 mEq/L' },
      { test: 'Magnesium (Mg2+)', range: '1.5-2.0 mEq/L' },

      { test: 'Ferritin, Male', range: '20-250 ng/mL' },
      { test: 'Ferritin, Female', range: '10-120 ng/mL' },

      { test: 'Follicle-stimulating hormone (FSH), Male', range: '4-25 mIU/mL' },
      { test: 'FSH, Female (premenopause)', range: '4-30 mIU/mL' },
      { test: 'FSH, Female (midcycle peak)', range: '10-90 mIU/mL' },
      { test: 'FSH, Female (postmenopause)', range: '40-250 mIU/mL' },

      { test: 'Glucose, Fasting', range: '70-110 mg/dL' },
      { test: 'Glucose, Random (non-fasting)', range: '<140 mg/dL' },

      { test: 'Growth hormone (arginine stimulation), Fasting', range: '<5 ng/mL' },
      { test: 'Growth hormone (arginine stimulation), Provocative', range: '>7 ng/mL' },

      { test: 'Iron, Male', range: '65-175 µg/dL' },
      { test: 'Iron, Female', range: '50-170 µg/dL' },
      { test: 'Total iron-binding capacity (TIBC)', range: '250-400 µg/dL' },
      { test: 'Transferrin', range: '200-360 mg/dL' },
      { test: 'Lactate dehydrogenase (LDH)', range: '45-200 U/L' },

      { test: 'Luteinizing hormone (LH), Male', range: '6-23 mIU/mL' },
      { test: 'LH, Female (follicular phase)', range: '5-30 mIU/mL' },
      { test: 'LH, Female (midcycle peak)', range: '75-150 mIU/mL' },
      { test: 'LH, Female (postmenopause)', range: '30-200 mIU/mL' },

      { test: 'Osmolality (serum)', range: '275-295 mOsmol/kg H2O' },
      { test: 'Intact parathyroid hormone (PTH)', range: '10-60 pg/mL' },
      { test: 'Phosphorus (inorganic)', range: '3.0-4.5 mg/dL' },

      { test: 'Prolactin (hPRL), Male', range: '<17 ng/mL' },
      { test: 'Prolactin (hPRL), Female', range: '<25 ng/mL' },

      { test: 'Proteins, Total (serum)', range: '6.0-7.8 g/dL' },
      { test: 'Albumin (serum)', range: '3.5-5.5 g/dL' },
      { test: 'Globulin (serum)', range: '2.0-3.5 g/dL' },

      { test: 'Troponin I', range: '<0.04 ng/dL' },
      { test: 'TSH (thyroid-stimulating hormone)', range: '0.4-4.0 µU/mL' },
      { test: 'Thyroidal iodine (123I) uptake', range: '8%-30% of administered dose/24h' },
      { test: 'Thyroxine (T4)', range: '5-12 µg/dL' },
      { test: 'Free T4', range: '0.9-1.7 ng/dL' },
      { test: 'Triiodothyronine (T3, RIA)', range: '100-200 ng/dL' },
      { test: 'T3 resin uptake', range: '25%-35%' },

      { test: 'Uric acid', range: '3.0-8.2 mg/dL' },

      { test: 'Immunoglobulin A (IgA)', range: '76-390 mg/dL' },
      { test: 'Immunoglobulin E (IgE)', range: '0-380 IU/mL' },
      { test: 'Immunoglobulin G (IgG)', range: '650-1500 mg/dL' },
      { test: 'Immunoglobulin M (IgM)', range: '50-300 mg/dL' },

      { test: 'Arterial blood gas pH (room air)', range: '7.35-7.45' },
      { test: 'Arterial blood gas Pco2 (room air)', range: '33-45 mm Hg' },
      { test: 'Arterial blood gas Po2 (room air)', range: '75-105 mm Hg' },
    ],

    Cerebrospinal: [
      { test: 'Cell count (CSF)', range: '0-5/mm^3' },
      { test: 'Chloride (CSF)', range: '118-132 mEq/L' },
      { test: 'Gamma globulin (CSF)', range: '3%-12% total proteins' },
      { test: 'Glucose (CSF)', range: '40-70 mg/dL' },
      { test: 'Pressure (CSF)', range: '70-180 mm H2O' },
      { test: 'Proteins, total (CSF)', range: '<40 mg/dL' },
    ],

    Blood: [
      // RBC and ESR
      { test: 'Erythrocyte count, Male', range: '4.3-5.9 million/mm^3' },
      { test: 'Erythrocyte count, Female', range: '3.5-5.5 million/mm^3' },
      { test: 'Erythrocyte sedimentation rate (ESR), Male', range: '0-15 mm/h' },
      { test: 'Erythrocyte sedimentation rate (ESR), Female', range: '0-20 mm/h' },

      // Hematocrit, Hemoglobin
      { test: 'Hematocrit, Male', range: '41%-53%' },
      { test: 'Hematocrit, Female', range: '36%-46%' },
      { test: 'Hemoglobin, Male', range: '13.5-17.5 g/dL' },
      { test: 'Hemoglobin, Female', range: '12.0-16.0 g/dL' },

      // From new images
      { test: 'Hemoglobin A1c', range: '≤6%' },
      { test: 'Hemoglobin, plasma', range: '<4 mg/dL' },

      // WBC + differential
      { test: 'Leukocyte count (WBC)', range: '4500-11000/mm^3' },
      { test: 'Neutrophils, segmented', range: '54%-62%' },
      { test: 'Neutrophils, bands', range: '3%-5%' },
      { test: 'Eosinophils', range: '1%-3%' },
      { test: 'Basophils', range: '0%-0.75%' },
      { test: 'Lymphocytes', range: '25%-33%' },
      { test: 'Monocytes', range: '3%-7%' },
      { test: 'CD4+ T-lymphocyte count', range: '≥500/mm^3' },

      // Platelets, Retic, Coag
      { test: 'Platelet count', range: '150000-400000/mm^3' },
      { test: 'Reticulocyte count', range: '0.5%-1.5%' },
      { test: 'D-Dimer', range: '≤250 ng/mL' },
      { test: 'Partial thromboplastin time (aPTT)', range: '25-40 seconds' },
      { test: 'Prothrombin time (PT)', range: '11-15 seconds' },

      // RBC indices
      { test: 'Mean corpuscular hemoglobin (MCH)', range: '25-35 pg/cell' },
      {
        test: 'Mean corpuscular hemoglobin concentration (MCHC)',
        range: '31%-36% Hb/cell',
      },
      { test: 'Mean corpuscular volume (MCV)', range: '80-100 µm^3' },

      // Blood volume
      { test: 'Volume, Plasma (Male)', range: '25-43 mL/kg' },
      { test: 'Volume, Plasma (Female)', range: '28-45 mL/kg' },
      { test: 'Volume, Red cell (Male)', range: '20-36 mL/kg' },
      { test: 'Volume, Red cell (Female)', range: '19-31 mL/kg' },
    ],

    'Urine and BMI': [
      // Original urine values
      { test: 'Color (urine)', range: 'Yellow' },
      { test: 'pH (urine)', range: '4.5-8.0' },
      { test: 'Protein (urine dipstick)', range: '0-5 mg/dL' },
      { test: 'Glucose (urine)', range: 'None' },
      { test: 'Ketones (urine)', range: 'None' },
      { test: 'Specific gravity (urine)', range: '1.005-1.030' },

      // Additional from screenshots
      { test: 'Calcium (urine, 24h)', range: '100-300 mg/24 h' },
      { test: 'Creatinine clearance, Male', range: '97-137 mL/min' },
      { test: 'Creatinine clearance, Female', range: '88-128 mL/min' },
      { test: 'Osmolality (urine)', range: '50-1200 mOsmol/kg H2O' },
      { test: 'Oxalate (urine)', range: '8-40 µg/mL' },
      { test: 'Proteins, total (urine, 24h)', range: '<150 mg/24 h' },

      // 17-hydroxy, 17-keto
      {
        test: '17-Hydroxycorticosteroids, Male',
        range: '3.0-10.0 mg/24 h',
      },
      {
        test: '17-Hydroxycorticosteroids, Female',
        range: '2.0-8.0 mg/24 h',
      },
      {
        test: '17-Ketosteroids, total, Male',
        range: '8-20 mg/24 h',
      },
      {
        test: '17-Ketosteroids, total, Female',
        range: '6-15 mg/24 h',
      },

      // BMI
      { test: 'Body Mass Index (BMI), Adult', range: '19-25 kg/m^2' },
    ],
  };

  const filteredData = labData[activeTab].filter((item) =>
    item.test.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLabValueVisible && (
        <div className="max-w-3xl p-6 bg-blue-400 text-black font-semibold rounded-lg">
          <button
            onClick={() => setIsLabValueVisible(false)}
            className="bg-red-500 text-white p-4 rounded-lg"
          >
            X
          </button>
          <h2 className="text-2xl font-bold text-center mb-2">Lab Values</h2>

          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded-md pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5" size={20} />
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            {Object.keys(labData).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-white'
                    : 'text-gray-900 font-semibold'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Lab Values Table with Scroll */}
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-300">
                  <th className="text-left p-3 border">Test</th>
                  <th className="text-left p-3 border">Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{item.test}</td>
                    <td className="p-3 border">{item.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default LabValue;

export const modelReferenceData = {
  QModelType: [
    {
      qm_type: "Model",
      qm_type_id: 1,
    },
    {
      qm_type: "DQM in scope",
      qm_type_id: 2,
    },
    {
      qm_type: "DQM out of scope",
      qm_type_id: 3,
    },
    {
      qm_type: "other",
      qm_type_id: 10,
    },
  ],
  QModelPurpose: [
    {
      purpose: "Credit",
      purpose_id: 1,
    },
    {
      purpose: "Market",
      purpose_id: 2,
    },
    {
      purpose: "Operational",
      purpose_id: 3,
    },
    {
      purpose: "Other",
      purpose_id: 10,
    },
  ],
  Uses: [
    {
      use: "Capital",
      use_id: 1,
    },
    {
      use: "Liq Managment",
      use_id: 2,
    },
    {
      use: "Pricing",
      use_id: 3,
    },
    {
      use: "Interest Rate Risk Banking book",
      use_id: 5,
    },
    {
      use: "Valuation",
      use_id: 4,
    },
    {
      use: "Portfolio Management",
      use_id: 6,
    },
    {
      use: "Stress Testing",
      use_id: 7,
    },
    {
      use: "Other",
      use_id: 20,
    },
  ],
  AssetClass: [
    {
      assetclass: "Rates",
      assetclass_id: 1,
    },
    {
      assetclass: "Equity",
      assetclass_id: 2,
    },
    {
      assetclass: "Commodity",
      assetclass_id: 3,
    },
    {
      assetclass: "Credit",
      assetclass_id: 4,
    },
    {
      assetclass: "FX",
      assetclass_id: 5,
    },
    {
      assetclass: "Hybrid",
      assetclass_id: 5,
    },
    {
      assetclass: "Inflation",
      assetclass_id: 6,
    },
    {
      assetclass: "Credit",
      assetclass_id: 7,
    },
    {
      assetclass: "Other",
      assetclass_id: 20,
    },
  ],
  Subgroup: [
    {
      subgroup: "SG1",
      subgroup_id: 1,
    },
    {
      subgroup: "SG2",
      subgroup_id: 2,
    },
    {
      subgroup: "SG10",
      subgroup_id: 3,
    },
    {
      subgroup: "SG30",
      subgroup_id: 4,
    },
  ],
  model_reference_data_level2: {
    PurposeToUse: [
      {
        purpose_id: 1,
        use_id: 1,
      },
      {
        purpose_id: 2,
        use_id: 1,
      },
      {
        purpose_id: 2,
        use_id: 2,
      },
      {
        purpose_id: 2,
        use_id: 3,
      },
      {
        purpose_id: 3,
        use_id: 6,
      },
      {
        purpose_id: 3,
        use_id: 7,
      },
      {
        purpose_id: 3,
        use_id: 8,
      },
    ],
    SubgroupToUse: [
      {
        subgroup_id: 1,
        use_id: 1,
      },
      {
        subgroup_id: 1,
        use_id: 7,
      },
      {
        subgroup_id: 2,
        use_id: 3,
      },
      {
        subgroup_id: 2,
        use_id: 3,
      },
    ],
    PurposeToAssetClass: [
      {
        purpose_id: 1,
        assetclass_id: 2,
      },
      {
        purpose_id: 1,
        assetclass_id: 6,
      },
      {
        purpose_id: 2,
        assetclass_id: 1,
      },
      {
        purpose_id: 2,
        assetclass_id: 2,
      },
      {
        purpose_id: 2,
        assetclass_id: 3,
      },
    ],
  },
}


# Model Inventory Management System

# Project Overview

Ss1/23 mandates that the bank undertake the task of building out a group wide model risk managment tool that would provide a framework to manage risk across the various of models both DQM (calculated metris like RWA) or QM (both deterministic or AI:ML based).

# System Architecture

The Model Risk Framework implements a tech-agnostic, functional architecture with the following key components:

## Model Risk Management Tool

The core system consists of several integrated components:

1. **User Interface Layer**

   - Model Lifecycle updates interface
   - Validation interface
   - UI for model owners and MRAVs (Model Risk Assessment Validators)

2. **Service Layer**

   - Workflow Admin service
   - Authorization/Authentication service
   - Inventory Query service
   - Report Service
   - Risk Metrics updater

3. **Data Management**

   - Model Risk Management data store with confidentiality levels:
     - Highly confidential
     - Confidential
     - Limited
     - Public
   - Database for centralized storage
   - Historic inventory data fetcher/ingestion

4. **Integration Layer**
   - Interfaces for external systems (in/out)

## User Roles

- Model owner
- MRAV (Model Risk Assessment Validator)
- Model Owner Inputter

## Functional Capabilities

- **Dashboarding/Visualization**: Visual representation of model risk data
- **Reporting**: Generation of standardized and custom reports
- **Workflow Management**: Administration of model lifecycle processes

# Data Sources and Integration

## Data Sources

The system integrates with multiple data sources across the organization:

### Risk Domain

- **Legacy Inventories in Risk**
  - Multiple inventory systems (sharepoint-based)
  - Inventory 1, 2, through n
- **Model Lifecycle Components**
  - Ops
  - Execution
  - Monitoring
  - Validation

### Wider Group Domain

- **Legacy Inventories**
  - Multiple inventory systems
  - Inventory 1, 2, through n
- **Model Lifecycle Components**
  - Ops
  - Execution
  - Monitoring
  - Validation

## Data Integration Patterns

### Batch Processing

- **Batch read/update** operations for historic inventory data
- Expected to be one-time imports for initial data population

### Periodic Updates

- **MLOps metrics** updated on a scheduled basis
- Continuous data refresh for operational metrics

### Integration Methods

- **SQL/read/REST/get/post** methods
- **File-Based Interfaces** (in/out)

## Downstream Systems

- **Case Management System**
- **End User App tracker System**
- **Other Enterprise systems**

# Data Pathways

- **Model Ops data pathway**: For operational model data flow
- **Legacy Inventory data pathway**: Integration with existing inventory systems
- **Internal connectivity**: Between system components
- **LBG System connectivity**: Integration with broader bank systems

# Modeling Estates

The framework encompasses:

- Modeling Estate within risk boundaries
- Modeling Estate outside of risk boundaries

# Purpose

To iterate a prototype towards the end product with active participation and feedback from the business teams. This prototype is the first step towards building out an enterprise-wide model risk management solution that meets regulatory requirements while providing practical utility to model owners and risk managers.

# Prototype Requirements

The business has collated 3 use cases that they deem important to tackle as part of this prototype. The first use case will be the initial focus for the dashboard implementation.

## Use Case 1: Models with Multiple Uses

### Goals

1. Record a model in the Inventory with multiple uses
2. Add a new model use (to be demonstrated live during interactive demo)
3. Review information for all models

### Implementation Steps

#### 1. Enter Model Details into the Inventory

**User Interface Requirements:**

- Form for entering model details via the user interface
- Fields to capture:
  - Unique reference
  - Model Y (model name)
  - Type of QM (Model, DQM in scope, DQM out scope, Gen AI, Other)
  - QM Purpose (Credit, Market, Operational, Other)
  - Owner
  - MOI (Model Owner Inputter)
  - Legal Entities (LE1, LE2)

**Example Implementation:**

- In this example, the purpose of the model is for Market risk
- Model Y is used in two legal entities (LE1 and LE2) for pricing and valuation
- Additional information related to the asset classes the model is used for

**Reference Data Structure:**

- Type of QM options:
  - Model
  - DQM in scope
  - DQM out scope
  - Gen AI
  - Other
- Model Purpose selection options:
  - Credit
  - Market
  - Operational
  - Other
- Model Use selection dependent on Model Purpose

#### 2. Add a New Model Use via the User Interface

**Live Demo Functionality:**

- Ability to add a new model use for Model Y
- Selection interface for Model Purpose & Model Use options
- Dependent dropdown functionality where Use selection depends on Purpose

**Model Use Categories by Purpose:**

- Credit Purpose:
  - Capital
  - Liquidity Management
  - Pricing
  - Valuation
  - Interest Rate Risk Banking Book
  - Portfolio Management
  - Stress Testing
  - Other
- Market Purpose:
  - Similar categories with market-specific options
- Operational Purpose:
  - Operational-specific categories

#### 3. Review Information for All Models

**Functionality:**

- Opportunity to show how model information can be found and reviewed in the system
- Interface to display comprehensive model details
- Audit log of changes for tracking modifications

**Key Features:**

- Searchable model inventory
- Filtering capabilities
- Detailed view of model attributes
- Change history tracking

# Use Cases

1. Model with multiple uses

- Record a model in inventory with multiple uses
- Add new model use
- Review information for all models

# Use Case

Model relationships

# Goals

1. Setup a series of model relationships
2. Show how model relationships can be viewed or reported

# Steps

1. Record a series of relationships between models va the user interface
   -- in this example (imagen attached) the output from model z is used as input to models P & Q, also the output from model Q is used as input to model R and the output from model S has both a use for reporting and as an input to model Q.
2. Add / Edit another model relationship (live in demo to stakeholders) --- we should be able to do this.
3. Show how the user can review model relationships including visualisation of the interdependencies.
   -- Oportunity to showcase different ways model relationships can be found and reviewed in your solution.

## 2d chart

Based on the project overview, use case 3, and the current implementation, here are several potential improvements we could make to the 2D chart:
Visual Hierarchy Improvements:
Add different node shapes for different model types (Model, DQM in scope, DQM out scope, Gen AI)
Use different line styles for different relationship types (input, output, reporting)
Implement a mini-map for large graphs to help with navigation
Model Risk Management Features:
Add visual indicators for models requiring validation or review
Color-code edges based on data sensitivity levels (highly confidential, confidential, limited, public)
Add badges or icons to show regulatory compliance status
Interactive Features:
Add the ability to drag and rearrange nodes manually
Implement node grouping/clustering by department or risk level
Add zoom and pan controls for better navigation
Double-click to expand/collapse node groups
Analysis Tools:
Add impact analysis visualization (highlight all affected models if one fails)
Show critical paths in the model dependencies
Add metrics visualization (e.g., risk scores, validation status)
Collaboration Features:
Add annotation capabilities for MRAV reviewers
Show user avatars/indicators for models currently being reviewed
Add the ability to share specific views/states of the graph
Layout Options:
Add different layout algorithms (hierarchical, circular, force-directed)
Allow saving and loading of custom layouts
Add auto-arrange options based on different criteria (risk, department, validation status)
Search and Filter Enhancements:
Add path finding between two selected models
Filter by data sensitivity level
Search by model attributes and relationships
Add timeline-based filtering
Documentation Integration:
Show documentation status indicators
Quick access to model documentation
Visual indicators for models with pending documentation updates
Workflow Integration:
Show model lifecycle status
Indicate models in validation process
Show approval workflow status
Reporting Features:
Add the ability to generate dependency reports
Export selected subgraphs
Create snapshots for point-in-time analysis
These improvements align with the project's goals of providing comprehensive model risk management while maintaining practical utility for model owners and risk managers.

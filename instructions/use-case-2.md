# Use Case

Model Validation and attestation

# Goals

1. Trigger an alert that a model independent validation is due.
2. Record an independent validation of a model and model owners attestation.
3. Identify any other model uses that cold be impacted by validation findings.

# Steps

1. Based upon the risk tier of Model Y and the previous date of the last indepdendent validation the inventory system determines an independent validation of model Y is due and alerts to the Model Owner and Validation Team.
2. For the porpuse of this example, we now 'fast forward', the validation has been performed, the finding and result need to be recorded, note the condition applied to model use for valuation. Review outcomes would be either Approved, Approved with conditions or Declined.
3. Record the Model Owner's attestation of the review findings and policy compliance.
   In this example, show a simple workflow; when the review is completed the model owner will recive a notification of the completed review and be prompted to attest, hey have been notified of the findings nd any limitacions found can be either accepted or rejected.
4. Run a report to identify all the uses of Model Y and stakeholders (Accountable Execs and Users) to ensure they are aware of the validation findings and conditions placed on use for validation.

# Other considerations to have in the UI design

1. Display Risk Tier [ref dasta - good to have, T1 has 12 months as the next validation point]
2. Add a Model ecord with a validation of T1 and last validation about 9 months. backend:mock
3. A general filter to pull out all models with outstanding Validation, so Validator and Model Owner view - where one can see that a model need validation.
4. From the prev screen the validation starts Validation, just a flag change.
5. On 3) Model Owner will see that his model has now been picked uo for validation.
6. Validator completed validation and uploaded documents, should cause doc (more than one) uloaded plus state change
7. |state change should be visible on 3)
8. Approver picks up Validation for a model and closes review with comments (approed \_ declined are straightforward, but approved with comments will require the approver to pull up Use case 1 and on that screen update the review agains each use (please check the use 2 screenshot for this))
9. Owner attest the validation
10. Use case 1 shpuld now show uses and the validation comments.

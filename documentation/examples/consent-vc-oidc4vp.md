Rights Reserved, Unlicensed
# Example: Health-data consent VC with Presentation Definition (OIDC4VP)

This example shows a Presentation Definition to request a health-data consent credential (VC) using Presentation Exchange / OIDC4VP.

```json
{
  "id": "health-consent-request",
  "input_descriptors": [
    {
      "id": "consent-credential",
      "name": "Health Data Consent",
      "purpose": "Prove valid consent to access and share specified health data",
      "constraints": {
        "fields": [
          {
            "path": ["$.type", "$.credentialSubject.type"],
            "filter": {
              "type": "array",
              "contains": {"const": "HealthDataConsent"}
            }
          }
        ]
      }
    }
  ]
}
```
